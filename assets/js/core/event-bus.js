import Logger from './logger.js';

class EventBus {
  constructor() {
    this.events = new Map();
    this.onceEvents = new Map();
    this.wildcardHandlers = [];
    this.maxListeners = 100;
    this.logger = new Logger('EventBus');
  }

  on(eventName, handler, context = null) {
    if (typeof handler !== 'function') {
      throw new Error('Handler must be a function');
    }

    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }

    const handlers = this.events.get(eventName);
    
    if (handlers.length >= this.maxListeners) {
      this.logger.warn(`Max listeners (${this.maxListeners}) reached for event: ${eventName}`);
    }

    handlers.push({ handler, context });
    this.logger.debug(`Listener added for event: ${eventName}`);

    return () => this.off(eventName, handler);
  }

  once(eventName, handler, context = null) {
    const onceHandler = (...args) => {
      handler.apply(context, args);
      this.off(eventName, onceHandler);
    };

    return this.on(eventName, onceHandler, context);
  }

  off(eventName, handler = null) {
    if (!handler) {
      this.events.delete(eventName);
      this.logger.debug(`All listeners removed for event: ${eventName}`);
      return;
    }

    const handlers = this.events.get(eventName);
    if (!handlers) return;

    const index = handlers.findIndex(h => h.handler === handler);
    if (index > -1) {
      handlers.splice(index, 1);
      this.logger.debug(`Listener removed for event: ${eventName}`);
    }
  }

  emit(eventName, ...args) {
    this.logger.debug(`Emitting event: ${eventName}`, args);

    this.wildcardHandlers.forEach(({ handler, context }) => {
      try {
        handler.apply(context, [eventName, ...args]);
      } catch (error) {
        this.logger.error(`Error in wildcard handler:`, error);
      }
    });

    const handlers = this.events.get(eventName);
    if (!handlers || handlers.length === 0) {
      this.logger.debug(`No listeners for event: ${eventName}`);
      return;
    }

    handlers.forEach(({ handler, context }) => {
      try {
        handler.apply(context, args);
      } catch (error) {
        this.logger.error(`Error in event handler for ${eventName}:`, error);
      }
    });
  }

  onAny(handler, context = null) {
    this.wildcardHandlers.push({ handler, context });
    return () => {
      const index = this.wildcardHandlers.findIndex(h => h.handler === handler);
      if (index > -1) {
        this.wildcardHandlers.splice(index, 1);
      }
    };
  }

  listenerCount(eventName) {
    const handlers = this.events.get(eventName);
    return handlers ? handlers.length : 0;
  }

  getEventNames() {
    return Array.from(this.events.keys());
  }

  removeAllListeners() {
    this.events.clear();
    this.onceEvents.clear();
    this.wildcardHandlers = [];
    this.logger.debug('All listeners removed');
  }
}

const eventBus = new EventBus();
export default eventBus;