# Phase 3: 页面开发 (Week 7-9)

**阶段**: Phase 3 (页面开发)  
**周期**: Week 7-9  
**优先级**: P0 - 关键路径  
**预计工时**: 12 天

---

## 🎯 阶段目标

完成所有前端页面的开发，实现完整的用户界面和交互功能。

---

## 📋 Week 7: 核心页面开发

### 任务 7.1: 首页 (Home Page)

**任务 ID**: PHASE3-W7-T1  
**复杂度**: 高  
**预计时间**: 8 小时

#### 任务描述
开发公司首页，展示公司形象、核心产品和优势。

#### 页面结构

```typescript
// apps/web/src/components/pages/HomePage.tsx
export function HomePage() {
  return (
    <main>
      {/* 1. Navigation Bar */}
      <Navigation />
      
      {/* 2. Hero Section */}
      <section className="hero-section">
        <h1>Premium Grinding Solutions for Advanced Materials</h1>
        <p>Serving 500+ enterprises worldwide with innovative milling technology</p>
        <div className="cta-buttons">
          <Button>Explore Products</Button>
          <Button variant="secondary">Watch Video</Button>
        </div>
      </section>
      
      {/* 3. Featured Products */}
      <section className="featured-products">
        <h2>Our Product Lines</h2>
        <ProductGrid products={featuredProducts} />
      </section>
      
      {/* 4. Applications */}
      <section className="applications">
        <h2>Serving Multiple Industries</h2>
        <IndustryIcons industries={industries} />
      </section>
      
      {/* 5. Technology Advantages */}
      <section className="advantages">
        <h2>Why Choose STD Material?</h2>
        <AdvantageCards />
      </section>
      
      {/* 6. Testimonials (Optional) */}
      <section className="testimonials">
        <h2>What Our Customers Say</h2>
        <TestimonialCarousel />
      </section>
      
      {/* 7. CTA Section */}
      <section className="cta-section">
        <h2>Ready to Optimize Your Grinding Process?</h2>
        <Button size="lg">Contact Us Today</Button>
      </section>
      
      {/* 8. Footer */}
      <Footer />
    </main>
  );
}
```

#### SEO 配置
```typescript
export const homePageSEO = {
  title: 'STD Material - Premium Grinding Solutions Manufacturer',
  description: 'Leading manufacturer of planetary ball mills, jet mills, and grinding equipment. Serving 500+ enterprises worldwide with ISO 9001 certified quality.',
  keywords: 'grinding solutions, ball mill, jet mill, planetary mill, grinding equipment',
  openGraph: {
    title: 'STD Material - Premium Grinding Solutions',
    description: 'Professional grinding equipment manufacturer',
    images: ['/og-image.jpg'],
    url: 'https://www.stdmaterial.com'
  }
};
```

#### 验收标准
- ✅ 所有 sections 实现完成
- ✅ 响应式布局正常
- ✅ 动画效果流畅
- ✅ SEO 元数据配置完整
- ✅ 全英文内容

---

### 任务 7.2: 产品目录页 (Product Catalog Page)

**任务 ID**: PHASE3-W7-T2  
**复杂度**: 高  
**预计时间**: 8 小时

#### 页面结构
```typescript
export function ProductCatalogPage() {
  return (
    <main>
      {/* 1. Page Header */}
      <PageHeader title="Our Products" breadcrumb={breadcrumb} />
      
      {/* 2. Main Content */}
      <div className="grid grid-cols-12 gap-8">
        {/* Sidebar - Filters */}
        <aside className="col-span-3">
          <FilterPanel
            categories={categories}
            industries={industries}
            priceRange={priceRange}
            fineness={fineness}
            onFilterChange={handleFilterChange}
          />
        </aside>
        
        {/* Main - Product Grid */}
        <div className="col-span-9">
          {/* Sort Options */}
          <SortOptions
            options={[
              { label: 'Featured', value: 'featured' },
              { label: 'Price: Low to High', value: 'price-asc' },
              { label: 'Price: High to Low', value: 'price-desc' },
              { label: 'Name: A-Z', value: 'name-asc' }
            ]}
            onSortChange={handleSortChange}
          />
          
          {/* Product Grid */}
          <ProductGrid
            products={products}
            loading={loading}
            emptyState={<NoProductsFound />}
          />
          
          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </main>
  );
}
```

#### 验收标准
- ✅ 筛选功能正常
- ✅ 排序功能正常
- ✅ 分页功能正常
- ✅ 响应式布局正常

---

### 任务 7.3: 产品详情页 (Product Detail Page)

**任务 ID**: PHASE3-W7-T3  
**复杂度**: 高  
**预计时间**: 10 小时

