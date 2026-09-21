import { createMiddleware } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'

type FileInterceptorOptions = {
  fieldName?: string
  maxSize?: number
  maxSizeErrorMsg?: string
  fileType?: RegExp
}
export const fileMiddleware = (options: FileInterceptorOptions = {}) =>
  createMiddleware<{
    Variables: UploadVariables
  }>(async (c, next) => {
    const {
      fieldName = 'file',
      maxSize = 6 * 1024 * 1024,
      maxSizeErrorMsg = 'Size must less than 6MB.',
      fileType
    } = options

    const body = await c.req.parseBody()
    const file = body[fieldName]

    if (!(file instanceof File)) {
      throw new HTTPException(400, {
        message: 'Please upload the file.'
      })
    }

    if (file.size > maxSize) {
      throw new HTTPException(400, {
        message: maxSizeErrorMsg
      })
    }

    if (fileType && !fileType.test(file.type)) {
      throw new HTTPException(400, {
        message: 'Invalid file type.'
      })
    }

    c.set('uploadedFile', file)
    c.set('uploadBody', body)

    await next()
  })
