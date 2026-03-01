# API接口规范文档

## 1. 概述

本文档定义了研磨设备 B2B 独立站的前后端接口规范，包括数据管理、用户交互和 AI 集成等方面的接口。接口设计遵循 RESTful 风格，使用 JSON 格式进行数据交换。

### 1.1 接口类型

- **前端本地存储接口**: 使用 localStorage 进行数据持久化
- **AI 服务接口**: 与大模型服务的集成接口
- **OpenClaw 接口**: 与 OpenClaw AI 系统的集成接口
- **未来后端接口**: 预留的传统后端 API 接口规范

### 1.2 技术栈

- **前端**: HTML5 + JavaScript + Tailwind CSS
- **数据存储**: localStorage (MVP 阶段)
- **AI 集成**: OpenAI API, DeepSeek API, Anthropic API, Silicon Flow API
- **工具库**: Chart.js, FileSaver.js, PapaParse

## 2. 本地存储接口

### 2.1 数据结构

所有数据以 JSON 格式存储在 localStorage 中，对应的数据键如下：

| 数据类型 | localStorage 键 | 文件路径 |
|----------|----------------|----------|
| 产品数据 | `products` | `data/products.json` |
| 询盘数据 | `inquiries` | `data/inquiries.json` |
| 用户数据 | `users` | `data/users.json` |
| 客户数据 | `customers` | `data/customers.json` |
| 订单数据 | `orders` | `data/orders.json` |
| API 配置 | `apiConfig` | `data/api-config.json` |
| 系统设置 | `settings` | `data/settings.json` |

### 2.2 通用接口方法

#### 2.2.1 数据读取

```javascript
/**
 * 从 localStorage 读取数据
 * @param {string} key - 存储键名
 * @param {any} defaultValue - 默认值
 * @returns {any} 读取的数据
 */
function getData(key, defaultValue = []) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error('读取数据失败:', error);
    return defaultValue;
  }
}
```

#### 2.2.2 数据写入

```javascript
/**
 * 向 localStorage 写入数据
 * @param {string} key - 存储键名
 * @param {any} data - 要存储的数据
 * @returns {boolean} 写入是否成功
 */
function setData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('写入数据失败:', error);
    return false;
  }
}
```

#### 2.2.3 数据导出

```javascript
/**
 * 导出数据为 JSON 文件
 * @param {string} key - 存储键名
 * @param {string} filename - 文件名
 */
function exportData(key, filename) {
  const data = getData(key);
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json'
  });
  saveAs(blob, filename);
}
```

#### 2.2.4 数据导入

```javascript
/**
 * 从 JSON 文件导入数据
 * @param {string} key - 存储键名
 * @param {File} file - 要导入的文件
 * @returns {Promise<any>} 导入的数据
 */
async function importData(key, file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        setData(key, data);
        resolve(data);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsText(file);
  });
}
```

## 3. 产品管理接口

### 3.1 获取产品列表

#### 请求
- **方法**: GET (本地方法调用)
- **参数**: 无

#### 响应
```javascript
// 返回产品数组
[
  {
    "id": "prod-001",
    "name": "行星式球磨机",
    "category": "研磨设备",
    "...": "..."
  }
]
```

### 3.2 获取产品详情

#### 请求
- **方法**: GET (本地方法调用)
- **参数**: `id` (产品ID)

#### 响应
```javascript
// 返回产品对象
{
  "id": "prod-001",
  "name": "行星式球磨机",
  "category": "研磨设备",
  "specifications": {
    "capacity": "500ml",
    "speed": "100-500rpm"
  },
  "images": ["/assets/images/products/pm-400-1.jpg"],
  "...": "..."
}
```

### 3.3 添加产品

#### 请求
- **方法**: POST (本地方法调用)
- **参数**: `product` (产品对象)

#### 响应
```javascript
// 返回新添加的产品对象
{
  "id": "prod-002",
  "name": "振动球磨机",
  "category": "研磨设备",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z",
  "...": "..."
}
```

### 3.4 更新产品

