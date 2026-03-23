# 页面详细描述文档

**版本**: 1.0  
**日期**: 2026-03-21  
**语言**: 全英文网站 (Frontend English Only)

---

## 📄 文档说明

本文档提供网站所有页面的**非代码详细描述**，包括页面目的、内容结构、用户交互、业务逻辑等。

**重要**: 
- ✅ 前端界面 100% 英文
- ✅ 产品 ID 与产品名称完全分离
- ✅ 所有描述为非技术性的业务说明

---

## 🏠 一、首页 (Home Page)

### 页面信息
- **URL**: `/` 或 `/home`
- **模板**: HomePageTemplate
- **SEO**: 核心关键词优化
- **目标用户**: 首次访问的潜在客户、行业专业人士

### 页面目的
作为网站的门户页面，首页承担着展示公司形象、介绍核心业务、引导用户探索的重要职责。需要在 3 秒内传达公司价值，吸引访客继续浏览。

### 内容结构

#### 1. 导航栏 (Navigation Bar)
**位置**: 页面顶部，固定定位

**内容**:
- 公司 Logo (左侧)
- 主菜单项:
  - "Home" - 返回首页
  - "Products" - 产品目录入口
  - "Applications" - 行业解决方案
  - "Technology" - 技术优势介绍
  - "About Us" - 公司介绍
  - "News" - 行业新闻
  - "Contact" - 联系方式
- 右侧功能区:
  - 搜索图标 (点击展开搜索框)
  - 语言选择器 (预留，当前仅英文)
  - "Get Quote" 按钮 (醒目颜色)

**交互**:
- 滚动时自动收缩为精简版
- 移动端显示为汉堡菜单
- 当前页面对应菜单项高亮

---

#### 2. 英雄区 (Hero Section)
**位置**: 导航栏下方，首屏核心区域

**内容**:
- 主标题 (H1): 
  - 文案："Premium Grinding Solutions for Advanced Materials"
  - 字体：48px, 加粗
- 副标题:
  - 文案："Serving 500+ enterprises worldwide with innovative milling technology"
  - 字体：20px, 常规
- CTA 按钮组:
  - 主按钮："Explore Products" (链接到产品目录)
  - 次按钮："Watch Video" (打开视频弹窗)
- 背景:
  - 高质量产品应用视频 (慢动作，工业美感)
  - 或轮播图 (3-5 张，展示不同产品线)

**交互**:
- 视频自动播放 (静音)
- 轮播图 5 秒自动切换
- 按钮悬浮效果 (颜色变化 + 轻微上浮)

---

#### 3. 核心产品线 (Featured Products)
**位置**: 英雄区下方

**内容**:
- 章节标题 (H2): "Our Product Lines"
- 产品卡片 (3-4 个):
  - 行星式球磨机 (Planetary Ball Mill)
    - 产品图片 (高质量，白色背景)
    - 产品名称: "Planetary Ball Mill PM Series"
    - 简短描述: "Precision grinding for laboratory and production"
    - 关键特性图标: 细度、容量、转速
    - "Learn More" 链接
  - 气流磨 (Jet Mill)
  - 砂磨机 (Bead Mill)
  - 研磨罐 (Grinding Jars)

**交互**:
- 卡片悬浮时上浮 + 阴影加深
- 点击图片或链接进入产品详情页
- 响应式布局 (桌面 3 列，平板 2 列，手机 1 列)

---

#### 4. 应用领域 (Applications)
**位置**: 产品线下方

**内容**:
- 章节标题 (H2): "Serving Multiple Industries"
- 行业图标网格 (6-8 个行业):
  - 矿业 (Mining) - 图标 + 文字
  - 陶瓷 (Ceramics)
  - 化工 (Chemicals)
  - 医药 (Pharmaceuticals)
  - 电池 (Batteries)
  - 3D 打印 (3D Printing)
  - 食品 (Food)
  - 化妆品 (Cosmetics)

