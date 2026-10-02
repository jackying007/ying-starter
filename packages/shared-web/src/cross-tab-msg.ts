type StringKey<T> = Extract<keyof T, string>

const lifeCycleEvents = ['connect', 'reply', 'close'] as const
type LifeCycleEvent = (typeof lifeCycleEvents)[number]
function isLifeCycleEvent(event: any): event is LifeCycleEvent {
  return lifeCycleEvents.includes(event as LifeCycleEvent)
}

type Handler<T> = (id: number, payload: T) => void
type LifeCycleHandler = (id: number) => void

interface CrossTabChannel<E extends Record<string, any>> {
  off<K extends StringKey<E>>(event: K, handler: Handler<E[K]>): void
  on<K extends StringKey<E>>(event: K, handler: Handler<E[K]>): () => void
  emit<K extends StringKey<E>>(event: K, payload: E[K]): void
  offLifeCycle(event: LifeCycleEvent, handler: LifeCycleHandler): void
  onLifeCycle(event: LifeCycleEvent, handler: LifeCycleHandler): () => void
  emitLifeCycle(event: LifeCycleEvent): void
}

type CrossTabChannelOptions = {
  name: string
  id: number
  allPageClose: () => void
}

export class LocalStorage<E extends Record<string, any>> implements CrossTabChannel<E> {
  name: string
  id: number
  listeners = new Set<number>()
  #handlersMap = new Map<keyof E, Handler<any>[]>()
  #lifeCycleHandlersMap = new Map<LifeCycleEvent, LifeCycleHandler[]>()
  #allPageClose: () => void
  constructor({ name, id, allPageClose }: CrossTabChannelOptions) {
    this.name = name
    this.id = id
    this.#allPageClose = allPageClose
    this.setUp()
  }

  off: CrossTabChannel<E>['off'] = (event, handler) => {
    const handlers = this.#handlersMap.get(event)
    if (!handlers) return
    const newHanlders = handlers.filter(el => el !== handler)
    if (!newHanlders.length) {
      this.#handlersMap.delete(event)
    } else {
      this.#handlersMap.set(event, newHanlders)
    }
  }

  on: CrossTabChannel<E>['on'] = (event, handler) => {
    const list = this.#handlersMap.get(event) ?? []
    list.push(handler)
    this.#handlersMap.set(event, list)

    return () => this.off(event, handler)
  }

  emit: CrossTabChannel<E>['emit'] = (event, payload) => {
    localStorage.setItem(
      `@@${this.name}`,
      JSON.stringify({
        data: {
          event,
          id: this.id,
          payload
        },
        timestamp: Date.now()
      })
    )
  }

  offLifeCycle: CrossTabChannel<E>['offLifeCycle'] = (event, handler) => {
    const handlers = this.#lifeCycleHandlersMap.get(event)
    if (!handlers) return
    const newHanlders = handlers.filter(el => el !== handler)
    if (!newHanlders.length) {
      this.#lifeCycleHandlersMap.delete(event)
    } else {
      this.#lifeCycleHandlersMap.set(event, newHanlders)
    }
  }

  onLifeCycle: CrossTabChannel<E>['onLifeCycle'] = (event, handler) => {
    const list = this.#lifeCycleHandlersMap.get(event) ?? []
    list.push(handler)
    this.#lifeCycleHandlersMap.set(event, list)

    return () => this.offLifeCycle(event, handler)
  }

  emitLifeCycle: CrossTabChannel<E>['emitLifeCycle'] = event => {
    localStorage.setItem(
      `@@${this.name}`,
      JSON.stringify({
        data: {
          event,
          id: this.id
        },
        timestamp: Date.now()
      })
    )
  }