#### 请求
- **方法**: PUT (本地方法调用)
- **参数**: `id` (产品ID), `product` (产品更新对象)

#### 响应
```javascript
// 返回更新后的产品对象
{
  "id": "prod-001",
  "name": "行星式球磨机 (升级版)",
  "updatedAt": "2024-01-02T00:00:00Z",
  "...": "..."
}
```

### 3.5 删除产品

#### 请求
- **方法**: DELETE (本地方法调用)
- **参数**: `id` (产品ID)

#### 响应
```javascript
// 返回删除结果
{
  "success": true,
  "message": "产品删除成功"
}
```

### 3.6 搜索产品

#### 请求
- **方法**: GET (本地方法调用)
- **参数**: `keyword` (搜索关键词)

#### 响应
```javascript
// 返回搜索结果数组
[
  {
    "id": "prod-001",
    "name": "行星式球磨机",
    "...": "..."
  }
]
```

### 3.7 筛选产品

#### 请求
- **方法**: GET (本地方法调用)
- **参数**: `filters` (筛选条件对象)

#### 响应
```javascript
// 返回筛选结果数组
[
  {
    "id": "prod-001",
    "name": "行星式球磨机",
    "category": "研磨设备",
    "...": "..."
  }
]
```

## 4. 询盘管理接口

### 4.1 获取询盘列表

#### 请求
- **方法**: GET (本地方法调用)
- **参数**: 无

#### 响应
```javascript
// 返回询盘数组
[
  {
    "id": "inq-001",
    "name": "张三",
    "company": "ABC 公司",
    "email": "zhangsan@example.com",
    "status": "pending",
    "...": "..."
  }
]
```

### 4.2 获取询盘详情

#### 请求
- **方法**: GET (本地方法调用)
- **参数**: `id` (询盘ID)

#### 响应
```javascript
// 返回询盘对象
{
  "id": "inq-001",
  "name": "张三",
  "company": "ABC 公司",
  "email": "zhangsan@example.com",
  "phone": "13800138000",
  "message": "咨询行星式球磨机的价格和交货期",
  "productId": "prod-001",
  "status": "pending",
  "...": "..."
}
```

### 4.3 添加询盘

#### 请求
- **方法**: POST (本地方法调用)
- **参数**: `inquiry` (询盘对象)

#### 响应
```javascript
// 返回新添加的询盘对象
{
  "id": "inq-002",
  "name": "李四",
  "company": "XYZ 公司",
  "email": "lisi@example.com",
  "status": "pending",
  "createdAt": "2024-01-01T00:00:00Z",
  "...": "..."
}
```

### 4.4 更新询盘

#### 请求
- **方法**: PUT (本地方法调用)
- **参数**: `id` (询盘ID), `inquiry` (询盘更新对象)

#### 响应
```javascript
// 返回更新后的询盘对象
{
  "id": "inq-001",
  "status": "processing",
  "assignedTo": "admin",
  "updatedAt": "2024-01-02T00:00:00Z",
  "...": "..."
}
```

### 4.5 更新询盘状态

#### 请求
- **方法**: PUT (本地方法调用)
- **参数**: `id` (询盘ID), `status` (新状态)

#### 响应
```javascript
// 返回更新后的询盘对象
{
  "id": "inq-001",
  "status": "completed",
  "updatedAt": "2024-01-03T00:00:00Z",
  "...": "..."
}
```

### 4.6 删除询盘

#### 请求
- **方法**: DELETE (本地方法调用)
- **参数**: `id` (询盘ID)

#### 响应
```javascript
// 返回删除结果
{
  "success": true,
  "message": "询盘删除成功"
}
```

## 5. 用户管理接口

### 5.1 获取用户列表

#### 请求
- **方法**: GET (本地方法调用)
- **参数**: 无

#### 响应
```javascript
// 返回用户数组
[
  {
    "id": "user-001",
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin",
    "status": "active",
    "...": "..."
  }
]
```

### 5.2 用户登录

#### 请求
- **方法**: POST (本地方法调用)
- **参数**: `username` (用户名), `password` (密码)

