import Logger from './logger.js';
import eventBus from './event-bus.js';

class StateManager {
  constructor(options = {}) {
    this.options = {
      enableTimeTravel: true,
      enablePersistence: true,
      persistenceKey: 'app_state',
      maxHistory: 50,
      ...options
    };
    
    this.state = {};
    this.history = [];
    this.historyIndex = -1;
    this.logger = new Logger('StateManager');
    
    this._loadPersistedState();
  }

  getState(path = null) {
    if (!path) return { ...this.state };
    
    return this._getNestedValue(this.state, path);
  }

  setState(path, value) {
    const newState = this._setNestedValue({ ...this.state }, path, value);
    this._updateState(newState);
  }

  updateState(updates) {
    const newState = { ...this.state, ...updates };
    this._updateState(newState);
  }

  mergeState(path, updates) {
    const currentValue = this.getState(path) || {};
    const newValue = { ...currentValue, ...updates };
    this.setState(path, newValue);
  }

  resetState() {
    this._updateState({});
  }

  undo() {
    if (!this.options.enableTimeTravel || this.historyIndex <= 0) {
      this.logger.warn('Cannot undo: no history available');
      return false;
    }
    
    this.historyIndex--;
    const previousState = this.history[this.historyIndex];
    this.state = { ...previousState };
    
    this._notifyStateChange();
    this.logger.info('State undo performed');
    return true;
  }

  redo() {
    if (!this.options.enableTimeTravel || this.historyIndex >= this.history.length - 1) {
      this.logger.warn('Cannot redo: no future state available');
      return false;
    }
    
    this.historyIndex++;
    const nextState = this.history[this.historyIndex];
    this.state = { ...nextState };
    
    this._notifyStateChange();
    this.logger.info('State redo performed');
    return true;
  }

  clearHistory() {
    this.history = [];
    this.historyIndex = -1;
    this.logger.info('State history cleared');
  }

  getHistory() {
    return [...this.history];
  }

  persistState() {
    if (!this.options.enablePersistence) return;
    
    try {
      localStorage.setItem(this.options.persistenceKey, JSON.stringify(this.state));
      this.logger.debug('State persisted to localStorage');
    } catch (error) {
      this.logger.error('Failed to persist state:', error);
    }
  }

  _loadPersistedState() {
    if (!this.options.enablePersistence) return;
    
    try {
      const persistedState = localStorage.getItem(this.options.persistenceKey);
      if (persistedState) {
        this.state = JSON.parse(persistedState);
        this.logger.info('State loaded from localStorage');
        this._notifyStateChange();
      }
    } catch (error) {
      this.logger.error('Failed to load persisted state:', error);
    }
  }

  _updateState(newState) {
    this.state = newState;
    
    if (this.options.enableTimeTravel) {
      this._addToHistory(newState);
    }
    
    if (this.options.enablePersistence) {
      this.persistState();
    }
    
    this._notifyStateChange();
  }

  _addToHistory(state) {
    if (this.historyIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.historyIndex + 1);
    }
    
    this.history.push({ ...state });
    
    if (this.history.length > this.options.maxHistory) {
      this.history.shift();
    } else {
      this.historyIndex++;
    }
  }

  _notifyStateChange() {
    eventBus.emit('state:changed', { ...this.state });
  }

  _getNestedValue(obj, path) {
    const keys = path.split('.');
    let value = obj;
    
    for (const key of keys) {
      if (value === undefined || value === null) {
        return undefined;
      }
      value = value[key];
    }
    
    return value;
  }

  _setNestedValue(obj, path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    let current = obj;
    
    for (const key of keys) {
      if (current[key] === undefined) {
        current[key] = {};
      }
      current = current[key];
    }
    
    current[lastKey] = value;
    return obj;
  }
}

const stateManager = new StateManager();
export default stateManager;