**交互**:
- 图标悬浮时颜色变化
- 点击跳转到对应行业解决方案页面

---

#### 5. 技术优势 (Technology Advantages)
**位置**: 应用领域下方

**内容**:
- 章节标题 (H2): "Why Choose STD Material?"
- 优势卡片 (4 个):
  - "20+ Years Experience" - 行业经验
  - "ISO 9001 Certified" - 质量认证
  - "Custom Solutions" - 定制能力
  - "Global Support" - 全球服务

**布局**: 2x2 网格或横向排列

---

#### 6. 客户评价 (Testimonials)
**位置**: 技术优势下方 (可选)

**内容**:
- 章节标题 (H2): "What Our Customers Say"
- 客户评价轮播 (3-5 条):
  - 客户公司名称
  - 客户姓名 + 职位
  - 评价内容 (英文)
  - 星级评分 (5 星)

---

#### 7. 行动号召区 (CTA Section)
**位置**: 页面底部，页脚上方

**内容**:
- 主标题: "Ready to Optimize Your Grinding Process?"
- 副标题: "Get a custom solution from our experts"
- 按钮: "Contact Us Today" (链接到联系表单)
- 背景：强调色渐变

---

#### 8. 页脚 (Footer)
**位置**: 页面最底部

**内容**:
- 公司信息:
  - 公司 Logo
  - 公司名称: "Hunan Shengtongda Material Technology Co., Ltd."
  - 地址、电话、邮箱
- 快速链接:
  - Products
  - Applications
  - About Us
  - Contact
- 社交媒体图标:
  - LinkedIn
  - Facebook
  - YouTube
- 认证标志:
  - ISO 9001
  - CE Certification
- 版权信息:
  - "© 2026 STD Material. All rights reserved."

---

### 用户旅程

**首次访问客户**:
1. 看到专业的首页设计 (信任建立)
2. 阅读主标题，了解公司业务 (价值传达)
3. 浏览核心产品线 (兴趣激发)
4. 查看应用领域，确认行业匹配 (需求确认)
5. 点击"Explore Products"深入了解 (行动引导)

**行业专业人士**:
1. 快速扫描技术关键词 (专业识别)
2. 查看产品规格 (技术评估)
3. 寻找应用案例 (可行性验证)
4. 点击"Get Quote"咨询 (转化)

---

## 🛍️ 二、产品目录页 (Product Catalog Page)

### 页面信息
- **URL**: `/products`
- **模板**: ProductCatalogTemplate
- **SEO**: 产品类型关键词
- **目标用户**: 有明确采购需求的客户、工程师、采购经理

### 页面目的
展示完整的产品线，提供强大的筛选和搜索功能，帮助用户快速找到所需产品。

### 内容结构

#### 1. 页面标题区
- 主标题 (H1): "Our Products"
- 面包屑导航: Home > Products
- 简短描述: "Comprehensive grinding solutions for various applications"

#### 2. 筛选器 (左侧栏)
**分类筛选**:
- 复选框列表:
  - ☑ Grinding Equipment
  - ☐ Grinding Media
  - ☐ Grinding Jars
  - ☐ Accessories

**行业筛选**:
- 复选框列表:
  - ☐ Mining
  - ☐ Ceramics
  - ☐ Chemicals
  - ☐ Pharmaceuticals

**价格范围**:
- 滑块控制: $0 - $100,000+
- 输入框：Min - Max

**应用细度**:
- 单选按钮:
  - ○ Coarse (>100μm)
  - ○ Fine (10-100μm)
  - ○ Ultra-fine (<10μm)

**按钮**:
- "Apply Filters" (应用筛选)
- "Reset" (清除筛选)

#### 3. 产品网格 (主内容区)
**排序选项**:
- 下拉菜单:
  - "Sort by: Featured"
  - "Price: Low to High"
  - "Price: High to Low"
  - "Name: A-Z"
  - "Newest First"

