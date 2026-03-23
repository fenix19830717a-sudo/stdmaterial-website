# 产品 ID 分离实施规范

**版本**: 1.0  
**日期**: 2026-03-21  
**优先级**: P0 - 关键要求  
**适用范围**: 所有产品相关代码和数据

---

## 🎯 核心要求

**产品 ID (productId) 和产品名称 (name) 是两个完全独立的字段，具有不同的用途和生成规则，严禁混用。**

---

## 📋 字段定义

### 1. 产品标识符体系

```typescript
interface ProductIdentifiers {
  /**
   * 产品唯一标识符 (内部使用)
   * 格式：PROD-XXXXX
   * 用途：数据库索引、API 调用、内部引用
   * 示例：PROD-00123, PROD-00456
   */
  productId: string;
  
  /**
   * 库存单位编码 (业务使用)
   * 格式：自定义编码规则
   * 用途：订单、库存、采购、物流
   * 示例：PM-400-STD, JM-200-PRO
   */
  sku: string;
  
  /**
   * 产品名称 (展示用)
   * 格式：英文商业名称
   * 用途：网站展示、产品目录、搜索
   * 示例：Planetary Ball Mill PM-400
   */
  name: string;
  
  /**
   * URL 友好名称 (基于 name 生成)
   * 格式：小写连字符分隔
   * 用途：SEO 友好的 URL
   * 示例：planetary-ball-mill-pm-400
   */
  slug: string;
}
```

---

## 📋 字段详细说明

### 2. ProductId (产品 ID)

#### 2.1 生成规则

```typescript
/**
 * ProductId 生成器
 * 格式：PROD- + 5 位数字序列
 */
function generateProductId(sequence: number): string {
  return `PROD-${sequence.toString().padStart(5, '0')}`;
}

// 示例
generateProductId(1)      // PROD-00001
generateProductId(123)    // PROD-00123
generateProductId(12345)  // PROD-12345
```

#### 2.2 使用场景

```typescript
// ✅ 正确使用场景

// 1. 数据库查询
const product = await db.products.findOne({ productId: 'PROD-00123' });

// 2. API 调用
GET /api/products/PROD-00123

// 3. 内部引用
const productId = 'PROD-00123';
trackProductView(productId);

// 4. 日志记录
logger.info(`Product viewed: ${product.productId}`);

// 5. 后台管理
<ProductTable>
  <Column field="productId" header="Product ID" />
</ProductTable>
```

#### 2.3 显示规范

```typescript
// 前端显示 (小字，灰色，辅助信息)
<div className="text-xs text-gray-500">
  ID: {product.productId}
</div>

// 产品卡片
<Card>
  <div className="mb-2">
    <span className="text-xs text-gray-500">ID: PROD-00123</span>
  </div>
  <h3 className="text-lg font-semibold">{product.name}</h3>
</Card>
```

---

### 3. SKU (库存单位)

#### 3.1 编码规则

```typescript
/**
 * SKU 编码规则
 * 格式：类型代码 - 型号代码 - 变体代码
 */
function generateSKU(type: string, model: number, variant: string): string {
  const typeCodes = {
    'Planetary Mill': 'PM',
    'Jet Mill': 'JM',
    'Bead Mill': 'BM',
    'Grinding Jar': 'GJ'
  };
  
  const variantCodes = {
    'Standard': 'STD',
    'Professional': 'PRO',
    'Ultra': 'ULTRA'
  };
  
  return `${typeCodes[type]}-${model}-${variantCodes[variant]}`;
}

// 示例
generateSKU('Planetary Mill', 400, 'Standard')  // PM-400-STD
generateSKU('Jet Mill', 200, 'Professional')    // JM-200-PRO
generateSKU('Bead Mill', 300, 'Ultra')          // BM-300-ULTRA
```

#### 3.2 使用场景

```typescript
// ✅ 正确使用场景

// 1. 订单管理
interface Order {
  items: [{
    sku: 'PM-400-STD',
    quantity: 2,
    price: 15000
  }]
}

// 2. 库存管理
const inventory = await db.inventory.findOne({ sku: 'PM-400-STD' });

// 3. 采购管理
purchaseOrder.items.push({
  sku: 'PM-400-STD',
  quantity: 10
});

// 4. 物流追踪
shipment.items.forEach(item => {
  console.log(`Shipping: ${item.sku} x ${item.quantity}`);
});
```

#### 3.3 显示规范

```typescript
// 产品详情页 (可选显示)
<div className="text-sm text-gray-600">
  SKU: {product.sku}
</div>

// 订单确认
<OrderSummary>
  <ProductRow>
    <div>{product.name}</div>
    <div className="text-sm text-gray-500">SKU: {product.sku}</div>
    <div>Qty: {item.quantity}</div>
  </ProductRow>
</OrderSummary>
```

---

### 4. Name (产品名称)

#### 4.1 命名规则

