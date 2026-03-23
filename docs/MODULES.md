# 模块划分文档

## 修订历史

| 版本 | 日期 | 作者 | 变更说明 |
|------|------|------|----------|
| 1.0 | 2026-03-21 | 技术部 | 初始版本，记录系统模块划分 |

## 1. 概述

本文档详细描述系统的模块划分，包括各模块的职责、接口、依赖关系和使用方式。系统采用模块化设计，遵循单一职责原则和高内聚低耦合的设计理念。

## 2. 模块分类

系统模块分为以下几大类:

1. **核心系统模块**: 提供基础能力支持
2. **前端页面模块**: 用户界面组件
3. **业务功能模块**: 具体业务逻辑实现
4. **后端服务模块**: API 和服务端功能
5. **工具函数库**: 通用工具函数

## 3. 核心系统模块

### 3.1 Logger (日志模块)

**文件位置**: `assets/js/core/logger.js`

**职责**: 提供统一的日志记录功能

**功能特性**:
- 多级别日志 (DEBUG, INFO, WARN, ERROR, FATAL)
- 日志格式化
- 历史记录存储
- 日志导出功能
- 命名空间支持

**API 接口**:
```javascript
class Logger {
  constructor(namespace: string);
  debug(message: string, ...data: any[]): void;
  info(message: string, ...data: any[]): void;
  warn(message: string, ...data: any[]): void;
  error(message: string, ...data: any[]): void;
  fatal(message: string, ...data: any[]): void;
  getHistory(): LogEntry[];
  clearHistory(): void;
  exportLogs(format: 'json' | 'csv'): string;
}
```

**使用示例**:
```javascript
import Logger from './assets/js/core/logger.js';

const logger = new Logger('ProductModule');
logger.info('Product loaded', { productId: 123 });
logger.error('Failed to fetch products', error);
```

**依赖关系**: 无

---

### 3.2 ErrorHandler (错误处理模块)

**文件位置**: `assets/js/core/error-handler.js`

**职责**: 全局错误捕获和处理

**功能特性**:
- 全局错误监听
- 错误分类和分级
- 错误报告
- 用户友好提示
- 错误日志记录

**API 接口**:
```javascript
class ErrorHandler {
  handleError(error: Error, context?: string): void;
  setHandler(type: ErrorType, handler: Function): void;
  showErrorMessage(message: string, duration?: number): void;
  reportError(error: Error, userInfo?: object): void;
}
```

**使用示例**:
```javascript
import errorHandler from './assets/js/core/error-handler.js';

try {
  // some operation
} catch (error) {
  errorHandler.handleError(error, 'ProductLoading');
}
```

**依赖关系**: Logger

---

### 3.3 EventBus (事件总线模块)

**文件位置**: `assets/js/core/event-bus.js`

**职责**: 模块间通信的事件系统

**功能特性**:
- 事件订阅和发布
- 支持通配符匹配
- 一次性事件监听
- 事件参数传递
- 事件取消订阅

**API 接口**:
```javascript
class EventBus {
  on(event: string, callback: Function): Subscription;
  once(event: string, callback: Function): void;
  emit(event: string, ...data: any[]): void;
  off(event: string, callback?: Function): void;
  offAll(event: string): void;
}
```

**事件命名规范**:
```
资源：操作：结果
例如:
- product:created:success
- product:updated:error
- user:login:success
```

**使用示例**:
```javascript
import eventBus from './assets/js/core/event-bus.js';

// 订阅事件
eventBus.on('product:updated', (product) => {
  console.log('Product updated:', product);
});

// 发布事件
eventBus.emit('product:updated', { id: 123, name: 'New Product' });
```

**依赖关系**: Logger

---

### 3.4 StateManager (状态管理模块)

**文件位置**: `assets/js/core/state-manager.js`

**职责**: 应用状态管理

**功能特性**:
- 集中式状态管理
- 状态变更追踪
- 状态持久化
- 时间旅行调试
- 状态快照