#### 页面结构
```typescript
export function ProductDetailPage({ slug }: { slug: string }) {
  const { data: product, loading } = useProduct(slug);
  
  if (loading) return <ProductDetailSkeleton />;
  if (!product) return <NotFoundPage />;
  
  return (
    <main>
      {/* 1. Breadcrumb */}
      <Breadcrumb items={breadcrumb} />
      
      {/* 2. Main Product Section */}
      <div className="grid grid-cols-2 gap-8">
        {/* Left - Images */}
        <div>
          <ProductImageGallery images={product.images} />
        </div>
        
        {/* Right - Info */}
        <div>
          {/* Product ID */}
          <p className="text-sm text-gray-500">ID: {product.productId}</p>
          
          {/* Product Name */}
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          
          {/* SKU */}
          <p className="text-gray-600 mb-4">SKU: {product.sku}</p>
          
          {/* Price */}
          <div className="text-2xl font-bold text-primary-500 mb-4">
            Contact for Price
          </div>
          
          {/* Short Description */}
          <p className="text-gray-700 mb-6">{product.shortDescription}</p>
          
          {/* Key Specifications */}
          <SpecificationsTable specs={product.specifications} />
          
          {/* Actions */}
          <div className="flex gap-4 mb-6">
            <Button size="lg">Get Quote</Button>
            <Button variant="secondary" size="lg">Add to Inquiry</Button>
            <Button variant="outline" size="lg">Download Brochure</Button>
          </div>
          
          {/* Contact Info */}
          <ContactInfo />
        </div>
      </div>
      
      {/* 3. Tabs Section */}
      <Tabs defaultValue="description">
        <TabsList>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="documents">Technical Documents</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
        </TabsList>
        <TabsContent value="description">
          <ProductDescription content={product.description} />
        </TabsContent>
        <TabsContent value="specifications">
          <FullSpecifications specs={product.fullSpecifications} />
        </TabsContent>
        <TabsContent value="applications">
          <ApplicationsList applications={product.applications} />
        </TabsContent>
        <TabsContent value="documents">
          <DocumentList documents={product.documents} />
        </TabsContent>
        <TabsContent value="videos">
          <VideoGallery videos={product.videos} />
        </TabsContent>
      </Tabs>
      
      {/* 4. Related Products */}
      <RelatedProducts categoryId={product.category} currentId={product.productId} />
      
      {/* 5. Inquiry Form */}
      <InquiryForm product={product} />
    </main>
  );
}
```

#### 验收标准
- ✅ 产品信息展示完整
- ✅ productId/sku/name 正确显示
- ✅ 标签页切换正常
- ✅ 图片缩放正常
- ✅ 询盘表单工作正常

---

### 任务 7.4-7.5: 其他页面

**任务 ID**: PHASE3-W7-T4 ~ T5  
**预计时间**: 6 小时

- **404 页面**: 自定义 404 页面，引导用户返回首页
- **Loading 页面**: 全局加载状态

---

## 📋 Week 8: 内容页面开发

### 任务 8.1-8.5: 内容页面

**任务 ID**: PHASE3-W8-T1 ~ T5  
**复杂度**: 中  
**预计时间**: 16 小时

#### 页面清单

**任务 8.1: 关于我们页 (About Us)** (4 小时)
- 公司介绍
- 发展历程时间线
- 核心优势
- 认证资质
- 团队展示
- 工厂展示
- 统计数据

**任务 8.2: 新闻中心页 (News List)** (3 小时)
- 新闻分类
- 新闻列表
- 分页

**任务 8.3: 新闻详情页 (News Detail)** (3 小时)
- 新闻内容
- 发布日期
- 作者信息
- 相关新闻

**任务 8.4: 联系我们页 (Contact)** (3 小时)
- 联系信息
- 联系表单
- Google 地图
- 社交媒体链接

**任务 8.5: 应用案例页 (Applications)** (3 小时)
- 行业解决方案
- 应用案例展示
- 客户故事

#### 验收标准
- ✅ 所有页面实现完成
- ✅ 内容展示正确
- ✅ 响应式布局正常
- ✅ SEO 配置完整

---

## 📋 Week 9: 功能页面开发

### 任务 9.1-9.5: 功能页面

**任务 ID**: PHASE3-W9-T1 ~ T5  
**复杂度**: 中  
**预计时间**: 16 小时

#### 页面清单

**任务 9.1: 搜索页面 (Search Results)** (3 小时)
- 搜索结果列表
- 搜索建议
- 相关筛选

**任务 9.2: 询盘车页面 (Inquiry Cart)** (3 小时)
- 已选产品列表
- 数量调整
- 清除功能

**任务 9.3: 提交询盘页 (Submit Inquiry)** (4 小时)
- 完整表单
- 文件上传
- 表单验证
- 提交反馈

**任务 9.4: 成功页面 (Success Page)** (2 小时)
- 成功提示
- 后续步骤说明
- 返回首页按钮

**任务 9.5: 网站地图页 (Sitemap)** (4 小时)
- XML Sitemap 生成
- HTML Sitemap 页面

#### 验收标准
- ✅ 所有功能页面实现完成
- ✅ 功能工作正常
- ✅ 用户体验流畅

---

## 🎯 阶段交付物

1. ✅ 15+ 完整页面
2. ✅ 页面路由配置
3. ✅ SEO 元数据集成
4. ✅ 响应式布局
5. ✅ 无障碍访问支持

---

## ⚠️ 关键约束

### 全英文网站约束
- ✅ 所有页面内容使用英文
- ✅ 所有按钮文字使用英文
- ✅ 所有表单标签使用英文
- ✅ 所有导航菜单使用英文
- ✅ 所有 SEO 元数据使用英文

### 产品 ID 分离约束
- ✅ 产品详情页必须显示 productId、sku、name
- ✅ 每个字段有正确的样式和位置

### SEO 优化约束
- ✅ 每个页面有唯一的 Title 和 Description
- ✅ 使用语义化 HTML 标签
- ✅ 实现结构化数据
- ✅ 图片有 alt 属性

---

**文档维护**: 技术部  
**最后更新**: 2026-03-21
