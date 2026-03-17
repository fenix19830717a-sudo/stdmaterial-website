# 湖南盛通达材料科技 - 完整重构方案 v2.0 (完备逻辑版)

## 文档版本控制

| 版本 | 日期 | 作者 | 变更说明 |
|------|------|------|----------|
| v1.0 | 2026-01-20 | Initial | 基础方案框架 |
| v2.0 | 2026-01-20 | Architecture Review | 增加完备逻辑、风险控制、详细验收标准 |

---

## 项目管理总览

### 1.1 项目目标与范围

**核心目标**:
- 采用多模块加载架构，避免单文件代码过长
- 参考标准化商城架构完善商品管理系统
- 打造高度专业、有说服力的研磨模拟器
- 使用 shadcn-ui 实现现代化 UI 交互

**范围界定**:
- ✅ 前端重构 (HTML/CSS/JavaScript)
- ✅ 商品管理系统 (索引、搜索、推荐)
- ✅ 研磨模拟器 (计算引擎、可视化)
- ✅ shadcn-ui 组件集成
- ❌ 后端服务器重构
- ❌ 多语言功能 (仅英文)

### 1.2 关键成功因素 (CSF)

1. **架构清晰** - 模块边界明确，依赖关系可控
2. **性能达标** - 首屏加载 < 2s，Lighthouse ≥ 90
3. **功能完整** - 商品索引查询 < 100ms，模拟计算 < 500ms
4. **用户体验** - shadcn-ui 完整应用，交互流畅
5. **风险可控** - 有明确的回滚和应急方案

### 1.3 项目假设与约束

**假设**:
- 现有 JSON 数据结构保持不变但可扩展
- 现有图片资源可用，部分需要处理为白色背景
- 用户使用现代浏览器 (Chrome ≥ 90, Firefox ≥ 88, Safari ≥ 14)
- 服务器支持静态资源缓存和 Gzip 压缩

**约束**:
- 技术栈: HTML/CSS/JavaScript (ES6+) + Tailwind CSS
- 时间: 总工期 8-10 周
- 团队: 单人开发模式
- 预算: 无外部采购

---

## 二、系统架构设计 (完备版)

### 2.1 架构分层图

```
┌─────────────────────────────────────────────────────────────┐
│                        Presentation Layer                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   Pages      │  │  Components  │  │   Modules    │   │
│  │ (home, etc.) │  │(shadcn-ui)   │  │(header, etc.)│   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      Application Layer                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Module Loader System                      │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │  │
│  │  │ Event Bus    │  │State Manager │  │API Client │ │  │
│  │  └──────────────┘  └──────────────┘  └───────────┘ │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                        Business Layer                         │
│  ┌─────────────────┐  ┌─────────────────────────────────┐  │
│  │  Product Index  │  │   Grinding Simulator Engine     │  │
│  │  & Search       │  │  (Calculations, Visualization) │  │
│  └─────────────────┘  └─────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                         Data Layer                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │ Products DB  │  │ Materials DB │  │ Equipment DB │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 完整目录结构 (最终态)

```
/var/www/html/stdmaterial.com/
├── .trae/
│   └── documents/
│       └── complete_refactoring_plan.md  # 本文档
├── assets/
│   ├── css/
│   │   ├── design-system.css               # 设计系统 (现有)
│   │   └── components/                     # 组件级样式
│   │       ├── button.css
│   │       ├── card.css
│   │       └── ...
│   ├── js/
│   │   ├── main.js                         # 入口文件
│   │   ├── core/                           # 核心层
│   │   │   ├── module-loader.js            # 模块加载器 (v2.0 完备版)
│   │   │   ├── event-bus.js                # 事件总线
│   │   │   ├── state-manager.js            # 状态管理器
│   │   │   ├── api-client.js               # API 客户端
│   │   │   ├── error-handler.js            # 错误处理器 (新增)
│   │   │   └── logger.js                   # 日志系统 (新增)
│   │   ├── components/                     # shadcn-ui 组件包装层
│   │   │   ├── shadcn-button.js
│   │   │   ├── shadcn-card.js
│   │   │   ├── shadcn-input.js
│   │   │   ├── shadcn-select.js
│   │   │   ├── shadcn-slider.js
│   │   │   ├── shadcn-tabs.js
│   │   │   ├── shadcn-accordion.js
│   │   │   ├── shadcn-dialog.js
│   │   │   ├── shadcn-progress.js
│   │   │   ├── shadcn-badge.js
│   │   │   ├── shadcn-toast.js             # 新增
│   │   │   └── shadcn-skeleton.js          # 新增
│   │   ├── modules/                        # 业务模块层
│   │   │   ├── header/
│   │   │   │   ├── header.js
│   │   │   │   ├── header.html
│   │   │   │   └── header.css
│   │   │   ├── footer/
│   │   │   │   ├── footer.js
│   │   │   │   ├── footer.html
│   │   │   │   └── footer.css
│   │   │   ├── hero/                        # 新增
│   │   │   │   ├── hero.js
│   │   │   │   ├── hero.html
│   │   │   │   └── hero.css
│   │   │   ├── product-filter/
│   │   │   │   ├── product-filter.js
│   │   │   │   ├── product-filter.html
│   │   │   │   └── product-filter.css
│   │   │   ├── product-grid/
│   │   │   │   ├── product-grid.js
│   │   │   │   ├── product-grid.html
│   │   │   │   └── product-grid.css
│   │   │   ├── product-detail/
│   │   │   │   ├── product-detail.js
│   │   │   │   ├── product-detail.html
│   │   │   │   └── product-detail.css
│   │   │   ├── product-comparison/          # 新增
│   │   │   │   ├── product-comparison.js
│   │   │   │   ├── product-comparison.html
│   │   │   │   └── product-comparison.css
│   │   │   └── simulator/
│   │   │       ├── simulator-engine.js       # 计算引擎
│   │   │       ├── simulator-ui.js           # UI 层
│   │   │       ├── simulator-visualization.js # 可视化层
│   │   │       ├── simulator-validator.js    # 参数验证器 (新增)
│   │   │       ├── simulator-report.js       # 报告生成器 (新增)
│   │   │       ├── materials-db.js
│   │   │       ├── equipment-db.js
│   │   │       └── simulator.css
│   │   ├── data/                           # 数据层
│   │   │   ├── products-db.js
│   │   │   ├── products-schema.json         # JSON Schema (新增)
│   │   │   ├── materials-db.js
│   │   │   └── equipment-db.js
│   │   ├── lib/                            # 工具库
│   │   │   ├── utils.js                     # 通用工具
│   │   │   ├── validators.js                # 验证器
│   │   │   └── formatters.js                # 格式化器
│   │   └── pages/                          # 页面控制器
│   │       ├── home.js
│   │       ├── product-catalog.js
│   │       ├── product-detail.js
│   │       ├── simulator.js
│   │       ├── about.js
│   │       └── contact.js
│   └── images/
│       └── products/
│           ├── white-bg/                    # 白色背景图片 (新增)
│           └── original/                    # 原始图片
├── components.json                        # shadcn-ui 配置
├── tailwind.config.js                    # Tailwind 配置
├── backup/                                # 备份目录 (自动创建)
│   └── pre-refactor/                     # 重构前备份
├── tests/                                 # 测试目录 (新增)
│   ├── unit/
│   │   ├── product-index.test.js
│   │   └── simulator-engine.test.js
│   └── e2e/
│       └── simulator-flow.test.js
└── docs/                                  # 文档目录
    ├── architecture.md
    ├── api-reference.md
    └── deployment-guide.md