**API 接口**:
```javascript
class StateManager {
  setState(key: string, value: any, persist?: boolean): void;
  getState(key: string): any;
  deleteState(key: string): void;
  subscribe(key: string, callback: Function): Subscription;
  getSnapshot(): object;
  restoreSnapshot(snapshot: object): void;
  clear(): void;
}
```

**使用示例**:
```javascript
import stateManager from './assets/js/core/state-manager.js';

// 设置状态
stateManager.setState('user', { id: 1, name: 'John' }, true);

// 获取状态
const user = stateManager.getState('user');

// 订阅状态变化
stateManager.subscribe('cart', (newCart) => {
  updateCartUI(newCart);
});
```

**依赖关系**: Logger, ErrorHandler

---

### 3.5 ModuleLoader (模块加载器)

**文件位置**: `assets/js/core/module-loader.js`

**职责**: 模块注册和加载管理

**功能特性**:
- 模块注册
- 依赖解析
- 懒加载
- 生命周期管理
- 模块缓存

**API 接口**:
```javascript
class ModuleLoader {
  registerModule(name: string, config: ModuleConfig): void;
  loadModule(name: string): Promise<any>;
  unloadModule(name: string): void;
  isLoaded(name: string): boolean;
  getModule(name: string): any;
}
```

**模块配置**:
```javascript
{
  create: () => ModuleInstance,
  dependencies: ['module1', 'module2'],
  init: async (module) => {},
  destroy: (module) => {}
}
```

**使用示例**:
```javascript
import moduleLoader from './assets/js/core/module-loader.js';

moduleLoader.registerModule('product', {
  create: () => new ProductModule(),
  dependencies: ['logger', 'api'],
  init: async (module) => {
    await module.initialize();
  }
});

await moduleLoader.loadModule('product');
```

**依赖关系**: Logger, ErrorHandler

---

## 4. 前端页面模块

### 4.1 首页模块 (Home)

**文件位置**: `src/App.tsx`, `index.html`

**职责**: 展示网站首页内容

**组件结构**:
```
Home
├── Navigation (导航栏)
├── HeroSection (主视觉区)
├── ProductsSection (产品展示)
├── ApplicationsSection (应用领域)
├── TechnologySection (技术优势)
├── SupportSection (支持服务)
├── ContactSection (联系表单)
└── Footer (页脚)
```

**功能特性**:
- 响应式布局
- 动画效果
- 产品快速导航
- 询盘表单

**依赖关系**: 
- React Router
- 组件库
- API 服务

---

### 4.2 产品目录模块 (Product Catalog)

**文件位置**: `product-catalog.html`, `assets/js/products.js`

**职责**: 产品展示和筛选

**功能特性**:
- 产品分类筛选
- 搜索功能
- 排序功能
- 分页加载
- 产品卡片展示

**核心组件**:
```javascript
class ProductCatalog {
  constructor(options: ProductCatalogOptions);
  loadProducts(filters: ProductFilters): Promise<Product[]>;
  filterProducts(criteria: FilterCriteria): Product[];
  sortProducts(field: string, order: 'asc' | 'desc'): void;
  renderProducts(products: Product[]): void;
}
```

**依赖关系**: 
- ProductManager
- EventBus
- API 服务

---

### 4.3 产品详情模块 (Product Detail)

**文件位置**: `product-detail.html`, `components/product-detail-gallery.html`

**职责**: 展示产品详细信息

**功能特性**:
- 产品图片画廊
- 规格参数展示
- 相关产品推荐
- 询盘表单
- 分享功能

**数据结构**:
```javascript
{
  id: string,
  name: string,
  description: string,
  category: Category,
  specifications: {
    // 规格参数
  },
  images: string[],
  price: number,
  stock: number,
  relatedProducts: Product[]
}
```

**依赖关系**: 
- ProductManager
- RecommendEngine
- API 服务

---

### 4.4 研磨模拟器模块 (Grinding Simulator)

**文件位置**: `simulator.html`, `assets/js/grinding-simulator.js`

**职责**: 研磨过程模拟和计算

**功能特性**:
- 参数配置界面
- 物理计算引擎
- 结果可视化
- 参数优化建议
- 方案保存和分享

