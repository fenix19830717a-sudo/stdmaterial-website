# API文档

本文档详细描述了独立站系统的所有API接口，包括认证、产品管理、订单管理、客户管理、内容管理等功能模块。

## 1. 认证接口

### 1.1 登录接口
- **路径**: `/api/login`
- **方法**: `POST`
- **功能**: 管理员登录获取访问令牌
- **请求参数**:
  - `username`: 用户名 (必填)
  - `password`: 密码 (必填)
- **响应**:
  - 成功: `{"access_token": "JWT令牌"}`
  - 失败: `{"error": "错误信息"}`

### 1.2 健康检查
- **路径**: `/api/health`
- **方法**: `GET`
- **功能**: 检查API服务健康状态
- **响应**:
  - `{"status": "healthy"}`

## 2. 产品管理接口

### 2.1 获取所有产品
- **路径**: `/api/products`
- **方法**: `GET`
- **功能**: 获取所有产品列表
- **响应**:
  - 产品列表数组

### 2.2 获取单个产品
- **路径**: `/api/products/<product_id>`
- **方法**: `GET`
- **功能**: 根据ID获取产品详情
- **响应**:
  - 产品详情对象

### 2.3 创建产品
- **路径**: `/api/products`
- **方法**: `POST`
- **功能**: 创建新产品
- **认证**: 需要JWT令牌
- **请求参数**:
  - `name`: 产品名称 (必填)
  - `category`: 产品分类 (必填)
  - `subcategory`: 产品子分类
  - `model`: 型号
  - `material`: 材质
  - `specifications`: 规格参数
  - `features`: 产品特点
  - `description`: 产品描述
  - `technicalDetails`: 技术详情
  - `images`: 产品图片
  - `price`: 价格
  - `currency`: 货币类型
  - `stock`: 库存
  - `moq`: 最小起订量
  - `leadTime`: 交货期
  - `certifications`: 认证
  - `applications`: 应用领域
  - `keywords`: 关键词
- **响应**:
  - 创建的产品对象

### 2.4 更新产品
- **路径**: `/api/products/<product_id>`
- **方法**: `PUT`
- **功能**: 更新产品信息
- **认证**: 需要JWT令牌
- **请求参数**:
  - 任意产品字段
- **响应**:
  - 更新后的产品对象

### 2.5 删除产品
- **路径**: `/api/products/<product_id>`
- **方法**: `DELETE`
- **功能**: 删除产品
- **认证**: 需要JWT令牌
- **响应**:
  - `{"message": "Product deleted successfully"}`

### 2.6 产品搜索和过滤
- **路径**: `/api/products/search`
- **方法**: `GET`
- **功能**: 根据关键词、分类、价格等过滤产品
- **查询参数**:
  - `keyword`: 搜索关键词
  - `category`: 分类
  - `subcategory`: 子分类
  - `min_price`: 最低价格
  - `max_price`: 最高价格
- **响应**:
  - 过滤后的产品列表

### 2.7 获取产品分类
- **路径**: `/api/products/categories`
- **方法**: `GET`
- **功能**: 获取所有产品分类和子分类
- **响应**:
  - `{"categories": [...], "subcategories": {...}}`

### 2.8 产品图片上传
- **路径**: `/api/products/upload`
- **方法**: `POST`
- **功能**: 上传产品图片
- **认证**: 需要JWT令牌
- **请求**: 表单数据，包含file字段
- **响应**:
  - `{"path": "图片相对路径"}`

## 3. 订单管理接口

### 3.1 获取所有订单
- **路径**: `/api/orders`
- **方法**: `GET`
- **功能**: 获取所有订单及统计数据
- **认证**: 需要JWT令牌
- **响应**:
  - `{"orders": [...], "stats": {...}}`

### 3.2 获取单个订单
- **路径**: `/api/orders/<order_id>`
- **方法**: `GET`
- **功能**: 根据ID获取订单详情
- **认证**: 需要JWT令牌
- **响应**:
  - 订单详情对象

