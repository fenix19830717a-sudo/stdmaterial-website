# 湖南盛通达材料科技官网 - 架构设计文档

> **版本**: 2.0  
> **最后更新**: 2026-03-21  
> **状态**: 重构规划中  
> **关联项目**: BuildAI Framework - WebsiteTemplate

---

## 1. 架构愿景

### 1.1 项目定位

湖南盛通达材料科技官网是一个**现代化的 B2B 企业网站**，专注于研磨设备、研磨介质和研磨罐等实验室材料处理设备的展示与销售。

**核心目标**：
- 🎯 打造行业领先的 B2B 企业网站标杆
- 🚀 提供卓越的用户体验和性能表现
- 🤖 集成 AI 能力实现智能推荐和客服
- 🌍 支持多语言全球化业务
- 📱 完全响应式设计，适配所有设备

### 1.2 设计原则

1. **组件化优先**: 所有 UI 元素都是可复用的组件
2. **TypeScript 优先**: 100% TypeScript 覆盖，类型安全
3. **性能优先**: Lighthouse Performance 评分 90+
4. **可访问性**: WCAG 2.1 AA 标准
5. **SEO 优化**: 语义化 HTML，结构化数据
6. **渐进增强**: 核心功能无需 JavaScript

---

## 2. 整体架构

### 2.1 架构分层

```
┌─────────────────────────────────────────┐
│         用户层 (User Layer)              │
│   PC + Mobile + Tablet + Search Engine  │
└─────────────────────────────────────────┘
                    │ HTTPS
┌─────────────────────────────────────────┐
│        表现层 (Presentation Layer)       │
│  ┌─────────────────────────────────┐    │
│  │  React 19 + TypeScript          │    │
│  │  ┌──────────┐  ┌──────────┐    │    │
│  │  │  Pages   │  │  Layouts │    │    │
│  │  └──────────┘  └──────────┘    │    │
│  │  ┌──────────┐  ┌──────────┐    │    │
│  │  │Organisms │  │ Molecules│    │    │
│  │  └──────────┘  └──────────┘    │    │
│  │  ┌──────────────────────────┐  │    │
│  │  │      Atoms (基础组件)     │  │    │
│  │  └──────────────────────────┘  │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
                    │ HTTP/HTTPS
┌─────────────────────────────────────────┐
│       网关层 (API Gateway Layer)         │
│  ┌─────────────────────────────────┐    │
│  │  Express.js + Nginx             │    │
│  │  - 反向代理                     │    │
│  │  - 负载均衡                     │    │
│  │  - 限流熔断                     │    │
│  │  - JWT 认证                     │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
                    │ HTTP/JSON
┌─────────────────────────────────────────┐
│        应用层 (Application Layer)        │
│  ┌─────────────────────────────────┐    │
│  │  Express.js Application         │    │
│  │  ┌──────────┐  ┌──────────┐    │    │
│  │  │  Routes  │  │Controllers│    │    │
│  │  └──────────┘  └──────────┘    │    │
│  │  ┌──────────┐  ┌──────────┐    │    │
│  │  │ Services │  │  Models  │    │    │
│  │  └──────────┘  └──────────┘    │    │
│  │  ┌──────────┐  ┌──────────┐    │    │
│  │  │  Events  │  │   Jobs   │    │    │
│  │  └──────────┘  └──────────┘    │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│         数据层 (Data Layer)              │
│  ┌──────────┐  ┌──────────┐            │
│  │ MongoDB  │  │  Redis   │            │
│  │ (主数据库)│  │  (缓存)  │            │
│  └──────────┘  └──────────┘            │
│  ┌──────────┐  ┌──────────┐            │
│  │  MinIO   │  │  Logs    │            │
│  │(文件存储)│  │ (日志)   │            │
│  └──────────┘  └──────────┘            │
└─────────────────────────────────────────┘
```

### 2.2 目录结构

