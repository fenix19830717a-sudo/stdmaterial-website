import Logger from '../../core/logger.js';
import eventBus from '../../core/event-bus.js';

class GrinderEngine {
  constructor() {
    this.logger = new Logger('GrinderEngine');
    this.simulation = null;
    this.isRunning = false;
    this.logger.info('GrinderEngine initialized');
  }

  // 开始研磨模拟
  startSimulation(config) {
    if (this.isRunning) {
      this.logger.warn('Simulation already running');
      return false;
    }

    // 验证配置
    const validation = this._validateConfig(config);
    if (!validation.valid) {
      this.logger.error('Invalid simulation config:', validation.errors);
      return false;
    }

    // 创建模拟实例
    this.simulation = {
      config: { ...config },
      startTime: Date.now(),
      currentTime: 0,
      state: {
        temperature: config.initialTemperature || 25,
        pressure: config.initialPressure || 1,
        particleSize: config.initialParticleSize || 100,
        energyInput: 0,
        materialLoss: 0
      },
      history: []
    };

    this.isRunning = true;
    this.logger.info('Simulation started with config:', config);
    eventBus.emit('grinder:simulationStarted', { config });

    // 开始模拟循环
    this._simulate();
    return true;
  }

  // 停止研磨模拟
  stopSimulation() {
    if (!this.isRunning) {
      this.logger.warn('No simulation running');
      return false;
    }

    this.isRunning = false;
    const finalState = { ...this.simulation.state };
    const duration = Date.now() - this.simulation.startTime;
    
    this.logger.info('Simulation stopped', { duration, finalState });
    eventBus.emit('grinder:simulationStopped', { duration, finalState });
    
    this.simulation = null;
    return true;
  }

  // 获取模拟状态
  getSimulationState() {
    if (!this.simulation) {
      return null;
    }
    return { ...this.simulation.state };
  }

  // 获取模拟历史
  getSimulationHistory() {
    if (!this.simulation) {
      return [];
    }
    return [...this.simulation.history];
  }

  // 计算研磨结果
  calculateGrindingResult(config) {
    // 验证配置
    const validation = this._validateConfig(config);
    if (!validation.valid) {
      throw new Error('Invalid config: ' + JSON.stringify(validation.errors));
    }

    // 计算研磨时间
    const grindingTime = this._calculateGrindingTime(config);
    
    // 计算最终粒度
    const finalParticleSize = this._calculateFinalParticleSize(config, grindingTime);
    
    // 计算能耗
    const energyConsumption = this._calculateEnergyConsumption(config, grindingTime);
    
    // 计算温度变化
    const temperatureChange = this._calculateTemperatureChange(config, grindingTime, energyConsumption);
    
    // 计算材料损失
    const materialLoss = this._calculateMaterialLoss(config, grindingTime);

    return {
      grindingTime,
      finalParticleSize,
      energyConsumption,
      temperatureChange,
      materialLoss,
      finalTemperature: (config.initialTemperature || 25) + temperatureChange
    };
  }

  // 模拟循环
  _simulate() {
    if (!this.isRunning) {
      return;
    }

    // 计算时间步长（100ms）
    const timeStep = 0.1;
    this.simulation.currentTime += timeStep;

    // 更新状态
    this._updateState(timeStep);

    // 记录历史
    this._recordHistory();

    // 检查是否达到目标
    if (this._checkGoalReached()) {
      this.stopSimulation();
      return;
    }

    // 继续模拟
    setTimeout(() => this._simulate(), 100);
  }

  // 更新状态
  _updateState(timeStep) {
    const { config, state } = this.simulation;

    // 计算能耗
    const power = config.power || 1000; // 瓦特
    const energyAdded = power * timeStep / 3600; // 转换为焦耳
    state.energyInput += energyAdded;

    // 计算温度变化
    const heatCapacity = config.materialHeatCapacity || 0.5; // J/g°C
    const materialMass = config.materialMass || 1000; // g
    const temperatureIncrease = energyAdded / (heatCapacity * materialMass);
    state.temperature += temperatureIncrease;

    // 计算粒度变化
    const sizeReduction = this._calculateSizeReduction(config, timeStep);
    state.particleSize = Math.max(state.particleSize - sizeReduction, config.targetParticleSize || 1);

    // 计算材料损失
    const materialLossRate = config.materialLossRate || 0.001; // 每小时百分比
    state.materialLoss += (config.materialMass || 1000) * materialLossRate * timeStep / 60;

    // 计算压力变化
    state.pressure = config.initialPressure || 1 + (state.temperature - (config.initialTemperature || 25)) * 0.01;
  }

  // 记录历史
  _recordHistory() {
    if (this.simulation.currentTime % 1 < 0.1) { // 每1秒记录一次
      this.simulation.history.push({
        time: this.simulation.currentTime,
        state: { ...this.simulation.state }
      });
    }
  }