**产品卡片** (每行 3 个):
- 产品图片 (400x400px, 白色背景)
- 产品 ID: "PROD-00123" (小字，灰色)
- 产品名称: "Planetary Ball Mill PM-400" (加粗)
- SKU: "PM-400-STD" (可选显示)
- 简短描述: "4x500ml jars, 800rpm max speed"
- 关键特性图标 (3-4 个)
- 价格: "Contact for Price" 或 "$15,000"
- 按钮:
  - "View Details" (主按钮)
  - "Add to Inquiry" (次按钮)

**分页**:
- 页码显示: "1 2 3 ... 10"
- 上一页/下一页按钮
- 每页数量选择: "Show 12/24/48 per page"

#### 4. 搜索结果 (无结果时)
- 提示文字: "No products found matching your criteria"
- 建议:
  - "Try adjusting your filters"
  - "Browse all products"
  - "Contact us for custom solutions"

---

## 📄 三、产品详情页 (Product Detail Page)

### 页面信息
- **URL**: `/products/[product-slug]`
- **示例**: `/products/planetary-ball-mill-pm-400`
- **模板**: ProductDetailTemplate
- **SEO**: 产品具体关键词

### 页面目的
提供产品的完整信息，包括详细规格、应用场景、技术文档，促成询盘或采购意向。

### 内容结构

#### 1. 面包屑导航
- 路径: Home > Products > Grinding Equipment > Planetary Ball Mill PM-400

#### 2. 产品主图区 (左侧 2/3)
- 主图展示 (800x800px):
  - 高质量产品图片
  - 支持缩放查看细节
- 缩略图列表 (底部或右侧):
  - 3-5 张不同角度图片
  - 1-2 张应用现场图片
  - 1 张技术图纸

#### 3. 产品信息区 (右侧 1/3)
**产品标识**:
- 产品 ID: "PROD-00123" (小字，灰色)
- 产品名称 (H1): "Planetary Ball Mill PM-400"
- SKU: "PM-400-STD" (如有)

**价格信息**:
- 价格标签: "Contact for Price" 或 "$15,000 - $18,000"
- 价格说明: "Price varies by configuration"

**简短描述**:
- "High-energy planetary ball mill for laboratory and small-scale production. Features 4x500ml grinding jars and variable speed control."

**关键参数**:
- 转速范围：0-800 rpm
- 装料容量：4x500ml
- 电机功率：2.2 kW
- 外形尺寸：650x550x850mm

**行动按钮**:
- "Get Quote" (主按钮，醒目颜色)
- "Add to Inquiry Cart" (次按钮)
- "Download Brochure" (PDF 下载)

**联系信息**:
- "Need help?"
- 电话图标 + 号码
- 邮箱图标 + 地址
- "Chat with Expert" (在线聊天)

#### 4. 详细信息标签页 (下方通栏)

**标签 1: Description (产品描述)**
- 完整产品介绍 (300-500 词)
- 工作原理说明
- 适用材料列表
- 技术亮点

**标签 2: Specifications (规格参数)**
- 详细参数表格:
  ```
  Model: PM-400
  Power Supply: 220V/50Hz
  Motor Power: 2.2 kW
  Speed Range: 0-800 rpm
  Jar Capacity: 4x500ml
  Max Loading: 2/3 of jar volume
  Noise Level: <60dB
  Weight: 180kg
  Dimensions: 650x550x850mm
  ```

**标签 3: Applications (应用领域)**
- 适用行业图标 + 说明
- 适用材料列表:
  - Geological samples
  - Minerals
  - Ceramics
  - Chemicals
  - Pharmaceuticals

**标签 4: Technical Documents (技术文档)**
- 可下载文件列表:
  - Product Brochure (PDF, 2MB)
  - Technical Specifications (PDF, 500KB)
  - Operation Manual (PDF, 5MB)
  - Maintenance Guide (PDF, 1MB)

