# 系统架构文档

## 修订历史

| 版本 | 日期 | 作者 | 变更说明 |
|------|------|------|----------|
| 2.0 | 2026-03-21 | 技术部 | 重构架构文档，反映当前技术栈 |
| 1.0 | 2025-01-01 | 技术部 | 初始版本 |

## 1. 项目概述

### 1.1 项目简介

湖南盛通达材料科技官网是一个现代化的 B2B 企业网站，专注于研磨设备、研磨介质和研磨罐等产品的展示与销售。网站采用前后端分离架构，提供多语言支持、在线模拟器、智能推荐等先进功能。

### 1.2 核心业务目标

- **产品展示**: 全面展示研磨设备、介质和配件产品
- **客户引流**: 通过 SEO 优化和内容营销获取潜在客户
- **在线互动**: 提供研磨模拟器和行业匹配工具增强用户体验
- **销售转化**: 完善的询盘和客户管理系统
- **品牌宣传**: 展示公司实力和技术优势

## 2. 系统架构图

### 2.1 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                        用户层                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  PC 浏览器 │  │ 移动设备  │  │  平板    │  │  其他终端 │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      表现层 (Frontend)                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              React 19 + TypeScript                    │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │  │
│  │  │ 主站前端  │  │ 管理后台  │  │ 公共组件  │           │  │
│  │  └──────────┘  └──────────┘  └──────────┘           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      网关层 (API Gateway)                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Express.js Reverse Proxy                 │  │
│  │         负载均衡 / 请求路由 / 限流 / 认证              │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      应用层 (Backend)                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Express.js Application                   │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │  │
│  │  │ REST API │  │ 业务逻辑  │  │ 数据访问  │           │  │
│  │  └──────────┘  └──────────┘  └──────────┘           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      数据层 (Data Layer)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ MongoDB  │  │  文件系统 │  │  缓存层   │  │  日志系统  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 前端架构

