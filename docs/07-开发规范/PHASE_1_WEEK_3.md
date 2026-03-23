# Phase 1 - Week 3: 开发环境完善

**阶段**: Phase 1 (项目初始化)  
**周次**: Week 3  
**优先级**: P0 - 关键路径  
**预计工时**: 4 天

---

## 🎯 本周目标

完善开发环境配置，提升开发效率和代码质量。

---

## 📋 任务清单

### 任务 3.1: 配置环境变量管理

**任务 ID**: PHASE1-W3-T1  
**复杂度**: 低  
**预计时间**: 2 小时

#### 任务描述
配置多环境变量管理系统。

#### 实施步骤

**步骤 1: 创建环境文件模板**
```bash
# .env.example
# Database
DATABASE_URL=mongodb://localhost:27017/stdmaterial

# Server
PORT=3001
NODE_ENV=development

# API
API_BASE_URL=http://localhost:3001/api

# Frontend
VITE_API_URL=http://localhost:3001/api
VITE_APP_TITLE=STD Material
VITE_APP_DESCRIPTION=Premium Grinding Solutions

# Third-party services
GOOGLE_ANALYTICS_ID=
SENDGRID_API_KEY=
```

**步骤 2: 创建环境配置加载器**
```typescript
// src/lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.string().default('3001'),
  NODE_ENV: z.enum(['development', 'production', 'test']),
  API_BASE_URL: z.string().url(),
  VITE_API_URL: z.string().url(),
  VITE_APP_TITLE: z.string(),
  VITE_APP_DESCRIPTION: z.string(),
  GOOGLE_ANALYTICS_ID: z.string().optional(),
  SENDGRID_API_KEY: z.string().optional()
});

export const env = envSchema.parse(process.env);
```

**步骤 3: 安装 zod**
```bash
pnpm add zod
```

#### 验收标准
- ✅ 环境变量验证工作正常
- ✅ 多环境配置分离
- ✅ 类型安全的环境变量访问

---

### 任务 3.2: 设置 Docker 开发环境

**任务 ID**: PHASE1-W3-T2  
**复杂度**: 中  
**预计时间**: 6 小时

#### 任务描述
配置 Docker 容器化开发环境。

#### 实施步骤

**步骤 1: 创建 Dockerfile**
```dockerfile
# apps/web/Dockerfile
FROM node:20-alpine AS base

# Development stage
FROM base AS dev
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
COPY packages/*/package.json ./packages/
RUN pnpm install --frozen-lockfile
COPY . .
EXPOSE 3000
CMD ["pnpm", "dev"]

# Build stage
FROM base AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
COPY packages/*/package.json ./packages/
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# Production stage
FROM base AS production
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
COPY packages/*/package.json ./packages/
RUN pnpm install --prod --frozen-lockfile
COPY --from=builder /app/apps/web/dist ./dist
EXPOSE 3000
CMD ["node", "dist/server/index.js"]
```

**步骤 2: 创建 docker-compose.yml**
```yaml
version: '3.8'

services:
  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
      target: dev
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - DATABASE_URL=mongodb://mongodb:27017/stdmaterial
    depends_on:
      - mongodb

  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
      target: dev
    ports:
      - "3001:3001"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - DATABASE_URL=mongodb://mongodb:27017/stdmaterial
    depends_on:
      - mongodb

  mongodb:
    image: mongo:8
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      - MONGO_INITDB_DATABASE=stdmaterial

volumes:
  mongodb_data:
```

**步骤 3: 创建 .dockerignore**
```
node_modules
dist
*.local
.git
.gitignore
README.md
.env
.env.*
! .env.example
```

#### 验收标准
- ✅ Docker 容器启动正常
- ✅ 热更新工作正常
- ✅ 数据库连接正常
- ✅ 多容器协作正常

---

### 任务 3.3: 配置热更新 (HMR)

**任务 ID**: PHASE1-W3-T3  
**复杂度**: 低  
**预计时间**: 2 小时

#### 任务描述
配置 Vite 热模块替换功能。

#### 实施步骤

**步骤 1: 配置 vite.config.ts**
```typescript
export default defineConfig({
  server: {
    port: 3000,
    host: true,
    open: true,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 3000
    }
  },
  plugins: [
    react({
      include: '**/*.tsx',
      babel: {
        plugins: [
          ['babel-plugin-react-compiler', {}]
        ]
      }
    })
  ]
});
```

**步骤 2: 安装 React Compiler**
```bash
pnpm add -D babel-plugin-react-compiler
```

#### 验收标准
- ✅ 代码修改立即生效
- ✅ 状态保持正常
- ✅ 无页面刷新

