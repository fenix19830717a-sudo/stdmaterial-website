# Phase 1 - Week 2: 技术栈配置

**阶段**: Phase 1 (项目初始化)  
**周次**: Week 2  
**优先级**: P0 - 关键路径  
**预计工时**: 4 天

---

## 🎯 本周目标

完成核心技术栈的安装和配置，建立现代化的开发和运行环境。

---

## 📋 任务清单

### 任务 2.1: 安装 React 19 + Vite 8

**任务 ID**: PHASE1-W2-T1  
**复杂度**: 中  
**预计时间**: 4 小时

#### 任务描述
配置 React 19 和 Vite 8 开发环境。

#### 实施步骤

**步骤 1: 安装 React 19**
```bash
cd apps/web
pnpm add react@rc react-dom@rc react-router-dom@rc
pnpm add -D @types/react@rc @types/react-dom@rc
```

**步骤 2: 安装 Vite 8**
```bash
pnpm add -D vite@latest @vitejs/plugin-react@latest
```

**步骤 3: 创建 vite.config.ts**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@types': path.resolve(__dirname, './src/types'),
      '@stdmaterial/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@stdmaterial/utils': path.resolve(__dirname, '../../packages/utils/src')
    }
  },
  server: {
    port: 3000,
    host: true,
    open: true
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@stdmaterial/ui']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
});
```

**步骤 4: 创建 index.html**
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Premium Grinding Solutions for Advanced Materials" />
    <meta name="theme-color" content="#0a192f" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>STD Material - Premium Grinding Solutions</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**步骤 5: 创建 src/main.tsx**
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

#### 验收标准
- ✅ React 19 正常运行
- ✅ Vite 8 开发服务器启动
- ✅ HMR 热更新工作正常
- ✅ TypeScript 类型检查通过

---

### 任务 2.2: 配置 Tailwind CSS 4

**任务 ID**: PHASE1-W2-T2  
**复杂度**: 中  
**预计时间**: 6 小时

#### 任务描述
配置 Tailwind CSS 4，建立完整的设计系统基础。

#### 实施步骤

**步骤 1: 安装 Tailwind CSS 4**
```bash
cd apps/web
pnpm add -D tailwindcss@latest postcss@latest autoprefixer@latest
```

**步骤 2: 创建 tailwind.config.js**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      // 色彩系统
      colors: {
        primary: {
          50: '#e6f7ff',
          100: '#b3e0ff',
          200: '#80c9ff',
          300: '#4db2ff',
          400: '#1a9bff',
          500: '#0084ff',
          600: '#0069d9',
          700: '#0052b3',
          800: '#003d8c',
          900: '#00265c'
        },
        navy: {
          DEFAULT: '#0a192f',
          light: '#112240',
          dark: '#020c1b'
        },
        cyan: {
          DEFAULT: '#06b6d2',
          glow: '#06b6d2'
        },
        orange: {
          DEFAULT: '#f97316',
          accent: '#f97316'
        }
      },
      
      // 字体系统
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }]
      },
      
      // 间距系统 (8px baseline)
      spacing: {
        '0': '0',
        '1': '0.25rem',
        '2': '0.5rem',
        '3': '0.75rem',
        '4': '1rem',
        '5': '1.25rem',
        '6': '1.5rem',
        '8': '2rem',
        '10': '2.5rem',
        '12': '3rem',
        '16': '4rem',
        '20': '5rem',
        '24': '6rem',
        '32': '8rem',
        '40': '10rem',
        '48': '12rem',
        '56': '14rem',
        '64': '16rem'
      },
      
      // 阴影系统
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'glow': '0 0 20px rgba(6, 182, 210, 0.3)'
      },
      
      // 圆角系统
      borderRadius: {
        'none': '0',
        'sm': '0.25rem',
        'DEFAULT': '0.5rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        'full': '9999px'
      },
      
      // 动画系统
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'scale-up': 'scaleUp 0.3s ease-out',
        'spin': 'spin 1s linear infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        scaleUp: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        }
      },
      
      // 响应式断点
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px'
      },
      
      // 网格系统
      gridTemplateColumns: {
        '12': 'repeat(12, minmax(0, 1fr))'
      }
    }
  },
  plugins: []
};
```

**步骤 3: 创建 src/styles/index.css**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-white text-navy-dark;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}

@layer components {
  .btn-primary {
    @apply bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-6 rounded-lg transition-all duration-200;
  }
  
  .btn-secondary {
    @apply bg-transparent border-2 border-primary-500 text-primary-500 hover:bg-primary-50 font-medium py-2 px-6 rounded-lg transition-all duration-200;
  }
  
  .card {
    @apply bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200;
  }
}

