# 研磨设备B2B独立站 (PrecisionGrind)

## 项目概述

这是一个完整的、可直接使用的B2B独立站系统，专门用于销售研磨设备和相关产品。系统包含前端采购商视角的所有页面和后端运营人员视角的所有功能模块。

## 项目结构

```
独立站代码实现/
├── index.html                    # 首页（完善）
├── product-catalog.html          # 产品目录（20个产品）
├── product-planetary-mill.html   # 产品详情页
├── about.html                    # 关于我们
├── contact.html                  # 联系我们
├── news.html                     # 新闻/资讯页（新建）
├── order-tracking.html           # 订单查询页（新建）
├── login.html                    # 登录/注册页（新建）
├── admin/
│   ├── login.html               # 管理后台登录
│   ├── dashboard.html           # 管理后台仪表盘
│   ├── products.html            # 产品管理（新建）
│   └── inquiries.html           # 询盘管理（新建）
├── assets/
│   ├── css/
│   │   ├── main.css            # 主样式文件
│   │   ├── animations.css      # 动画样式
│   │   └── admin.css           # 管理后台样式
│   └── js/
│       ├── main.js             # 主JavaScript文件
│       ├── products.js         # 产品相关功能
│       ├── admin.js            # 管理后台功能
│       └── openclaw-api.js     # OpenClaw API集成
├── data/
│   ├── products.json            # 产品数据库（20个产品）
│   ├── customers.json           # 客户数据库（10个客户）
│   ├── orders.json              # 订单数据库（5个订单）
│   └── inquiries.json           # 询盘数据库（8个询盘）
├── openclaw/
│   ├── config/
│   │   ├── config.yaml         # OpenClaw主配置
│   │   ├── agents.yaml         # AI Agent团队配置
│   │   └── skills.yaml         # 技能配置
│   ├── shared-context/
│   │   └── priorities.md       # 任务优先级
│   ├── MEMORY.md               # 长期记忆
│   └── SOUL.md                 # AI性格配置
├── docker-compose.yml           # Docker配置
├── nginx.conf                   # Nginx配置
├── deploy.sh                    # 部署脚本
└── README.md                    # 项目说明
```

## 前端页面（采购商视角）

### 1. 首页 (index.html)
- ✅ 品牌logo和导航
- ✅ 多语言/货币切换按钮
- ✅ 全局搜索框
- ✅ 登录/注册入口
- ✅ 在线聊天入口
- ✅ 品牌Banner展示
- ✅ 产品展示区域
- ✅ 企业亮点模块（工厂实景、资质证书、客户logo墙）
- ✅ 完整的底部信息

### 2. 产品搜索/列表页 (product-catalog.html)
- ✅ 产品分类筛选栏
- ✅ 价格区间筛选
- ✅ 产品卡片（高清图、名称、规格、起订量、FOB价格）
- ✅ 关键词搜索功能
- ✅ 分页功能

### 3. 产品详情页 (product-planetary-mill.html)
- ✅ 产品高清图展示
- ✅ 详细规格参数
- ✅ 交易信息（MOQ、价格）
- ✅ 询盘表单
- ✅ 产品说明书下载

### 4. 企业介绍页 (about.html)
- ✅ 企业历程
- ✅ 工厂展示
- ✅ 团队与资质
- ✅ 合作案例

### 5. 新闻/资讯页 (news.html) - 新建
- ✅ 行业动态
- ✅ 企业动态
- ✅ 采购指南
- ✅ 分类筛选
- ✅ 订阅功能

### 6. 联系我们页 (contact.html)
- ✅ 企业信息
- ✅ 在线聊天入口
- ✅ 询盘表单

### 7. 订单查询页 (order-tracking.html) - 新建
- ✅ 订单号查询
- ✅ 订单状态展示
- ✅ 物流信息跟踪
- ✅ 订单详情

### 8. 登录/注册页 (login.html) - 新建
- ✅ 登录表单
- ✅ 注册表单
- ✅ 社交媒体登录
- ✅ 注册权益说明

## 后端功能（运营人员视角）

### 1. 产品管理 (admin/products.html) - 新建
- ✅ 产品列表展示
- ✅ 添加/编辑产品
- ✅ 批量导入（CSV）
- ✅ 分类与标签管理
- ✅ 库存状态管理
- ✅ 素材上传