```typescript
/**
 * 产品名称命名规范
 * 格式：产品类型 + 型号 + 关键特性
 */
function generateProductName(type: string, model: number, feature: string): string {
  return `${type} ${model} - ${feature}`;
}

// 示例
generateProductName('Planetary Ball Mill', 400, '4x500ml Jars')
  // Planetary Ball Mill PM-400 - 4x500ml Jars

generateProductName('Jet Mill', 200, 'Ultra Fine Grinding')
  // Jet Mill JM-200 - Ultra Fine Grinding
```

#### 4.2 使用场景

```typescript
// ✅ 正确使用场景

// 1. 网站展示
<h1>{product.name}</h1>
<ProductTitle>{product.name}</ProductTitle>

// 2. 产品目录
<ProductCard>
  <h3>{product.name}</h3>
</ProductCard>

// 3. 搜索
const results = await searchProducts({
  query: 'Planetary Ball Mill'  // 搜索 name 字段
});

// 4. SEO
const seo = {
  title: `${product.name} - Grinding Equipment | STD Material`,
  description: `${product.name}. ${product.description}`
};
```

#### 4.3 显示规范

```typescript
// 产品详情页 (主标题，大字，加粗)
<h1 className="text-3xl font-bold mb-4">
  {product.name}
</h1>

// 产品卡片 (醒目位置)
<Card>
  <h3 className="text-lg font-semibold mb-2">
    {product.name}
  </h3>
</Card>

// 面包屑导航
<Breadcrumb>
  <Item>{product.name}</Item>
</Breadcrumb>
```

---

### 5. Slug (URL 友好名称)

#### 5.1 生成规则

```typescript
/**
 * Slug 生成器
 * 基于 name 生成 URL 友好的字符串
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// 示例
generateSlug('Planetary Ball Mill PM-400')
  // planetary-ball-mill-pm-400

generateSlug('Jet Mill JM-200 - Ultra Fine')
  // jet-mill-jm-200-ultra-fine
```

#### 5.2 使用场景

```typescript
// ✅ 正确使用场景

// 1. URL 路由
GET /products/planetary-ball-mill-pm-400

// 2. React Router
<Route 
  path="/products/:slug" 
  element={<ProductDetailPage />} 
/>

// 3. 内部链接
<Link to={`/products/${product.slug}`}>
  {product.name}
</Link>

// 4. SEO 规范
<link rel="canonical" href={`https://www.stdmaterial.com/products/${product.slug}`} />
```

---

## 📊 字段对比表

| 字段 | 格式示例 | 用途 | 可见性 | 可变性 |
|------|---------|------|--------|--------|
| **productId** | PROD-00123 | 数据库索引、API 调用 | 内部 | 不可变 |
| **sku** | PM-400-STD | 订单、库存、采购 | 业务 | 不可变 |
| **name** | Planetary Ball Mill PM-400 | 网站展示、搜索 | 公开 | 可优化 |
| **slug** | planetary-ball-mill-pm-400 | URL | 公开 | 不可变 |

---

## 💻 代码实施

### 6. 数据库模型

```typescript
// apps/web/src/server/models/Product.ts
const productSchema = new mongoose.Schema({
  // 产品标识符 (必须分离)
  productId: {
    type: String,
    required: true,
    unique: true,
    match: /^PROD-\d{5}$/,
    index: true
  },
  sku: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    index: 'text'  // 全文搜索
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true
  },
  
  // 产品描述
  description: {
    type: String,
    required: true,
    maxlength: 5000
  },
  shortDescription: {
    type: String,
    maxlength: 500
  },
  
  // 分类
  category: {
    type: String,
    required: true,
    ref: 'Category'
  },
  
  // 规格参数
  specifications: {
    type: Map,
    of: String
  },
  
  // 图片
  images: [{
    type: String,
    validate: {
      validator: (url: string) => url.startsWith('http'),
      message: 'Image must be a valid URL'
    }
  }],
  
  // 应用领域
  applications: [{
    type: String
  }]
}, {
  timestamps: true
});

// 索引优化
productSchema.index({ category: 1, slug: 1 });
productSchema.index({ name: 'text', description: 'text' });

// 自动生成 productId
productSchema.pre('save', async function(next) {
  if (!this.productId) {
    const counter = await mongoose.model('ProductCounter').findOneAndUpdate(
      {},
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.productId = `PROD-${String(counter.seq).padStart(5, '0')}`;
  }
  next();
});

// 自动生成 slug
productSchema.pre('save', function(next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

export const Product = mongoose.model('Product', productSchema);
```

---

### 7. API 接口

```typescript
// apps/web/src/server/routes/products.ts
import { Router } from 'express';

export const productRoutes = Router();

// 获取产品列表 (使用 productId 或 category)
productRoutes.get('/', async (req, res) => {
  const { category, page = 1, limit = 12 } = req.query;
  const query = category ? { category } : {};
  
  const products = await Product.find(query)
    .select('productId sku name slug description images category')
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));
  
  res.json({
    data: products.map(p => ({
      productId: p.productId,  // 返回 productId
      sku: p.sku,              // 返回 sku
      name: p.name,            // 返回 name
      slug: p.slug,
      description: p.description,
      images: p.images,
      category: p.category
    }))
  });
});

// 通过 slug 获取产品详情 (SEO 友好)
productRoutes.get('/:slug', async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  res.json({
    data: {
      productId: product.productId,  // 返回所有字段
      sku: product.sku,
      name: product.name,
      slug: product.slug,
      description: product.description,
      specifications: product.specifications,
      applications: product.applications,
      images: product.images
    }
  });
});