```
stdmaterial.com/
├── apps/
│   ├── web/                          # 主网站应用
│   │   ├── src/
│   │   │   ├── components/           # React 组件
│   │   │   │   ├── atoms/           # 基础组件 (Button, Input 等)
│   │   │   │   ├── molecules/       # 组合组件 (ProductCard 等)
│   │   │   │   ├── organisms/       # 功能模块 (ProductList 等)
│   │   │   │   └── layouts/         # 布局组件 (Header, Footer)
│   │   │   ├── pages/               # 页面组件
│   │   │   ├── hooks/               # 自定义 Hooks
│   │   │   ├── utils/               # 工具函数
│   │   │   ├── types/               # TypeScript 类型
│   │   │   ├── constants/           # 常量定义
│   │   │   └── data/                # 静态数据
│   │   ├── public/                  # 静态资源
│   │   ├── tests/                   # 测试文件
│   │   └── package.json
│   │
│   └── admin/                        # 管理后台应用
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── hooks/
│       │   └── utils/
│       ├── public/
│       └── package.json
│
├── packages/
│   ├── ui/                          # 共享 UI 组件库
│   │   ├── src/
│   │   ├── stories/                 # Storybook 文档
│   │   └── package.json
│   │
│   ├── utils/                       # 共享工具函数
│   │   ├── src/
│   │   └── package.json
│   │
│   └── types/                       # 共享 TypeScript 类型
│       ├── src/
│       └── package.json
│
├── services/
│   └── api/                         # API 服务
│       ├── src/
│       │   ├── routes/
│       │   ├── controllers/
│       │   ├── services/
│       │   ├── models/
│       │   └── middleware/
│       └── package.json
│
├── infrastructure/
│   ├── docker/                      # Docker 配置
│   ├── nginx/                       # Nginx 配置
│   └── scripts/                     # 部署脚本
│
├── docs/
│   ├── ARCHITECTURE.md              # 架构文档 (本文档)
│   ├── DESIGN-SYSTEM.md             # 设计系统
│   ├── API.md                       # API 文档
│   ├── DEPLOYMENT.md                # 部署指南
│   └── CONTRIBUTING.md              # 贡献指南
│
├── .github/
│   └── workflows/                   # CI/CD 配置
│
├── pnpm-workspace.yaml              # Monorepo 配置
├── package.json                     # 根 package.json
├── tsconfig.json                    # TypeScript 配置
├── turbo.json                       # Turborepo 配置
└── .env.example                     # 环境变量示例
```

---

## 3. 技术栈

### 3.1 前端技术栈

| 类别 | 技术 | 版本 | 说明 |
|------|------|------|------|
| **核心框架** | React | 19.x | UI 框架 |
| **语言** | TypeScript | 5.x | 类型系统 |
| **构建工具** | Vite | 8.x | 构建和开发服务器 |
| **样式** | TailwindCSS | 4.x | 原子化 CSS |
| **UI 组件** | shadcn-ui | latest | 组件库 |
| **路由** | React Router | 6.x | 前端路由 |
| **状态管理** | Zustand | 5.x | 轻量状态管理 |
| **HTTP 客户端** | Axios | 1.x | API 请求 |
| **表单** | React Hook Form | 7.x | 表单处理 |
| **图表** | Chart.js | 4.x | 数据可视化 |
| **动画** | Framer Motion | 11.x | 动画库 |

### 3.2 后端技术栈

| 类别 | 技术 | 版本 | 说明 |
|------|------|------|------|
| **运行时** | Node.js | 20.x | JavaScript 运行时 |
| **框架** | Express | 5.x | Web 框架 |
| **语言** | TypeScript | 5.x | 类型系统 |
| **数据库** | MongoDB | 8.x | NoSQL 数据库 |
| **ORM** | Mongoose | 8.x | MongoDB ODM |
| **缓存** | Redis | 7.x | 内存缓存 |
| **文件存储** | MinIO | latest | S3 兼容对象存储 |
| **认证** | JWT | latest | Token 认证 |
| **验证** | Zod | 3.x | Schema 验证 |
| **日志** | Winston | 3.x | 日志库 |

### 3.3 开发和运维

| 类别 | 技术 | 版本 | 说明 |
|------|------|------|------|
| **包管理器** | pnpm | 9.x | 快速、节省空间的包管理 |
| **Monorepo** | Turborepo | 2.x | 构建缓存系统 |
| **代码质量** | ESLint | 9.x | 代码检查 |
| **格式化** | Prettier | 3.x | 代码格式化 |
| **测试** | Vitest | 2.x | 单元测试 |
| **E2E 测试** | Playwright | 1.x | 端到端测试 |
| **容器** | Docker | 24.x | 容器化 |
| **编排** | Docker Compose | 2.x | 容器编排 |
| **CI/CD** | GitHub Actions | latest | 自动化流程 |
| **监控** | Sentry | latest | 错误追踪 |