  // 检查是否达到目标
  _checkGoalReached() {
    const { config, state } = this.simulation;
    
    // 检查是否达到目标粒度
    if (config.targetParticleSize && state.particleSize <= config.targetParticleSize) {
      return true;
    }

    // 检查是否达到最大时间
    if (config.maxTime && this.simulation.currentTime >= config.maxTime) {
      return true;
    }

    // 检查是否温度过高
    if (config.maxTemperature && state.temperature >= config.maxTemperature) {
      return true;
    }

    return false;
  }

  // 验证配置
  _validateConfig(config) {
    const errors = [];

    if (!config) {
      errors.push('Config is required');
      return { valid: false, errors };
    }

    if (!config.materialType) {
      errors.push('Material type is required');
    }

    if (!config.materialMass || config.materialMass <= 0) {
      errors.push('Material mass must be greater than 0');
    }

    if (!config.power || config.power <= 0) {
      errors.push('Power must be greater than 0');
    }

    if (config.targetParticleSize && config.targetParticleSize <= 0) {
      errors.push('Target particle size must be greater than 0');
    }

    if (config.maxTime && config.maxTime <= 0) {
      errors.push('Max time must be greater than 0');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // 计算研磨时间
  _calculateGrindingTime(config) {
    const { initialParticleSize = 100, targetParticleSize = 1, materialHardness = 5 } = config;
    
    // 基于Rittinger's定律计算
    const sizeRatio = initialParticleSize / targetParticleSize;
    const hardnessFactor = 1 + (materialHardness - 5) * 0.1;
    const time = Math.log(sizeRatio) * hardnessFactor * 0.5;
    
    return Math.max(time, 0.1); // 最小0.1小时
  }

  // 计算最终粒度
  _calculateFinalParticleSize(config, grindingTime) {
    const { initialParticleSize = 100, materialHardness = 5, power = 1000 } = config;
    
    // 基于Rittinger's定律
    const powerFactor = power / 1000;
    const hardnessFactor = 1 + (materialHardness - 5) * 0.1;
    const sizeReduction = Math.log(initialParticleSize) - (grindingTime * powerFactor / hardnessFactor);
    
    return Math.max(Math.exp(sizeReduction), 0.1); // 最小0.1微米
  }

  // 计算能耗
  _calculateEnergyConsumption(config, grindingTime) {
    const { power = 1000 } = config;
    return power * grindingTime / 3600; // 转换为焦耳
  }

  // 计算温度变化
  _calculateTemperatureChange(config, grindingTime, energyConsumption) {
    const { materialHeatCapacity = 0.5, materialMass = 1000 } = config;
    return energyConsumption / (materialHeatCapacity * materialMass);
  }

  // 计算材料损失
  _calculateMaterialLoss(config, grindingTime) {
    const { materialMass = 1000, materialLossRate = 0.001 } = config;
    return materialMass * materialLossRate * grindingTime;
  }

  // 计算粒度减少量
  _calculateSizeReduction(config, timeStep) {
    const { power = 1000, materialHardness = 5, initialParticleSize = 100 } = config;
    const { particleSize } = this.simulation.state;
    
    const powerFactor = power / 1000;
    const hardnessFactor = 1 + (materialHardness - 5) * 0.1;
    const sizeFactor = Math.log(initialParticleSize / particleSize);
    
    return (powerFactor / hardnessFactor) * sizeFactor * timeStep * 10;
  }

  // 获取推荐参数
  getRecommendedParameters(materialType, desiredParticleSize) {
    const materialParams = {
      'ceramic': {
        power: 1200,
        materialHardness: 7,
        materialHeatCapacity: 0.8,
        materialLossRate: 0.0015
      },
      'metal': {
        power: 1500,
        materialHardness: 6,
        materialHeatCapacity: 0.4,
        materialLossRate: 0.001
      },
      'mineral': {
        power: 1000,
        materialHardness: 5,
        materialHeatCapacity: 0.6,
        materialLossRate: 0.002
      },
      'polymer': {
        power: 800,
        materialHardness: 3,
        materialHeatCapacity: 1.2,
        materialLossRate: 0.0005
      }
    };

    const params = materialParams[materialType] || materialParams.mineral;
    
    return {
      ...params,
      targetParticleSize: desiredParticleSize,
      initialParticleSize: desiredParticleSize * 100, // 假设初始粒度是目标的100倍
      maxTemperature: 80, // 最大温度80°C
      maxTime: this._calculateGrindingTime({
        ...params,
        targetParticleSize: desiredParticleSize,
        initialParticleSize: desiredParticleSize * 100
      }) * 1.5 // 留出50%的余量
    };
  }
}

const grinderEngine = new GrinderEngine();
export default grinderEngine;
