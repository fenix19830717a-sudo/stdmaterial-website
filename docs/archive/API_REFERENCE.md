# API 接口定义文档

## 修订历史

| 版本 | 日期 | 作者 | 变更说明 |
|------|------|------|----------|
| 1.0 | 2026-03-21 | 技术部 | 初始版本 |

## 1. 概述

### 1.1 API 设计规范

- **架构风格**: RESTful
- **数据格式**: JSON
- **字符编码**: UTF-8
- **认证方式**: JWT Token / Session
- **版本控制**: URL 路径版本 (如 /api/v1/)

### 1.2 基础 URL

```
生产环境：https://api.stdmaterial.com/api/v1
开发环境：http://localhost:3001/api/v1
```

### 1.3 通用响应格式

**成功响应**:
```json
{
  "success": true,
  "data": {},
  "message": "操作成功",
  "timestamp": "2026-03-21T12:00:00.000Z"
}
```

**错误响应**:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述",
    "details": {}
  },
  "timestamp": "2026-03-21T12:00:00.000Z"
}
```

### 1.4 分页响应格式

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  },
  "timestamp": "2026-03-21T12:00:00.000Z"
}
```

## 2. 认证接口 (Auth)

### 2.1 用户登录

**端点**: `POST /api/auth/login`

**请求体**:
```json
{
  "username": "user@example.com",
  "password": "password123"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "123",
      "email": "user@example.com",
      "role": "customer"
    }
  }
}
```

### 2.2 用户注册

**端点**: `POST /api/auth/register`