  #storageHandler = (e: StorageEvent) => {
    if (!e.key || !e.newValue || !e.key.startsWith(`@@${this.name}`)) return
    const value = JSON.parse(e.newValue)
    const data = value.data as {
      event: keyof E | LifeCycleEvent
      id: number
      payload: E[keyof E]
    }
    const { event, id, payload } = data
    if (isLifeCycleEvent(event)) {
      this.#lifeCycleHandlersMap.get(event)?.forEach(handler => handler(id))
    } else {
      this.#handlersMap.get(event)?.forEach(handler => handler(id, payload))
    }
  }

  clear() {
    window.removeEventListener('storage', this.#storageHandler)
  }

  setUp() {
    this.emitLifeCycle('connect')
    window.addEventListener('pagehide', () => {
      if (this.listeners.size === 0) this.#allPageClose()
      this.emitLifeCycle('close')
    })
    this.onLifeCycle('connect', id => {
      this.emitLifeCycle('reply')
      this.listeners.add(id)
    })
    this.onLifeCycle('reply', id => {
      this.listeners.add(id)
    })
    this.onLifeCycle('close', id => {
      this.listeners.delete(id)
    })
    window.addEventListener('storage', this.#storageHandler)
  }
}

export class Broadcast<E extends Record<string, any>> implements CrossTabChannel<E> {
  #channel: BroadcastChannel
  id: number
  listeners = new Set<number>()
  #handlersMap = new Map<keyof E, Handler<any>[]>()
  #lifeCycleHandlersMap = new Map<LifeCycleEvent, LifeCycleHandler[]>()
  #allPageClose: () => void
  constructor({ name, id, allPageClose }: CrossTabChannelOptions) {
    this.#channel = new BroadcastChannel(name)
    this.id = id
    this.#allPageClose = allPageClose
    this.setUp()
  }

  off: CrossTabChannel<E>['off'] = (event, handler) => {
    const handlers = this.#handlersMap.get(event)
    if (!handlers) return
    const newHanlders = handlers.filter(el => el !== handler)
    if (!newHanlders.length) {
      this.#handlersMap.delete(event)
    } else {
      this.#handlersMap.set(event, newHanlders)
    }
  }

  on: CrossTabChannel<E>['on'] = (event, handler) => {
    const list = this.#handlersMap.get(event) ?? []
    list.push(handler)
    this.#handlersMap.set(event, list)

    return () => this.off(event, handler)
  }

  emit: CrossTabChannel<E>['emit'] = (event, payload) => {
    this.#channel.postMessage({
      event,
      id: this.id,
      payload
    })
  }

  offLifeCycle: CrossTabChannel<E>['offLifeCycle'] = (event, handler) => {
    const handlers = this.#lifeCycleHandlersMap.get(event)
    if (!handlers) return
    const newHanlders = handlers.filter(el => el !== handler)
    if (!newHanlders.length) {
      this.#lifeCycleHandlersMap.delete(event)
    } else {
      this.#lifeCycleHandlersMap.set(event, newHanlders)
    }
  }

  onLifeCycle: CrossTabChannel<E>['onLifeCycle'] = (event, handler) => {
    const list = this.#lifeCycleHandlersMap.get(event) ?? []
    list.push(handler)
    this.#lifeCycleHandlersMap.set(event, list)

    return () => this.offLifeCycle(event, handler)
  }

  emitLifeCycle: CrossTabChannel<E>['emitLifeCycle'] = event => {
    this.#channel.postMessage({
      event,
      id: this.id
    })
  }

  #messageEvent = (e: MessageEvent<any>) => {
    const data = e.data as {
      event: keyof E | LifeCycleEvent
      id: number
      payload: E[keyof E]
    }
    const { event, id, payload } = data
    if (isLifeCycleEvent(event)) {
      this.#lifeCycleHandlersMap.get(event)?.forEach(handler => handler(id))
    } else {
      this.#handlersMap.get(event)?.forEach(handler => handler(id, payload))
    }
  }

  clear() {
    this.#channel.removeEventListener('message', this.#messageEvent)
  }

  setUp() {
    this.emitLifeCycle('connect')
    window.addEventListener('pagehide', () => {
      if (this.listeners.size === 0) this.#allPageClose()
      this.emitLifeCycle('close')
    })
    this.onLifeCycle('connect', id => {
      this.emitLifeCycle('reply')
      this.listeners.add(id)
    })
    this.onLifeCycle('reply', id => {
      this.listeners.add(id)
    })
    this.onLifeCycle('close', id => {
      this.listeners.delete(id)
    })
    this.#channel.addEventListener('message', this.#messageEvent)
  }
}

export class ChannelManager<T extends Record<string, Record<string, any>>> {
  createId(name: string) {
    const key = `channel-${name}`
    let id = +(localStorage.getItem(key) ?? 0)
    id++
    localStorage.setItem(key, id.toString())
    return id
  }
  clearId(name: string) {
    const key = `channel-${name}`
    localStorage.removeItem(key)
  }
  createLocalStorageChannel<K extends StringKey<T>>(name: K) {
    const id = this.createId(name)
    return new LocalStorage<T[K]>({ name, id, allPageClose: () => this.clearId(name) })
  }
  createBroadcastChannel<K extends StringKey<T>>(name: K) {
    const id = this.createId(name)
    return new Broadcast<T[K]>({ name, id, allPageClose: () => this.clearId(name) })
  }
}