**标签 5: Videos (视频)**
- 产品演示视频 (嵌入 YouTube/Vimeo)
- 客户案例视频
- 操作培训视频

#### 5. 相关产品推荐
- 章节标题: "Related Products"
- 产品卡片 (4 个):
  - 同类型不同型号
  - 配套设备 (研磨罐、研磨球)
  - 配件

#### 6. 询盘表单 (页面底部或弹窗)
**表单字段**:
- 姓名 (必填)
- 邮箱 (必填)
- 公司名称
- 电话
- 国家/地区
- 感兴趣的产品 (自动填充当前产品)
- 需求数量
- 细度要求
- 应用材料
- 留言内容
- 验证码

**提交按钮**:
- "Submit Inquiry"
- 隐私政策同意复选框

---

## 📝 四、关于我们页 (About Us Page)

### 页面信息
- **URL**: `/about-us`
- **模板**: AboutPageTemplate
- **SEO**: 公司名称、行业关键词

### 页面目的
建立信任，展示公司实力，传达企业价值观。

### 内容结构

#### 1. 页面标题区
- 主标题 (H1): "About STD Material"
- 副标题: "20+ Years of Grinding Excellence"

#### 2. 公司介绍
- 成立年份: "Founded in 200X"
- 公司简介: 200-300 词
- 核心业务说明
- 市场定位

#### 3. 发展历程 (时间线)
- 200X: 公司成立
- 201X: 通过 ISO 9001 认证
- 201X: 出口业务启动
- 201X: 新工厂落成
- 202X: 服务 500+ 客户

#### 4. 核心优势
- 技术实力
- 质量控制
- 定制能力
- 全球服务网络

#### 5. 认证资质
- ISO 9001 证书图片
- CE 认证
- 其他资质证书

#### 6. 团队展示
- 核心团队照片
- 技术专家简介
- 销售团队

#### 7. 工厂展示
- 生产车间图片
- 检测设备
- 仓库

#### 8. 数据统计
- "20+ Years Experience"
- "500+ Enterprise Customers"
- "50+ Countries Served"
- "10,000+ Units Sold"

---

## 📰 五、新闻中心 (News Page)

### 页面信息
- **URL**: `/news`
- **模板**: NewsListTemplate
- **SEO**: 行业新闻关键词

### 页面目的
展示公司动态、行业资讯，提升 SEO 排名。

### 内容结构

#### 1. 页面标题
- 主标题: "News & Insights"

#### 2. 新闻分类
- All News
- Company News
- Industry Trends
- Product Updates
- Events

#### 3. 新闻列表
**新闻卡片** (按时间倒序):
- 封面图片
- 分类标签: "Company News"
- 标题: "STD Material Launches New PM-500 Planetary Ball Mill"
- 摘要: 100-150 词
- 发布日期: "March 15, 2026"
- 阅读更多链接

#### 4. 分页
- 页码导航
- RSS 订阅链接

---

## 📞 六、联系我们页 (Contact Page)

### 页面信息
- **URL**: `/contact`
- **模板**: ContactTemplate
- **SEO**: 联系相关关键词

### 页面目的
提供多种联系方式，方便客户咨询。

### 内容结构

#### 1. 页面标题
- 主标题: "Get in Touch"
- 副标题: "We're here to help with your grinding needs"

#### 2. 联系方式
**公司信息**:
- 公司名称
- 地址
- 电话
- 邮箱
- 工作时间

**社交媒体**:
- LinkedIn
- Facebook
- YouTube

#### 3. 联系表单
**表单字段**:
- 姓名 (必填)
- 邮箱 (必填)
- 公司名称
- 电话
- 主题
- 留言内容 (必填)
- 附件上传 (可选)

#### 4. 地图
- Google Maps 嵌入
- 公司位置标记

---

**文档持续更新中...**

---

**文档维护**: 技术部 + 市场部  
**最后更新**: 2026-03-21  
**下次审查**: 2026-04-21
