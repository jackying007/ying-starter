import qs from 'qs'
import { MakeRequired } from './type'
import {
  MethodOptions,
  MethodOptionsWithJSONResponseType,
  MethodOptionsWithSpecialResponseType,
  RequestOptions,
  RequestOptionsWithJSONResponseType,
  RequestOptionsWithSpecialResponseType,
  ResponseDataType,
  ResponseDataTypeMap
} from './http-request-type'

export type BaseHttpErrorOptions = {
  status: number
  statusText: string
}
export class BaseHttpError extends Error {
  status: number
  statusText: string
  constructor(options: BaseHttpErrorOptions) {
    super(options.statusText)
    // 自动将错误名称设置为当前类的类名
    this.name = new.target.name
    this.status = options.status
    this.statusText = options.statusText
    // 修正原型链 (Fix prototype chain) 解决 TS 编译为 ES5 时，instanceof 失效的问题
    Object.setPrototypeOf(this, new.target.prototype)
  }
  toJSON() {
    return {
      status: this.status,
      statusText: this.statusText
    }
  }
}

export type BeforeRequestHookOptions = MakeRequired<RequestOptions, 'headers' | 'responseType'>
export type BeforeRequestHook = (
  options: BeforeRequestHookOptions
) => Promise<BeforeRequestHookOptions> | BeforeRequestHookOptions

export type AfterResponseHookOptions =
  | { type: 'json'; data: any }
  | { type: 'raw'; data: Response }
  | { type: 'blob'; data: Blob }
  | { type: 'text'; data: string }
  | { type: 'arrayBuffer'; data: ArrayBuffer }
  | { type: 'bytes'; data: Uint8Array }

export type AfterResponseHook = <T extends AfterResponseHookOptions>(
  options: AfterResponseHookOptions
) => Promise<T['data']> | T['data']

export type BeforeErrorHook = (fetchRes: Response, options: BeforeRequestHookOptions) => Promise<Response> | Response
export type AfterErrorHook = (fetchRes: Response, error: BaseHttpError) => Promise<BaseHttpError> | BaseHttpError

export type AddHooksOptions = {
  beforeRequest?: BeforeRequestHook | BeforeRequestHook[]
  afterResponse?: AfterResponseHook | AfterResponseHook[]
  beforeError?: BeforeErrorHook | BeforeErrorHook[]
  afterError?: AfterErrorHook | AfterErrorHook[]
}

export type HttpRequestOptions = {
  baseURL?: string
  logError?: boolean
}

export class HttpRequest {
  options: HttpRequestOptions = {
    logError: true
  }
  hooks: {
    beforeRequest?: BeforeRequestHook[]
    afterResponse?: AfterResponseHook[]
    beforeError?: BeforeErrorHook[]
    afterError?: AfterErrorHook[]
  } = {}
  constructor(options?: HttpRequestOptions) {
    this.options = { ...this.options, ...options }
  }

  addHooks(hooks: AddHooksOptions) {
    Object.entries(hooks).forEach(([key, val]) => {
      const hookArr: any[] = []
      if (typeof val === 'function') {
        hookArr.push(val)
      } else if (Array.isArray(val)) {
        hookArr.push(...val)
      }
      this.hooks[key as keyof AddHooksOptions] = hookArr
    })
  }

  protected buildRequest(reqOptions: RequestOptions): BeforeRequestHookOptions {
    const { headers = {}, responseType = 'json', data, ...rest } = reqOptions
    if (data) headers['content-type'] = 'application/json;charset=utf-8'
    return { headers, responseType, data, ...rest }
  }

  protected async beforeRequest(reqOptions: BeforeRequestHookOptions) {
    const beforeRequestHooks = this.hooks.beforeRequest
    if (!beforeRequestHooks) return reqOptions
    let options = reqOptions
    for (const fn of beforeRequestHooks) {
      options = await Promise.resolve(fn(options))
    }
    return options
  }

  protected async afterResponse(resOptions: AfterResponseHookOptions) {
    const afterResponseHooks = this.hooks.afterResponse
    if (!afterResponseHooks) return resOptions.data
    const options = resOptions
    for (const fn of afterResponseHooks) {
      options.data = await Promise.resolve(fn(options))
    }
    return options.data
  }