@layer utilities {
  .text-gradient {
    @apply bg-gradient-to-r from-primary-500 to-cyan-500 bg-clip-text text-transparent;
  }
}
```

#### 验收标准
- ✅ Tailwind CSS 4 正常运行
- ✅ 设计系统配置完整
- ✅ 响应式断点工作正常
- ✅ 动画效果流畅

---

### 任务 2.3: 集成 shadcn/ui 组件库

**任务 ID**: PHASE1-W2-T3  
**复杂度**: 中  
**预计时间**: 4 小时

#### 任务描述
集成 shadcn/ui 组件库，建立基础 UI 组件系统。

#### 实施步骤

**步骤 1: 初始化 shadcn/ui**
```bash
cd apps/web
pnpm dlx shadcn@latest init
```

**步骤 2: 配置 components.json**
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/styles/index.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

**步骤 3: 安装基础组件**
```bash
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add input
pnpm dlx shadcn@latest add card
pnpm dlx shadcn@latest add navigation-menu
pnpm dlx shadcn@latest add sheet
pnpm dlx shadcn@latest add dialog
pnpm dlx shadcn@latest add form
pnpm dlx shadcn@latest add toast
```

**步骤 4: 创建 src/lib/utils.ts**
```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**步骤 5: 安装额外依赖**
```bash
pnpm add clsx tailwind-merge class-variance-authority
pnpm add -D @types/node
```

#### 验收标准
- ✅ shadcn/ui 配置完成
- ✅ 基础组件可用
- ✅ 组件样式正确
- ✅ TypeScript 类型完整

---

### 任务 2.4: 配置 React Router 7

**任务 ID**: PHASE1-W2-T4  
**复杂度**: 中  
**预计时间**: 3 小时

#### 任务描述
配置 React Router 7，实现页面路由系统。

#### 实施步骤

**步骤 1: 创建路由配置文件**
```typescript
// src/app/routes.tsx
import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import HomePage from '../components/pages/HomePage';
import ProductCatalogPage from '../components/pages/ProductCatalogPage';
import ProductDetailPage from '../components/pages/ProductDetailPage';
import AboutPage from '../components/pages/AboutPage';
import NewsPage from '../components/pages/NewsPage';
import NewsDetailPage from '../components/pages/NewsDetailPage';
import ContactPage from '../components/pages/ContactPage';
import NotFoundPage from '../components/pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'products',
        element: <ProductCatalogPage />
      },
      {
        path: 'products/:slug',
        element: <ProductDetailPage />
      },
      {
        path: 'about-us',
        element: <AboutPage />
      },
      {
        path: 'news',
        element: <NewsPage />
      },
      {
        path: 'news/:slug',
        element: <NewsDetailPage />
      },
      {
        path: 'contact',
        element: <ContactPage />
      },
      {
        path: '*',
        element: <NotFoundPage />
      }
    ]
  }
]);
```

**步骤 2: 更新 src/main.tsx**
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/routes';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
```

**步骤 3: 创建路由守卫组件**
```typescript
// src/components/routes/RouteGuard.tsx
import { Navigate, useLocation } from 'react-router-dom';

interface RouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function RouteGuard({ children, requireAuth = false }: RouteGuardProps) {
  const location = useLocation();
  const isAuthenticated = true; // TODO: 实现认证逻辑

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/contact" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
```

#### 验收标准
- ✅ 路由配置正确
- ✅ 页面跳转正常
- ✅ 参数传递正常
- ✅ 404 页面工作正常

---

### 任务 2.5: 设置 MongoDB + Mongoose

**任务 ID**: PHASE1-W2-T5  
**复杂度**: 高  
**预计时间**: 6 小时

#### 任务描述
配置 MongoDB 数据库和 Mongoose ODM。

#### 实施步骤

**步骤 1: 安装依赖**
```bash
cd apps/web
pnpm add mongodb mongoose
pnpm add -D @types/node
```

**步骤 2: 创建数据库连接**
```typescript
// src/lib/database.ts
import mongoose from 'mongoose';

export interface DatabaseConfig {
  uri: string;
  options?: mongoose.ConnectOptions;
}

class Database {
  private static instance: Database;
  private connection: mongoose.Connection | null = null;

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(config: DatabaseConfig): Promise<void> {
    if (this.connection?.readyState === 1) {
      console.log('Database already connected');
      return;
    }

    try {
      this.connection = await mongoose
        .createConnection(config.uri, {
          ...config.options,
          maxPoolSize: 10,
          minPoolSize: 5,
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000
        })
        .asPromise();

      console.log('MongoDB connected successfully');
    } catch (error) {
      console.error('Database connection failed:', error);
      throw error;
    }
  }

