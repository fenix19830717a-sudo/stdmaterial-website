# Phase 2: 核心组件开发 (Week 4-6)

**阶段**: Phase 2 (核心组件开发)  
**周期**: Week 4-6  
**优先级**: P0 - 关键路径  
**预计工时**: 12 天

---

## 🎯 阶段目标

开发完整的设计系统和可复用组件库，为页面开发奠定基础。

---

## 📋 Week 4: 设计系统实现

### 任务 4.1: 创建 Design Tokens 系统

**任务 ID**: PHASE2-W4-T1  
**复杂度**: 中  
**预计时间**: 6 小时

#### 任务描述
创建统一的设计令牌系统，实现设计规范的代码化。

#### 实施步骤

**步骤 1: 创建 tokens 文件**
```typescript
// packages/ui/src/tokens/index.ts
export const tokens = {
  // Colors
  colors: {
    primary: {
      50: '#e6f7ff',
      100: '#b3e0ff',
      // ... more shades
      500: '#0084ff',
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
    }
  },
  
  // Typography
  typography: {
    fontFamily: {
      sans: 'Inter, system-ui, sans-serif',
      mono: 'JetBrains Mono, monospace'
    },
    fontSize: {
      xs: { size: '0.75rem', lineHeight: '1rem' },
      sm: { size: '0.875rem', lineHeight: '1.25rem' },
      // ... more sizes
      '7xl': { size: '4.5rem', lineHeight: '1' }
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    }
  },
  
  // Spacing (8px baseline)
  spacing: {
    0: '0',
    1: '0.25rem',  // 2px
    2: '0.5rem',   // 4px
    4: '1rem',     // 8px
    8: '2rem',     // 16px
    16: '4rem',    // 32px
    32: '8rem'     // 64px
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    glow: '0 0 20px rgba(6, 182, 210, 0.3)'
  },
  
  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.25rem',
    DEFAULT: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px'
  },
  
  // Transitions
  transitions: {
    fast: '150ms ease',
    normal: '200ms ease',
    slow: '300ms ease'
  }
};

export type TokenCategory = keyof typeof tokens;
export type ColorToken = keyof typeof tokens.colors;
```

**步骤 2: 创建 CSS 变量导出**
```typescript
// packages/ui/src/tokens/css-variables.ts
export const cssVariables = `
:root {
  // Colors
  --color-primary-500: ${tokens.colors.primary[500]};
  --color-navy: ${tokens.colors.navy.DEFAULT};
  --color-cyan: ${tokens.colors.cyan.DEFAULT};
  
  // Typography
  --font-sans: ${tokens.typography.fontFamily.sans};
  
  // Spacing
  --spacing-base: 8px;
  
  // Shadows
  --shadow-glow: ${tokens.shadows.glow};
  
  // Transitions
  --transition-fast: ${tokens.transitions.fast};
  --transition-normal: ${tokens.transitions.normal};
}
`;
```

#### 验收标准
- ✅ Design Tokens 定义完整
- ✅ TypeScript 类型安全
- ✅ CSS 变量生成正确
- ✅ 与设计规范一致

---

### 任务 4.2-4.6: 实现各子系统

**任务 ID**: PHASE2-W4-T2 ~ T6  
**复杂度**: 中  
**预计时间**: 16 小时

#### 任务列表

**任务 4.2: 实现色彩系统组件** (3 小时)
- ColorPalette 组件
- ColorSwatch 组件
- 色彩对比度检查工具

**任务 4.3: 实现字体排印系统** (3 小时)
- Typography 组件
- Heading 组件 (H1-H6)
- Text 组件
- 字体预览工具

**任务 4.4: 实现间距系统组件** (2 小时)
- Spacer 组件
- Stack 组件
- Grid 组件

**任务 4.5: 实现阴影系统组件** (2 小时)
- ShadowBox 组件
- 阴影预览工具

**任务 4.6: 实现圆角和动效系统** (6 小时)
- BorderRadius 展示组件
- Animation 示例组件
- Transition 工具类

#### 验收标准
- ✅ 所有子系统实现完成
- ✅ 组件可复用
- ✅ 文档完整

---

## 📋 Week 5: 基础组件开发

### 任务 5.1-5.6: 基础组件开发

**任务 ID**: PHASE2-W5-T1 ~ T6  
**复杂度**: 中  
**预计时间**: 20 小时

#### 组件清单

**任务 5.1: Button 组件** (4 小时)
```typescript
// packages/ui/src/button/Button.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@stdmaterial/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
  {
    variants: {
      variant: {
        primary: 'bg-primary-500 hover:bg-primary-600 text-white focus:ring-primary-500',
        secondary: 'bg-transparent border-2 border-primary-500 text-primary-500 hover:bg-primary-50 focus:ring-primary-500',
        outline: 'bg-transparent border border-gray-300 hover:bg-gray-50 focus:ring-gray-500',
        ghost: 'bg-transparent hover:bg-gray-100 focus:ring-gray-500',
        danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
      },
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
        xl: 'px-8 py-4 text-xl'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md'
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, leftIcon, rightIcon, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

export { buttonVariants };
```

