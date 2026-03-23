# SEO 优化指南

**版本**: 1.0  
**日期**: 2026-03-21  
**优先级**: P0 - 关键要求  
**适用范围**: 所有前端页面

---

## 🎯 SEO 目标

- Lighthouse SEO Score: ≥ 95
- Google Search Console: 0 错误
- 核心关键词排名前 3
- 有机流量月增长 ≥ 20%

---

## 📋 核心优化策略

### 1. 页面级 SEO

#### 1.1 Title 标签

**要求**:
- 长度：50-60 个字符
- 格式：`Primary Keyword - Secondary Keyword | Brand Name`
- 每个页面唯一
- 包含核心关键词

**示例**:
```typescript
// ✅ 正确示例
<title>Planetary Ball Mill PM-400 - Laboratory Grinding Equipment | STD Material</title>

// ❌ 错误示例
<title>Product Details</title>  // 太泛，无关键词
<title>PM-400</title>  // 太短，信息不足
```

**实施代码**:
```typescript
// apps/web/src/lib/seo.ts
interface SEOConfig {
  title: string;
  description: string;
  keywords: string;
  canonical?: string;
  openGraph?: OpenGraphConfig;
  twitter?: TwitterConfig;
}

export function generateSEO(config: SEOConfig) {
  return {
    title: config.title,
    meta: [
      { name: 'description', content: config.description },
      { name: 'keywords', content: config.keywords },
      { name: 'robots', content: 'index, follow' },
      { name: 'googlebot', content: 'index, follow' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ],
    link: [
      { rel: 'canonical', href: config.canonical }
    ]
  };
}

// 使用示例
const productSEO = generateSEO({
  title: 'Planetary Ball Mill PM-400 - Laboratory Grinding Equipment | STD Material',
  description: 'High-energy planetary ball mill for laboratory grinding. Features 4x500ml jars, variable speed 0-800rpm. ISO 9001 certified. Get quote today!',
  keywords: 'planetary ball mill, laboratory mill, grinding equipment, PM-400, ball mill manufacturer',
  canonical: 'https://www.stdmaterial.com/products/planetary-ball-mill-pm-400'
});
```

---

#### 1.2 Meta Description

**要求**:
- 长度：150-160 个字符
- 包含核心关键词
- 有吸引力的文案
- 包含行动号召

**示例**:
```typescript
// ✅ 正确示例
<meta name="description" content="High-energy planetary ball mill for laboratory grinding. Features 4x500ml jars, variable speed 0-800rpm. ISO 9001 certified. Get quote today!" />

// ❌ 错误示例
<meta name="description" content="This is a product." />  // 太短，无信息
```

---

#### 1.3 结构化数据 (Schema.org)

**要求**:
- 产品页面使用 Product schema
- 文章页面使用 Article schema
- 组织页面使用 Organization schema
- FAQ 页面使用 FAQPage schema

**实施代码**:
```typescript
// apps/web/src/lib/structured-data.ts
interface ProductSchema {
  '@context': 'https://schema.org';
  '@type': 'Product';
  name: string;
  description: string;
  image: string[];
  brand: {
    '@type': 'Brand';
    name: string;
  };
  sku: string;
  mpn: string;  // productId
  offers: {
    '@type': 'Offer';
    availability: string;
    priceCurrency: string;
    price: string;
    seller: {
      '@type': 'Organization';
      name: string;
    };
  };
  aggregateRating?: {
    '@type': 'AggregateRating';
    ratingValue: string;
    reviewCount: string;
  };
}

export function generateProductSchema(product: Product): ProductSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
    brand: {
      '@type': 'Brand',
      name: 'STD Material'
    },
    sku: product.sku,
    mpn: product.productId,
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'USD',
      price: product.price || 'Contact for Price',
      seller: {
        '@type': 'Organization',
        name: 'Hunan Shengtongda Material Technology Co., Ltd.'
      }
    }
  };
}

// 在组件中使用
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(generateProductSchema(product))
  }}
/>
```

---

### 2. 内容级 SEO

#### 2.1 关键词优化

**关键词研究**:
```typescript
// 核心关键词列表
export const keywords = {
  // 产品关键词
  products: [
    'planetary ball mill',
    'jet mill',
    'bead mill',
    'grinding equipment',
    'grinding jars',
    'grinding media'
  ],
  
  // 行业关键词
  industries: [
    'mining grinding',
    'ceramics grinding',
    'chemicals grinding',
    'pharmaceuticals grinding',
    'battery materials grinding'
  ],
  
  // 长尾关键词
  longTail: [
    'laboratory ball mill manufacturer',
    'industrial grinding equipment supplier',
    'custom grinding solutions China',
    'ISO 9001 certified ball mill'
  ]
};
```

**关键词密度**:
- 主关键词：2-3%
- 副关键词：1-2%
- 长尾关键词：0.5-1%

---

#### 2.2 内容质量

**要求**:
- 原创内容
- 深度内容 (800+ 词)
- 自然语言
- 易于阅读
- 包含数据和事实

**内容结构**:
```markdown
# H1: Main Title (包含主关键词)

## H2: Introduction
- 问题陈述
- 解决方案概述

## H2: Key Features (包含副关键词)
### H3: Feature 1
### H3: Feature 2

## H2: Applications (包含行业关键词)
### H3: Industry 1
### H3: Industry 2

## H2: Technical Specifications
- 参数表格
- 技术亮点

## H2: FAQ (包含长尾关键词)
### H3: Question 1
### H3: Question 2

## H2: Conclusion
- 总结
- 行动号召
```