#### 响应
```javascript
// 登录成功
{
  "success": true,
  "user": {
    "id": "user-001",
    "username": "admin",
    "role": "admin",
    "...": "..."
  },
  "token": "session-token"
}

// 登录失败
{
  "success": false,
  "message": "用户名或密码错误"
}
```

### 5.3 用户注册

#### 请求
- **方法**: POST (本地方法调用)
- **参数**: `user` (用户对象)

#### 响应
```javascript
// 注册成功
{
  "success": true,
  "user": {
    "id": "user-002",
    "username": "newuser",
    "role": "user",
    "...": "..."
  }
}

// 注册失败
{
  "success": false,
  "message": "用户名已存在"
}
```

### 5.4 更新用户信息

#### 请求
- **方法**: PUT (本地方法调用)
- **参数**: `id` (用户ID), `user` (用户更新对象)

#### 响应
```javascript
// 返回更新后的用户对象
{
  "id": "user-001",
  "name": "管理员",
  "phone": "13900139000",
  "updatedAt": "2024-01-02T00:00:00Z",
  "...": "..."
}
```

### 5.5 修改密码

#### 请求
- **方法**: PUT (本地方法调用)
- **参数**: `id` (用户ID), `oldPassword` (旧密码), `newPassword` (新密码)

#### 响应
```javascript
// 修改成功
{
  "success": true,
  "message": "密码修改成功"
}

// 修改失败
{
  "success": false,
  "message": "旧密码错误"
}
```

## 6. 客户管理接口

### 6.1 获取客户列表

#### 请求
- **方法**: GET (本地方法调用)
- **参数**: 无

#### 响应
```javascript
// 返回客户数组
[
  {
    "id": "cust-001",
    "name": "张三",
    "company": "ABC 公司",
    "email": "zhangsan@example.com",
    "country": "中国",
    "...": "..."
  }
]
```

### 6.2 获取客户详情

#### 请求
- **方法**: GET (本地方法调用)
- **参数**: `id` (客户ID)

#### 响应
```javascript
// 返回客户对象
{
  "id": "cust-001",
  "name": "张三",
  "company": "ABC 公司",
  "email": "zhangsan@example.com",
  "phone": "13800138000",
  "country": "中国",
  "city": "上海",
  "industry": "制造业",
  "...": "..."
}
```

### 6.3 添加客户

#### 请求
- **方法**: POST (本地方法调用)
- **参数**: `customer` (客户对象)

#### 响应
```javascript
// 返回新添加的客户对象
{
  "id": "cust-002",
  "name": "李四",
  "company": "XYZ 公司",
  "email": "lisi@example.com",
  "createdAt": "2024-01-01T00:00:00Z",
  "...": "..."
}
```

### 6.4 更新客户

#### 请求
- **方法**: PUT (本地方法调用)
- **参数**: `id` (客户ID), `customer` (客户更新对象)

#### 响应
```javascript
// 返回更新后的客户对象
{
  "id": "cust-001",
  "phone": "13900139000",
  "address": "上海市浦东新区",
  "updatedAt": "2024-01-02T00:00:00Z",
  "...": "..."
}
```

### 6.5 删除客户

#### 请求
- **方法**: DELETE (本地方法调用)
- **参数**: `id` (客户ID)

#### 响应
```javascript
// 返回删除结果
{
  "success": true,
  "message": "客户删除成功"
}
```

## 7. 订单管理接口

### 7.1 获取订单列表

#### 请求
- **方法**: GET (本地方法调用)
- **参数**: 无

#### 响应
```javascript
// 返回订单数组
[
  {
    "id": "order-001",
    "customerName": "张三",
    "customerCompany": "ABC 公司",
    "orderDate": "2024-01-01",
    "status": "pending",
    "totalAmount": 12000,
    "...": "..."
  }
]
```

### 7.2 获取订单详情

#### 请求
- **方法**: GET (本地方法调用)
- **参数**: `id` (订单ID)