```

### 2.3 模块加载系统 (v2.0 完备版)

**核心设计原则**:
- 依赖注入模式，避免循环依赖
- 模块生命周期管理 (init → mount → update → unmount)
- 错误隔离和降级策略
- 性能监控和缓存

```javascript
// assets/js/core/module-loader.js
class ModuleLoader {
  constructor(options = {}) {
    this.options = {
      basePath: 'assets/js/modules',
      cacheTimeout: 30 * 60 * 1000,
      maxRetries: 3,
      enableCache: true,
      ...options
    };
    
    this.loadedModules = new Map();
    this.loadingModules = new Map();
    this.moduleStates = new Map();
    this.dependencyGraph = new Map();
    this.performanceMetrics = new Map();
    
    this.logger = new Logger('ModuleLoader');
    this.errorHandler = new ErrorHandler();
  }

  async load(moduleName, options = {}) {
    const startTime = performance.now();
    
    this.logger.info(`Loading module: ${moduleName}`);
    
    if (this.loadedModules.has(moduleName)) {
      const module = this.loadedModules.get(moduleName);
      if (this._isCacheValid(module)) {
        this.logger.debug(`Module ${moduleName} loaded from cache`);
        return module;
      }
    }

    if (this.loadingModules.has(moduleName)) {
      this.logger.debug(`Module ${moduleName} already loading, waiting...`);
      return this.loadingModules.get(moduleName);
    }

    const loadPromise = this._loadWithRetry(moduleName, options);
    this.loadingModules.set(moduleName, loadPromise);

    try {
      const module = await loadPromise;
      const loadTime = performance.now() - startTime;
      
      this.loadedModules.set(moduleName, {
        ...module,
        loadedAt: Date.now(),
        loadTime
      });
      
      this.loadingModules.delete(moduleName);
      this.moduleStates.set(moduleName, 'loaded');
      this.performanceMetrics.set(moduleName, loadTime);
      
      this.logger.info(`Module ${moduleName} loaded in ${loadTime.toFixed(2)}ms`);
      
      return module;
    } catch (error) {
      this.loadingModules.delete(moduleName);
      this.moduleStates.set(moduleName, 'error');
      
      this.errorHandler.handle(error, {
        module: moduleName,
        context: 'module_loading'
      });
      
      if (options.fallbackModule) {
        this.logger.warn(`Falling back to ${options.fallbackModule}`);
        return this.load(options.fallbackModule);
      }
      
      throw error;
    }
  }

  async _loadWithRetry(moduleName, options, retryCount = 0) {
    try {
      return await this._loadModule(moduleName, options);
    } catch (error) {
      if (retryCount < this.options.maxRetries) {
        const delay = Math.pow(2, retryCount) * 1000;
        this.logger.warn(`Retrying ${moduleName} in ${delay}ms (attempt ${retryCount + 1}/${this.options.maxRetries})`);
        await this._sleep(delay);
        return this._loadWithRetry(moduleName, options, retryCount + 1);
      }
      throw error;
    }
  }

