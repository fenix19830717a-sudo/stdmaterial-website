# 全英文网站实施规范

**版本**: 1.0  
**日期**: 2026-03-21  
**优先级**: P0 - 最高优先级  
**适用范围**: 所有前端开发

---

## 🎯 核心要求

**这是一个面向国际市场的 B2B 网站，前端界面必须 100% 英文，零中文显示。**

---

## 📋 实施规范

### 1. 导航系统

#### 1.1 主导航菜单

```typescript
// ✅ 正确示例
export const navigation = {
  main: [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Applications', href: '/applications' },
    { label: 'Technology', href: '/technology' },
    { label: 'About Us', href: '/about-us' },
    { label: 'News', href: '/news' },
    { label: 'Contact', href: '/contact' }
  ]
};

// ❌ 错误示例 (禁止使用中文)
export const navigation = {
  main: [
    { label: '首页', href: '/' },          // ❌ 禁止
    { label: '产品', href: '/products' },  // ❌ 禁止
    { label: '关于我们', href: '/about' }  // ❌ 禁止
  ]
};
```

#### 1.2 面包屑导航

```typescript
// ✅ 正确示例
const breadcrumb = {
  items: [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Grinding Equipment', href: '/products/grinding-equipment' },
    { label: 'Planetary Ball Mill PM-400', href: '/products/planetary-ball-mill-pm-400' }
  ]
};

// ❌ 错误示例
const breadcrumb = {
  items: [
    { label: '首页', href: '/' },              // ❌ 禁止
    { label: '产品中心', href: '/products' }   // ❌ 禁止
  ]
};
```

---

### 2. 按钮文字

#### 2.1 行动按钮

```typescript
// ✅ 正确示例
const buttons = {
  primary: 'Get Quote',
  secondary: 'Learn More',
  addToInquiry: 'Add to Inquiry',
  viewDetails: 'View Details',
  downloadBrochure: 'Download Brochure',
  contactUs: 'Contact Us',
  submit: 'Submit',
  cancel: 'Cancel',
  save: 'Save',
  delete: 'Delete',
  edit: 'Edit',
  search: 'Search',
  filter: 'Filter',
  clearAll: 'Clear All',
  loadMore: 'Load More',
  backToTop: 'Back to Top'
};

// ❌ 错误示例 (禁止使用中文)
const buttons = {
  primary: '获取报价',          // ❌ 禁止
  secondary: '了解更多',        // ❌ 禁止
  addToInquiry: '加入询盘',    // ❌ 禁止
  submit: '提交'               // ❌ 禁止
};
```

#### 2.2 表单按钮

```typescript
// ✅ 正确示例
const formButtons = {
  submitInquiry: 'Submit Inquiry',
  send: 'Send Message',
  requestQuote: 'Request Quote',
  scheduleDemo: 'Schedule Demo',
  downloadNow: 'Download Now',
  subscribe: 'Subscribe',
  register: 'Register',
  login: 'Login',
  logout: 'Logout',
  signUp: 'Sign Up'
};

// ❌ 错误示例
const formButtons = {
  submitInquiry: '提交询盘',    // ❌ 禁止
  send: '发送消息',             // ❌ 禁止
  login: '登录'                 // ❌ 禁止
};
```

---

### 3. 表单标签

#### 3.1 联系表单

```typescript
// ✅ 正确示例
const contactForm = {
  fields: {
    firstName: {
      label: 'First Name',
      placeholder: 'Enter your first name',
      required: 'First name is required'
    },
    lastName: {
      label: 'Last Name',
      placeholder: 'Enter your last name',
      required: 'Last name is required'
    },
    email: {
      label: 'Email Address',
      placeholder: 'your.email@company.com',
      required: 'Email is required',
      invalid: 'Please enter a valid email address'
    },
    company: {
      label: 'Company Name',
      placeholder: 'Your company name'
    },
    phone: {
      label: 'Phone Number',
      placeholder: '+1 (555) 123-4567'
    },
    country: {
      label: 'Country/Region',
      placeholder: 'Select your country'
    },
    subject: {
      label: 'Subject',
      placeholder: 'What is this regarding?'
    },
    message: {
      label: 'Message',
      placeholder: 'Tell us about your requirements...',
      required: 'Message is required',
      minLength: 'Message must be at least 20 characters'
    },
    attachments: {
      label: 'Attachments',
      help: 'Upload drawings or specifications (Max 10MB)'
    }
  }
};

// ❌ 错误示例 (禁止使用中文)
const contactForm = {
  fields: {
    firstName: {
      label: '名字',              // ❌ 禁止
      placeholder: '请输入名字'   // ❌ 禁止
    },
    email: {
      label: '邮箱',              // ❌ 禁止
      required: '邮箱是必填项'    // ❌ 禁止
    }
  }
};
```

---

### 4. 产品信息

#### 4.1 产品字段

