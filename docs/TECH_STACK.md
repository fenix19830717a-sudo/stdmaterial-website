# 技术栈说明文档

## 修订历史

| 版本 | 日期 | 作者 | 变更说明 |
|------|------|------|----------|
| 1.0 | 2026-03-21 | 技术部 | 初始版本，记录当前技术栈 |

## 1. 概述

本文档详细记录湖南盛通达材料科技官网使用的全部技术栈，包括前端、后端、开发工具、第三方服务等。

## 2. 前端技术栈

### 2.1 核心框架

#### React 19.2.4
- **用途**: 前端 UI 框架
- **位置**: 主站前端 + 管理后台
- **特性**: 
  - Hooks API
  - Context API
  - Concurrent Features
  - Server Components (部分使用)

```json
{
  "react": "^19.2.4",
  "react-dom": "^19.2.4"
}
```

#### TypeScript 5.9.3
- **用途**: 类型系统
- **配置**: 严格模式
- **覆盖范围**: 主站源码 + 管理后台

```json
{
  "typescript": "^5.9.3",
  "@types/react": "^19.2.14",
  "@types/react-dom": "^19.2.3"
}
```

### 2.2 路由管理

#### React Router DOM 7.13.1
- **用途**: 客户端路由
- **模式**: Hash Router + Browser Router
- **特性**:
  - 嵌套路由
  - 路由守卫
  - 懒加载

```json
{
  "react-router-dom": "^7.13.1"
}
```

### 2.3 样式方案

#### TailwindCSS 4.2.1
- **用途**: 原子化 CSS 框架
- **配置**: 
  - 自定义主题
  - 响应式断点
  - 深色模式支持

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'deep-navy': '#0a192f',
        'primary': '#06b6d2',
        'secondary': '#f97316',
        'success': '#22c55e',
      }
    }
  }
}
```

#### shadcn-ui
- **用途**: UI 组件库
- **特点**: 
  - 基于 TailwindCSS
  - 可定制组件
  - 无障碍访问支持

#### PostCSS 8.5.8
- **用途**: CSS 后处理
- **插件**:
  - Autoprefixer
  - TailwindCSS

```json
{
  "postcss": "^8.5.8",
  "autoprefixer": "^10.4.27",
  "@tailwindcss/postcss": "^4.2.1"
}
```

### 2.4 构建工具

#### Vite 8.0.0
- **用途**: 前端构建工具
- **特性**:
  - 热模块替换 (HMR)
  - 快速冷启动
  - 优化的构建性能
- **配置**:
  - React 插件
  - TailwindCSS 插件
  - 路径别名

```javascript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
```

```json
{
  "vite": "^8.0.0",
  "@vitejs/plugin-react": "^6.0.1",
  "@tailwindcss/vite": "^4.2.2"
}
```

### 2.5 状态管理

#### React Context API
- **用途**: 全局状态管理
- **使用场景**:
  - 用户认证状态
  - 主题配置
  - 语言设置

#### LocalStorage
- **用途**: 本地持久化
- **存储内容**:
  - 用户偏好设置
  - 缓存数据
  - 会话信息

### 2.6 数据请求

#### Axios 1.13.6
- **用途**: HTTP 客户端
- **特性**:
  - 拦截器
  - 请求取消
  - 自动 JSON 转换

```json
{
  "axios": "^1.13.6"
}
```

### 2.7 图表库

#### Chart.js 4.5.1
- **用途**: 数据可视化
- **使用场景**:
  - 管理后台数据统计
  - 报表展示

```json
{
  "chart.js": "^4.5.1"
}
```

### 2.8 图标库

#### Material Icons
- **用途**: 图标系统
- **引入方式**: Google Fonts CDN
- **使用示例**:
```html
<span class="material-symbols-outlined">search</span>
```

## 3. 后端技术栈

### 3.1 运行时环境

#### Node.js
- **版本**: 18.x LTS (推荐)
- **包管理**: npm
- **模块系统**: ES Modules

### 3.2 Web 框架

#### Express.js 5.2.1
- **用途**: Web 应用框架
- **特性**:
  - 中间件系统
  - 路由系统
  - 请求/响应处理

```json
{
  "express": "^5.2.1"
}
```

#### Body Parser 2.2.2
- **用途**: 请求体解析
- **支持格式**:
  - JSON
  - URL-encoded
  - Text

```json
{
  "body-parser": "^2.2.2"
}
```

#### CORS 2.8.6
- **用途**: 跨域资源共享
- **配置**: 允许特定域名访问

```json
{
  "cors": "^2.8.6"
}
```

### 3.3 数据库

#### MongoDB 8.0.0
- **类型**: NoSQL 文档数据库
- **用途**: 主数据库
- **特性**:
  - 文档存储
  - 灵活 Schema
  - 水平扩展

```json
{
  "mongoose": "^8.0.0"
}
```

#### Mongoose 8.0.0
- **用途**: MongoDB ODM
- **功能**:
  - Schema 定义
  - 数据验证
  - 查询构建器
  - 中间件钩子

**数据模型示例**:
```javascript
// src/models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  specifications: {
    type: Object,
    default: {}
  },
  images: [{
    type: String
  }],
  price: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('Product', productSchema);