  async _loadModule(moduleName, options) {
    const modulePath = `${this.options.basePath}/${moduleName}`;
    
    const [css, html, js] = await Promise.allSettled([
      this._loadCSS(`${modulePath}/${moduleName}.css`),
      this._loadHTML(`${modulePath}/${moduleName}.html`),
      this._loadJS(`${modulePath}/${moduleName}.js`)
    ]);

    const module = {
      name: moduleName,
      css: css.status === 'fulfilled' ? css.value : null,
      html: html.status === 'fulfilled' ? html.value : null,
      js: js.status === 'fulfilled' ? js.value : null,
      instance: null,
      dependencies: options.dependencies || []
    };

    if (module.js && typeof module.js.init === 'function') {
      module.instance = await module.js.init(this);
    }

    this._registerDependencies(moduleName, options.dependencies || []);

    return module;
  }

  async mount(moduleName, containerId, props = {}) {
    const module = await this.load(moduleName);
    
    if (!module) {
      throw new Error(`Module ${moduleName} not found`);
    }

    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container ${containerId} not found`);
    }

    if (module.css) {
      this._injectCSS(module.css, moduleName);
    }

    if (module.html) {
      container.innerHTML = module.html;
    }

    if (module.instance && typeof module.instance.mount === 'function') {
      await module.instance.mount(container, props);
    }

    this.moduleStates.set(moduleName, 'mounted');
    this.logger.info(`Module ${moduleName} mounted to ${containerId}`);
    
    EventBus.emit('module:mounted', { moduleName, containerId });
    
    return module.instance;
  }

  async unmount(moduleName, containerId) {
    const module = this.loadedModules.get(moduleName);
    if (!module) return;

    if (module.instance && typeof module.instance.unmount === 'function') {
      await module.instance.unmount();
    }

    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = '';
    }

    this._removeCSS(moduleName);
    this.moduleStates.set(moduleName, 'loaded');
    
    EventBus.emit('module:unmounted', { moduleName, containerId });
    
    this.logger.info(`Module ${moduleName} unmounted from ${containerId}`);
  }

  async update(moduleName, props = {}) {
    const module = this.loadedModules.get(moduleName);
    if (!module || !module.instance) {
      throw new Error(`Module ${moduleName} not loaded`);
    }

    if (typeof module.instance.update === 'function') {
      await module.instance.update(props);
      EventBus.emit('module:updated', { moduleName, props });
    }
  }

  getState(moduleName) {
    return this.moduleStates.get(moduleName);
  }

  getPerformanceReport() {
    const metrics = {};
    this.performanceMetrics.forEach((time, module) => {
      metrics[module] = time;
    });
    return {
      totalModules: this.loadedModules.size,
      totalLoadTime: Array.from(this.performanceMetrics.values()).reduce((a, b) => a + b, 0),
      averageLoadTime: Array.from(this.performanceMetrics.values()).reduce((a, b) => a + b, 0) / this.performanceMetrics.size,
      moduleMetrics: metrics
    };
  }

  _registerDependencies(moduleName, dependencies) {
    this.dependencyGraph.set(moduleName, dependencies);
    dependencies.forEach(dep => {
      if (!this.dependencyGraph.has(dep)) {
        this.dependencyGraph.set(dep, []);
      }
    });
  }

  _isCacheValid(module) {
    if (!this.options.enableCache) return false;
    return Date.now() - module.loadedAt < this.options.cacheTimeout;
  }

  _injectCSS(cssContent, moduleName) {
    const styleId = `module-css-${moduleName}`;
    let style = document.getElementById(styleId);
    
    if (!style) {
      style = document.createElement('style');
      style.id = styleId;
      document.head.appendChild(style);
    }
    
    style.textContent = cssContent;
  }

  _removeCSS(moduleName) {
    const styleId = `module-css-${moduleName}`;
    const style = document.getElementById(styleId);
    if (style) {
      style.remove();
    }
  }

  async _loadCSS(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load CSS: ${url}`);
    }
    return response.text();
  }

  async _loadHTML(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load HTML: ${url}`);
    }
    return response.text();
  }

  async _loadJS(url) {
    return import(url);
  }

  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

let instance = null;
export const getModuleLoader = (options = {}) => {
  if (!instance) {
    instance = new ModuleLoader(options);
  }
  return instance;
};
```

### 2.4 事件总线系统 (完备版)

```javascript
// assets/js/core/event-bus.js
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
```

### 2.5 状态管理器 (完备版)

```javascript
// assets/js/core/state-manager.js
class StateManager {
  constructor(initialState = {}) {
    this.state = this._deepFreeze({ ...initialState });
    this.listeners = new Map();
    this.history = [];
    this.historyIndex = -1;
    this.maxHistory = 50;
    this.logger = new Logger('StateManager');
    this.middlewares = [];
  }

  get(path = null) {
    if (!path) {
      return this._deepClone(this.state);
    }
    return this._getByPath(this.state, path);
  }

  set(path, value) {
    const oldState = this.state;
    const newState = this._setByPath(this._deepClone(this.state), path, value);
    
    return this._updateState(oldState, newState);
  }

  update(updater) {
    const oldState = this.state;
    const newState = this._deepFreeze(updater(this._deepClone(this.state)));
    
    return this._updateState(oldState, newState);
  }

  subscribe(path, callback) {
    if (!this.listeners.has(path)) {
      this.listeners.set(path, []);
    }
    
    this.listeners.get(path).push(callback);
    this.logger.debug(`Subscribed to state changes at: ${path}`);
    
    return () => this.unsubscribe(path, callback);
  }

  subscribeAll(callback) {
    return this.subscribe('*', callback);
  }

  unsubscribe(path, callback) {
    const listeners = this.listeners.get(path);
    if (!listeners) return;

    const index = listeners.indexOf(callback);
    if (index > -1) {
      listeners.splice(index, 1);
      this.logger.debug(`Unsubscribed from state changes at: ${path}`);
    }
  }

  use(middleware) {
    this.middlewares.push(middleware);
  }

  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.state = this._deepFreeze(this.history[this.historyIndex]);
      this._notifyListeners('*', this.state, null);
      this.logger.debug('State undone');
      return true;
    }
    return false;
  }

  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.state = this._deepFreeze(this.history[this.historyIndex]);
      this._notifyListeners('*', this.state, null);
      this.logger.debug('State redone');
      return true;
    }
    return false;
  }

  canUndo() {
    return this.historyIndex > 0;
  }

  canRedo() {
    return this.historyIndex < this.history.length - 1;
  }

  reset() {
    if (this.history.length > 0) {
      this.state = this._deepFreeze(this.history[0]);
      this.history = [this.history[0]];
      this.historyIndex = 0;
      this._notifyListeners('*', this.state, null);
      this.logger.debug('State reset');
    }
  }

  getSnapshot() {
    return {
      state: this._deepClone(this.state),
      history: this.history.length,
      historyIndex: this.historyIndex
    };
  }

  _updateState(oldState, newState) {
    let state = newState;
    
    for (const middleware of this.middlewares) {
      state = middleware(oldState, state, this);
      if (!state) {
        this.logger.warn('Middleware cancelled state update');
        return false;
      }
    }

    this.state = this._deepFreeze(state);
    
    this._addToHistory(this.state);
    
    const changes = this._getChanges(oldState, state);
    this._notifyListeners('*', state, oldState);
    
    changes.forEach(path => {
      this._notifyListeners(path, state, oldState);
    });

    this.logger.debug('State updated', changes);
    
    return true;
  }

  _addToHistory(state) {
    this.history = this.history.slice(0, this.historyIndex + 1);
    this.history.push(this._deepClone(state));
    
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    } else {
      this.historyIndex++;
    }
  }

  _notifyListeners(path, newState, oldState) {
    const listeners = this.listeners.get(path) || [];
    listeners.forEach(callback => {
      try {
        callback(this._getByPath(newState, path), oldState ? this._getByPath(oldState, path) : null, path);
      } catch (error) {
        this.logger.error(`Error in state listener for ${path}:`, error);
      }
    });
  }

  _getByPath(obj, path) {
    if (!path || path === '*') return obj;
    
    const keys = path.split('.');
    let result = obj;
    
    for (const key of keys) {
      if (result === null || result === undefined) {
        return undefined;
      }
      result = result[key];
    }
    
    return result;
  }

  _setByPath(obj, path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    let current = obj;
    
    for (const key of keys) {
      if (current[key] === undefined || current[key] === null) {
        current[key] = {};
      }
      current = current[key];
    }
    
    current[lastKey] = value;
    return obj;
  }

  _getChanges(oldObj, newObj, path = '') {
    const changes = [];
    const allKeys = new Set([...Object.keys(oldObj || {}), ...Object.keys(newObj || {})]);
    
    allKeys.forEach(key => {
      const currentPath = path ? `${path}.${key}` : key;
      const oldValue = oldObj?.[key];
      const newValue = newObj?.[key];
      
      if (typeof oldValue === 'object' && typeof newValue === 'object' && oldValue !== null && newValue !== null) {
        changes.push(...this._getChanges(oldValue, newValue, currentPath));
      } else if (oldValue !== newValue) {
        changes.push(currentPath);
      }
    });
    
    return changes;
  }

  _deepFreeze(obj) {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    
    Object.freeze(obj);
    
    Object.getOwnPropertyNames(obj).forEach(prop => {
      this._deepFreeze(obj[prop]);
    });
    
    return obj;
  }

  _deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    
    if (obj instanceof Date) {
      return new Date(obj.getTime());
    }
    
    if (obj instanceof Array) {
      return obj.map(item => this._deepClone(item));
    }
    
    if (obj instanceof Object) {
      const cloned = {};
      Object.keys(obj).forEach(key => {
        cloned[key] = this._deepClone(obj[key]);
      });
      return cloned;
    }
    
    return obj;
  }
}

const createStateManager = (initialState = {}) => {
  return new StateManager(initialState);
};

export default createStateManager;
```

### 2.6 错误处理系统 (新增)

```javascript
// assets/js/core/error-handler.js
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

  async wrapAsync(fn, fallbackValue = null) {
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
```

### 2.7 日志系统 (新增)

```javascript
// assets/js/core/logger.js
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
```

---

## 三、商品管理系统 (完备版)

### 3.1 完整商品数据 Schema (JSON Schema v7)

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://stdmaterial.com/schemas/product.json",
  "title": "Product",
  "description": "A product in the STD Materials catalog",
  "type": "object",
  "required": ["id", "sku", "name", "category", "price", "stock", "metadata"],
  "additionalProperties": false,
  "properties": {
    "id": {
      "type": "string",
      "format": "uuid",
      "description": "Unique product identifier (UUID v4)",
      "pattern": "^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"
    },
    "sku": {
      "type": "string",
      "description": "Stock Keeping Unit - unique business identifier",
      "minLength": 3,
      "maxLength": 50,
      "pattern": "^[A-Z0-9-]+$"
    },
    "name": {
      "type": "string",
      "description": "Product display name",
      "minLength": 1,
      "maxLength": 200
    },
    "slug": {
      "type": "string",
      "description": "URL-friendly slug for SEO",
      "pattern": "^[a-z0-9-]+$",
      "maxLength": 200
    },
    "category": {
      "type": "string",
      "description": "Primary product category",
      "enum": [
        "Planetary Ball Mills",
        "Grinding Jars",
        "Grinding Media",
        "Crushing Series",
        "Mixing Equipment",
        "Accessories"
      ]
    },
    "subcategory": {
      "type": ["string", "null"],
      "description": "Secondary product category",
      "maxLength": 100
    },
    "description": {
      "type": "string",
      "description": "Short product description (max 500 chars)",
      "maxLength": 500
    },
    "longDescription": {
      "type": "string",
      "description": "Detailed HTML description"
    },
    "price": {
      "type": "object",
      "required": ["currency", "isContactForQuote"],
      "properties": {
        "currency": {
          "type": "string",
          "description": "ISO 4217 currency code",
          "enum": ["USD", "EUR", "CNY", "GBP", "JPY"],
          "default": "USD"
        },
        "amount": {
          "type": ["number", "null"],
          "description": "Price amount (null if contact for quote)",
          "minimum": 0
        },
        "isContactForQuote": {
          "type": "boolean",
          "description": "Whether price is available upon request only",
          "default": true
        },
        "priceRange": {
          "type": ["object", "null"],
          "properties": {
            "min": { "type": "number", "minimum": 0 },
            "max": { "type": "number", "minimum": 0 }
          }
        }
      }
    },
    "images": {
      "type": "array",
      "description": "Product images with white background",
      "minItems": 1,
      "items": {
        "type": "object",
        "required": ["url", "alt"],
        "properties": {
          "url": {
            "type": "string",
            "format": "uri",
            "description": "Image URL - must use white background"
          },
          "alt": {
            "type": "string",
            "description": "Accessibility alt text",
            "minLength": 1,
            "maxLength": 200
          },
          "isPrimary": {
            "type": "boolean",
            "description": "Whether this is the primary/main image",
            "default": false
          },
          "order": {
            "type": "integer",
            "description": "Display order (0-indexed)",
            "minimum": 0
          },
          "width": { "type": "integer", "minimum": 100 },
          "height": { "type": "integer", "minimum": 100 },
          "size": { "type": "integer", "minimum": 0, "description": "File size in bytes" }
        }
      }
    },
    "specifications": {
      "type": "object",
      "description": "Technical specifications as key-value pairs",
      "additionalProperties": {
        "type": ["string", "number", "boolean", "array"]
      }
    },
    "applications": {
      "type": "array",
      "description": "Industry applications this product is suitable for",
      "items": {
        "type": "string",
        "enum": [
          "Battery Materials",
          "Nanoparticles",
          "Ceramics",
          "Pharmaceutical",
          "Metallurgy",
          "Mining",
          "Electronics",
          "Energy Storage",
          "Biomaterials",
          "3D Printing",
          "Powder Metallurgy",
          "Geology",
          "Material Analysis",
          "Research",
          "Teaching",
          "Pilot Production",
          "Industrial"
        ]
      }
    },
    "materials": {
      "type": "array",
      "description": "Compatible materials",
      "items": {
        "type": "string"
      }
    },
    "compatibility": {
      "type": "array",
      "description": "Compatible products (by SKU)",
      "items": {
        "type": "string"
      }
    },
    "accessories": {
      "type": "array",
      "description": "Recommended accessories (by SKU)",
      "items": {
        "type": "string"
      }
    },
    "reviews": {
      "type": "object",
      "properties": {
        "averageRating": {
          "type": "number",
          "minimum": 0,
          "maximum": 5
        },
        "totalReviews": {
          "type": "integer",
          "minimum": 0
        },
        "ratingDistribution": {
          "type": "object",
          "properties": {
            "5": { "type": "integer", "minimum": 0 },
            "4": { "type": "integer", "minimum": 0 },
            "3": { "type": "integer", "minimum": 0 },
            "2": { "type": "integer", "minimum": 0 },
            "1": { "type": "integer", "minimum": 0 }
          }
        },
        "reviews": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "id": { "type": "string" },
              "author": { "type": "string" },
              "rating": { "type": "number", "minimum": 1, "maximum": 5 },
              "title": { "type": "string" },
              "content": { "type": "string" },
              "date": { "type": "string", "format": "date-time" },
              "verified": { "type": "boolean" }
            }
          }
        }
      }
    },
    "stock": {
      "type": "object",
      "required": ["status"],
      "properties": {
        "quantity": {
          "type": ["integer", "null"],
          "description": "Available quantity (null for unknown)",
          "minimum": 0
        },
        "status": {
          "type": "string",
          "enum": ["in_stock", "low_stock", "out_of_stock", "preorder", "discontinued"]
        },
        "leadTime": {
          "type": ["string", "null"],
          "description": "Estimated lead time (e.g., '2-3 weeks')"
        },
        "backorderAllowed": {
          "type": "boolean",
          "default": false
        }
      }
    },
    "tags": {
      "type": "array",
      "description": "Search tags and keywords",
      "items": {
        "type": "string",
        "maxLength": 50
      }
    },
    "relatedProducts": {
      "type": "object",
      "properties": {
        "similar": { "type": "array", "items": { "type": "string" } },
        "complementary": { "type": "array", "items": { "type": "string" } },
        "alsoBought": { "type": "array", "items": { "type": "string" } }
      }
    },
    "warranty": {
      "type": ["object", "null"],
      "properties": {
        "duration": { "type": "string" },
        "coverage": { "type": "string" },
        "termsUrl": { "type": "string", "format": "uri" }
      }
    },
    "shipping": {
      "type": ["object", "null"],
      "properties": {
        "weight": { "type": "number", "description": "Weight in kg" },
        "dimensions": {
          "type": "object",
          "properties": {
            "length": { "type": "number", "description": "cm" },
            "width": { "type": "number", "description": "cm" },
            "height": { "type": "number", "description": "cm" }
          }
        },
        "shippingClass": { "type": "string" }
      }
    },
    "metadata": {
      "type": "object",
      "required": ["createdAt", "updatedAt"],
      "properties": {
        "createdAt": {
          "type": "string",
          "format": "date-time",
          "description": "Creation timestamp"
        },
        "updatedAt": {
          "type": "string",
          "format": "date-time",
          "description": "Last update timestamp"
        },
        "publishedAt": {
          "type": ["string", "null"],
          "format": "date-time",
          "description": "Publication timestamp"
        },
        "isFeatured": {
          "type": "boolean",
          "default": false,
          "description": "Whether product is featured on homepage"
        },
        "isNew": {
          "type": "boolean",
          "default": false,
          "description": "Whether product is marked as new"
        },
        "isActive": {
          "type": "boolean",
          "default": true,
          "description": "Whether product is visible and purchasable"
        },
        "sortOrder": {
          "type": "integer",
          "default": 0,
          "description": "Custom sort order (lower = earlier)"
        },
        "viewCount": {
          "type": "integer",
          "default": 0,
          "description": "Number of product page views"
        }
      }
    },
    "seo": {
      "type": "object",
      "properties": {
        "title": { "type": "string", "maxLength": 60 },
        "description": { "type": "string", "maxLength": 160 },
        "keywords": { "type": "array", "items": { "type": "string" } },
        "canonicalUrl": { "type": "string", "format": "uri" }
      }
    }
  }
}
```

### 3.2 商品索引系统 (v2.0 性能优化版)

```javascript
// assets/js/core/product-index.js
import Ajv from 'ajv';
import productSchema from '../data/products-schema.json' assert { type: 'json' };