---

## 4. 核心模块设计

### 4.1 组件系统 (原子设计)

#### Atoms (基础组件)
```typescript
// 示例：Button 组件
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
}

const Button: FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  onClick,
  disabled,
  loading 
}) => {
  // 实现...
}
```

**基础组件列表** (30 个):
- Button, Input, Textarea, Select, Checkbox, Radio
- Label, Badge, Avatar, Icon, Spinner
- Card, Modal, Dropdown, Tooltip, Toast
- Tabs, Accordion, Pagination, Breadcrumb
- ...

#### Molecules (组合组件)
```typescript
// 示例：ProductCard 组件
interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
  onViewDetails?: (product: Product) => void
}

const ProductCard: FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  onViewDetails 
}) => {
  return (
    <Card>
      <ProductImage src={product.image} />
      <ProductTitle>{product.name}</ProductTitle>
      <ProductPrice>{product.price}</ProductPrice>
      <Button onClick={() => onAddToCart?.(product)}>
        加入购物车
      </Button>
    </Card>
  )
}
```

**组合组件列表** (20 个):
- ProductCard, CategoryCard, NewsCard
- SearchBar, FilterPanel, SortDropdown
- CartItem, OrderSummary, UserMenu
- ...

#### Organisms (功能模块)
```typescript
// 示例：ProductList 组件
interface ProductListProps {
  products: Product[]
  filters: ProductFilters
  onFilterChange: (filters: ProductFilters) => void
  onLoadMore: () => void
}

const ProductList: FC<ProductListProps> = ({
  products,
  filters,
  onFilterChange,
  onLoadMore
}) => {
  return (
    <section>
      <FilterPanel filters={filters} onChange={onFilterChange} />
      <div className="grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <LoadMoreButton onClick={onLoadMore} />
    </section>
  )
}
```

**功能模块列表** (25 个):
- ProductList, CategoryList, NewsList
- Header, Footer, Sidebar
- ShoppingCart, CheckoutForm, ContactForm
- GrindingSimulator, ProductRecommender
- ...

### 4.2 状态管理

#### 全局状态 (Zustand)
```typescript
// 购物车状态
interface CartStore {
  items: CartItem[]
  addItem: (product: Product, quantity: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  total: number
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (product, quantity) => {
    // 实现...
  },
  // 其他方法...
}))
```

#### 服务器状态 (React Query)
```typescript
// 产品查询
export const useProducts = (filters: ProductFilters) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => fetchProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 分钟
  })
}
```

### 4.3 路由设计

```typescript
// 路由配置
const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'products', element: <ProductCatalog /> },
      { path: 'products/:id', element: <ProductDetail /> },
      { path: 'categories/:id', element: <CategoryPage /> },
      { path: 'simulator', element: <GrindingSimulator /> },
      { path: 'news', element: <NewsList /> },
      { path: 'news/:id', element: <NewsDetail /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'products', element: <ProductManagement /> },
      { path: 'categories', element: <CategoryManagement /> },
      { path: 'orders', element: <OrderManagement /> },
      { path: 'customers', element: <CustomerManagement /> },
      { path: 'content', element: <ContentManagement /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
]
```

### 4.4 API 设计