**核心组件**:
```javascript
class GrindingSimulator {
  constructor(config: SimulatorConfig);
  setParameters(params: GrindingParameters): void;
  calculate(): SimulationResult;
  render(): void;
  exportReport(): string;
  saveConfiguration(): void;
}
```

**物理模型**:
- 研磨介质运动轨迹
- 能量计算
- 研磨效率预测
- 温度变化模拟

**依赖关系**: 
- Logger
- EventBus
- Chart.js (可视化)

---

### 4.5 行业匹配工具 (Industry Matcher)

**文件位置**: `selection.html`, `assets/js/industry-matcher.js`

**职责**: 根据行业推荐合适的设备和配置

**功能特性**:
- 行业选择
- 材料类型选择
- 细度要求输入
- 智能推荐算法
- 推荐结果展示

**推荐流程**:
```
用户输入 → 需求分析 → 匹配算法 → 产品推荐 → 方案展示
```

**依赖关系**: 
- ProductManager
- RecommendEngine
- API 服务

---

### 4.6 询盘生成模块 (Lead Generation)

**文件位置**: `src/pages/LeadGeneration.tsx`

**职责**: 潜在客户信息收集

**功能特性**:
- 多步骤表单
- 表单验证
- 自动保存
- 提交确认
- 后续跟踪

**表单字段**:
```typescript
interface LeadForm {
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    company: string;
  };
  requirements: {
    productInterest: string[];
    quantity: string;
    timeline: string;
    budget: string;
  };
  additionalInfo: {
    message: string;
    source: string;
  };
}
```

**依赖关系**: 
- React Hook Form
- API 服务
- 验证工具

---

### 4.7 管理后台模块 (Admin Dashboard)

**文件位置**: `admin/src/`, `src/pages/AdminDashboard.tsx`

**职责**: 后台管理系统

**子模块**:
- **登录模块**: 管理员认证
- **仪表盘**: 数据统计展示
- **产品管理**: CRUD 操作
- **订单管理**: 订单处理
- **客户管理**: 客户信息管理
- **内容管理**: 新闻和文章管理
- **系统设置**: 参数配置

**技术栈**:
- React 19
- Material-UI
- React Router
- Axios

**依赖关系**: 
- 认证服务
- API 服务
- 图表库

---

## 5. 业务功能模块

### 5.1 ProductManager (产品管理模块)

**文件位置**: `assets/js/product-manager.js`

**职责**: 产品数据管理

**功能特性**:
- 产品数据 CRUD
- 产品分类管理
- 产品搜索
- 产品索引
- 缓存管理

**API 接口**:
```javascript
class ProductManager {
  constructor(apiClient: APIClient);
  getProducts(filters?: ProductFilters): Promise<Product[]>;
  getProductById(id: string): Promise<Product>;
  createProduct(product: Product): Promise<Product>;
  updateProduct(id: string, updates: object): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
  searchProducts(query: string): Promise<Product[]>;
  getCategories(): Promise<Category[]>;
}
```

**依赖关系**: 
- Logger
- API 服务
- StateManager

---

### 5.2 RecommendEngine (推荐引擎)

**文件位置**: `src/utils/recommendEngine.js`

**职责**: 智能产品推荐

**功能特性**:
- 基于浏览历史的推荐
- 相关产品推荐
- 基于行业的推荐
- 热门推荐
- 个性化排序

**推荐算法**:
```javascript
class RecommendEngine {
  // 基于协同过滤
  getCollaborativeRecommendations(userId: string): Product[];
  
  // 基于内容
  getContentBasedRecommendations(productId: string): Product[];
  
  // 基于规则
  getRuleBasedRecommendations(context: RecommendationContext): Product[];
  
  // 混合推荐
  getHybridRecommendations(userId: string, context: object): Product[];
}
```

**依赖关系**: 
- ProductManager
- StateManager (用户行为数据)
- Logger

---

### 5.3 I18n (国际化模块)

**文件位置**: `assets/js/i18n.js`

**职责**: 多语言支持

**支持语言**:
- 英语 (en)
- 中文 (zh)
- 西班牙语 (es)
- 德语 (de)

