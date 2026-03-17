# 项目架构文档

## 1. 项目概述

本项目是一个现代化的研磨设备制造商网站，采用模块化架构设计，包含核心系统、商品管理系统和研磨模拟器引擎等功能模块。

## 2. 技术栈

- **前端框架**: 原生JavaScript + TailwindCSS + shadcn-ui
- **测试框架**: Jest + Babel
- **构建工具**: 原生模块系统
- **依赖管理**: npm

## 3. 目录结构

```
/
├── assets/
│   ├── css/
│   │   ├── tailwind.css          # TailwindCSS配置
│   │   └── design-system.css     # 设计系统样式
│   ├── js/
│   │   ├── core/                 # 核心系统
│   │   │   ├── logger.js         # 日志系统
│   │   │   ├── error-handler.js  # 错误处理系统
│   │   │   ├── event-bus.js      # 事件总线
│   │   │   ├── state-manager.js  # 状态管理系统
│   │   │   └── module-loader.js  # 模块加载器
│   │   ├── modules/              # 功能模块
│   │   │   ├── product/          # 商品管理系统
│   │   │   └── grinder/          # 研磨模拟器引擎
│   │   ├── components/           # UI组件
│   │   └── utils/                # 工具函数
│   └── images/                   # 图片资源
├── tests/                        # 测试文件
├── index.html                    # 首页
├── package.json                  # 项目配置
├── tailwind.config.js            # TailwindCSS配置
├── postcss.config.js             # PostCSS配置
└── components.json               # shadcn-ui配置
```

## 4. 核心系统

### 4.1 Logger 日志系统

- **功能**: 提供多级别日志记录，支持历史记录和导出
- **使用方法**:
  ```javascript
  import Logger from './assets/js/core/logger.js';
  const logger = new Logger('ModuleName');
  logger.info('Message');
  ```

### 4.2 ErrorHandler 错误处理系统

- **功能**: 全局错误捕获，错误报告和用户通知
- **使用方法**:
  ```javascript
  import errorHandler from './assets/js/core/error-handler.js';
  errorHandler.handleError(new Error('Something went wrong'));
  ```

### 4.3 EventBus 事件总线

- **功能**: 事件监听、触发和移除，支持通配符和一次性监听
- **使用方法**:
  ```javascript
  import eventBus from './assets/js/core/event-bus.js';
  eventBus.on('event', (data) => console.log(data));
  eventBus.emit('event', { message: 'Hello' });
  ```

### 4.4 StateManager 状态管理系统

- **功能**: 状态管理和时间旅行调试，支持状态持久化
- **使用方法**:
  ```javascript
  import stateManager from './assets/js/core/state-manager.js';
  stateManager.setState('key', 'value');
  const value = stateManager.getState('key');
  ```

### 4.5 ModuleLoader 模块加载器

- **功能**: 多模块加载架构，支持依赖解析和生命周期管理
- **使用方法**:
  ```javascript
  import moduleLoader from './assets/js/core/module-loader.js';
  moduleLoader.registerModule('module', {
    create: () => new Module(),
    dependencies: ['dependency']
  });
  await moduleLoader.loadModule('module');
  ```

## 5. 功能模块

### 5.1 商品管理系统

- **功能**: 商品数据管理、索引和搜索
- **核心组件**:
  - ProductSchema: JSON Schema验证
  - ProductIndex: 商品索引系统
  - ProductSearch: 全文搜索功能

### 5.2 研磨模拟器引擎

- **功能**: 研磨过程模拟，物理计算模型
- **核心组件**:
  - GrinderEngine: 模拟引擎核心
  - 物理计算模型: 基于实际研磨过程的数学模型

## 6. 性能优化

- **缓存策略**: 内存缓存，支持过期时间
- **代码分割**: 模块懒加载
- **资源预加载**: 图片和脚本预加载

## 7. 测试策略

- **单元测试**: 每个核心模块的功能测试
- **集成测试**: 模块间交互测试
- **测试覆盖率**: 确保核心功能的测试覆盖

## 8. 部署指南

1. 安装依赖: `npm install`
2. 运行开发服务器: `npm run dev`
3. 运行测试: `npm test`
4. 构建项目: `npm run build`

## 9. 最佳实践

- **模块化设计**: 每个功能模块独立封装
- **事件驱动**: 使用EventBus进行模块间通信
- **状态管理**: 使用StateManager统一管理应用状态
- **错误处理**: 全局错误捕获和处理
- **性能优化**: 缓存策略和代码分割
- **测试驱动**: 编写测试用例确保代码质量

## 10. 未来规划

- **AI集成**: 智能产品推荐和研磨参数优化
- **多语言支持**: 国际化
- **响应式设计**: 移动端优化
- **API集成**: 与后端系统对接
- **数据可视化**: 研磨过程模拟结果可视化