#### RESTful API 规范
```typescript
// 产品 API
GET    /api/products          # 获取产品列表
GET    /api/products/:id      # 获取单个产品
POST   /api/products          # 创建产品 (Admin)
PUT    /api/products/:id      # 更新产品 (Admin)
DELETE /api/products/:id      # 删除产品 (Admin)

// 请求示例
GET /api/products?category=planetary&page=1&limit=20

// 响应示例
{
  "status": "success",
  "data": {
    "products": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

#### API 客户端
```typescript
// API 客户端封装
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 处理未授权
    }
    return Promise.reject(error)
  }
)
```

---

## 5. 设计系统

### 5.1 色彩系统

```typescript
// 主题色彩
const colors = {
  // 主色调
  primary: {
    50: '#E0F7FF',
    100: '#B8EEFF',
    200: '#8AE5FF',
    300: '#5CDCFF',
    400: '#2ED2FF',
    500: '#00D4FF', // 主色
    600: '#00A8CC',
    700: '#007C99',
    800: '#005066',
    900: '#002433',
  },
  
  // 辅助色
  secondary: {
    500: '#F97316', // 橙色
  },
  success: {
    500: '#22C55E', // 绿色
  },
  warning: {
    500: '#F59E0B', // 黄色
  },
  danger: {
    500: '#EF4444', // 红色
  },
  
  // 中性色
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    // ...
    900: '#111827',
  },
}
```

### 5.2 字体系统

```typescript
const typography = {
  // 字体系列
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    display: ['Poppins', 'system-ui', 'sans-serif'],
    mono: ['Fira Code', 'monospace'],
  },
  
  // 字体大小
  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
    '7xl': '4.5rem',   // 72px
  },
  
  // 字重
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
}
```

### 5.3 间距系统

```typescript
const spacing = {
  0: '0',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  5: '1.25rem',  // 20px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  10: '2.5rem',  // 40px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
  20: '5rem',    // 80px
  24: '6rem',    // 96px
}
```

### 5.4 阴影系统

```typescript
const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
}
```

---

## 6. 性能优化策略

### 6.1 代码分割

```typescript
// 路由级别代码分割
const HomePage = lazy(() => import('./pages/HomePage'))
const ProductCatalog = lazy(() => import('./pages/ProductCatalog'))

// 组件级别代码分割
const GrindingSimulator = lazy(() => 
  import('./components/organisms/GrindingSimulator')
)
```

### 6.2 图片优化

```typescript
// 响应式图片
<picture>
  <source 
    srcSet="/images/product-400.webp 400w,
            /images/product-800.webp 800w"
    sizes="(max-width: 600px) 400px, 800px"
    type="image/webp"
  />
  <img 
    src="/images/product-800.jpg" 
    alt="Product"
    loading="lazy"
    decoding="async"
  />
</picture>
```

### 6.3 缓存策略

```typescript
// React Query 缓存配置
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 分钟
      cacheTime: 10 * 60 * 1000, // 10 分钟
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
})
```

### 6.4 服务端优化

```typescript
// MongoDB 索引
productSchema.index({ category: 1, name: 1 })
productSchema.index({ slug: 1 }, { unique: true })
productSchema.index({ tags: 1 })

// Redis 缓存
const getCachedProduct = async (id: string) => {
  const cached = await redis.get(`product:${id}`)
  if (cached) return JSON.parse(cached)
  
  const product = await Product.findById(id)
  await redis.setex(`product:${id}`, 300, JSON.stringify(product))
  return product
}
```

---

## 7. 安全策略

### 7.1 认证和授权

```typescript
// JWT Token 认证
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  
  if (!token) {
    return res.status(401).json({ message: '未授权' })
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ message: 'Token 无效' })
  }
}

// RBAC 权限控制
const requireRole = (roles: string[]) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: '权限不足' })
    }
    next()
  }
}
```

### 7.2 输入验证

```typescript
// Zod Schema 验证
const createProductSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(5000),
  price: z.number().positive(),
  category: z.string().uuid(),
  images: z.array(z.string().url()).max(10),
  specifications: z.object({
    power: z.string().optional(),
    capacity: z.string().optional(),
    // ...
  }),
})

// 使用验证
app.post('/api/products', async (req, res) => {
  try {
    const data = createProductSchema.parse(req.body)
    const product = await Product.create(data)
    res.json({ status: 'success', data: product })
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.errors })
  }
})
```

### 7.3 XSS 防护

```typescript
// 清理用户输入
import DOMPurify from 'dompurify'

const sanitizeHtml = (html: string) => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u'],
    ALLOWED_ATTR: [],
  })
}
```

---

## 8. 测试策略

### 8.1 测试金字塔

```
           /\
          /  \
         / E2E \        10% - Playwright
        /______\
       /        \
      / Integration\    20% - Integration Tests
     /______________\
    /                \
   /    Unit Tests    \  70% - Vitest
  /____________________\