**功能特性**:
- 语言切换
- 文本翻译
- 日期格式化
- 货币格式化
- 数字格式化

**API 接口**:
```javascript
class I18n {
  constructor(translations: object);
  setLocale(locale: string): void;
  getLocale(): string;
  t(key: string, params?: object): string;
  formatDate(date: Date, format?: string): string;
  formatCurrency(amount: number, currency?: string): string;
  formatNumber(number: number, options?: object): string;
}
```

**使用示例**:
```javascript
import i18n from './assets/js/i18n.js';

i18n.setLocale('zh');
const greeting = i18n.t('common.greeting', { name: 'John' });
const price = i18n.formatCurrency(1000, 'USD');
```

**依赖关系**: StateManager, EventBus

---

### 5.4 ImageProcessor (图片处理模块)

**文件位置**: `src/services/imageProcessor.js`

**职责**: 图片加载和优化

**功能特性**:
- 图片懒加载
- 图片压缩
- 格式转换
- 响应式图片
- 图片预加载

**API 接口**:
```javascript
class ImageProcessor {
  lazyLoad(selector: string): void;
  compress(image: HTMLImageElement, quality?: number): Promise<Blob>;
  convertFormat(image: Blob, format: string): Promise<Blob>;
  preload(urls: string[]): Promise<void>;
  generateSrcset(image: object): string;
}
```

**依赖关系**: Logger

---

## 6. 后端服务模块

### 6.1 API Gateway (API 网关)

**文件位置**: `src/routes/api.js`

**职责**: API 路由和请求分发

**路由组织**:
```javascript
// 主路由配置
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/customers', customerRoutes);
router.use('/orders', orderRoutes);
router.use('/auth', authRoutes);
router.use('/leads', leadRoutes);
router.use('/analytics', analyticsRoutes);
```

**中间件链**:
```
请求 → CORS → Logger → Auth → Rate Limit → 路由处理 → 响应
```

**依赖关系**: 
- Express.js
- 认证中间件
- 日志中间件

---

### 6.2 Auth Module (认证模块)

**文件位置**: `src/routes/auth.js`, `src/services/auth.service.js`

**职责**: 用户认证和授权

**功能特性**:
- 用户登录
- 用户注册
- Token 生成和验证
- 密码加密
- 权限检查

**API 端点**:
```
POST   /api/auth/login      - 用户登录
POST   /api/auth/register   - 用户注册
POST   /api/auth/logout     - 用户登出
POST   /api/auth/refresh    - 刷新 Token
GET    /api/auth/me         - 获取当前用户
```

**依赖关系**: 
- JWT / Session
- 用户模型
- 加密库

---

### 6.3 Product Service (产品服务)

**文件位置**: `src/routes/products.js`, `src/services/product.service.js`

**职责**: 产品相关业务逻辑

**功能特性**:
- 产品 CRUD
- 产品搜索
- 产品分类
- 产品推荐
- 库存管理

**API 端点**:
```
GET    /api/products           - 获取产品列表
GET    /api/products/:id       - 获取产品详情
POST   /api/products           - 创建产品
PUT    /api/products/:id       - 更新产品
DELETE /api/products/:id       - 删除产品
GET    /api/products/:id/related - 相关产品
POST   /api/products/search    - 搜索产品
```

**依赖关系**: 
- Product 模型
- Category 模型
- 数据库服务

---

### 6.4 Customer Service (客户服务)

**文件位置**: `src/routes/customers.js`, `src/services/customer.service.js`

**职责**: 客户信息管理

**功能特性**:
- 客户信息管理
- 客户分类
- 交互历史
- 客户价值分析

**API 端点**:
```
GET    /api/customers          - 获取客户列表
GET    /api/customers/:id      - 获取客户详情
POST   /api/customers          - 创建客户
PUT    /api/customers/:id      - 更新客户
GET    /api/customers/:id/orders - 客户订单
GET    /api/customers/:id/inquiries - 客户询盘
```

**依赖关系**: 
- Customer 模型
- Order 模型
- 数据库服务

---

### 6.5 Order Service (订单服务)

