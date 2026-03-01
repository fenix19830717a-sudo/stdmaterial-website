# 研磨设备B2B独立站 - AI接入文档

## 文档概述

本文档详细说明如何将AI功能接入到研磨设备B2B独立站系统中，包括系统架构、接口定义、配置方法和使用示例。

---

## 目录

1. [系统架构](#系统架构)
2. [AI Agent系统](#ai-agent系统)
3. [API接口规范](#api接口规范)
4. [配置方法](#配置方法)
5. [使用示例](#使用示例)
6. [故障排除](#故障排除)

---

## 系统架构

### 整体架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                        用户界面层                                │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐    │
│  │   前台网站    │ │   管理后台    │ │    AI助手界面         │    │
│  └──────────────┘ └──────────────┘ └──────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       API网关层                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              OpenClaw API Gateway                         │  │
│  │  /api/openclaw/command  /api/openclaw/agents             │  │
│  │  /api/openclaw/tasks    /api/openclaw/metrics            │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      AI Agent调度层                              │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            │
│  │  Main Agent  │ │ Task Planner │ │  Coordinator │            │
│  │  (运营总协调) │ │  (任务规划)   │ │  (执行调度)   │            │
│  └──────────────┘ └──────────────┘ └──────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      专业Agent层                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │ 产品运营  │ │ 营销推广  │ │ 客户服务  │ │ 数据分析  │          │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
│  ┌──────────┐                                                    │
│  │ 技术支持  │                                                    │
│  └──────────┘                                                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       技能工具层                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │ 网页浏览  │ │ 数据处理  │ │ 文件操作  │ │ 代码执行  │          │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │ 邮件营销  │ │ 内容生成  │ │ 聊天机器人 │ │ 数据分析  │          │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

### 数据流

```
用户请求 → API Gateway → Main Agent → 任务分配 → 专业Agent → 技能执行 → 结果返回
```

---

## AI Agent系统

### Agent层级结构

#### 1. 主Agent (Main Agent)

**角色**: 运营总协调

**职责**:
- 接收并分析用户指令
- 制定任务执行计划
- 分配任务给合适的子Agent
- 监控任务执行进度
- 汇总并报告执行结果

**配置参数**:
```yaml
main_agent:
  id: "main_agent"
  name: "研磨设备B2B运营总协调"
  role: "运营总监"
  model: "gpt-4-turbo"
  temperature: 0.7
  max_tokens: 4000
```

#### 2. 专业Agent

##### 2.1 产品运营专员 (Product Operations)

**职责**:
- 管理产品数据库
- 生成产品描述和规格
- 同步库存信息
- 研究市场趋势
- 优化产品信息

**技能**:
- 产品管理
- 数据抓取
- 内容生成
- 市场研究
- 库存管理

**API调用示例**:
```javascript
// 上传新产品
OpenClawAPI.uploadProduct({
    name: "Alumina Ceramic Grinding Jar",
    category: "Grinding Jars",
    material: "Alumina (Al2O3)",
    volume: "500ml"
});

// 更新产品信息
OpenClawAPI.updateProduct("GJ-AL-500", {
    price: "$299",
    stock: "In Stock"
});
```

##### 2.2 营销推广专员 (Marketing Promotion)

**职责**:
- 创建营销内容
- 管理社交媒体账号
- 执行邮件营销活动
- 优化SEO表现
- 分析营销效果

**技能**:
- 内容创作
- 邮件营销
- SEO优化
- 社交媒体管理
- 活动管理

**API调用示例**:
```javascript
// 生成产品描述
OpenClawAPI.generateProductDescription({
    name: "Planetary Ball Mill",
    features: ["High energy", "Digital control", "4 stations"]
});

// 生成营销内容
OpenClawAPI.generateMarketingContent('blog_post', {
    topic: "Grinding Technology Trends 2024",
    keywords: ["ball mill", "grinding efficiency"]
});

// 安排社交媒体发布
OpenClawAPI.scheduleSocialMediaPost(
    content,
    ['LinkedIn', 'Twitter'],
    '2024-02-20T09:00:00Z'
);
```

##### 2.3 客户服务专员 (Customer Service)

**职责**:
- 处理客户询盘
- 跟进潜在客户
- 解决客户问题
- 维护客户关系
- 收集客户反馈

**技能**:
- 客户支持
- 询盘处理
- 跟进管理
- 投诉解决
- 关系管理

**API调用示例**:
```javascript
// 处理客户询盘
OpenClawAPI.handleCustomerInquiry({
    customerName: "John Smith",
    email: "john@example.com",
    productInterest: "Planetary Ball Mill",
    message: "Interested in pricing for bulk orders"
});
```

##### 2.4 数据分析专员 (Data Analysis)

**职责**:
- 分析业务数据
- 识别市场趋势
- 评估营销效果
- 生成分析报告
- 提供决策建议

**技能**:
- 数据分析
- 趋势分析
- 绩效评估
- 预测分析
- 报告生成

**API调用示例**:
```javascript
// 分析市场趋势
OpenClawAPI.analyzeMarketTrends('grinding equipment');

// 生成SEO报告
OpenClawAPI.generateSEOReport();

// 获取业务指标
OpenClawAPI.getBusinessMetrics();
```

##### 2.5 技术支持专员 (Technical Support)

**职责**:
- 管理技术文档
- 解答技术问题
- 配置产品参数
- 集成系统功能
- 优化技术流程

**技能**:
- 技术支持
- 文档管理
- 问题解决
- 产品配置
- 系统集成

---

## API接口规范

### 基础信息

**Base URL**: `/api/openclaw`

**认证方式**: Bearer Token

**请求格式**: JSON

**响应格式**: JSON

### 通用响应格式

```json
{
    "success": true,
    "data": {},
    "message": "操作成功",
    "timestamp": "2024-02-15T10:30:00Z"
}
```

错误响应:
```json
{
    "success": false,
    "error": {
        "code": "ERROR_CODE",
        "message": "错误描述"
    },
    "timestamp": "2024-02-15T10:30:00Z"
}
```

### 接口列表

#### 1. 健康检查

**GET** `/health`

**响应**:
```json
{
    "status": "ok",
    "version": "1.0.0",
    "timestamp": "2024-02-15T10:30:00Z"
}
```

#### 2. Agent管理

##### 2.1 获取所有Agent

**GET** `/agents`

**响应**:
```json
{
    "success": true,
    "data": {
        "agents": [
            {
                "id": "main_agent",
                "name": "研磨设备B2B运营总协调",
                "status": "active",
                "current_tasks": 3
            },
            {
                "id": "product_operations",
                "name": "产品运营专员",
                "status": "active",
                "current_tasks": 1
            }
        ]
    }
}
```

##### 2.2 获取Agent状态

**GET** `/agents/{agentId}/status`

**参数**:
- `agentId`: Agent标识符

**响应**:
```json
{
    "success": true,
    "data": {
        "agentId": "product_operations",
        "status": "active",
        "current_tasks": 1,
        "completed_tasks": 156,
        "last_activity": "2024-02-15T10:25:00Z"
    }
}
```

#### 3. 任务管理

##### 3.1 发送命令

**POST** `/command`

**请求体**:
```json
{
    "agentId": "product_operations",
    "command": "upload_product",
    "params": {
        "name": "Alumina Grinding Jar",
        "category": "Grinding Jars",
        "material": "Alumina (Al2O3)"
    },
    "timestamp": "2024-02-15T10:30:00Z"
}
```

**响应**:
```json
{
    "success": true,
    "data": {
        "commandId": "cmd_123456",
        "status": "accepted",
        "message": "命令已接收，正在处理"
    }
}
```

##### 3.2 执行任务

**POST** `/tasks/execute`

**请求体**:
```json
{
    "task": "Generate product description for new grinding mill",
    "agent": "marketing_promotion",
    "priority": "normal",
    "context": {
        "action": "generate_description",
        "product": {
            "name": "Planetary Ball Mill",
            "features": ["High energy", "Digital control"]
        }
    },
    "callback": "https://your-domain.com/webhook/task-complete"
}
```

**响应**:
```json
{
    "success": true,
    "data": {
        "taskId": "task_789012",
        "status": "processing",
        "estimated_completion": "2024-02-15T10:35:00Z"
    }
}
```

##### 3.3 获取任务状态

**GET** `/tasks/{taskId}/status`

**响应**:
```json
{
    "success": true,
    "data": {
        "taskId": "task_789012",
        "status": "completed",
        "progress": 100,
        "result": {
            "description": "Generated product description...",
            "seo_score": 85
        },
        "completed_at": "2024-02-15T10:32:00Z"
    }
}
```

##### 3.4 取消任务

**POST** `/tasks/{taskId}/cancel`

**响应**:
```json
{
    "success": true,
    "data": {
        "taskId": "task_789012",
        "status": "cancelled"
    }
}
```

#### 4. 业务指标

##### 4.1 获取业务指标

**GET** `/metrics/business`

**响应**:
```json
{
    "success": true,
    "data": {
        "products": {
            "total": 20,
            "active": 18,
            "new_this_month": 3
        },
        "inquiries": {
            "total": 156,
            "pending": 12,
            "converted": 45
        },
        "orders": {
            "total": 89,
            "revenue": "$125,000",
            "avg_order_value": "$1,404"
        },
        "customers": {
            "total": 67,
            "new_this_month": 8,
            "active": 45
        }
    }
}
```

#### 5. 事件订阅

**GET** `/events`

**SSE (Server-Sent Events)** 连接，用于实时接收AI系统事件。

**事件类型**:
- `task_started`: 任务开始
- `task_completed`: 任务完成
- `task_failed`: 任务失败
- `agent_status_changed`: Agent状态变化

**示例事件**:
```json
event: task_completed
data: {
    "taskId": "task_789012",
    "agentId": "marketing_promotion",
    "result": {...},
    "timestamp": "2024-02-15T10:32:00Z"
}
```

---

## 配置方法

### 1. 基础配置

编辑 `openclaw/config/config.yaml`:

```yaml
openclaw:
  name: "研磨设备B2B独立站AI助手"
  version: "1.0.0"
  language: "zh-CN"
  timezone: "Asia/Shanghai"

logging:
  level: "INFO"
  format: "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
  file: "/var/log/openclaw/openclaw.log"

storage:
  type: "local"
  path: "./data"
  backup:
    interval: 24
    retention: 30

security:
  api_key: "your-secure-api-key-here"
  allowed_ips: ["127.0.0.1", "192.168.1.0/24"]
  rate_limit:
    requests_per_minute: 100
    burst: 20
```

### 2. Agent配置

编辑 `openclaw/config/agents.yaml`:

```yaml
agents:
  main_agent:
    id: "main_agent"
    name: "研磨设备B2B运营总协调"
    model: "gpt-4-turbo"
    temperature: 0.7
    max_tokens: 4000
    core_skills:
      - task_planning
      - team_coordination
      - decision_making

  product_operations:
    id: "product_operations"
    name: "产品运营专员"
    model: "gpt-4-turbo"
    temperature: 0.5
    max_tokens: 3000
    core_skills:
      - product_management
      - data_scraping
      - content_generation
```

### 3. 技能配置

编辑 `openclaw/config/skills.yaml`:

```yaml
skills:
  web_browser:
    name: "网页浏览器"
    enabled: true
    config:
      timeout: 30
      max_pages: 10
      user_agent: "OpenClaw/1.0"

  data_processor:
    name: "数据处理器"
    enabled: true
    config:
      supported_formats: ["csv", "json", "excel"]
      max_file_size: 10485760
```

### 4. 前端集成

在HTML文件中引入API客户端:

```html
<script src="assets/js/openclaw-api.js"></script>
<script>
// 初始化API
OpenClawAPI.init({
    baseUrl: '/api/openclaw',
    apiKey: 'your-api-key',
    timeout: 30000,
    retryAttempts: 3
});

// 检查连接
OpenClawAPI.checkConnection().then(connected => {
    console.log('AI系统连接状态:', connected);
});
</script>
```

---

## 使用示例

### 示例1: 批量上传产品

```javascript
async function batchUploadProducts(products) {
    const results = [];
    
    for (const product of products) {
        try {
            const result = await OpenClawAPI.uploadProduct(product);
            results.push({
                product: product.name,
                status: 'success',
                taskId: result.data.taskId
            });
        } catch (error) {
            results.push({
                product: product.name,
                status: 'failed',
                error: error.message
            });
        }
    }
    
    return results;
}

// 使用示例
const newProducts = [
    {
        name: "Zirconia Grinding Jar",
        category: "Grinding Jars",
        material: "Zirconia (ZrO2)",
        volume: "250ml"
    },
    {
        name: "Stainless Steel Grinding Media",
        category: "Grinding Media",
        material: "Stainless Steel 304",
        size: "10mm"
    }
];

batchUploadProducts(newProducts).then(results => {
    console.log('批量上传结果:', results);
});
```

### 示例2: 智能客服自动回复

```javascript
async function handleCustomerInquiry(inquiry) {
    // 1. 分析询盘内容
    const analysis = await OpenClawAPI.executeTask({
        description: 'Analyze customer inquiry',
        agent: 'customer_service',
        context: {
            action: 'analyze_inquiry',
            inquiry: inquiry
        }
    });
    
    // 2. 生成回复
    const response = await OpenClawAPI.executeTask({
        description: 'Generate response to customer inquiry',
        agent: 'customer_service',
        context: {
            action: 'generate_response',
            inquiry: inquiry,
            analysis: analysis.data.result
        }
    });
    
    // 3. 发送回复
    await sendEmail(inquiry.email, response.data.result.message);
    
    return response.data.result;
}
```

### 示例3: 营销内容自动化

```javascript
async function generateWeeklyMarketingContent() {
    const contentPlan = {
        blogPosts: 2,
        socialMediaPosts: 5,
        emailCampaigns: 1
    };
    
    const results = {
        blogPosts: [],
        socialMediaPosts: [],
        emailCampaigns: []
    };
    
    // 生成博客文章
    for (let i = 0; i < contentPlan.blogPosts; i++) {
        const post = await OpenClawAPI.generateMarketingContent('blog_post', {
            topic: getRandomTopic(),
            keywords: ['grinding equipment', 'ball mill', 'industrial'],
            length: '1500-2000 words'
        });
        results.blogPosts.push(post);
    }
    
    // 生成社交媒体内容
    for (let i = 0; i < contentPlan.socialMediaPosts; i++) {
        const post = await OpenClawAPI.generateMarketingContent('social_post', {
            platform: ['LinkedIn', 'Twitter'][i % 2],
            tone: 'professional',
            include_image: true
        });
        results.socialMediaPosts.push(post);
    }
    
    return results;
}
```

### 示例4: 数据分析和报告

```javascript
async function generateWeeklyReport() {
    // 获取业务指标
    const metrics = await OpenClawAPI.getBusinessMetrics();
    
    // 分析市场趋势
    const marketTrends = await OpenClawAPI.analyzeMarketTrends('grinding equipment');
    
    // 生成SEO报告
    const seoReport = await OpenClawAPI.generateSEOReport();
    
    // 生成综合分析报告
    const comprehensiveReport = await OpenClawAPI.executeTask({
        description: 'Generate comprehensive weekly business report',
        agent: 'data_analysis',
        context: {
            action: 'generate_report',
            metrics: metrics.data,
            marketTrends: marketTrends.data.result,
            seoReport: seoReport.data.result
        }
    });
    
    return comprehensiveReport.data.result;
}
```

### 示例5: 实时事件监听

```javascript
// 订阅AI系统事件
const eventSource = OpenClawAPI.subscribeToEvents((event) => {
    switch (event.type) {
        case 'task_completed':
            console.log(`任务 ${event.taskId} 已完成`);
            updateTaskStatus(event.taskId, 'completed');
            break;
        case 'task_failed':
            console.error(`任务 ${event.taskId} 失败:`, event.error);
            updateTaskStatus(event.taskId, 'failed');
            break;
        case 'agent_status_changed':
            console.log(`Agent ${event.agentId} 状态变为 ${event.status}`);
            updateAgentStatus(event.agentId, event.status);
            break;
    }
});

// 断开连接
// eventSource.close();
```

---

## 故障排除

### 常见问题

#### 1. 连接失败

**症状**: API调用返回连接错误

**解决方案**:
```javascript
// 检查网络连接
OpenClawAPI.checkConnection().then(connected => {
    if (!connected) {
        console.error('无法连接到AI服务');
        // 显示用户友好的错误消息
    }
});
```

#### 2. 认证失败

**症状**: 返回401 Unauthorized错误

**解决方案**:
- 检查API密钥是否正确
- 确认API密钥未过期
- 验证请求头中的Authorization格式

#### 3. 任务执行超时

**症状**: 长时间没有收到任务完成通知

**解决方案**:
```javascript
// 设置超时处理
const timeout = setTimeout(() => {
    console.warn('任务执行超时，正在检查状态...');
    OpenClawAPI.getTaskStatus(taskId).then(status => {
        if (status.data.status === 'processing') {
            // 任务仍在执行，继续等待
        } else {
            // 处理其他状态
        }
    });
}, 60000); // 60秒超时
```

#### 4. 速率限制

**症状**: 返回429 Too Many Requests错误

**解决方案**:
- 实现请求队列
- 添加重试逻辑
- 调整请求频率

```javascript
async function makeRequestWithRetry(endpoint, method, data, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await OpenClawAPI.request(endpoint, method, data);
        } catch (error) {
            if (error.status === 429 && i < maxRetries - 1) {
                const delay = Math.pow(2, i) * 1000; // 指数退避
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                throw error;
            }
        }
    }
}
```

### 调试技巧

1. **启用详细日志**:
```yaml
logging:
  level: "DEBUG"
```

2. **检查Agent状态**:
```javascript
const agents = await OpenClawAPI.listAgents();
console.log('可用Agent:', agents);
```

3. **监控任务队列**:
```javascript
// 定期检查任务状态
setInterval(async () => {
    const pendingTasks = await getPendingTasks();
    console.log(`待处理任务数: ${pendingTasks.length}`);
}, 30000);
```

### 联系支持

如遇到无法解决的问题，请联系技术支持团队:
- 邮箱: support@wistailor.com
- 电话: +86-731-8888-8888

---

## 附录

### A. 错误代码表

| 错误代码 | 描述 | 解决方案 |
|---------|------|---------|
| AUTH_001 | API密钥无效 | 检查并更新API密钥 |
| AUTH_002 | IP地址未授权 | 将IP添加到允许列表 |
| RATE_001 | 超出速率限制 | 降低请求频率 |
| TASK_001 | 任务不存在 | 检查任务ID是否正确 |
| TASK_002 | 任务执行失败 | 查看详细错误日志 |
| AGENT_001 | Agent不可用 | 检查Agent状态 |

### B. 状态码说明

| 状态码 | 含义 |
|-------|------|
| 200 | 请求成功 |
| 400 | 请求参数错误 |
| 401 | 认证失败 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 429 | 请求过于频繁 |
| 500 | 服务器内部错误 |

### C. 更新日志

**v1.0.0** (2024-02-15)
- 初始版本发布
- 支持5个专业Agent
- 实现基础API接口
- 添加任务管理和事件订阅功能

---

*文档版本: 1.0.0*
*最后更新: 2024-02-15*
*作者: AI技术团队*
