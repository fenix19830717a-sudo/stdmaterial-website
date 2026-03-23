class Logger {
  constructor(name = 'App') {
    this.name = name;
    this.level = Logger.levels.DEBUG;
    this.history = [];
    this.maxHistory = 1000;
  }

  static levels = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    NONE: 4
  };

  setLevel(level) {
    this.level = level;
  }

  debug(...args) {
    this._log(Logger.levels.DEBUG, args);
  }

  info(...args) {
    this._log(Logger.levels.INFO, args);
  }

  warn(...args) {
    this._log(Logger.levels.WARN, args);
  }

  error(...args) {
    this._log(Logger.levels.ERROR, args);
  }

  _log(level, args) {
    if (level < this.level) return;

    const levelNames = ['DEBUG', 'INFO', 'WARN', 'ERROR'];
    const timestamp = new Date().toISOString();
    const levelName = levelNames[level];
    
    const logEntry = {
      timestamp,
      level: levelName,
      name: this.name,
      args
    };

    this.history.push(logEntry);
    
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }

    const consoleMethod = level === Logger.levels.DEBUG ? 'debug' :
                         level === Logger.levels.INFO ? 'info' :
                         level === Logger.levels.WARN ? 'warn' : 'error';

    const prefix = `[${timestamp}] [${levelName}] [${this.name}]`;
    
    console[consoleMethod](prefix, ...args);
  }

  getHistory(filter = {}) {
    let results = [...this.history];
    
    if (filter.level) {
      results = results.filter(e => e.level === filter.level);
    }
    
    if (filter.name) {
      results = results.filter(e => e.name === filter.name);
    }
    
    if (filter.since) {
      results = results.filter(e => new Date(e.timestamp) >= new Date(filter.since));
    }
    
    return results;
  }

  clearHistory() {
    this.history = [];
  }

  exportHistory() {
    return JSON.stringify(this.history, null, 2);
  }
}

export default Logger;