```

### 3.4 认证授权

#### JWT (计划引入)
- **用途**: Token 认证
- **实现**: 
  - 登录获取 Token
  - 请求携带 Token
  - 中间件验证

#### Session (当前使用)
- **用途**: 会话管理
- **存储**: 内存/Redis

### 3.5 文件处理

#### Sharp 0.32.0
- **用途**: 图片处理
- **功能**:
  - 图片压缩
  - 格式转换
  - 尺寸调整
  - 水印添加

```json
{
  "sharp": "^0.32.0"
}
```

### 3.6 网络爬虫

#### Puppeteer 20.0.0
- **用途**: 无头浏览器
- **使用场景**:
  - 页面截图
  - 数据抓取
  - 自动化测试

```json
{
  "puppeteer": "^20.0.0"
}
```

## 4. 开发工具

### 4.1 代码质量

#### ESLint (管理后台)
- **用途**: 代码检查
- **配置**:
  - TypeScript 支持
  - React Hooks 规则
  - 自定义规则

```json
{
  "eslint": "^8.45.0",
  "@typescript-eslint/eslint-plugin": "^6.0.0",
  "@typescript-eslint/parser": "^6.0.0",
  "eslint-plugin-react-hooks": "^4.6.0",
  "eslint-plugin-react-refresh": "^0.4.3"
}
```

#### TypeScript
- **用途**: 类型检查
- **配置**: 严格模式
- **tsconfig.json**:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "strict": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### 4.2 测试框架

#### Jest 30.3.0
- **用途**: 单元测试和集成测试
- **配置**:
  - JSDOM 环境
  - Babel 转换
  - 覆盖率报告

```json
{
  "jest": "^30.3.0",
  "jest-environment-jsdom": "^30.3.0",
  "babel-jest": "^30.3.0"
}
```

**测试配置**:
```javascript
// jest.config.cjs
export default {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'
  },
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts'
  ]
};
```

#### Babel 7.29.0
- **用途**: JavaScript 编译器
- **预设**:
  - @babel/preset-env
  - @babel/preset-react
  - @babel/preset-typescript

```json
{
  "@babel/core": "^7.29.0",
  "@babel/preset-env": "^7.29.2"
}
```

### 4.3 开发服务器

#### Vite Dev Server
- **用途**: 开发环境服务器
- **特性**:
  - 热更新
  - 代理配置
  - 错误覆盖

#### http-server 14.1.1
- **用途**: 静态文件服务器
- **使用场景**: 
  - 生产构建预览
  - 简单文件服务

```json
{
  "http-server": "^14.1.1"
}
```

## 5. 第三方服务

### 5.1 分析统计

#### Google Analytics
- **用途**: 网站流量分析
- **集成方式**: gtag.js
- **跟踪内容**:
  - 页面访问
  - 用户行为
  - 转化事件

### 5.2 搜索引擎

#### Google Search Console
- **用途**: SEO 监控
- **功能**:
  - 索引状态
  - 搜索表现
  - 错误检测

### 5.3 地图服务 (计划)
- **候选**: Google Maps / 高德地图
- **用途**: 公司地址展示

## 6. 部署工具

### 6.1 进程管理

#### PM2 (推荐)
- **用途**: Node.js 进程管理
- **特性**:
  - 自动重启
  - 日志管理
  - 集群模式
  - 性能监控

**配置文件**:
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'stdmaterial-api',
    script: './src/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
};
```

### 6.2 Web 服务器

#### Nginx
- **用途**: 反向代理 + 静态文件服务
- **配置要点**:
  - HTTPS 配置
  - Gzip 压缩
  - 缓存策略
  - 负载均衡