---

### 任务 3.4: 建立 Mock 数据系统

**任务 ID**: PHASE1-W3-T4  
**复杂度**: 中  
**预计时间**: 4 小时

#### 任务描述
创建 Mock 数据系统，支持前端独立开发。

#### 实施步骤

**步骤 1: 创建 Mock 数据生成器**
```typescript
// tools/scripts/generate-mock-data.ts
import { faker } from '@faker-js/faker';

export function generateProducts(count: number = 50) {
  const products = [];
  
  for (let i = 1; i <= count; i++) {
    products.push({
      productId: `PROD-${String(i).padStart(5, '0')}`,
      sku: `${faker.helpers.arrayElement(['PM', 'JM', 'BM'])}-${faker.number.int({ min: 100, max: 999 })}-${faker.helpers.arrayElement(['STD', 'PRO', 'ULTRA'])}`,
      name: `${faker.helpers.arrayElement(['Planetary Ball Mill', 'Jet Mill', 'Bead Mill'])} ${faker.helpers.arrayElement(['PM', 'JM', 'BM'])}-${faker.number.int({ min: 100, max: 999 })}`,
      slug: faker.helpers.slugify(`product-${i}`),
      description: faker.commerce.productDescription(),
      category: faker.helpers.arrayElement(['Grinding Equipment', 'Grinding Media', 'Grinding Jars']),
      specifications: {
        power: faker.helpers.arrayElement(['1.5kW', '2.2kW', '3.0kW', '4.0kW']),
        speed: faker.helpers.arrayElement(['500rpm', '800rpm', '1200rpm', '2000rpm']),
        capacity: faker.helpers.arrayElement(['4x500ml', '4x1000ml', '2x2000ml'])
      },
      images: [
        faker.image.url({ width: 800, height: 800 }),
        faker.image.url({ width: 800, height: 800 })
      ],
      applications: [
        'Mining',
        'Ceramics',
        'Chemicals',
        'Pharmaceuticals'
      ]
    });
  }
  
  return products;
}

// Generate and save
const products = generateProducts(50);
console.log(JSON.stringify(products, null, 2));
```

**步骤 2: 安装 faker**
```bash
pnpm add -D @faker-js/faker
```

**步骤 3: 创建 Mock API 中间件**
```typescript
// src/server/middleware/mock.ts
import { RequestHandler } from 'express';
import { generateProducts } from '../../../tools/scripts/generate-mock-data';

const mockProducts = generateProducts(50);

export const mockMiddleware: RequestHandler = (req, res, next) => {
  if (process.env.USE_MOCK === 'true') {
    // Return mock data
    res.json({ data: mockProducts });
  } else {
    next();
  }
};
```

#### 验收标准
- ✅ Mock 数据生成正常
- ✅ Mock API 工作正常
- ✅ 数据格式符合预期

---

### 任务 3.5: 配置路径别名

**任务 ID**: PHASE1-W3-T5  
**复杂度**: 低  
**预计时间**: 2 小时

#### 任务描述
配置统一的导入路径别名系统。

#### 实施步骤

**步骤 1: 配置 vite.config.ts**
```typescript
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@types': path.resolve(__dirname, './src/types'),
      '@ui': path.resolve(__dirname, '../../packages/ui/src')
    }
  }
});
```

**步骤 2: 配置 tsconfig.json**
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@lib/*": ["./src/lib/*"],
      "@styles/*": ["./src/styles/*"],
      "@types/*": ["./src/types/*"],
      "@ui/*": ["../../packages/ui/src/*"]
    }
  }
}
```

#### 验收标准
- ✅ 路径别名解析正常
- ✅ TypeScript 类型提示正常
- ✅ 构建后路径正确

---

## 🎯 本周交付物

1. ✅ 多环境变量管理系统
2. ✅ Docker 容器化开发环境
3. ✅ Vite HMR 热更新
4. ✅ Mock 数据系统
5. ✅ 统一路径别名系统

---

## ⚠️ 关键约束

### 全英文网站约束
- ✅ 所有环境变量名使用英文大写
- ✅ 所有注释使用英文
- ✅ Mock 数据内容使用英文

### SEO 优化约束
- ✅ 环境变量包含 SEO 配置项
- ✅ 支持多环境 SEO 配置

---

## 📚 参考文档

- [Zod](https://zod.dev/)
- [Docker](https://www.docker.com/)
- [Vite HMR](https://vitejs.dev/guide/features.html#hot-module-replacement)
- [Faker.js](https://fakerjs.dev/)

---

**文档维护**: 技术部  
**最后更新**: 2026-03-21
