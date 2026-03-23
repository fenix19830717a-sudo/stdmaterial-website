import Logger from './logger.js';

class ErrorHandler {
  constructor(options = {}) {
    this.options = {
      enableReporting: true,
      enableUserNotifications: true,
      maxErrorReports: 100,
      ...options
    };
    
    this.errorLog = [];
    this.logger = new Logger('ErrorHandler');
    this.initGlobalHandlers();
  }

  initGlobalHandlers() {
    window.addEventListener('error', (event) => {
      this.handle(event.error, {
        type: 'global_error',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.handle(event.reason, {
        type: 'unhandled_rejection',
        promise: event.promise
      });
    });

    this.logger.info('Global error handlers initialized');
  }

  handle(error, context = {}) {
    const errorInfo = {
      id: this._generateErrorId(),
      timestamp: new Date().toISOString(),
      error: {
        name: error?.name || 'UnknownError',
        message: error?.message || 'An unknown error occurred',
        stack: error?.stack,
        cause: error?.cause
      },
      context,
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    this.errorLog.push(errorInfo);
    
    if (this.errorLog.length > this.options.maxErrorReports) {
      this.errorLog.shift();
    }

    this.logger.error('Error occurred:', errorInfo);

    if (this.options.enableReporting) {
      this._reportError(errorInfo);
    }

    if (this.options.enableUserNotifications) {
      this._showUserNotification(errorInfo);
    }

    return errorInfo;
  }

  wrap(fn, fallbackValue = null) {
    return (...args) => {
      try {
        return fn(...args);
      } catch (error) {
        this.handle(error, {
          type: 'wrapped_function',
          functionName: fn.name
        });
        return fallbackValue;
      }
    };
  }

  wrapAsync(fn, fallbackValue = null) {
    return async (...args) => {
      try {
        return await fn(...args);
      } catch (error) {
        this.handle(error, {
          type: 'wrapped_async_function',
          functionName: fn.name
        });
        return fallbackValue;
      }
    };
  }

  getErrorLog() {
    return [...this.errorLog];
  }

  clearErrorLog() {
    this.errorLog = [];
    this.logger.info('Error log cleared');
  }

  _generateErrorId() {
    return 'err_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }

  _reportError(errorInfo) {
    if (typeof navigator.sendBeacon === 'function') {
      try {
        navigator.sendBeacon(
          '/api/errors',
          JSON.stringify(errorInfo)
        );
      } catch (e) {
        this.logger.debug('Failed to send beacon:', e);
      }
    }
  }

  _showUserNotification(errorInfo) {
    try {
      if (typeof EventBus !== 'undefined') {
        EventBus.emit('error:occurred', errorInfo);
      }
    } catch (e) {
      this.logger.debug('Failed to show user notification:', e);
    }
  }
}

const errorHandler = new ErrorHandler();
export default errorHandler;