**任务 5.2: Input 组件** (3 小时)
- Text Input
- Textarea
- Select
- Radio Group
- Checkbox

**任务 5.3: Card 组件** (3 小时)
- Base Card
- Product Card
- Feature Card
- Stats Card

**任务 5.4: Navigation 组件** (4 小时)
- NavBar
- NavMenu
- MobileMenu
- Breadcrumb

**任务 5.5: Footer 组件** (3 小时)
- Footer
- FooterLinks
- SocialIcons

**任务 5.6: Loading 组件** (3 小时)
- Spinner
- Skeleton
- ProgressBar
- LoadingOverlay

#### 验收标准
- ✅ 所有基础组件实现完成
- ✅ 组件支持 TypeScript
- ✅ 组件有完整文档
- ✅ 组件有单元测试

---

## 📋 Week 6: 业务组件开发

### 任务 6.1-6.6: 业务组件开发

**任务 ID**: PHASE2-W6-T1 ~ T6  
**复杂度**: 高  
**预计时间**: 20 小时

#### 组件清单

**任务 6.1: ProductCard 组件** (4 小时)
```typescript
// apps/web/src/components/products/ProductCard.tsx
import { Card } from '@stdmaterial/ui';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  onAddToInquiry?: (product: Product) => void;
  onViewDetails?: (slug: string) => void;
}

export function ProductCard({ product, onAddToInquiry, onViewDetails }: ProductCardProps) {
  return (
    <Card className="group">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden rounded-t-xl">
        <img
          src={product.images[0]}
          alt={product.name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      
      {/* Product Info */}
      <div className="p-4">
        {/* Product ID */}
        <p className="text-xs text-gray-500 mb-1">
          ID: {product.productId}
        </p>
        
        {/* Product Name */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {product.name}
        </h3>
        
        {/* SKU */}
        <p className="text-sm text-gray-600 mb-2">
          SKU: {product.sku}
        </p>
        
        {/* Short Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {product.description}
        </p>
        
        {/* Key Features */}
        <div className="flex gap-2 mb-4">
          {Object.entries(product.specifications).slice(0, 3).map(([key, value]) => (
            <span key={key} className="px-2 py-1 bg-gray-100 text-xs rounded">
              {key}: {value}
            </span>
          ))}
        </div>
        
        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onViewDetails?.(product.slug)}
            className="flex-1 btn-primary"
          >
            View Details
          </button>
          <button
            onClick={() => onAddToInquiry?.(product)}
            className="flex-1 btn-secondary"
          >
            Add to Inquiry
          </button>
        </div>
      </div>
    </Card>
  );
}
```

**任务 6.2: ProductGrid 组件** (3 小时)
- 响应式网格布局
- 支持自定义列数
- 支持空状态

**任务 6.3: FilterPanel 组件** (4 小时)
- 分类筛选
- 价格范围筛选
- 行业筛选
- 细度筛选
- 清除筛选

**任务 6.4: SearchBox 组件** (3 小时)
- 实时搜索
- 搜索建议
- 搜索历史
- 热门搜索

**任务 6.5: InquiryForm 组件** (4 小时)
- 表单验证
- 文件上传
- 自动完成
- 提交反馈

**任务 6.6: Breadcrumb 组件** (2 小时)
- 多级面包屑
- 响应式处理
- SEO 优化

#### 验收标准
- ✅ 所有业务组件实现完成
- ✅ 组件支持全英文显示
- ✅ 组件正确处理 productId/sku/name
- ✅ 组件有完整文档和测试

---

## 🎯 阶段交付物

1. ✅ 完整的设计系统
2. ✅ 30+ 可复用组件
3. ✅ 组件文档站点
4. ✅ 组件测试用例 (覆盖率 ≥ 85%)

---

## ⚠️ 关键约束

### 全英文网站约束
- ✅ 所有组件文本使用英文
- ✅ 所有占位符使用英文
- ✅ 所有错误提示使用英文
- ✅ 所有标签使用英文

### 产品 ID 分离约束
- ✅ ProductCard 必须显示 productId、sku、name 三个字段
- ✅ 每个字段有正确的样式和位置
- ✅ 字段用途清晰区分

### SEO 优化约束
- ✅ 组件支持语义化 HTML
- ✅ 图片必须有 alt 属性
- ✅ 支持结构化数据

---

## 📚 参考文档

- [Design Tokens](https://design-tokens.org/)
- [Class Variance Authority](https://cva.style/)
- [Storybook](https://storybook.js.org/)
- [Testing Library](https://testing-library.com/)

---

**文档维护**: 技术部  
**最后更新**: 2026-03-21