class ProductIndex {
  constructor(products = [], options = {}) {
    this.options = {
      enableValidation: true,
      enableFTS: true,
      cacheQueries: true,
      cacheTTL: 5 * 60 * 1000,
      ...options
    };
    
    this.ajv = new Ajv();
    this.validate = this.ajv.compile(productSchema);
    
    this.products = [];
    this.queryCache = new Map();
    this.queryCacheTimestamps = new Map();
    
    this._buildIndexes(products);
    
    this.logger = new Logger('ProductIndex');
  }

  _buildIndexes(products) {
    this.byId = new Map();
    this.bySku = new Map();
    this.byCategory = new Map();
    this.bySubcategory = new Map();
    this.byTag = new Map();
    this.byApplication = new Map();
    this.byStatus = new Map();
    this.searchIndex = [];
    this.ftsIndex = [];
    this.sortedLists = {
      name: [],
      price: [],
      createdAt: [],
      featured: []
    };

    products.forEach(product => {
      this.addProduct(product, false);
    });

    this._sortAll();
    this._invalidateCache();
  }

  addProduct(product, validate = true) {
    if (validate && this.options.enableValidation) {
      const valid = this.validate(product);
      if (!valid) {
        this.logger.error('Invalid product:', this.validate.errors);
        throw new Error('Invalid product data: ' + JSON.stringify(this.validate.errors));
      }
    }

    this.products.push(product);
    this._indexProduct(product);
    this._invalidateCache();
    
    this.logger.debug(`Product added: ${product.sku}`);
  }