#### 响应
```javascript
// 返回订单对象
{
  "id": "order-001",
  "customerId": "cust-001",
  "customerName": "张三",
  "customerCompany": "ABC 公司",
  "orderDate": "2024-01-01",
  "deliveryDate": "2024-01-15",
  "status": "pending",
  "totalAmount": 12000,
  "currency": "USD",
  "items": [
    {
      "productId": "prod-001",
      "productName": "行星式球磨机",
      "quantity": 1,
      "price": 12000,
      "total": 12000
    }
  ],
  "...": "..."
}
```

### 7.3 添加订单

#### 请求
- **方法**: POST (本地方法调用)
- **参数**: `order` (订单对象)

#### 响应
```javascript
// 返回新添加的订单对象
{
  "id": "order-002",
  "customerName": "李四",
  "customerCompany": "XYZ 公司",
  "orderDate": "2024-01-02",
  "status": "pending",
  "createdAt": "2024-01-02T00:00:00Z",
  "...": "..."
}
```

### 7.4 更新订单

#### 请求
- **方法**: PUT (本地方法调用)
- **参数**: `id` (订单ID), `order` (订单更新对象)

#### 响应
```javascript
// 返回更新后的订单对象
{
  "id": "order-001",
  "status": "processing",
  "paymentStatus": "paid",
  "updatedAt": "2024-01-03T00:00:00Z",
  "...": "..."
}
```

### 7.5 更新订单状态

#### 请求
- **方法**: PUT (本地方法调用)
- **参数**: `id` (订单ID), `status` (新状态)

#### 响应
```javascript
// 返回更新后的订单对象
{
  "id": "order-001",
  "status": "completed",
  "updatedAt": "2024-01-15T00:00:00Z",
  "...": "..."
}
```

### 7.6 删除订单

#### 请求
- **方法**: DELETE (本地方法调用)
- **参数**: `id` (订单ID)

#### 响应
```javascript
// 返回删除结果
{
  "success": true,
  "message": "订单删除成功"
}
```

## 8. AI 服务接口

### 8.1 API 配置管理

#### 请求
- **方法**: GET (本地方法调用)
- **参数**: 无

#### 响应
```javascript
// 返回 API 配置对象
{
  "providers": {
    "openai": {
      "apiKey": "sk-...",
      "model": "gpt-4",
      "baseUrl": "https://api.openai.com/v1"
    },
    "deepseek": {
      "apiKey": "sk-...",
      "model": "deepseek-chat",
      "baseUrl": "https://api.deepseek.com/v1"
    },
    "anthropic": {
      "apiKey": "sk-...",
      "model": "claude-3-opus-20240229",
      "baseUrl": "https://api.anthropic.com/v1"
    },
    "siliconflow": {
      "apiKey": "sk-...",
      "model": "gpt-4",
      "baseUrl": "https://api.siliconflow.cn/v1"
    }
  },
  "defaultProvider": "openai",
  "rateLimits": {
    "requestsPerMinute": 60,
    "tokensPerMinute": 150000
  }
}
```

### 8.2 内容生成

#### 请求
- **方法**: POST (本地方法调用)
- **参数**: `prompt` (提示词), `options` (选项)

#### 响应
```javascript
// 返回生成的内容
{
  "success": true,
  "content": "生成的产品描述内容...",
  "provider": "openai",
  "model": "gpt-4",
  "tokensUsed": 120
}
```

### 8.3 询盘分析

#### 请求
- **方法**: POST (本地方法调用)
- **参数**: `inquiry` (询盘对象)

#### 响应
```javascript
// 返回分析结果
{
  "success": true,
  "summary": "这是一个关于行星式球磨机的询盘，客户需要了解价格和交货期。",
  "score": 85,
  "tags": ["高优先级", "设备采购"],
  "recommendation": "建议尽快回复客户，提供详细的产品信息和报价。"
}
```

### 8.4 产品描述生成

#### 请求
- **方法**: POST (本地方法调用)
- **参数**: `product` (产品对象), `length` (长度)

