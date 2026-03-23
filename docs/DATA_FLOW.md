# 数据流程文档

## 修订历史

| 版本 | 日期 | 作者 | 变更说明 |
|------|------|------|----------|
| 1.0 | 2026-03-21 | 技术部 | 初始版本 |

## 1. 概述

本文档描述系统中的数据流转过程，包括数据模型、数据存储、数据同步和数据流转路径。

## 2. 数据模型设计

### 2.1 核心数据模型

#### Product (产品)
```javascript
{
  _id: ObjectId,
  name: String,                    // 产品名称
  slug: String,                    // URL 友好名称
  description: String,             // 产品描述
  category: ObjectId,              // 分类引用
  specifications: Object,          // 规格参数
  images: [String],                // 图片 URL 数组
  price: Number,                   // 价格
  currency: String,                // 货币单位 (默认 CNY)
  stock: Number,                   // 库存数量
  status: String,                  // 状态：draft, published, archived
  tags: [String],                  // 标签
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  createdAt: Date,
  updatedAt: Date,
  createdBy: ObjectId,
  updatedBy: ObjectId
}
```

#### Category (分类)
```javascript
{
  _id: ObjectId,
  name: String,
  slug: String,
  parent: ObjectId,                // 父分类引用
  children: [ObjectId],            // 子分类 ID 数组
  description: String,
  order: Number,                   // 排序顺序
  level: Number,                   // 分类层级
  icon: String,                    // 图标
  createdAt: Date,
  updatedAt: Date
}
```

