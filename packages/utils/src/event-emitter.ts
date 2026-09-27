type Handler<T> = (payload: T) => void

export class EventEmitter<E extends Record<string, any>> {
  #handlersMap = new Map<keyof E, Handler<any>[]>()

  off<K extends keyof E>(event: K, handler: Handler<E[K]>) {
    const handlers = this.#handlersMap.get(event)
    if (!handlers) return
    const newHanlders = handlers.filter(el => el !== handler)
    if (!newHanlders.length) {
      this.#handlersMap.delete(event)
    } else {
      this.#handlersMap.set(event, newHanlders)
    }
  }

  on<K extends keyof E>(event: K, handler: Handler<E[K]>) {
    const list = this.#handlersMap.get(event) ?? []
    list.push(handler)
    this.#handlersMap.set(event, list)

    return () => this.off(event, handler)
  }

  emit<K extends keyof E>(event: K, payload: E[K]) {
    this.#handlersMap.get(event)?.forEach(handler => {
      handler(payload)
    })
  }
}