### 2. 询盘管理 (admin/inquiries.html) - 新建
- ✅ 询盘列表
- ✅ 询盘详情查看
- ✅ 询盘回复
- ✅ 回复模板
- ✅ 状态更新
- ✅ 分配业务员
- ✅ 导出功能

### 3. 仪表盘 (admin/dashboard.html)
- ✅ 业务数据概览
- ✅ 订单统计
- ✅ 客户统计
- ✅ 收入统计
- ✅ AI服务状态

### 4. 其他管理功能
- 📝 订单管理（待完善）
- 📝 客户管理（待完善）
- 📝 营销管理（待完善）
- 📝 数据统计（待完善）
- 📝 系统设置（待完善）

## OpenClaw AI Agent团队

### 组织架构
- **主Agent**: 运营总监，协调所有任务
- **产品运营Agent**: 产品管理、内容生成
- **营销推广Agent**: 内容创作、SEO优化
- **客户服务Agent**: 询盘处理、客户跟进
- **数据分析Agent**: 数据分析、报告生成
- **技术支持Agent**: 技术文档、系统集成

### 配置文件
- `openclaw/config/config.yaml`: 主配置
- `openclaw/config/agents.yaml`: Agent团队配置
- `openclaw/config/skills.yaml`: 技能配置
- `openclaw/MEMORY.md`: 长期记忆
- `openclaw/SOUL.md`: AI性格配置

## 产品数据

系统包含20个完整的研磨设备产品：

### 研磨罐 (12个)
- 氧化铝陶瓷研磨罐
- 不锈钢研磨罐
- 氧化锆研磨罐
- 尼龙研磨罐
- 碳化钨研磨罐
- PU研磨罐
- 玛瑙研磨罐
- PTFE研磨罐
- 钛合金研磨罐
- 氮化硅研磨罐
- HDPE研磨罐
- 哈氏合金研磨罐

### 研磨介质 (4个)
- 氧化铝研磨介质
- 氧化锆研磨介质
- 不锈钢研磨介质
- 碳化钨研磨介质

### 研磨设备 (3个)
- 行星球磨机
- 振动磨机
- 辊磨机

### 配件 (1个)
- 研磨罐配件套件

## 技术栈

- **前端**: HTML5 + Tailwind CSS + JavaScript
- **数据存储**: JSON文件
- **AI集成**: OpenClaw API
- **部署**: Docker + Nginx

## 快速开始

### 本地开发

1. 进入项目目录
```bash
cd 独立站代码实现
```

2. 启动本地服务器
```bash
python -m http.server 8000
```

3. 访问网站
- 前端首页: http://localhost:8000
- 产品目录: http://localhost:8000/product-catalog.html
- 新闻资讯: http://localhost:8000/news.html
- 订单查询: http://localhost:8000/order-tracking.html
- 登录注册: http://localhost:8000/login.html
- 管理后台: http://localhost:8000/admin/login.html

### 管理后台登录

- **用户名**: admin
- **密码**: admin123

## 部署到服务器

### 使用部署脚本

```bash
chmod +x deploy.sh
./deploy.sh
```

### 手动部署

1. 安装Docker和Docker Compose
2. 复制项目文件到服务器
3. 运行 `docker-compose up -d`
4. 配置Nginx反向代理

## 功能完成状态

| 功能模块 | 状态 |
|---------|------|
| 首页 | ✅ 完成 |
| 产品目录 | ✅ 完成 |
| 产品详情 | ✅ 完成 |
| 企业介绍 | ✅ 完成 |
| 新闻资讯 | ✅ 完成 |
| 联系我们 | ✅ 完成 |
| 订单查询 | ✅ 完成 |
| 登录注册 | ✅ 完成 |
| 产品管理 | ✅ 完成 |
| 询盘管理 | ✅ 完成 |
| 订单管理 | 📝 待完善 |
| 客户管理 | 📝 待完善 |
| 营销管理 | 📝 待完善 |
| 数据统计 | 📝 待完善 |
| 系统设置 | 📝 待完善 |
| OpenClaw集成 | ✅ 完成 |

## 后续扩展

1. **数据库集成**: 将JSON文件迁移到MySQL/MongoDB
2. **支付集成**: 集成支付网关
3. **多语言**: 完善多语言支持
4. **移动应用**: 开发移动端应用
5. **完善后端**: 完成剩余的管理功能模块

## 联系方式

- **邮箱**: sales@precisiongrind.com
- **电话**: +1 (800) 555-0199

---

© 2024 PrecisionGrind Inc. All Rights Reserved.
