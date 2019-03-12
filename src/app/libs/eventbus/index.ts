const listeners = new Map<string, Map<string, Function>>() 

export const events = {
  loadSymptoms: 'loadSymptoms',
  logout: 'logout',
  languageChanged: 'languageChanged',
}

export function addListener(event: string, listenerClass: string, callback: Function) {
  if (!listeners.has(event)) {
    const callbacks = new Map<string, Function>()
    callbacks.set(listenerClass, callback)
    listeners.set(event, callbacks)
  } else {
    const callbacks: Map<string, Function> = listeners.get(event)
    callbacks.set(listenerClass, callback)
    listeners.set(event, callbacks)
  }
}

export function removeListener(event: string, listenerClass: string) {
  if (listeners.has(event)) {
    const callbacks: Map<string, Function> = listeners.get(event)
    if(callbacks.has(listenerClass)) {
      callbacks.delete(listenerClass)
    }
  }
}

export function notify(event: string, data?: any) {
  if (listeners.has(event)) {
    const callbacks: Map<string, Function> = listeners.get(event)
    callbacks.forEach((callback) => {
      callback(data)
    })
  }
}

export default {
  addListener: addListener,
  removeListener: removeListener,
  notify: notify,
  events: events,
}