#### Customer (客户)
```javascript
{
  _id: ObjectId,
  email: String,
  password: String,                // 加密存储
  name: String,
  company: String,
  phone: String,
  role: String,                    // customer, admin, super_admin
  status: String,                  // active, inactive, banned
  addresses: [{
    type: String,                  // billing, shipping
    name: String,
    phone: String,
    address: String,
    city: String,
    province: String,
    country: String,
    postalCode: String
  }],
  preferences: {
    language: String,
    currency: String,
    newsletter: Boolean
  },
  lastLoginAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### Order (订单)
```javascript
{
  _id: ObjectId,
  orderNumber: String,             // 订单编号
  customer: ObjectId,              // 客户引用
  items: [{
    product: ObjectId,
    name: String,
    quantity: Number,
    price: Number,
    total: Number
  }],
  subtotal: Number,
  tax: Number,
  shipping: Number,
  total: Number,
  status: String,                  // pending, confirmed, processing, shipped, delivered, completed, cancelled
  paymentStatus: String,           // unpaid, paid, refunded
  paymentMethod: String,
  shippingAddress: Object,
  billingAddress: Object,
  tracking: {
    carrier: String,
    trackingNumber: String,
    events: [{
      timestamp: Date,
      status: String,
      location: String,
      description: String
    }]
  },
  remarks: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### Lead (销售线索)
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  phone: String,
  company: String,
  position: String,
  productInterest: [ObjectId],
  budget: String,
  timeline: String,
  message: String,
  source: String,                  // website, referral, social_media, etc.
  status: String,                  // new, contacted, qualified, converted, lost
  score: Number,                   // 线索评分
  assignedTo: ObjectId,            // 分配的销售人员
  followUps: [{
    date: Date,
    type: String,                  // call, email, meeting
    notes: String,
    result: String
  }],
  convertedAt: Date,
  convertedToCustomer: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

### 2.2 索引设计

```javascript
// Product 索引
products.createIndex({ slug: 1 }, { unique: true });
products.createIndex({ category: 1, status: 1 });
products.createIndex({ name: "text", description: "text" });
products.createIndex({ createdAt: -1 });
products.createIndex({ price: 1 });

// Category 索引
categories.createIndex({ slug: 1 }, { unique: true });
categories.createIndex({ parent: 1, order: 1 });

// Customer 索引
customers.createIndex({ email: 1 }, { unique: true });
customers.createIndex({ phone: 1 });

// Order 索引
orders.createIndex({ orderNumber: 1 }, { unique: true });
orders.createIndex({ customer: 1, createdAt: -1 });
orders.createIndex({ status: 1, createdAt: -1 });

// Lead 索引
leads.createIndex({ email: 1 });
leads.createIndex({ status: 1, createdAt: -1 });
leads.createIndex({ score: -1 });
```

## 3. 数据流转过程

### 3.1 产品数据流转

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│  管理员创建  │ ────►│  数据库存储  │ ────►│  前端展示   │
│  产品信息   │      │  MongoDB    │      │  产品页面   │
└─────────────┘      └─────────────┘      └─────────────┘
                            │
                            ▼
                     ┌─────────────┐
                     │   缓存层    │
                     │   Redis     │
                     └─────────────┘
```

**详细流程**:

1. **创建阶段**:
   - 管理员通过后台提交产品数据
   - 数据验证 (Schema Validation)
   - 生成 Slug (URL 友好)
   - 保存到 MongoDB
   - 清除产品列表缓存

2. **展示阶段**:
   - 前端请求产品列表/详情
   - 检查 Redis 缓存
   - 缓存命中：返回缓存数据
   - 缓存未命中：查询数据库 → 写入缓存 → 返回数据

3. **更新阶段**:
   - 管理员更新产品信息
   - 验证并更新数据库
   - 清除相关缓存
   - 触发更新事件 (EventBus)

4. **删除阶段**:
   - 软删除 (设置 status: 'archived')
   - 清除缓存
   - 记录操作日志

### 3.2 订单数据流转

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│  用户下单   │ ────►│  订单创建   │ ────►│  库存扣减   │
└─────────────┘      └─────────────┘      └─────────────┘
                            │
                            ▼
                     ┌─────────────┐      ┌─────────────┐
                     │  订单处理   │ ────►│  发货配送   │
                     └─────────────┘      └─────────────┘
                            │
                            ▼
                     ┌─────────────┐
                     │  订单完成   │
                     └─────────────┘
```

**详细流程**:

1. **下单流程**:
   - 用户选择商品加入购物车
   - 填写收货地址
   - 选择支付方式
   - 提交订单
   - 验证库存
   - 创建订单记录
   - 扣减库存
   - 发送确认邮件

2. **支付流程**:
   - 用户支付订单
   - 支付网关回调
   - 更新订单支付状态
   - 记录支付信息
   - 发送支付确认通知

3. **履约流程**:
   - 仓库接收订单
   - 拣货打包
   - 发货并录入物流信息
   - 更新订单状态
   - 通知用户

4. **完成流程**:
   - 用户确认收货
   - 订单完成
   - 更新销售统计
   - 邀请评价

### 3.3 销售线索流转

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│  访客提交   │ ────►│  线索创建   │ ────►│  自动评分   │
│  询盘表单   │      │  数据库    │      │  评分系统   │
└─────────────┘      └─────────────┘      └─────────────┘
                            │
                            ▼
                     ┌─────────────┐      ┌─────────────┐
                     │  销售分配   │ ────►│  跟进联系   │
                     └─────────────┘      └─────────────┘
                            │
                            ▼
                     ┌─────────────┐
                     │  转化为客户  │
                     └─────────────┘
```

**详细流程**:

1. **线索收集**:
   - 访客填写询盘表单
   - 数据验证
   - 创建线索记录
   - 发送自动回复邮件
   - 通知销售团队

2. **线索评分**:
   - 分析线索信息完整度
   - 评估产品兴趣匹配度
   - 考虑预算和时间线
   - 计算综合评分
   - 标记高价值线索

3. **线索分配**:
   - 根据区域分配
   - 根据产品线分配
   - 轮询分配
   - 手动分配

4. **线索跟进**:
   - 销售联系客户
   - 记录跟进情况
   - 更新线索状态
   - 安排下次跟进

5. **线索转化**:
   - 客户确认购买意向
   - 创建客户记录
   - 关联历史线索
   - 标记线索已转化

## 4. 数据存储方案

### 4.1 数据库存储

**MongoDB 集群配置**:
```
主节点 (Primary): 处理所有写操作
从节点 (Secondary): 处理读操作，数据备份
仲裁节点 (Arbiter): 参与选举，不存储数据
```

**数据分片策略**:
- 按时间分片 (订单数据)
- 按地区分片 (客户数据)
- 按分类分片 (产品数据)

### 4.2 缓存策略

**Redis 缓存**:
```javascript
// 缓存键命名规范
cache:products:list:{page}:{limit}
cache:products:detail:{id}
cache:categories:tree
cache:customer:{id}
cache:session:{sessionId}
```

**缓存过期时间**:
- 产品列表：30 分钟
- 产品详情：1 小时
- 分类树：24 小时
- 会话数据：2 小时
- 统计数据：10 分钟

### 4.3 文件存储

**本地文件系统**:
```
/uploads/
  /products/     - 产品图片
  /customers/    - 客户上传文件
  /orders/       - 订单相关文档
  /content/      - 内容图片
```

**图片处理流程**:
1. 上传原始图片
2. 生成多种尺寸 (thumbnail, medium, large)
3. 转换为 WebP 格式
4. 添加水印 (可选)
5. 存储到文件系统
6. 记录文件元数据

## 5. 数据同步机制

### 5.1 实时同步

**使用场景**:
- 库存更新
- 订单状态变更
- 价格调整

**实现方式**:
- WebSocket 推送
- Server-Sent Events (SSE)
- 轮询 (fallback)

### 5.2 异步同步

**使用场景**:
- 统计数据更新
- 搜索引擎索引
- 邮件通知

**实现方式**:
- 消息队列 (Bull)
- 后台任务处理
- 定时任务

### 5.3 数据一致性

**最终一致性策略**:
1. 写操作先更新主数据库
2. 发布更新事件
3. 订阅者异步更新缓存/索引
4. 定期校验数据一致性

## 6. 数据备份策略

### 6.1 备份频率

- **完全备份**: 每天凌晨 2 点
- **增量备份**: 每小时
- **实时备份**: MongoDB Oplog

### 6.2 备份内容

- MongoDB 数据库
- 上传的文件
- 配置文件
- 日志文件

### 6.3 备份存储

- 本地备份：最近 7 天
- 远程备份：最近 30 天
- 归档备份：最近 1 年

### 6.4 恢复流程

1. 确定恢复时间点
2. 停止应用服务
3. 恢复数据库备份
4. 恢复文件备份
5. 验证数据完整性
6. 重启应用服务

## 7. 数据安全

### 7.1 数据加密

- **传输加密**: HTTPS/TLS 1.3
- **存储加密**: AES-256
- **密码加密**: bcrypt

### 7.2 访问控制

- **角色权限**: RBAC 模型
- **数据权限**: 基于角色的数据访问控制
- **API 权限**: Token 认证 + 权限验证

### 7.3 审计日志

记录所有数据操作:
- 操作人
- 操作时间
- 操作类型
- 操作对象
- 操作结果

## 8. 数据迁移

### 8.1 迁移工具

使用 MongoDB 官方工具:
- mongodump / mongorestore
- mongoimport / mongoexport

### 8.2 迁移流程

1. 数据导出
2. 数据转换
3. 数据验证
4. 数据导入
5. 一致性检查
6. 回滚准备

---

**文档维护**: 技术部  
**最后更新**: 2026-03-21