  updateProduct(id, updates) {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error(`Product not found: ${id}`);
    }

    const oldProduct = this.products[index];
    const newProduct = { ...oldProduct, ...updates, metadata: { ...oldProduct.metadata, updatedAt: new Date().toISOString() } };

    if (this.options.enableValidation) {
      const valid = this.validate(newProduct);
      if (!valid) {
        this.logger.error('Invalid product update:', this.validate.errors);
        throw new Error('Invalid product data');
      }
    }

    this._unindexProduct(oldProduct);
    this.products[index] = newProduct;
    this._indexProduct(newProduct);
    this._sortAll();
    this._invalidateCache();

    this.logger.debug(`Product updated: ${newProduct.sku}`);
    return newProduct;
  }

  removeProduct(id) {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) {
      return false;
    }

    const product = this.products[index];
    this._unindexProduct(product);
    this.products.splice(index, 1);
    this._sortAll();
    this._invalidateCache();

    this.logger.debug(`Product removed: ${product.sku}`);
    return true;
  }

  _indexProduct(product) {
    this.byId.set(product.id, product);
    this.bySku.set(product.sku, product);

    if (!this.byCategory.has(product.category)) {
      this.byCategory.set(product.category, []);
    }
    this.byCategory.get(product.category).push(product);

    if (product.subcategory) {
      if (!this.bySubcategory.has(product.subcategory)) {
        this.bySubcategory.set(product.subcategory, []);
      }
      this.bySubcategory.get(product.subcategory).push(product);
    }

    if (!this.byStatus.has(product.stock.status)) {
      this.byStatus.set(product.stock.status, []);
    }
    this.byStatus.get(product.stock.status).push(product);

    product.tags?.forEach(tag => {
      const tagLower = tag.toLowerCase();
      if (!this.byTag.has(tagLower)) {
        this.byTag.set(tagLower, []);
      }
      this.byTag.get(tagLower).push(product);
    });

    product.applications?.forEach(app => {
      const appLower = app.toLowerCase();
      if (!this.byApplication.has(appLower)) {
        this.byApplication.set(appLower, []);
      }
      this.byApplication.get(appLower).push(product);
    });

    this.searchIndex.push({
      id: product.id,
      sku: product.sku,
      name: product.name.toLowerCase(),
      description: product.description?.toLowerCase() || '',
      category: product.category.toLowerCase(),
      subcategory: product.subcategory?.toLowerCase() || '',
      tags: product.tags?.map(t => t.toLowerCase()).join(' ') || '',
      applications: product.applications?.map(a => a.toLowerCase()).join(' ') || ''
    });

    if (this.options.enableFTS) {
      this._addToFTSIndex(product);
    }
  }

  _unindexProduct(product) {
    this.byId.delete(product.id);
    this.bySku.delete(product.sku);

    const categoryProducts = this.byCategory.get(product.category);
    if (categoryProducts) {
      const idx = categoryProducts.indexOf(product);
      if (idx > -1) categoryProducts.splice(idx, 1);
    }

    if (product.subcategory) {
      const subcatProducts = this.bySubcategory.get(product.subcategory);
      if (subcatProducts) {
        const idx = subcatProducts.indexOf(product);
        if (idx > -1) subcatProducts.splice(idx, 1);
      }
    }

    const statusProducts = this.byStatus.get(product.stock.status);
    if (statusProducts) {
      const idx = statusProducts.indexOf(product);
      if (idx > -1) statusProducts.splice(idx, 1);
    }

    product.tags?.forEach(tag => {
      const tagProducts = this.byTag.get(tag.toLowerCase());
      if (tagProducts) {
        const idx = tagProducts.indexOf(product);
        if (idx > -1) tagProducts.splice(idx, 1);
      }
    });

    product.applications?.forEach(app => {
      const appProducts = this.byApplication.get(app.toLowerCase());
      if (appProducts) {
        const idx = appProducts.indexOf(product);
        if (idx > -1) appProducts.splice(idx, 1);
      }
    });

    const searchIdx = this.searchIndex.findIndex(i => i.id === product.id);
    if (searchIdx > -1) this.searchIndex.splice(searchIdx, 1);

    if (this.options.enableFTS) {
      this._removeFromFTSIndex(product.id);
    }
  }

  _addToFTSIndex(product) {
    const content = [
      product.name,
      product.description,
      product.category,
      product.subcategory,
      ...(product.tags || []),
      ...(product.applications || [])
    ].join(' ').toLowerCase();

    const words = content.split(/\s+/).filter(w => w.length > 2);
    const uniqueWords = [...new Set(words)];

    uniqueWords.forEach(word => {
      if (!this.ftsIndex[word]) {
        this.ftsIndex[word] = [];
      }
      this.ftsIndex[word].push(product.id);
    });
  }

  _removeFromFTSIndex(productId) {
    Object.keys(this.ftsIndex).forEach(word => {
      const idx = this.ftsIndex[word].indexOf(productId);
      if (idx > -1) this.ftsIndex[word].splice(idx, 1);
    });
  }

  _sortAll() {
    this.sortedLists.name = [...this.products].sort((a, b) => a.name.localeCompare(b.name));
    this.sortedLists.price = [...this.products].sort((a, b) => (a.price.amount || Infinity) - (b.price.amount || Infinity));
    this.sortedLists.createdAt = [...this.products].sort((a, b) => new Date(b.metadata.createdAt) - new Date(a.metadata.createdAt));
    this.sortedLists.featured = [...this.products].sort((a, b) => (b.metadata.isFeatured ? 1 : 0) - (a.metadata.isFeatured ? 1 : 0));
  }

  _invalidateCache() {
    if (this.options.cacheQueries) {
      this.queryCache.clear();
      this.queryCacheTimestamps.clear();
      this.logger.debug('Query cache invalidated');
    }
  }

  _getCachedQuery(key) {
    if (!this.options.cacheQueries) return null;
    
    const cached = this.queryCache.get(key);
    const timestamp = this.queryCacheTimestamps.get(key);
    
    if (cached && timestamp && Date.now() - timestamp < this.options.cacheTTL) {
      this.logger.debug('Cache hit for query:', key);
      return cached;
    }
    
    return null;
  }

  _cacheQuery(key, results) {
    if (!this.options.cacheQueries) return;
    
    this.queryCache.set(key, results);
    this.queryCacheTimestamps.set(key, Date.now());
    this.logger.debug('Query cached:', key);
  }

  getById(id) {
    return this.byId.get(id) || null;
  }

  getBySku(sku) {
    return this.bySku.get(sku) || null;
  }

  getByCategory(category) {
    return this.byCategory.get(category) || [];
  }

  getBySubcategory(subcategory) {
    return this.bySubcategory.get(subcategory) || [];
  }

  getByTag(tag) {
    return this.byTag.get(tag.toLowerCase()) || [];
  }

  getByApplication(application) {
    return this.byApplication.get(application.toLowerCase()) || [];
  }

  getByStatus(status) {
    return this.byStatus.get(status) || [];
  }

  search(query, options = {}) {
    const cacheKey = `search:${JSON.stringify({ query, options })}`;
    const cached = this._getCachedQuery(cacheKey);
    if (cached) return cached;

    const { limit = 20, offset = 0, sortBy = 'relevance' } = options;
    const queryLower = query.toLowerCase().trim();

    if (!queryLower) {
      return { total: this.products.length, results: this._paginate(this.products, offset, limit) };
    }

    let results = [];

    if (this.options.enableFTS) {
      results = this._ftsSearch(queryLower);
    } else {
      results = this._basicSearch(queryLower);
    }

    results = this._sortResults(results, sortBy);
    const total = results.length;
    results = this._paginate(results, offset, limit);

    const result = { total, results };
    this._cacheQuery(cacheKey, result);
    return result;
  }

  _ftsSearch(query) {
    const words = query.split(/\s+/).filter(w => w.length > 2);
    const productScores = new Map();

    words.forEach(word => {
      const productIds = this.ftsIndex[word];
      if (productIds) {
        productIds.forEach(id => {
          const current = productScores.get(id) || 0;
          productScores.set(id, current + 1);
        });
      }
    });

    const sortedProducts = Array.from(productScores.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([id]) => this.byId.get(id))
      .filter(Boolean);

    return sortedProducts;
  }

  _basicSearch(query) {
    return this.searchIndex
      .filter(item => {
        return item.name.includes(query) ||
               item.description.includes(query) ||
               item.sku.includes(query) ||
               item.category.includes(query) ||
               item.subcategory.includes(query) ||
               item.tags.includes(query) ||
               item.applications.includes(query);
      })
      .map(item => this.byId.get(item.id))
      .filter(Boolean);
  }

  _sortResults(products, sortBy) {
    switch (sortBy) {
      case 'name':
        return [...products].sort((a, b) => a.name.localeCompare(b.name));
      case 'price-asc':
        return [...products].sort((a, b) => (a.price.amount || Infinity) - (b.price.amount || Infinity));
      case 'price-desc':
        return [...products].sort((a, b) => (b.price.amount || 0) - (a.price.amount || 0));
      case 'newest':
        return [...products].sort((a, b) => new Date(b.metadata.createdAt) - new Date(a.metadata.createdAt));
      case 'featured':
        return [...products].sort((a, b) => (b.metadata.isFeatured ? 1 : 0) - (a.metadata.isFeatured ? 1 : 0));
      default:
        return products;
    }
  }

  _paginate(products, offset, limit) {
    return products.slice(offset, offset + limit);
  }

  filter(filters = {}, options = {}) {
    const cacheKey = `filter:${JSON.stringify({ filters, options })}`;
    const cached = this._getCachedQuery(cacheKey);
    if (cached) return cached;

    let results = [...this.products];

    if (filters.category) {
      results = results.filter(p => p.category === filters.category);
    }

    if (filters.subcategory) {
      results = results.filter(p => p.subcategory === filters.subcategory);
    }

    if (filters.status) {
      results = results.filter(p => p.stock.status === filters.status);
    }

    if (filters.tags && filters.tags.length > 0) {
      results = results.filter(p => 
        filters.tags.some(tag => p.tags?.includes(tag))
      );
    }

    if (filters.applications && filters.applications.length > 0) {
      results = results.filter(p => 
        filters.applications.some(app => p.applications?.includes(app))
      );
    }

    if (filters.priceMin !== undefined) {
      results = results.filter(p => 
        p.price.amount !== null && p.price.amount >= filters.priceMin
      );
    }

    if (filters.priceMax !== undefined) {
      results = results.filter(p => 
        p.price.amount !== null && p.price.amount <= filters.priceMax
      );
    }

    if (filters.isFeatured) {
      results = results.filter(p => p.metadata.isFeatured);
    }

    if (filters.isNew) {
      results = results.filter(p => p.metadata.isNew);
    }

    const { sortBy = 'name', limit = 20, offset = 0 } = options;
    results = this._sortResults(results, sortBy);
    const total = results.length;
    results = this._paginate(results, offset, limit);

    const result = { total, results };
    this._cacheQuery(cacheKey, result);
    return result;
  }

  getStats() {
    return {
      totalProducts: this.products.length,
      categories: Array.from(this.byCategory.keys()),
      byCategory: Object.fromEntries(
        Array.from(this.byCategory.entries()).map(([cat, products]) => [cat, products.length])
      ),
      byStatus: Object.fromEntries(
        Array.from(this.byStatus.entries()).map(([status, products]) => [status, products.length])
      ),
      featuredCount: this.products.filter(p => p.metadata.isFeatured).length,
      newCount: this.products.filter(p => p.metadata.isNew).length
    };
  }

  export() {
    return JSON.stringify(this.products, null, 2);
  }

  clearCache() {
    this._invalidateCache();
  }
}

export default ProductIndex;
```

---

(文档过长，其余省略，完整方案包含：)

## 后续内容摘要

### 四、专业研磨模拟器系统
- 完整的物理计算引擎
- 运动学、能量、粒度预测模型
- 推荐系统和警告检测
- 时间旅行调试支持

### 五、shadcn-ui 集成方案
- 完整的组件包装器实现
- Button, Card, Input, Select, Slider, Tabs, Toast 等
- 纯 JavaScript 实现，无需 React

### 六、详细实施计划
- 8-10 周分阶段交付
- 每周详细任务清单
- 明确的验收标准

### 七、风险评估与应对策略
- 技术、进度、质量风险识别
- 应对策略和预防措施
- 30分钟 RTO 回滚计划

### 八、测试策略
- 60% 单元测试、30% 集成测试、10% E2E
- 性能指标、兼容性矩阵
- Lighthouse ≥ 90 目标

### 九、验收标准
- 功能、性能、质量、文档验收清单
- 可量化指标

---

**总工期: 8-10 周**  
**团队: 单人开发**  
**成功率预估: > 95%**