**文件位置**: `src/routes/orders.js`, `src/services/order.service.js`

**职责**: 订单管理

**功能特性**:
- 订单创建
- 订单状态管理
- 订单跟踪
- 订单统计

**订单状态机**:
```
Pending → Confirmed → Processing → Shipped → Delivered → Completed
                ↓
             Cancelled
```

**API 端点**:
```
GET    /api/orders             - 获取订单列表
GET    /api/orders/:id         - 获取订单详情
POST   /api/orders             - 创建订单
PUT    /api/orders/:id         - 更新订单
PUT    /api/orders/:id/status  - 更新订单状态
GET    /api/orders/:id/tracking - 订单跟踪信息
```

**依赖关系**: 
- Order 模型
- Product 模型
- Customer 模型
- 数据库服务

---

### 6.6 Lead Service (销售线索服务)

**文件位置**: `src/routes/leads.js`, `src/services/lead.service.js`

**职责**: 销售线索管理

**功能特性**:
- 线索收集
- 线索评分
- 线索分配
- 线索转化跟踪

**API 端点**:
```
GET    /api/leads              - 获取线索列表
GET    /api/leads/:id          - 获取线索详情
POST   /api/leads              - 创建线索
PUT    /api/leads/:id          - 更新线索
PUT    /api/leads/:id/score    - 线索评分
PUT    /api/leads/:id/assign   - 分配线索
```

**依赖关系**: 
- Lead 模型
- Customer 模型
- 数据库服务

---

### 6.7 Analytics Service (分析服务)

**文件位置**: `src/routes/analytics.js`, `src/services/analytics.service.js`

**职责**: 数据统计和分析

**功能特性**:
- 访问统计
- 销售统计
- 产品热度分析
- 转化率分析
- 报表生成

**API 端点**:
```
GET    /api/analytics/overview     - 概览数据
GET    /api/analytics/traffic      - 流量统计
GET    /api/analytics/sales        - 销售统计
GET    /api/analytics/products     - 产品分析
GET    /api/analytics/conversion   - 转化分析
POST   /api/analytics/report       - 生成报表
```

**依赖关系**: 
- 各业务模型
- 数据库聚合查询
- 缓存服务

---

## 7. 工具函数库

### 7.1 数据预处理工具

**文件位置**: `src/utils/dataPreprocessor.js`

**功能**:
- 数据清洗
- 数据格式化
- 数据验证
- 数据转换

**函数列表**:
```javascript
// 字符串处理
export function sanitizeString(str: string): string;
export function truncateText(text: string, length: number): string;

// 数字处理
export function formatNumber(num: number, decimals?: number): string;
export function parseNumber(str: string): number;

// 日期处理
export function formatDate(date: Date, format?: string): string;
export function parseDate(str: string): Date;

// 数组处理
export function uniqueArray<T>(arr: T[]): T[];
export function chunkArray<T>(arr: T[], size: number): T[][];
```

**依赖关系**: 无

---

### 7.2 验证工具

**文件位置**: `src/utils/validators.js`

**功能**:
- 邮箱验证
- 手机号验证
- URL 验证
- 必填项验证
- 长度验证

**函数列表**:
```javascript
export function isEmail(value: string): boolean;
export function isPhone(value: string): boolean;
export function isURL(value: string): boolean;
export function isRequired(value: any): boolean;
export function minLength(value: string, length: number): boolean;
export function maxLength(value: string, length: number): boolean;
export function isNumber(value: any): boolean;
export function isInRange(value: number, min: number, max: number): boolean;
```

**依赖关系**: 无

---

### 7.3 API 客户端

**文件位置**: `assets/js/api-config.js`

**功能**:
- HTTP 请求封装
- 请求拦截
- 响应拦截
- 错误处理
- Token 管理

**类定义**:
```javascript
class APIClient {
  constructor(baseURL: string, config?: object);
  
  get<T>(url: string, params?: object): Promise<T>;
  post<T>(url: string, data?: object): Promise<T>;
  put<T>(url: string, data?: object): Promise<T>;
  delete<T>(url: string): Promise<T>;
  
  setToken(token: string): void;
  getToken(): string | null;
  clearToken(): void;
}
```