#### 响应
```javascript
// 返回生成的描述
{
  "success": true,
  "description": "行星式球磨机是一种高效的研磨设备，适用于实验室和工业生产...",
  "features": ["高效研磨", "智能控制", "低噪音"],
  "keywords": ["行星式球磨机", "研磨设备", "实验室设备"]
}
```

### 8.5 营销内容生成

#### 请求
- **方法**: POST (本地方法调用)
- **参数**: `topic` (主题), `type` (类型), `length` (长度)

#### 响应
```javascript
// 返回生成的营销内容
{
  "success": true,
  "content": "研磨设备行业的未来发展趋势...",
  "title": "研磨设备行业的未来发展趋势分析",
  "keywords": ["研磨设备", "行业趋势", "技术创新"]
}
```

## 9. OpenClaw 集成接口

### 9.1 技能执行

#### 请求
- **方法**: POST (本地方法调用)
- **参数**: `skillName` (技能名称), `parameters` (参数)

#### 响应
```javascript
// 返回执行结果
{
  "success": true,
  "data": {
    "products": [...]
  },
  "message": "产品采集完成",
  "executionTime": 15000
}
```

### 9.2 代理执行

#### 请求
- **方法**: POST (本地方法调用)
- **参数**: `agentName` (代理名称), `task` (任务描述)

#### 响应
```javascript
// 返回执行结果
{
  "success": true,
  "result": "任务执行结果...",
  "steps": [
    "步骤1: 分析任务",
    "步骤2: 执行操作",
    "步骤3: 验证结果"
  ],
  "executionTime": 25000
}
```

### 9.3 任务调度

#### 请求
- **方法**: POST (本地方法调用)
- **参数**: `task` (任务对象)

#### 响应
```javascript
// 返回调度结果
{
  "success": true,
  "taskId": "task-123",
  "status": "scheduled",
  "scheduledAt": "2024-01-01T00:00:00Z"
}
```

## 10. 系统接口

### 10.1 系统设置

#### 请求
- **方法**: GET (本地方法调用)
- **参数**: 无

#### 响应
```javascript
// 返回系统设置
{
  "company": {
    "name": "晟通达材料",
    "email": "info@example.com",
    "phone": "400-123-4567",
    "address": "上海市浦东新区"
  },
  "website": {
    "title": "晟通达材料 - 工业研磨设备专家",
    "description": "专业提供工业研磨设备和解决方案",
    "keywords": "研磨设备,球磨机,工业设备"
  },
  "features": {
    "aiEnabled": true,
    "openclawEnabled": true,
    "analyticsEnabled": false
  },
  "notifications": {
    "emailAlerts": true,
    "pushNotifications": false,
    "alertThreshold": 5
  }
}
```

### 10.2 更新系统设置

#### 请求
- **方法**: PUT (本地方法调用)
- **参数**: `settings` (设置对象)

#### 响应
```javascript
// 返回更新结果
{
  "success": true,
  "message": "系统设置更新成功"
}
```

### 10.3 系统状态

#### 请求
- **方法**: GET (本地方法调用)
- **参数**: 无

#### 响应
```javascript
// 返回系统状态
{
  "status": "healthy",
  "version": "1.0.0",
  "lastUpdated": "2024-01-01T00:00:00Z",
  "storage": {
    "used": "1.2MB",
    "total": "5MB",
    "percentage": "24%"
  },
  "ai": {
    "status": "connected",
    "provider": "openai",
    "lastRequest": "2024-01-01T00:00:00Z"
  }
}
```

## 11. 错误处理

### 11.1 错误响应格式

```javascript
// 错误响应
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述",
    "details": "详细错误信息"
  }
}
```

### 11.2 常见错误码

| 错误码 | 描述 | HTTP 状态码 |
|--------|------|-------------|
| `INVALID_INPUT` | 无效的输入参数 | 400 |
| `NOT_FOUND` | 资源不存在 | 404 |
| `UNAUTHORIZED` | 未授权访问 | 401 |
| `FORBIDDEN` | 禁止访问 | 403 |
| `RATE_LIMIT_EXCEEDED` | 超出速率限制 | 429 |
| `SERVER_ERROR` | 服务器内部错误 | 500 |
| `STORAGE_ERROR` | 存储错误 | 500 |
| `AI_SERVICE_ERROR` | AI 服务错误 | 502 |