  public getConnection(): mongoose.Connection {
    if (!this.connection) {
      throw new Error('Database not connected');
    }
    return this.connection;
  }

  public async disconnect(): Promise<void> {
    if (this.connection) {
      await mongoose.disconnect();
      this.connection = null;
      console.log('Database disconnected');
    }
  }
}

export const db = Database.getInstance();
```

**步骤 3: 创建环境变量配置**
```bash
# .env.example
DATABASE_URL=mongodb://localhost:27017/stdmaterial
NODE_ENV=development
PORT=3000
```

**步骤 4: 创建 TypeScript 类型定义**
```typescript
// src/types/database.ts
export interface ProductDocument extends Document {
  productId: string;
  sku: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  specifications: Record<string, any>;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

#### 验收标准
- ✅ MongoDB 连接成功
- ✅ Mongoose 配置正确
- ✅ 连接池配置优化
- ✅ 错误处理完善

---

### 任务 2.6: 配置 Express 服务器

**任务 ID**: PHASE1-W2-T6  
**复杂度**: 高  
**预计时间**: 6 小时

#### 任务描述
配置 Express 服务器，提供 API 接口和静态文件服务。

#### 实施步骤

**步骤 1: 安装依赖**
```bash
pnpm add express cors helmet compression morgan
pnpm add -D @types/express @types/cors @types/helmet @types/compression @types/morgan
```

**步骤 2: 创建 Express 服务器**
```typescript
// src/server/index.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { db } from '../lib/database';
import { productRoutes } from './routes/products';
import { categoryRoutes } from './routes/categories';
import { inquiryRoutes } from './routes/inquiries';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/inquiries', inquiryRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Database connection and server start
async function startServer() {
  try {
    await db.connect({
      uri: process.env.DATABASE_URL || 'mongodb://localhost:27017/stdmaterial'
    });

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
```

**步骤 3: 创建产品路由**
```typescript
// src/server/routes/products.ts
import { Router } from 'express';
import { Product } from '../models/Product';

export const productRoutes = Router();

// Get all products
productRoutes.get('/', async (req, res) => {
  try {
    const { category, page = 1, limit = 12 } = req.query;
    const query = category ? { category } : {};
    
    const products = await Product.find(query)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));
    
    const total = await Product.countDocuments(query);
    
    res.json({
      data: products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get product by slug
productRoutes.get('/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});
```

**步骤 4: 创建产品模型**
```typescript
// src/server/models/Product.ts
import mongoose from 'mongoose';
import { ProductDocument } from '../../types/database';

const productSchema = new mongoose.Schema<ProductDocument>({
  productId: {
    type: String,
    required: true,
    unique: true,
    match: /^PROD-\d{5}$/
  },
  sku: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    ref: 'Category'
  },
  specifications: {
    type: Object,
    default: {}
  },
  images: [{
    type: String
  }],
  applications: [{
    type: String
  }]
}, {
  timestamps: true
});

// Indexes
productSchema.index({ slug: 1 });
productSchema.index({ category: 1 });
productSchema.index({ name: 'text' });

export const Product = mongoose.model<ProductDocument>('Product', productSchema);
```

#### 验收标准
- ✅ Express 服务器启动成功
- ✅ API 路由配置正确
- ✅ 中间件工作正常
- ✅ 数据库连接正常
- ✅ 错误处理完善

---

## 🎯 本周交付物

1. ✅ React 19 + Vite 8 开发环境
2. ✅ Tailwind CSS 4 设计系统
3. ✅ shadcn/ui 组件库集成
4. ✅ React Router 7 路由系统
5. ✅ MongoDB + Mongoose 数据库
6. ✅ Express API 服务器

---

## ⚠️ 关键约束

### 全英文网站约束
- ✅ 所有 API 响应使用英文
- ✅ 所有错误信息使用英文
- ✅ 所有数据库字段使用英文
- ✅ 所有注释使用英文

### 产品 ID 分离约束
- ✅ Product 模型必须包含 productId、sku、name 三个独立字段
- ✅ 每个字段有明确的用途说明
- ✅ 数据库索引正确配置

### SEO 优化约束
- ✅ 页面 Title 和 Description 配置
- ✅ 语义化 HTML 标签
- ✅ Meta 标签完整

---

## 📚 参考文档

- [React 19](https://react.dev/)
- [Vite 8](https://vitejs.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [React Router 7](https://reactrouter.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [Express](https://expressjs.com/)

---

**文档维护**: 技术部  
**最后更新**: 2026-03-21