**请求体**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "company": "Company Name",
  "phone": "+86 123 4567 8900"
}
```

### 2.3 刷新 Token

**端点**: `POST /api/auth/refresh`

**请求头**: `Authorization: Bearer <token>`

### 2.4 用户登出

**端点**: `POST /api/auth/logout`

**请求头**: `Authorization: Bearer <token>`

## 3. 产品接口 (Products)

### 3.1 获取产品列表

**端点**: `GET /api/products`

**查询参数**:
- `page`: 页码 (默认 1)
- `limit`: 每页数量 (默认 20)
- `category`: 分类 ID
- `sort`: 排序字段 (name, price, createdAt)
- `order`: 排序方向 (asc, desc)
- `search`: 搜索关键词

**响应**:
```json
{
  "success": true,
  "data": [
    {
      "id": "123",
      "name": "Planetary Ball Mill PM-400",
      "description": "...",
      "category": {
        "id": "cat1",
        "name": "Grinding Equipment"
      },
      "price": 15000,
      "images": ["url1", "url2"],
      "stock": 10
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

### 3.2 获取产品详情

**端点**: `GET /api/products/:id`

**响应**:
```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Planetary Ball Mill PM-400",
    "description": "Detailed description...",
    "specifications": {
      "power": "2.2 kW",
      "speed": "800 rpm",
      "capacity": "4 x 500ml"
    },
    "images": ["url1", "url2", "url3"],
    "price": 15000,
    "stock": 10,
    "category": {...},
    "relatedProducts": [...]
  }
}
```

### 3.3 创建产品

**端点**: `POST /api/products`

**权限**: Admin

**请求体**:
```json
{
  "name": "New Product",
  "description": "...",
  "categoryId": "cat1",
  "specifications": {},
  "price": 10000,
  "stock": 50
}
```

### 3.4 更新产品

**端点**: `PUT /api/products/:id`

**权限**: Admin

### 3.5 删除产品

**端点**: `DELETE /api/products/:id`

**权限**: Admin

### 3.6 搜索产品

**端点**: `POST /api/products/search`

**请求体**:
```json
{
  "query": "planetary mill",
  "filters": {
    "category": ["cat1", "cat2"],
    "priceRange": {
      "min": 1000,
      "max": 50000
    }
  }
}
```

## 4. 分类接口 (Categories)

### 4.1 获取所有分类

**端点**: `GET /api/categories`

**响应**:
```json
{
  "success": true,
  "data": [
    {
      "id": "cat1",
      "name": "Grinding Equipment",
      "slug": "grinding-equipment",
      "parent": null,
      "children": ["cat2", "cat3"]
    }
  ]
}
```

### 4.2 获取分类详情

**端点**: `GET /api/categories/:id`

## 5. 客户接口 (Customers)

### 5.1 获取客户列表

**端点**: `GET /api/customers`

**权限**: Admin

### 5.2 获取客户详情

**端点**: `GET /api/customers/:id`

### 5.3 更新客户信息

**端点**: `PUT /api/customers/:id`

## 6. 订单接口 (Orders)

### 6.1 创建订单

**端点**: `POST /api/orders`

**请求体**:
```json
{
  "items": [
    {
      "productId": "123",
      "quantity": 2,
      "price": 15000
    }
  ],
  "shippingAddress": {
    "name": "John Doe",
    "phone": "+86 123 4567 8900",
    "address": "123 Street",
    "city": "Changsha",
    "province": "Hunan",
    "country": "China",
    "postalCode": "410000"
  }
}
```

### 6.2 获取订单列表

**端点**: `GET /api/orders`

**查询参数**:
- `status`: 订单状态
- `page`: 页码
- `limit`: 每页数量

### 6.3 获取订单详情

**端点**: `GET /api/orders/:id`

### 6.4 更新订单状态

**端点**: `PUT /api/orders/:id/status`

**请求体**:
```json
{
  "status": "confirmed",
  "remark": "订单已确认"
}
```

## 7. 销售线索接口 (Leads)

### 7.1 创建销售线索

**端点**: `POST /api/leads`

**请求体**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+86 123 4567 8900",
  "company": "Company Name",
  "productInterest": ["prod1", "prod2"],
  "message": "I'm interested in...",
  "source": "website"
}
```

### 7.2 获取线索列表

**端点**: `GET /api/leads`

**权限**: Admin

### 7.3 更新线索状态

**端点**: `PUT /api/leads/:id`

## 8. 分析统计接口 (Analytics)

### 8.1 获取概览数据

**端点**: `GET /api/analytics/overview`

**权限**: Admin

**响应**:
```json
{
  "success": true,
  "data": {
    "totalProducts": 150,
    "totalCustomers": 1200,
    "totalOrders": 500,
    "monthlyRevenue": 150000,
    "conversionRate": 3.5
  }
}
```

### 8.2 获取流量统计

**端点**: `GET /api/analytics/traffic`

### 8.3 获取销售统计

**端点**: `GET /api/analytics/sales`

## 9. 错误码定义

### 9.1 通用错误码

| 错误码 | 说明 | HTTP 状态码 |
|--------|------|------------|
| SUCCESS | 操作成功 | 200 |
| BAD_REQUEST | 请求参数错误 | 400 |
| UNAUTHORIZED | 未授权 | 401 |
| FORBIDDEN | 禁止访问 | 403 |
| NOT_FOUND | 资源不存在 | 404 |
| INTERNAL_ERROR | 服务器内部错误 | 500 |

### 9.2 业务错误码

| 错误码 | 说明 | HTTP 状态码 |
|--------|------|------------|
| PRODUCT_NOT_FOUND | 产品不存在 | 404 |
| PRODUCT_OUT_OF_STOCK | 产品缺货 | 400 |
| ORDER_NOT_FOUND | 订单不存在 | 404 |
| ORDER_INVALID_STATUS | 订单状态无效 | 400 |
| USER_NOT_FOUND | 用户不存在 | 404 |
| INVALID_CREDENTIALS | 用户名或密码错误 | 401 |
| TOKEN_EXPIRED | Token 已过期 | 401 |
| TOKEN_INVALID | Token 无效 | 401 |

## 10. 请求头规范

### 10.1 必需请求头

```
Content-Type: application/json
Authorization: Bearer <token>  (需要认证的接口)
```

### 10.2 可选请求头

```
X-Request-ID: <uuid>  (请求追踪 ID)
X-Language: zh-CN  (语言偏好)
```

## 11. 限流策略

- **普通用户**: 100 请求/分钟
- **认证用户**: 500 请求/分钟
- **管理员**: 1000 请求/分钟

**限流响应**:
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "请求过于频繁，请稍后再试"
  },
  "retryAfter": 60
}
```

---

**文档维护**: 技术部  
**最后更新**: 2026-03-21