### 3.3 创建订单
- **路径**: `/api/orders`
- **方法**: `POST`
- **功能**: 创建新订单
- **认证**: 需要JWT令牌
- **请求参数**:
  - `customerName`: 客户名称 (必填)
  - `items`: 订单商品 (必填)
  - `customerId`: 客户ID
  - `orderDate`: 订单日期
  - `status`: 订单状态
  - `subtotal`: 小计
  - `shipping`: 运费
  - `tax`: 税费
  - `total`: 总计
  - `shippingAddress`: 收货地址
  - `paymentMethod`: 支付方式
  - `paymentStatus`: 支付状态
  - `trackingNumber`: 物流单号
  - `notes`: 备注
- **响应**:
  - 创建的订单对象

### 3.4 更新订单
- **路径**: `/api/orders/<order_id>`
- **方法**: `PUT`
- **功能**: 更新订单信息
- **认证**: 需要JWT令牌
- **请求参数**:
  - 任意订单字段
- **响应**:
  - 更新后的订单对象

### 3.5 删除订单
- **路径**: `/api/orders/<order_id>`
- **方法**: `DELETE`
- **功能**: 删除订单
- **认证**: 需要JWT令牌
- **响应**:
  - `{"message": "Order deleted successfully"}`

### 3.6 获取订单统计数据
- **路径**: `/api/orders/stats`
- **方法**: `GET`
- **功能**: 获取订单统计信息
- **认证**: 需要JWT令牌
- **响应**:
  - 统计数据对象

### 3.7 导出订单数据
- **路径**: `/api/orders/export`
- **方法**: `GET`
- **功能**: 导出订单为CSV文件
- **认证**: 需要JWT令牌
- **响应**:
  - CSV文件下载

## 4. 客户管理接口

### 4.1 获取所有客户
- **路径**: `/api/customers`
- **方法**: `GET`
- **功能**: 获取所有客户及统计数据
- **认证**: 需要JWT令牌
- **响应**:
  - `{"customers": [...], "stats": {...}}`

### 4.2 获取单个客户
- **路径**: `/api/customers/<customer_id>`
- **方法**: `GET`
- **功能**: 根据ID获取客户详情
- **认证**: 需要JWT令牌
- **响应**:
  - 客户详情对象

### 4.3 创建客户
- **路径**: `/api/customers`
- **方法**: `POST`
- **功能**: 创建新客户
- **认证**: 需要JWT令牌
- **请求参数**:
  - `company`: 公司名称 (必填)
  - `email`: 邮箱 (必填)
  - `contactPerson`: 联系人
  - `phone`: 电话
  - `country`: 国家
  - `address`: 地址
  - `industry`: 行业
  - `customerType`: 客户类型
  - `status`: 状态
  - `totalOrders`: 总订单数
  - `totalSpent`: 总消费
  - `lastOrderDate`: 最后订单日期
  - `createdAt`: 创建日期
  - `notes`: 备注
- **响应**:
  - 创建的客户对象

### 4.4 更新客户
- **路径**: `/api/customers/<customer_id>`
- **方法**: `PUT`
- **功能**: 更新客户信息
- **认证**: 需要JWT令牌
- **请求参数**:
  - 任意客户字段
- **响应**:
  - 更新后的客户对象

### 4.5 删除客户
- **路径**: `/api/customers/<customer_id>`
- **方法**: `DELETE`
- **功能**: 删除客户
- **认证**: 需要JWT令牌
- **响应**:
  - `{"message": "Customer deleted successfully"}`

### 4.6 客户搜索和过滤
- **路径**: `/api/customers/search`
- **方法**: `GET`
- **功能**: 根据关键词、国家、行业等过滤客户
- **认证**: 需要JWT令牌
- **查询参数**:
  - `keyword`: 搜索关键词
  - `country`: 国家
  - `industry`: 行业
  - `customerType`: 客户类型
  - `status`: 状态
- **响应**:
  - 过滤后的客户列表

### 4.7 获取客户统计数据
- **路径**: `/api/customers/stats`
- **方法**: `GET`
- **功能**: 获取客户统计信息
- **认证**: 需要JWT令牌
- **响应**:
  - 统计数据对象

### 4.8 客户账户管理
- **路径**: `/api/customers/<customer_id>/account`
- **方法**: `GET`
- **功能**: 获取客户账户信息
- **认证**: 需要JWT令牌
- **响应**:
  - 客户账户信息对象