**配置示例**:
```nginx
server {
    listen 80;
    server_name stdmaterial.com;
    
    # 前端静态文件
    location / {
        root /var/www/html/stdmaterial.com/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # API 代理
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # 管理后台
    location /admin {
        root /var/www/html/stdmaterial.com/admin/dist;
        try_files $uri $uri/ /admin/index.html;
    }
}
```

## 7. 浏览器支持

### 7.1 目标浏览器

根据 browserslist 配置:

```json
{
  "browserslist": [
    ">0.2%",
    "not dead",
    "not op_mini all",
    "last 2 versions"
  ]
}
```

### 7.2 支持列表

- **Chrome**: 最新 2 个版本
- **Firefox**: 最新 2 个版本
- **Safari**: 最新 2 个版本
- **Edge**: 最新 2 个版本
- **Mobile**: iOS Safari, Chrome Mobile

## 8. 技术选型理由

### 8.1 为什么选择 React?

1. **生态系统**: 丰富的第三方库和组件
2. **性能**: Virtual DOM 优化渲染
3. **可维护性**: 组件化开发模式
4. **团队熟悉度**: 团队成员有丰富经验
5. **就业市场**: 易于招聘相关人才

### 8.2 为什么选择 MongoDB?

1. **灵活性**: Schema-less 适合快速迭代
2. **性能**: 高读写性能
3. **扩展性**: 天然支持水平扩展
4. **JSON 友好**: 与 JavaScript 无缝集成

### 8.3 为什么选择 Vite?

1. **速度**: 基于 ESM 的极速启动
2. **HMR**: 热更新体验优秀
3. **配置简单**: 开箱即用
4. **生产优化**: Rollup 构建优化

### 8.4 为什么选择 TailwindCSS?

1. **开发效率**: 原子化类名快速开发
2. **一致性**: 设计系统内置
3. **性能**: PurgeCSS 自动移除未使用样式
4. **可定制**: 主题配置灵活

## 9. 技术债务与升级计划

### 9.1 当前技术债务

1. **混合技术栈**: 
   - 问题：原生 JavaScript 和 React 并存
   - 影响：维护成本高，代码风格不统一
   - 解决：逐步迁移到纯 React

2. **类型覆盖不足**:
   - 问题：部分代码缺少 TypeScript 类型定义
   - 影响：运行时错误风险
   - 解决：逐步补充类型定义

3. **测试覆盖率低**:
   - 问题：测试用例不足
   - 影响：重构风险高
   - 解决：制定测试覆盖率目标

### 9.2 升级计划

#### 短期 (1-3 个月)
- [ ] 统一代码风格 (Prettier + ESLint)
- [ ] 提升测试覆盖率到 60%
- [ ] 完成剩余原生 JS 代码的 React 迁移

#### 中期 (3-6 个月)
- [ ] 引入 JWT 认证
- [ ] 实现完整的 TypeScript 覆盖
- [ ] 引入 Redis 缓存层

#### 长期 (6-12 个月)
- [ ] 考虑迁移到 Next.js 实现 SSR
- [ ] 引入 GraphQL API
- [ ] 实现微前端架构

## 10. 依赖管理

### 10.1 版本控制策略

- **生产依赖**: 锁定主版本 (^x.y.z)
- **开发依赖**: 锁定次版本 (~x.y.z)
- **关键依赖**: 锁定确切版本 (x.y.z)

### 10.2 依赖更新流程

1. **定期检查**: 使用 `npm outdated` 检查可更新依赖
2. **评估影响**: 查看变更日志和破坏性更新
3. **测试验证**: 在开发环境测试更新
4. **逐步部署**: 先部署到测试环境验证

### 10.3 安全更新

- 启用 npm audit 自动检查
- 关键安全漏洞 24 小时内修复
- 定期执行 `npm audit fix`

## 11. 开发环境要求

### 11.1 系统要求

- **操作系统**: macOS / Linux / Windows 10+
- **Node.js**: 18.x LTS
- **npm**: 9.x+
- **内存**: 最低 8GB，推荐 16GB

### 11.2 必需软件

- **Git**: 版本控制
- **VS Code**: 推荐编辑器
- **MongoDB**: 本地开发数据库 (或使用 Docker)

### 11.3 推荐扩展

- **ESLint**: 代码检查
- **Prettier**: 代码格式化
- **GitLens**: Git 增强
- **Thunder Client**: API 测试

---

**文档维护**: 技术部  
**最后更新**: 2026-03-21  
**下次审查**: 2026-06-21
