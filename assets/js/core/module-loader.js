import Logger from './logger.js';
import eventBus from './event-bus.js';
import errorHandler from './error-handler.js';

class ModuleLoader {
  constructor() {
    this.modules = new Map();
    this.loadedModules = new Set();
    this.logger = new Logger('ModuleLoader');
  }

  registerModule(name, moduleDefinition) {
    if (!name || typeof name !== 'string') {
      throw new Error('Module name must be a string');
    }

    if (!moduleDefinition || typeof moduleDefinition !== 'object') {
      throw new Error('Module definition must be an object');
    }

    const module = {
      name,
      definition: moduleDefinition,
      dependencies: moduleDefinition.dependencies || [],
      status: 'registered',
      instance: null
    };

    this.modules.set(name, module);
    this.logger.info(`Module registered: ${name}`);
    
    eventBus.emit('module:registered', { name, module });
    return this;
  }

  async loadModule(name) {
    const module = this.modules.get(name);
    if (!module) {
      throw new Error(`Module not found: ${name}`);
    }

    if (module.status === 'loaded') {
      this.logger.debug(`Module already loaded: ${name}`);
      return module.instance;
    }

    try {
      // Load dependencies first
      await this._loadDependencies(module);

      // Create module instance
      module.instance = await this._createModuleInstance(module);
      module.status = 'loaded';
      this.loadedModules.add(name);

      this.logger.info(`Module loaded: ${name}`);
      eventBus.emit('module:loaded', { name, instance: module.instance });

      return module.instance;
    } catch (error) {
      module.status = 'error';
      this.logger.error(`Failed to load module ${name}:`, error);
      eventBus.emit('module:error', { name, error });
      throw error;
    }
  }

  async loadAllModules() {
    const moduleNames = Array.from(this.modules.keys());
    const loadPromises = moduleNames.map(name => this.loadModule(name));
    
    await Promise.all(loadPromises);
    this.logger.info('All modules loaded');
    eventBus.emit('modules:allLoaded');
  }

  async startModule(name) {
    const module = this.modules.get(name);
    if (!module) {
      throw new Error(`Module not found: ${name}`);
    }

    if (module.status !== 'loaded') {
      await this.loadModule(name);
    }

    if (module.status === 'started') {
      this.logger.debug(`Module already started: ${name}`);
      return;
    }

    try {
      if (typeof module.instance.start === 'function') {
        await module.instance.start();
      }
      module.status = 'started';
      
      this.logger.info(`Module started: ${name}`);
      eventBus.emit('module:started', { name, instance: module.instance });
    } catch (error) {
      this.logger.error(`Failed to start module ${name}:`, error);
      eventBus.emit('module:error', { name, error });
      throw error;
    }
  }

  async startAllModules() {
    const loadedModuleNames = Array.from(this.loadedModules);
    const startPromises = loadedModuleNames.map(name => this.startModule(name));
    
    await Promise.all(startPromises);
    this.logger.info('All modules started');
    eventBus.emit('modules:allStarted');
  }

  async stopModule(name) {
    const module = this.modules.get(name);
    if (!module) {
      throw new Error(`Module not found: ${name}`);
    }

    if (module.status !== 'started') {
      this.logger.debug(`Module not started: ${name}`);
      return;
    }

    try {
      if (typeof module.instance.stop === 'function') {
        await module.instance.stop();
      }
      module.status = 'loaded';
      
      this.logger.info(`Module stopped: ${name}`);
      eventBus.emit('module:stopped', { name, instance: module.instance });
    } catch (error) {
      this.logger.error(`Failed to stop module ${name}:`, error);
      eventBus.emit('module:error', { name, error });
      throw error;
    }
  }

  async stopAllModules() {
    const loadedModuleNames = Array.from(this.loadedModules);
    const stopPromises = loadedModuleNames.map(name => this.stopModule(name));
    
    await Promise.all(stopPromises);
    this.logger.info('All modules stopped');
    eventBus.emit('modules:allStopped');
  }

  getModule(name) {
    const module = this.modules.get(name);
    return module ? module.instance : null;
  }

  getAllModules() {
    const result = {};
    this.modules.forEach((module, name) => {
      result[name] = module.instance;
    });
    return result;
  }

  getModuleStatus(name) {
    const module = this.modules.get(name);
    return module ? module.status : 'not_registered';
  }

  /**
   * 懒加载模块
   * @param {string} name - 模块名称
   * @param {Function} loader - 模块加载函数
   * @param {Array} dependencies - 依赖模块列表
   * @returns {Promise<any>} 模块实例
   */
  async lazyLoadModule(name, loader, dependencies = []) {
    if (this.modules.has(name)) {
      return this.loadModule(name);
    }

    // 注册模块
    this.registerModule(name, {
      create: async () => {
        try {
          const module = await loader();
          return module.default || module;
        } catch (error) {
          this.logger.error(`Failed to lazy load module ${name}:`, error);
          throw error;
        }
      },
      dependencies
    });

    return this.loadModule(name);
  }

  async _loadDependencies(module) {
    const dependencies = module.dependencies;
    if (!dependencies || dependencies.length === 0) {
      return;
    }

    this.logger.debug(`Loading dependencies for module ${module.name}: ${dependencies.join(', ')}`);
    
    for (const depName of dependencies) {
      if (!this.modules.has(depName)) {
        throw new Error(`Dependency not found: ${depName} for module ${module.name}`);
      }
      await this.loadModule(depName);
    }
  }

  async _createModuleInstance(module) {
    const { definition } = module;
    let instance;

    if (typeof definition.create === 'function') {
      // Create instance using create method
      instance = await definition.create();
    } else if (definition.class) {
      // Create instance from class
      const ModuleClass = definition.class;
      instance = new ModuleClass();
    } else if (typeof definition === 'function') {
      // Create instance from function
      instance = definition();
    } else {
      // Use definition as instance
      instance = definition;
    }

    // Add module metadata
    if (instance) {
      instance._moduleName = module.name;
      instance._moduleLoader = this;
    }

    return instance;
  }
}

const moduleLoader = new ModuleLoader();
export default moduleLoader;