### 4.9 更新客户账户信息
- **路径**: `/api/customers/<customer_id>/account`
- **方法**: `PUT`
- **功能**: 更新客户账户信息
- **认证**: 需要JWT令牌
- **请求参数**:
  - 账户相关字段
- **响应**:
  - 更新后的客户对象

## 5. 查询历史记录接口

### 5.1 获取查询历史记录
- **路径**: `/api/query-history`
- **方法**: `GET`
- **功能**: 获取查询历史记录
- **认证**: 需要JWT令牌
- **响应**:
  - 查询历史记录数组

### 5.2 添加查询历史记录
- **路径**: `/api/query-history`
- **方法**: `POST`
- **功能**: 添加查询历史记录
- **请求参数**:
  - `query`: 查询内容 (必填)
- **响应**:
  - 创建的查询记录对象

### 5.3 清空查询历史记录
- **路径**: `/api/query-history`
- **方法**: `DELETE`
- **功能**: 清空查询历史记录
- **认证**: 需要JWT令牌
- **响应**:
  - `{"message": "Query history cleared successfully"}`

## 6. 反馈管理接口

### 6.1 获取所有反馈
- **路径**: `/api/feedback`
- **方法**: `GET`
- **功能**: 获取所有反馈
- **认证**: 需要JWT令牌
- **响应**:
  - 反馈列表数组

### 6.2 提交反馈
- **路径**: `/api/feedback`
- **方法**: `POST`
- **功能**: 提交新反馈
- **请求参数**:
  - `email`: 邮箱 (必填)
  - `message`: 反馈内容 (必填)
  - `name`: 姓名
  - `subject`: 主题
- **响应**:
  - 创建的反馈对象

### 6.3 更新反馈状态
- **路径**: `/api/feedback/<feedback_id>`
- **方法**: `PUT`
- **功能**: 更新反馈状态
- **认证**: 需要JWT令牌
- **请求参数**:
  - `status`: 状态 (必填)
- **响应**:
  - 更新后的反馈对象

### 6.4 删除反馈
- **路径**: `/api/feedback/<feedback_id>`
- **方法**: `DELETE`
- **功能**: 删除反馈
- **认证**: 需要JWT令牌
- **响应**:
  - `{"message": "Feedback deleted successfully"}`

## 7. 内容管理接口

### 7.1 获取所有内容
- **路径**: `/api/content`
- **方法**: `GET`
- **功能**: 获取所有内容
- **响应**:
  - 内容列表数组

### 7.2 获取单个内容
- **路径**: `/api/content/<content_id>`
- **方法**: `GET`
- **功能**: 根据ID获取内容详情
- **响应**:
  - 内容详情对象

### 7.3 创建内容
- **路径**: `/api/content`
- **方法**: `POST`
- **功能**: 创建新内容
- **认证**: 需要JWT令牌
- **请求参数**:
  - `title`: 标题 (必填)
  - `type`: 类型 (必填)
  - `content`: 内容
  - `slug`: 别名
  - `status`: 状态
  - `author`: 作者
  - `meta`: 元数据
- **响应**:
  - 创建的内容对象

### 7.4 更新内容
- **路径**: `/api/content/<content_id>`
- **方法**: `PUT`
- **功能**: 更新内容
- **认证**: 需要JWT令牌
- **请求参数**:
  - 任意内容字段
- **响应**:
  - 更新后的内容对象

### 7.5 删除内容
- **路径**: `/api/content/<content_id>`
- **方法**: `DELETE`
- **功能**: 删除内容
- **认证**: 需要JWT令牌
- **响应**:
  - `{"message": "Content deleted successfully"}`

### 7.6 获取内容版本历史
- **路径**: `/api/content/<content_id>/versions`
- **方法**: `GET`
- **功能**: 获取内容版本历史
- **认证**: 需要JWT令牌
- **响应**:
  - 版本历史数组

### 7.7 恢复内容到特定版本
- **路径**: `/api/content/<content_id>/versions/<version_id>/restore`
- **方法**: `POST`
- **功能**: 恢复内容到特定版本
- **认证**: 需要JWT令牌
- **响应**:
  - 恢复后的内容对象

### 7.8 预览内容
- **路径**: `/api/content/<content_id>/preview`
- **方法**: `GET`
- **功能**: 预览内容
- **响应**:
  - 内容对象