**依赖关系**: Axios, Logger

---

### 7.4 性能优化工具

**文件位置**: `assets/js/performance.js`, `assets/js/lazy-loader.js`

**功能**:
- 防抖和节流
- 懒加载
- 资源预加载
- 性能监控

**函数列表**:
```javascript
// 防抖
export function debounce<T extends Function>(func: T, wait: number): T;

// 节流
export function throttle<T extends Function>(func: T, limit: number): T;

// 懒加载
export function lazyLoad(selector: string, options?: object): void;

// 预加载
export function preload(resources: string[]): void;

// 性能监控
export function measurePerformance(metric: string): void;
export function reportPerformance(): object;
```

**依赖关系**: Logger, EventBus

---

## 8. 模块依赖关系图

```
┌─────────────────────────────────────────────────────────────┐
│                      应用层 (Application)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Home   │  │ Products │  │ Simulator│  │  Admin   │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
└───────┼─────────────┼─────────────┼─────────────┼──────────┘
        │             │             │             │
        └─────────────┴─────────────┴─────────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │                         │                         │
        ▼                         ▼                         ▼
┌──────────────┐          ┌──────────────┐          ┌──────────────┐
│  核心系统模块  │          │  业务功能模块  │          │  后端服务模块  │
│              │          │              │          │              │
│ • Logger     │◄────────►│ • ProductMgr │◄────────►│ • API Gateway│
│ • ErrorHandler│         │ • Recommend  │          │ • Auth       │
│ • EventBus   │          │ • I18n       │          │ • Product    │
│ • StateMgr   │          │ • ImageProc  │          │ • Customer   │
│ • ModuleLoader│         │              │          │ • Order      │
└──────────────┘          └──────────────┘          │ • Lead       │
        │                                           │ • Analytics  │
        │                                           └──────────────┘
        │
        ▼
┌──────────────┐
│  工具函数库   │
│              │
│ • Validators │
│ • DataProc   │
│ • APIClient  │
│ • PerfUtils  │
└──────────────┘
```

## 9. 模块通信机制

### 9.1 基于事件的通信

模块间通过 EventBus 进行松耦合通信:

```javascript
// 模块 A 发布事件
eventBus.emit('product:updated', { productId: 123 });

// 模块 B 订阅事件
eventBus.on('product:updated', (data) => {
  // 处理产品更新
});
```

### 9.2 基于状态的通信

通过 StateManager 共享状态:

```javascript
// 模块 A 设置状态
stateManager.setState('cart', cartItems);

// 模块 B 订阅状态变化
stateManager.subscribe('cart', (newCart) => {
  // 更新 UI
});
```

### 9.3 直接调用

对于紧密耦合的模块，可以直接导入调用:

```javascript
import productManager from './product-manager.js';
const products = await productManager.getProducts();
```

## 10. 模块加载策略

### 10.1 初始加载

核心模块在应用启动时加载:
- Logger
- ErrorHandler
- EventBus
- StateManager

### 10.2 按需加载

业务模块按需懒加载:
- 产品详情模块
- 模拟器模块
- 管理后台模块

### 10.3 预加载

预测用户可能访问的模块提前加载:
- 相关产品模块
- 下一页内容

## 11. 模块测试策略

### 11.1 单元测试

每个核心模块都应有完整的单元测试:

```javascript
describe('ProductManager', () => {
  it('should fetch products successfully', async () => {
    // test implementation
  });
  
  it('should handle API errors', async () => {
    // test implementation
  });
});
```

### 11.2 集成测试

测试模块间交互:

```javascript
describe('Product Flow', () => {
  it('should complete product purchase flow', async () => {
    // test implementation
  });
});
```

### 11.3 E2E 测试

完整业务流程测试:

```javascript
describe('E2E - Product Purchase', () => {
  it('should complete purchase from browsing to order', async () => {
    // test implementation
  });
});
```

---

**文档维护**: 技术部  
**最后更新**: 2026-03-21  
**下次审查**: 2026-06-21