// 通过 productId 获取产品 (内部使用)
productRoutes.get('/id/:productId', async (req, res) => {
  const product = await Product.findOne({ productId: req.params.productId });
  
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  res.json({ data: product });
});
```

---

### 8. 前端组件

```typescript
// apps/web/src/components/products/ProductCard.tsx
interface ProductCardProps {
  product: {
    productId: string;
    sku: string;
    name: string;
    slug: string;
    description: string;
    images: string[];
    specifications: Record<string, string>;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="group">
      {/* 产品图片 */}
      <div className="aspect-square overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}  // 使用 name 作为 alt
          className="object-cover group-hover:scale-105 transition-transform"
        />
      </div>
      
      {/* 产品信息 */}
      <div className="p-4">
        {/* Product ID (小字，辅助信息) */}
        <p className="text-xs text-gray-500 mb-1">
          ID: {product.productId}
        </p>
        
        {/* Product Name (主标题，醒目) */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {product.name}
        </h3>
        
        {/* SKU (可选显示) */}
        <p className="text-sm text-gray-600 mb-2">
          SKU: {product.sku}
        </p>
        
        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {product.description}
        </p>
        
        {/* Specifications */}
        <div className="flex gap-2 mb-4">
          {Object.entries(product.specifications)
            .slice(0, 3)
            .map(([key, value]) => (
              <span key={key} className="px-2 py-1 bg-gray-100 text-xs rounded">
                {key}: {value}
              </span>
            ))}
        </div>
        
        {/* Actions */}
        <div className="flex gap-2">
          <Link
            to={`/products/${product.slug}`}  // 使用 slug 生成 URL
            className="flex-1 btn-primary"
          >
            View Details
          </Link>
          <button className="flex-1 btn-secondary">
            Add to Inquiry
          </button>
        </div>
      </div>
    </Card>
  );
}
```

---

## 🔍 代码审查清单

### 字段使用检查
- [ ] productId 用于数据库索引和 API 调用
- [ ] sku 用于订单和库存管理
- [ ] name 用于网站展示和搜索
- [ ] slug 用于 URL 路由
- [ ] 四个字段完全分离，不混用
- [ ] 前端显示正确区分各字段

### 数据质量检查
- [ ] productId 格式：PROD-XXXXX
- [ ] sku 格式符合编码规则
- [ ] name 为英文商业名称
- [ ] slug 为小写连字符分隔
- [ ] 所有字段必填
- [ ] 所有字段唯一

---

## ⚠️ 常见错误

### 错误 1: 字段混用

```typescript
// ❌ 错误：使用 productId 作为展示名称
<h1>{product.productId}</h1>  // 不应该显示 PROD-00123 作为标题

// ✅ 正确：使用 name 作为展示名称
<h1>{product.name}</h1>  // 显示 Planetary Ball Mill PM-400
```

### 错误 2: URL 使用错误字段

```typescript
// ❌ 错误：使用 productId 作为 URL
<Link to={`/products/${product.productId}`}>  // /products/PROD-00123

// ✅ 正确：使用 slug 作为 URL
<Link to={`/products/${product.slug}`}>  // /products/planetary-ball-mill-pm-400
```

### 错误 3: 搜索使用错误字段

```typescript
// ❌ 错误：搜索 productId
const results = await Product.find({ productId: /mill/i });

// ✅ 正确：搜索 name
const results = await Product.find({ name: /mill/i });
```

---

## 📊 数据迁移

### 从旧系统迁移

```typescript
// 旧系统数据结构
interface OldProduct {
  id: number;           // 需要转换为 PROD-00001
  code: string;         // 需要转换为 sku
  name: string;         // 保持不变
}

// 新系统数据结构
interface NewProduct {
  productId: string;    // PROD-00001
  sku: string;          // PM-400-STD
  name: string;         // Planetary Ball Mill PM-400
  slug: string;         // planetary-ball-mill-pm-400
}

// 迁移脚本
async function migrateProducts(oldProducts: OldProduct[]) {
  return oldProducts.map((old, index) => ({
    productId: `PROD-${String(index + 1).padStart(5, '0')}`,
    sku: transformCodeToSKU(old.code),
    name: old.name,
    slug: generateSlug(old.name)
  }));
}
```

---

## 🎯 质量验收

### 验收标准
- ✅ productId、sku、name、slug 四个字段完全分离
- ✅ 每个字段有明确的用途和生成规则
- ✅ 前端显示正确区分各字段
- ✅ API 正确使用各字段
- ✅ 数据库索引正确配置
- ✅ SEO 优化正确实施

---

**文档维护**: 技术部  
**最后更新**: 2026-03-21  
**强制执行**: 立即生效