### 7.9 发布内容
- **路径**: `/api/content/<content_id>/publish`
- **方法**: `POST`
- **功能**: 发布内容
- **认证**: 需要JWT令牌
- **响应**:
  - 发布后的内容对象

### 7.10 下线内容
- **路径**: `/api/content/<content_id>/unpublish`
- **方法**: `POST`
- **功能**: 下线内容
- **认证**: 需要JWT令牌
- **响应**:
  - 下线后的内容对象

## 8. 版本管理接口

### 8.1 获取产品版本历史
- **路径**: `/api/products/<product_id>/versions`
- **方法**: `GET`
- **功能**: 获取产品版本历史
- **认证**: 需要JWT令牌
- **响应**:
  - 版本历史数组

### 8.2 恢复产品到特定版本
- **路径**: `/api/products/<product_id>/versions/<version_id>/restore`
- **方法**: `POST`
- **功能**: 恢复产品到特定版本
- **认证**: 需要JWT令牌
- **响应**:
  - `{"message": "Product restored successfully"}`

### 8.3 获取订单版本历史
- **路径**: `/api/orders/<order_id>/versions`
- **方法**: `GET`
- **功能**: 获取订单版本历史
- **认证**: 需要JWT令牌
- **响应**:
  - 版本历史数组

### 8.4 恢复订单到特定版本
- **路径**: `/api/orders/<order_id>/versions/<version_id>/restore`
- **方法**: `POST`
- **功能**: 恢复订单到特定版本
- **认证**: 需要JWT令牌
- **响应**:
  - `{"message": "Order restored successfully"}`

### 8.5 获取客户版本历史
- **路径**: `/api/customers/<customer_id>/versions`
- **方法**: `GET`
- **功能**: 获取客户版本历史
- **认证**: 需要JWT令牌
- **响应**:
  - 版本历史数组

### 8.6 恢复客户到特定版本
- **路径**: `/api/customers/<customer_id>/versions/<version_id>/restore`
- **方法**: `POST`
- **功能**: 恢复客户到特定版本
- **认证**: 需要JWT令牌
- **响应**:
  - `{"message": "Customer restored successfully"}`

## 9. 备份和恢复接口

### 9.1 创建备份
- **路径**: `/api/backups`
- **方法**: `POST`
- **功能**: 创建数据备份
- **认证**: 需要JWT令牌
- **响应**:
  - `{"message": "Backup created successfully", "backupName": "备份名称"}`

### 9.2 列出所有备份
- **路径**: `/api/backups`
- **方法**: `GET`
- **功能**: 列出所有备份
- **认证**: 需要JWT令牌
- **响应**:
  - 备份列表数组

### 9.3 从备份恢复
- **路径**: `/api/backups/<backup_name>/restore`
- **方法**: `POST`
- **功能**: 从备份恢复数据
- **认证**: 需要JWT令牌
- **响应**:
  - `{"message": "Backup restored successfully"}`

### 9.4 删除备份
- **路径**: `/api/backups/<backup_name>`
- **方法**: `DELETE`
- **功能**: 删除备份
- **认证**: 需要JWT令牌
- **响应**:
  - `{"message": "Backup deleted successfully"}`

## 10. 静态文件服务

### 10.1 静态资源访问
- **路径**: `/assets/<path:path>`
- **方法**: `GET`
- **功能**: 访问静态资源文件
- **响应**:
  - 静态文件内容

## 11. 错误处理

### 11.1 404错误
- **路径**: 任意不存在的路径
- **响应**:
  - 404错误页面

## 12. 认证说明

- 所有需要认证的接口都需要在请求头中添加 `Authorization: Bearer <token>`
- 令牌有效期为1小时
- 令牌过期后需要重新登录获取新令牌

## 13. 数据格式说明

- 所有API响应均为JSON格式
- 成功响应状态码为200或201
- 错误响应状态码为400、401、404或500
- 错误响应格式为 `{"error": "错误信息"}`

## 14. 速率限制

- API接口暂未设置速率限制
- 建议合理使用API，避免频繁请求

## 15. 最佳实践

- 使用HTTPS协议访问API
- 妥善保管JWT令牌
- 定期备份数据
- 遵循RESTful API设计规范