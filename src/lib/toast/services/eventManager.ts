type Listeners<TEvents> = Map<keyof TEvents, ((parameters: TEvents[keyof TEvents]) => void)[]>

export default class EventManager<TEvents extends Record<keyof TEvents, TEvents[keyof TEvents]>> {
  private listeners: Listeners<TEvents> = new Map([])

  public on<TKey extends keyof TEvents>(event: TKey, listener: (parameters: TEvents[TKey]) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }

    this.listeners.get(event)?.push(listener as (parameters: TEvents[keyof TEvents]) => void)
  }

  public emit<TKey extends keyof TEvents>(event: TKey, payload: TEvents[TKey]) {
    if (!this.listeners.has(event)) {
      return
    }

    this.listeners.get(event)?.forEach((listener) => listener(payload))
  }

  public removeListener<TKey extends keyof TEvents>(
    event: TKey,
    listenerToRemove: (parameters: TEvents[TKey]) => void,
  ) {
    const listeners = this.listeners.get(event)

    if (!listeners) {
      return
    }

    const filteredListeners = listeners.filter((listener) => listener !== listenerToRemove)

    this.listeners.set(event, filteredListeners)
  }
}