```typescript
// ✅ 正确示例
interface Product {
  // 产品标识 (保持分离)
  productId: string;    // 例：PROD-00123
  sku: string;          // 例：PM-400-STD
  name: string;         // 例：Planetary Ball Mill PM-400
  slug: string;         // 例：planetary-ball-mill-pm-400
  
  // 产品描述 (全英文)
  description: string;  // 英文产品描述
  shortDescription: string;  // 英文简短描述
  
  // 规格参数 (英文键值对)
  specifications: {
    'Model': 'PM-400',
    'Power': '2.2 kW',
    'Speed': '0-800 rpm',
    'Capacity': '4x500ml'
  };
  
  // 应用领域 (英文)
  applications: string[];  // ['Mining', 'Ceramics', 'Chemicals']
  
  // 特性 (英文)
  features: string[];  // ['High energy grinding', 'Variable speed']
}

// ❌ 错误示例 (禁止使用中文)
interface Product {
  name: '行星式球磨机',     // ❌ 禁止
  description: '这是一款...',  // ❌ 禁止
  specifications: {
    '型号': 'PM-400',        // ❌ 禁止
    '功率': '2.2 kW'         // ❌ 禁止
  }
};
```

#### 4.2 产品卡片

```typescript
// ✅ 正确示例
<ProductCard>
  <ProductId>ID: PROD-00123</ProductId>
  <ProductName>Planetary Ball Mill PM-400</ProductName>
  <SKU>SKU: PM-400-STD</SKU>
  <Description>High-energy planetary ball mill for laboratory grinding</Description>
  <Features>
    <Feature>4x500ml jars</Feature>
    <Feature>0-800 rpm</Feature>
    <Feature>2.2 kW power</Feature>
  </Features>
  <Actions>
    <Button>View Details</Button>
    <Button>Add to Inquiry</Button>
  </Actions>
</ProductCard>

// ❌ 错误示例 (禁止使用中文)
<ProductCard>
  <ProductId>编号：PROD-00123</ProductId>      // ❌ 禁止
  <ProductName>行星式球磨机 PM-400</ProductName>  // ❌ 禁止
  <Description>高能行星式球磨机...</Description>  // ❌ 禁止
  <Button>查看详情</Button>                      // ❌ 禁止
</ProductCard>
```

---

### 5. 错误和成功消息

#### 5.1 表单验证

```typescript
// ✅ 正确示例
const validationMessages = {
  required: 'This field is required',
  invalid: 'Please enter a valid value',
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid phone number',
  url: 'Please enter a valid URL',
  minLength: 'Must be at least {min} characters',
  maxLength: 'Must be no more than {max} characters',
  pattern: 'Please match the requested format',
  min: 'Value must be at least {min}',
  max: 'Value must be no more than {max}'
};

// ❌ 错误示例 (禁止使用中文)
const validationMessages = {
  required: '此字段为必填项',      // ❌ 禁止
  invalid: '请输入有效的值',      // ❌ 禁止
  email: '请输入有效的邮箱地址'   // ❌ 禁止
};
```

#### 5.2 操作反馈

```typescript
// ✅ 正确示例
const feedbackMessages = {
  // 成功消息
  success: {
    submitted: 'Your inquiry has been submitted successfully',
    saved: 'Changes saved successfully',
    deleted: 'Item deleted successfully',
    uploaded: 'File uploaded successfully',
    subscribed: 'Successfully subscribed to newsletter'
  },
  
  // 错误消息
  error: {
    submit: 'Failed to submit. Please try again.',
    load: 'Failed to load data. Please refresh the page.',
    upload: 'File upload failed. Max size is 10MB.',
    network: 'Network error. Please check your connection.',
    server: 'Server error. Please try again later.'
  },
  
  // 确认消息
  confirm: {
    delete: 'Are you sure you want to delete this item?',
    submit: 'Are you sure you want to submit this inquiry?',
    cancel: 'Are you sure you want to cancel?'
  }
};

// ❌ 错误示例 (禁止使用中文)
const feedbackMessages = {
  success: {
    submitted: '您的询盘已成功提交'  // ❌ 禁止
  }
};
```

---

### 6. SEO 元数据

#### 6.1 页面标题和描述

```typescript
// ✅ 正确示例
const seoConfig = {
  home: {
    title: 'STD Material - Premium Grinding Solutions Manufacturer',
    description: 'Leading manufacturer of planetary ball mills, jet mills, and grinding equipment. ISO 9001 certified. Serving 500+ enterprises worldwide.'
  },
  products: {
    title: 'Grinding Equipment & Solutions | STD Material',
    description: 'Comprehensive range of grinding equipment including planetary ball mills, jet mills, bead mills, and grinding jars. Custom solutions available.'
  }
};

// ❌ 错误示例 (禁止使用中文)
const seoConfig = {
  home: {
    title: '盛通达 - 研磨解决方案制造商',  // ❌ 禁止
    description: '专业的球磨机制造商...'    // ❌ 禁止
  }
};
```