  protected async beforeError(fetchRes: Response, options: BeforeRequestHookOptions) {
    const beforeErrorHooks = this.hooks.beforeError
    if (!beforeErrorHooks) return fetchRes
    for (const fn of beforeErrorHooks) {
      fetchRes = await Promise.resolve(fn(fetchRes, options))
    }
    return fetchRes
  }

  protected async afterError(fetchRes: Response, error: BaseHttpError) {
    const afterErrorHooks = this.hooks.afterError
    if (!afterErrorHooks) return error
    for (const fn of afterErrorHooks) {
      error = await Promise.resolve(fn(fetchRes, error))
    }
    return error
  }

  request<T extends ResponseDataType>(
    reqOptions: RequestOptionsWithSpecialResponseType<T>
  ): Promise<ResponseDataTypeMap[T]>

  request<T>(reqOptions: RequestOptionsWithJSONResponseType): Promise<T>

  async request(reqOptions: RequestOptions) {
    const baseOptions = this.buildRequest(reqOptions)
    const options = baseOptions.skipBeforeRequest ? baseOptions : await this.beforeRequest(baseOptions)
    const {
      url,
      method,
      query,
      data,
      headers,
      body,
      responseType,
      skipBeforeError,
      skipAfterError,
      skipAfterResponse
    } = options

    const queryStr = qs.stringify(query, { arrayFormat: 'repeat' })
    const fetchUrl = `${this.options.baseURL ?? ''}${url}${queryStr ? `?${queryStr}` : ''}`
    let fetchRes = await fetch(fetchUrl, {
      method,
      headers,
      body: body ?? (data ? JSON.stringify(data) : undefined)
    })

    if (!fetchRes.ok && !skipBeforeError) fetchRes = await this.beforeError(fetchRes, options)
    if (!fetchRes.ok) {
      const baseError = new BaseHttpError({
        status: fetchRes.status,
        statusText: fetchRes.statusText
      })
      const error = skipAfterError ? baseError : await this.afterError(fetchRes, baseError)
      if (this.options.logError) console.error(error, error.toJSON())
      throw error
    }

    let resData
    if (responseType === 'json') resData = await fetchRes.json()
    else if (responseType === 'blob') resData = await fetchRes.blob()
    else if (responseType === 'text') resData = await fetchRes.text()
    else if (responseType === 'arrayBuffer') resData = await fetchRes.arrayBuffer()
    else if (responseType === 'bytes') resData = await fetchRes.bytes()
    else resData = fetchRes

    if (skipAfterResponse) return resData
    return this.afterResponse({ type: responseType, data: resData })
  }

  get<T extends ResponseDataType>(
    url: string,
    reqOptions?: MethodOptionsWithSpecialResponseType<T>
  ): Promise<ResponseDataTypeMap[T]>

  get<T>(url: string, reqOptions?: MethodOptionsWithJSONResponseType): Promise<T>

  get(url: string, reqOptions?: MethodOptions) {
    return this.request({ url, method: 'get', ...(reqOptions as any) })
  }

  post<T extends ResponseDataType>(
    url: string,
    reqOptions?: MethodOptionsWithSpecialResponseType<T>
  ): Promise<ResponseDataTypeMap[T]>

  post<T>(url: string, reqOptions?: MethodOptionsWithJSONResponseType): Promise<T>

  post(url: string, reqOptions?: MethodOptions) {
    return this.request({ url, method: 'post', ...(reqOptions as any) })
  }

  put<T extends ResponseDataType>(
    url: string,
    reqOptions?: MethodOptionsWithSpecialResponseType<T>
  ): Promise<ResponseDataTypeMap[T]>

  put<T>(url: string, reqOptions?: MethodOptionsWithJSONResponseType): Promise<T>

  put(url: string, reqOptions?: MethodOptions) {
    return this.request({ url, method: 'put', ...(reqOptions as any) })
  }

  delete<T extends ResponseDataType>(
    url: string,
    reqOptions?: MethodOptionsWithSpecialResponseType<T>
  ): Promise<ResponseDataTypeMap[T]>

  delete<T>(url: string, reqOptions?: MethodOptionsWithJSONResponseType): Promise<T>

  delete(url: string, reqOptions?: MethodOptions) {
    return this.request({ url, method: 'delete', ...(reqOptions as any) })
  }
}