---

### 3. 技术级 SEO

#### 3.1 语义化 HTML

**要求**:
- 使用正确的 HTML5 标签
- 正确的标题层级
- 语义化的导航
- 语义化的列表

**示例**:
```html
<!-- ✅ 正确示例 -->
<header>
  <nav aria-label="Main navigation">
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/products">Products</a></li>
    </ul>
  </nav>
</header>

<main>
  <article>
    <h1>Product Name</h1>
    <section aria-labelledby="features-heading">
      <h2 id="features-heading">Features</h2>
      <ul>
        <li>Feature 1</li>
        <li>Feature 2</li>
      </ul>
    </section>
  </article>
</main>

<footer>
  <p>&copy; 2026 STD Material</p>
</footer>

<!-- ❌ 错误示例 -->
<div>
  <div>
    <div onClick={() => navigate('/')}>Home</div>
    <div onClick={() => navigate('/products')}>Products</div>
  </div>
</div>
```

---

#### 3.2 图片优化

**要求**:
- 所有图片必须有 alt 属性
- 使用描述性的文件名
- 压缩图片大小
- 使用 WebP 格式
- 实现懒加载

**示例**:
```typescript
// ✅ 正确示例
<img
  src="/images/products/planetary-ball-mill-pm-400.webp"
  alt="Planetary Ball Mill PM-400 with 4x500ml grinding jars"
  width="800"
  height="600"
  loading="lazy"
  decoding="async"
/>

// ❌ 错误示例
<img src="/images/product1.jpg" />  // 无 alt 属性
<img alt="image" src="..." />  // alt 无意义
```

---

#### 3.3 内部链接

**要求**:
- 使用描述性的锚文本
- 建立内容关联
- 避免孤立页面
- 实现面包屑导航

**示例**:
```typescript
// ✅ 正确示例
<Link to="/products/planetary-ball-mill-pm-400">
  Learn more about Planetary Ball Mill PM-400
</Link>

// ❌ 错误示例
<Link to="/products/123">Click here</Link>
```

---

### 4. 性能优化

#### 4.1 核心 Web 指标

**目标**:
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1
- TBT (Total Blocking Time): < 200ms

**优化策略**:
```typescript
// 1. 代码分割
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));

// 2. 图片优化
<img
  src="/image.webp"
  srcSet="/image-400.webp 400w, /image-800.webp 800w"
  sizes="(max-width: 600px) 400px, 800px"
  loading="lazy"
/>

// 3. 预加载关键资源
<link rel="preload" href="/fonts/inter.woff2" as="font" crossorigin />

// 4. 缓存策略
Cache-Control: public, max-age=31536000, immutable
```

---

### 5. 移动优化

**要求**:
- 响应式设计
- 触摸友好
- 字体大小适中
- 按钮尺寸合适

**示例**:
```css
/* 触摸友好的按钮尺寸 */
.btn {
  min-width: 44px;
  min-height: 44px;
  padding: 12px 24px;
}

/* 响应式字体 */
html {
  font-size: 16px;
}

@media (max-width: 768px) {
  html {
    font-size: 14px;
  }
}
```

---

## 📊 SEO 检查清单

### 页面级检查
- [ ] Title 标签 (50-60 字符，包含关键词)
- [ ] Meta Description (150-160 字符，包含关键词)
- [ ] H1 标签 (唯一，包含关键词)
- [ ] H2-H6 标签 (层级正确)
- [ ] 结构化数据 (Schema.org)
- [ ] Canonical URL
- [ ] Open Graph 标签
- [ ] Twitter Card 标签

### 内容级检查
- [ ] 关键词密度 (2-3%)
- [ ] 内容质量 (800+ 词)
- [ ] 内部链接 (描述性锚文本)
- [ ] 图片优化 (alt 属性，WebP)
- [ ] 视频内容 (如有)
- [ ] FAQ 部分 (如有)

### 技术级检查
- [ ] 语义化 HTML
- [ ] 移动友好
- [ ] 页面速度 (LCP < 2.5s)
- [ ] 核心 Web 指标
- [ ] SSL 证书 (HTTPS)
- [ ] XML Sitemap
- [ ] Robots.txt
- [ ] 404 页面

---

## 📈 SEO 监控

### 工具配置
```typescript
// Google Analytics 配置
export const gaConfig = {
  measurementId: 'G-XXXXXXXXXX',
  trackPageViews: true,
  trackEvents: true
};

// Google Search Console 验证
<meta name="google-site-verification" content="verification-code" />
```

### 监控指标
- 有机流量
- 关键词排名
- 点击率 (CTR)
- 跳出率
- 平均停留时间
- 索引页面数

---

## ⚠️ 全英文网站约束

**所有 SEO 相关内容必须使用英文**:
- ✅ Title 标签：英文
- ✅ Meta Description: 英文
- ✅ Keywords: 英文
- ✅ 内容文本：英文
- ✅ Alt 属性：英文
- ✅ 锚文本：英文
- ✅ 结构化数据：英文

---

## 📚 参考资源

- [Google Search Central](https://developers.google.com/search)
- [Moz SEO Guide](https://moz.com/beginners-guide-to-seo)
- [Ahrefs Blog](https://ahrefs.com/blog/)
- [Schema.org](https://schema.org/)
- [Google Analytics](https://analytics.google.com/)

---

**文档维护**: 技术部 + 市场部  
**最后更新**: 2026-03-21  
**下次审查**: 2026-04-21