## 12. 性能优化

### 12.1 缓存策略

1. **内存缓存**: 频繁访问的数据使用内存缓存
2. **本地存储**: 持久化数据使用 localStorage
3. **文件备份**: 定期备份到 JSON 文件
4. **批量操作**: 支持批量添加、更新、删除操作

### 12.2 速率限制

1. **API 调用限制**: 每分钟最多 60 个请求
2. **令牌使用限制**: 每分钟最多 150,000 个令牌
3. **并发控制**: 最多 5 个并发请求
4. **重试机制**: 失败请求自动重试 3 次

### 12.3 数据压缩

1. **JSON 压缩**: 使用 JSON.minify 压缩存储数据
2. **图片优化**: 自动压缩上传的图片
3. **响应压缩**: 大型响应使用 GZIP 压缩

## 13. 安全性

### 13.1 数据安全

1. **密码加密**: 用户密码使用 bcrypt 加密存储
2. **数据验证**: 所有输入数据进行严格验证
3. **XSS 防护**: 防止跨站脚本攻击
4. **CSRF 防护**: 防止跨站请求伪造

### 13.2 API 安全

1. **API 密钥管理**: 安全存储 API 密钥
2. **请求验证**: 验证所有 API 请求
3. **访问控制**: 基于角色的访问控制
4. **操作审计**: 记录关键操作日志

## 14. 未来扩展

### 14.1 后端 API 接口

当系统从 MVP 阶段升级到正式版本时，将添加以下后端 API 接口：

#### 14.1.1 认证接口

- `POST /api/auth/login` - 用户登录
- `POST /api/auth/logout` - 用户登出
- `POST /api/auth/refresh` - 刷新令牌
- `POST /api/auth/register` - 用户注册

#### 14.1.2 产品接口

- `GET /api/products` - 获取产品列表
- `GET /api/products/:id` - 获取产品详情
- `POST /api/products` - 添加产品
- `PUT /api/products/:id` - 更新产品
- `DELETE /api/products/:id` - 删除产品

#### 14.1.3 询盘接口

- `GET /api/inquiries` - 获取询盘列表
- `GET /api/inquiries/:id` - 获取询盘详情
- `POST /api/inquiries` - 添加询盘
- `PUT /api/inquiries/:id` - 更新询盘
- `DELETE /api/inquiries/:id` - 删除询盘

#### 14.1.4 客户接口

- `GET /api/customers` - 获取客户列表
- `GET /api/customers/:id` - 获取客户详情
- `POST /api/customers` - 添加客户
- `PUT /api/customers/:id` - 更新客户
- `DELETE /api/customers/:id` - 删除客户

#### 14.1.5 订单接口

- `GET /api/orders` - 获取订单列表
- `GET /api/orders/:id` - 获取订单详情
- `POST /api/orders` - 添加订单
- `PUT /api/orders/:id` - 更新订单
- `DELETE /api/orders/:id` - 删除订单

### 14.2 WebSocket 接口

为了支持实时通信，未来将添加以下 WebSocket 接口：

- `ws://example.com/ws/notifications` - 实时通知
- `ws://example.com/ws/chat` - 实时聊天
- `ws://example.com/ws/dashboard` - 实时仪表盘数据

## 15. 结论

本 API 接口规范文档详细定义了研磨设备 B2B 独立站的前后端接口，包括本地存储接口、AI 服务接口和未来的后端 API 接口。接口设计遵循 RESTful 风格，使用 JSON 格式进行数据交换，确保了系统的可扩展性和可维护性。

在 MVP 阶段，系统使用 localStorage 进行数据持久化，简化了部署和维护。随着系统的发展，可以无缝迁移到传统的后端服务器架构，同时保持接口的一致性。

通过本规范文档，前端开发人员和后端开发人员可以明确各自的职责，确保系统的顺利开发和集成。