```
┌─────────────────────────────────────────────────────────┐
│                    前端应用架构                          │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Entry Point (main.tsx)              │   │
│  └─────────────────────────────────────────────────┘   │
│                         │                               │
│                         ▼                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │              App.tsx (Root Component)           │   │
│  │         React Router + Navigation                │   │
│  └─────────────────────────────────────────────────┘   │
│                         │                               │
│         ┌───────────────┼───────────────┐              │
│         ▼               ▼               ▼              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐       │
│  │   Pages    │  │ Components │  │  Services  │       │
│  │            │  │            │  │            │       │
│  │ • Home     │  │ • Header   │  │ • API      │       │
│  │ • Products │  │ • Footer   │  │ • Auth     │       │
│  │ • Simulator│  │ • Cards    │  │ • Data     │       │
│  │ • Admin    │  │ • Forms    │  │ • Utils    │       │
│  └────────────┘  └────────────┘  └────────────┘       │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │              State Management                   │   │
│  │         React Context + Local Storage           │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 2.3 后端架构

```
┌─────────────────────────────────────────────────────────┐
│                    后端服务架构                          │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Express.js Server                   │   │
│  │              (src/server.js)                     │   │
│  └─────────────────────────────────────────────────┘   │
│                         │                               │
│         ┌───────────────┼───────────────┐              │
│         ▼               ▼               ▼              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐       │
│  │   Routes   │  │ Middleware │  │ Controllers │       │
│  │            │  │            │  │            │       │
│  │ • /api/*   │  │ • CORS     │  │ • Products │       │
│  │ • /admin/* │  │ • Auth     │  │ • Users    │       │
│  │ • /auth/*  │  │ • Logger   │  │ • Orders   │       │
│  └────────────┘  └────────────┘  └────────────┘       │
│                         │                               │
│                         ▼                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Data Access Layer                  │   │
│  │         Mongoose ODM + Models                    │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## 3. 技术架构分层

### 3.1 表现层 (Presentation Layer)

**职责**: 用户界面展示和交互

**技术选型**:
- React 19.2.4
- TypeScript 5.9.3
- React Router DOM 7.13.1
- TailwindCSS 4.2.1
- shadcn-ui 组件库

**目录结构**:
```
src/
├── main.tsx              # 应用入口
├── App.tsx               # 根组件
├── pages/                # 页面组件
│   ├── Home.tsx
│   ├── LeadGeneration.tsx
│   ├── AdminLogin.tsx
│   └── AdminDashboard.tsx
├── components/           # 可复用组件
│   ├── FloatingContactButton.tsx
│   ├── LowThresholdLeadForm.tsx
│   ├── MediumThresholdLeadForm.tsx
│   └── HighThresholdLeadForm.tsx
└── assets/              # 静态资源
    ├── css/
    └── images/
```

### 3.2 应用层 (Application Layer)

**职责**: 业务逻辑处理和协调

**核心模块**:
- **产品管理**: 产品数据管理和展示逻辑
- **用户管理**: 用户认证和权限控制
- **订单管理**: 订单处理流程
- **模拟器引擎**: 研磨过程模拟计算

**目录结构**:
```
src/
├── services/            # 业务服务
│   ├── integrator.js
│   ├── imageProcessor.js
│   ├── translator.js
│   └── crawler/
├── utils/              # 工具函数
│   ├── recommendEngine.js
│   └── dataPreprocessor.js
└── models/             # 数据模型
    ├── Product.js
    └── Category.js
```

### 3.3 路由层 (Routing Layer)

**职责**: API 路由定义和请求分发

**路由组织**:
```
src/routes/
├── api.js              # API 总路由
├── products.js         # 产品相关路由
├── categories.js       # 分类相关路由
├── customers.js        # 客户相关路由
├── orders.js           # 订单相关路由
├── auth.js             # 认证相关路由
├── leads.js            # 销售线索路由
└── analytics.js        # 分析统计路由
```

### 3.4 数据层 (Data Layer)

**职责**: 数据存储和访问

**技术选型**:
- **数据库**: MongoDB 8.0.0 (通过 Mongoose 8.0.0)
- **缓存**: 内存缓存 + LocalStorage
- **文件系统**: 本地文件系统

**数据模型**:
```javascript
// Product Model
{
  _id: ObjectId,
  name: String,
  description: String,
  category: ObjectId,
  specifications: Object,
  images: [String],
  price: Number,
  stock: Number,
  createdAt: Date,
  updatedAt: Date
}

// Category Model
{
  _id: ObjectId,
  name: String,
  parent: ObjectId,
  children: [ObjectId],
  slug: String,
  order: Number
}
```

## 4. 核心系统模块

### 4.1 日志系统 (Logger)

**位置**: `assets/js/core/logger.js`

**功能**:
- 多级别日志记录 (DEBUG, INFO, WARN, ERROR)
- 日志历史记录
- 日志导出功能

**使用示例**:
```javascript
import Logger from './assets/js/core/logger.js';
const logger = new Logger('ModuleName');
logger.info('Operation started');
logger.error('Something went wrong');
```

### 4.2 错误处理系统 (ErrorHandler)

**位置**: `assets/js/core/error-handler.js`

**功能**:
- 全局错误捕获
- 错误报告
- 用户通知

**使用示例**:
```javascript
import errorHandler from './assets/js/core/error-handler.js';
errorHandler.handleError(new Error('Something went wrong'));
```

### 4.3 事件总线 (EventBus)

**位置**: `assets/js/core/event-bus.js`

**功能**:
- 事件监听和触发
- 支持通配符
- 一次性事件监听

**使用示例**:
```javascript
import eventBus from './assets/js/core/event-bus.js';
eventBus.on('product:updated', (data) => console.log(data));
eventBus.emit('product:updated', { id: 123 });
```

### 4.4 状态管理系统 (StateManager)

**位置**: `assets/js/core/state-manager.js`

**功能**:
- 应用状态管理
- 状态持久化
- 时间旅行调试

**使用示例**:
```javascript
import stateManager from './assets/js/core/state-manager.js';
stateManager.setState('user', userData);
const user = stateManager.getState('user');
```

### 4.5 模块加载器 (ModuleLoader)

**位置**: `assets/js/core/module-loader.js`

**功能**:
- 模块注册和加载
- 依赖解析
- 生命周期管理

**使用示例**:
```javascript
import moduleLoader from './assets/js/core/module-loader.js';
moduleLoader.registerModule('product', {
  create: () => new ProductModule(),
  dependencies: ['logger']
});
await moduleLoader.loadModule('product');
```

## 5. 功能模块

### 5.1 产品管理系统

**职责**: 产品数据管理、索引和搜索

**核心组件**:
- ProductSchema: JSON Schema 验证
- ProductIndex: 产品索引系统
- ProductSearch: 全文搜索功能

**文件位置**: `assets/js/modules/product/`

### 5.2 研磨模拟器引擎

**职责**: 研磨过程模拟和物理计算

**核心组件**:
- GrinderEngine: 模拟引擎核心
- PhysicsModel: 物理计算模型
- SimulationUI: 模拟器界面

**文件位置**: 
- `assets/js/modules/grinder/`
- `assets/js/grinding-simulator.js`

### 5.3 推荐引擎

**职责**: 智能产品推荐

**核心功能**:
- 基于用户行为的推荐
- 相关产品推荐
- 个性化展示

**文件位置**: `src/utils/recommendEngine.js`

### 5.4 多语言系统 (i18n)

**职责**: 国际化支持

**支持语言**:
- 英语 (en)
- 中文 (zh)
- 西班牙语 (es)
- 德语 (de)

**文件位置**: `assets/js/i18n.js`

## 6. 部署架构

### 6.1 生产环境架构

```
                    ┌─────────────┐
                    │   Nginx     │
                    │  (Reverse   │
                    │   Proxy)    │
                    └──────┬──────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
         ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Frontend    │  │   Backend    │  │    Admin     │
│  (Port 80)   │  │ (Port 3001)  │  │  (Port 3002) │
│  Static      │  │  Express.js  │  │   React App  │
│  Files       │  │   Server     │  │              │
└──────────────┘  └──────────────┘  └──────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │   MongoDB    │
                    │  (Port 27017)│
                    └──────────────┘
```

### 6.2 服务组件

- **Nginx**: 反向代理和静态文件服务
- **Node.js**: 应用运行时
- **Express.js**: Web 应用框架
- **MongoDB**: 数据库服务
- **PM2**: 进程管理器 (建议使用)

## 7. 性能优化策略

### 7.1 前端优化

- **代码分割**: 基于路由的懒加载
- **资源预加载**: 关键资源预加载
- **图片优化**: WebP 格式 + 懒加载
- **缓存策略**: Service Worker + LocalStorage
- **构建优化**: Tree Shaking + Minification

### 7.2 后端优化

- **数据库索引**: 关键字段索引优化
- **查询优化**: 避免 N+1 查询
- **缓存层**: Redis/Memory 缓存
- **连接池**: 数据库连接复用
- **API 限流**: 防止滥用

### 7.3 网络优化

- **CDN**: 静态资源 CDN 加速
- **Gzip/Brotli**: 压缩传输
- **HTTP/2**: 多路复用
- **Keep-Alive**: 连接保持

## 8. 安全架构

### 8.1 应用安全

- **XSS 防护**: 输入验证和输出编码
- **CSRF 防护**: Token 验证
- **SQL 注入防护**: 参数化查询
- **认证授权**: JWT Token

### 8.2 数据安全

- **传输加密**: HTTPS/TLS
- **数据加密**: 敏感数据加密存储
- **备份策略**: 定期数据备份
- **访问控制**: 基于角色的权限

## 9. 监控与日志

### 9.1 应用监控

- **性能监控**: 响应时间、吞吐量
- **错误监控**: 错误率和类型统计
- **资源监控**: CPU、内存使用率

### 9.2 日志系统

- **访问日志**: 所有 HTTP 请求记录
- **应用日志**: 业务操作日志
- **错误日志**: 异常和错误堆栈
- **审计日志**: 关键操作审计

## 10. 扩展性设计

### 10.1 水平扩展

- 无状态设计支持多实例部署
- 会话共享通过 Redis
- 数据库副本集

### 10.2 垂直扩展

- 模块化设计便于功能扩展
- 插件化架构支持第三方集成
- API 版本控制支持向后兼容

## 11. 技术债务与改进计划

### 11.1 当前技术债务

1. 前后端代码混合，需要完全分离
2. 部分旧代码仍使用原生 JavaScript
3. 测试覆盖率不足
4. 文档需要更新

### 11.2 改进计划

1. **短期** (1-3 个月):
   - 完成前端 React 化迁移
   - 完善测试覆盖
   - 更新技术文档

2. **中期** (3-6 个月):
   - 引入 TypeScript 到所有模块
   - 实现完整的 CI/CD 流程
   - 性能优化和监控

3. **长期** (6-12 个月):
   - 微服务架构改造
   - 引入消息队列
   - 容器化部署

---

**文档维护**: 技术部  
**最后更新**: 2026-03-21  
**下次审查**: 2026-06-21