#### 6.2 图片 Alt 属性

```typescript
// ✅ 正确示例
<img
  src="/images/products/pm-400.jpg"
  alt="Planetary Ball Mill PM-400 with 4x500ml grinding jars"
/>

<img
  src="/images/factory/workshop.jpg"
  alt="STD Material manufacturing workshop with quality control equipment"
/>

// ❌ 错误示例 (禁止使用中文)
<img
  src="/images/products/pm-400.jpg"
  alt="行星式球磨机 PM-400"  // ❌ 禁止
/>

<img alt="图片" />  // ❌ 禁止 - 无意义
<img />  // ❌ 禁止 - 缺少 alt
```

---

### 7. 页脚内容

```typescript
// ✅ 正确示例
const footer = {
  companyInfo: {
    name: 'Hunan Shengtongda Material Technology Co., Ltd.',
    address: 'No. 123 Industrial Park, Changsha, Hunan, China',
    phone: '+86-731-1234-5678',
    email: 'info@stdmaterial.com'
  },
  quickLinks: {
    products: 'Products',
    applications: 'Applications',
    about: 'About Us',
    contact: 'Contact',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service'
  },
  social: {
    linkedin: 'LinkedIn',
    facebook: 'Facebook',
    youtube: 'YouTube',
    twitter: 'Twitter'
  },
  certifications: {
    iso: 'ISO 9001:2015 Certified',
    ce: 'CE Certified'
  },
  copyright: '© 2026 STD Material. All rights reserved.'
};

// ❌ 错误示例 (禁止使用中文)
const footer = {
  companyInfo: {
    name: '湖南盛通达材料科技有限公司',  // ❌ 禁止
    address: '中国湖南省长沙市工业园'    // ❌ 禁止
  },
  quickLinks: {
    products: '产品中心',  // ❌ 禁止
    about: '关于我们'      // ❌ 禁止
  }
};
```

---

## 🔍 代码审查清单

### 前端代码检查
- [ ] 所有 UI 文本使用英文
- [ ] 所有按钮文字使用英文
- [ ] 所有表单标签使用英文
- [ ] 所有导航菜单使用英文
- [ ] 所有错误消息使用英文
- [ ] 所有成功消息使用英文
- [ ] 所有占位符使用英文
- [ ] 所有验证消息使用英文
- [ ] 所有 SEO 元数据使用英文
- [ ] 所有图片 alt 属性使用英文
- [ ] 所有变量名使用英文
- [ ] 所有注释使用英文
- [ ] 所有文件名使用英文
- [ ] 所有目录名使用英文

### 内容检查
- [ ] 产品名称使用英文
- [ ] 产品描述使用英文
- [ ] 规格参数使用英文
- [ ] 应用领域使用英文
- [ ] 新闻文章使用英文
- [ ] 案例研究使用英文
- [ ] FAQ 使用英文

---

## ⚠️ 例外情况

### 允许使用中文的场景

**1. 后台管理系统**
```typescript
// 后台管理界面可以使用中文
const adminLabels = {
  dashboard: '仪表盘',      // ✅ 允许 (仅后台)
  products: '产品管理',     // ✅ 允许 (仅后台)
  orders: '订单管理'        // ✅ 允许 (仅后台)
};
```

**2. 客户公司名称**
```typescript
// 客户提供的公司名称保持原样
const customerCompany = '湖南盛通达材料科技有限公司';  // ✅ 允许
```

**3. 技术文档附件**
```typescript
// 可下载的技术文档可以是中文
const documents = [
  { title: 'Product Brochure (English)', language: 'en' },
  { title: '产品手册 (中文)', language: 'zh' }  // ✅ 允许 (下载文档)
];
```

---

## 📊 自动化检查

### ESLint 规则配置

```javascript
// .eslintrc.cjs
module.exports = {
  rules: {
    // 禁止中文字符串 (前台代码)
    'no-chinese-strings': 'error',
    
    // 强制使用英文注释
    'english-comments': 'warn'
  }
};

// 自定义 ESLint 规则
module.exports = {
  rules: {
    'no-chinese-strings': {
      create(context) {
        return {
          Literal(node) {
            if (typeof node.value === 'string' && /[\u4e00-\u9fa5]/.test(node.value)) {
              context.report({
                node,
                message: 'Chinese strings are not allowed. Use English instead.'
              });
            }
          }
        };
      }
    }
  }
};
```

---

## 🎯 质量验收

### 验收标准
- ✅ 前端界面 100% 英文
- ✅ 零中文显示
- ✅ 所有 UI 文本通过审查
- ✅ 所有内容通过审查
- ✅ 所有 SEO 元数据通过审查

### 测试方法
1. 人工审查所有页面
2. 使用脚本扫描中文字符
3. 第三方审核
4. 用户测试

---

**文档维护**: 技术部  
**最后更新**: 2026-03-21  
**强制执行**: 立即生效