```

### 8.2 单元测试

```typescript
// 组件测试
import { render, screen } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
  
  it('handles click event', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    screen.getByText('Click me').click()
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### 8.3 E2E 测试

```typescript
// Playwright E2E 测试
import { test, expect } from '@playwright/test'

test('用户可以将商品加入购物车', async ({ page }) => {
  await page.goto('/products')
  
  // 点击第一个商品
  await page.click('[data-testid="product-card"]:first-child')
  
  // 添加到购物车
  await page.click('[data-testid="add-to-cart"]')
  
  // 验证购物车图标显示数量
  const cartBadge = page.locator('[data-testid="cart-badge"]')
  await expect(cartBadge).toHaveText('1')
})
```

---

## 9. 部署架构

### 9.1 生产环境架构

```
                    ┌─────────────┐
                    │   Nginx     │
                    │ (负载均衡)   │
                    └──────┬──────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
┌────────▼────────┐ ┌─────▼──────┐ ┌────────▼────────┐
│   Node.js #1    │ │ Node.js #2 │ │   Node.js #3    │
│   (PM2 Cluster) │ │ (PM2)      │ │   (PM2)         │
└────────┬────────┘ └─────┬──────┘ └────────┬────────┘
         │                │                  │
         └────────────────┼──────────────────┘
                          │
         ┌────────────────┼──────────────────┐
         │                │                  │
┌────────▼────────┐ ┌─────▼──────┐ ┌────────▼────────┐
│   MongoDB       │ │   Redis    │ │    MinIO        │
│   (Replica Set) │ │   (Cache)  │ │   (File Store)  │
└─────────────────┘ └────────────┘ └─────────────────┘
```

### 9.2 Docker 部署

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY pnpm-lock.yaml package.json ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 3000
CMD ["node", "dist/server.js"]
```

### 9.3 CI/CD 流程

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - setup-node
      - pnpm install
      - pnpm lint
      - pnpm test
      - pnpm build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - deploy-to-production
```

---

## 10. 监控和日志

### 10.1 前端监控

```typescript
// Sentry 错误追踪
import * as Sentry from '@sentry/react'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
})
```

### 10.2 性能监控

```typescript
// Web Vitals 监控
import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals'

onCLS(console.log)
onFID(console.log)
onFCP(console.log)
onLCP(console.log)
onTTFB(console.log)
```

### 10.3 后端日志

```typescript
// Winston 日志配置
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
})
```

---

## 11. 开发规范

### 11.1 代码风格

```typescript
// .eslintrc.js
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react-hooks'],
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
  },
}
```

### 11.2 Git 工作流

```bash
# Branch 命名规范
feature/add-shopping-cart      # 新功能
fix/product-image-upload       # Bug 修复
refactor/product-api           # 重构
docs/update-api-docs           # 文档更新
test/add-unit-tests            # 测试

# Commit 规范
feat: 添加购物车功能
fix: 修复产品图片上传问题
refactor: 重构产品 API
docs: 更新 API 文档
test: 添加单元测试
```

### 11.3 文档规范

```markdown
# 组件文档模板

## 组件名称

### 描述
简要描述组件的用途

### Props
| 名称 | 类型 | 默认值 | 说明 |
|------|------|--------|------|

### 用法
```tsx
import { Component } from './Component'

function Example() {
  return <Component prop="value" />
}
```

### 示例
展示实际使用效果
```

---

## 12. 路线图

### Phase 1 - 基础建设 (Week 1-4)
- [ ] 完成 Monorepo 架构搭建
- [ ] 建立设计系统文档
- [ ] 开发基础组件 (Atoms)
- [ ] 配置 CI/CD 流程

### Phase 2 - 核心功能 (Week 5-10)
- [ ] 开发组合组件 (Molecules)
- [ ] 开发功能模块 (Organisms)
- [ ] 重构核心页面
- [ ] 集成 AI 推荐系统

### Phase 3 - 优化完善 (Week 11-14)
- [ ] 性能优化
- [ ] SEO 优化
- [ ] 可访问性优化
- [ ] 完善测试覆盖

### Phase 4 - 上线运营 (Week 15-17)
- [ ] 灰度发布
- [ ] 监控告警
- [ ] 用户反馈
- [ ] 持续优化

---

## 13. 附录

### 13.1 术语表

| 术语 | 说明 |
|------|------|
| Monorepo | 单一代码仓库管理多个项目 |
| Atomic Design | 原子设计方法论 |
| SSR | 服务端渲染 |
| SSG | 静态站点生成 |
| CSR | 客户端渲染 |

### 13.2 参考资源

- [React 官方文档](https://react.dev)
- [TypeScript 官方文档](https://www.typescriptlang.org)
- [TailwindCSS 文档](https://tailwindcss.com)
- [Atomic Design](https://atomicdesign.bradfrost.com)

---

**文档维护**: 技术团队  
**最后更新**: 2026-03-21  
**下次审查**: 2026-04-21
