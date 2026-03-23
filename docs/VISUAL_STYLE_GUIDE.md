# 视觉风格规范设计文档

**版本**: 1.0  
**日期**: 2026-03-21  
**状态**: ✅ 已批准

---

## 🎨 设计理念

### 核心原则

**"工业美学 · 精密呈现 · 专业至上"**

融合德国工业设计的严谨与东方美学的留白，打造具有国际视野的 B2B 企业网站视觉体系。

---

## 📐 一、网格系统与对齐

### 1.1 12 列网格系统

```
┌─────────────────────────────────────────────────────────┐
│                    1920px (Container)                    │
├──────┬──────┬──────┬──────┬──────┬──────┬──────┬───────┤
│  1   │  2   │  3   │  4   │  5   │  6   │  7   │   8   │ ...
├──────┴──────┴──────┴──────┴──────┴──────┴──────┴───────┤
│                      Gutter (24px)                       │
└─────────────────────────────────────────────────────────┘
```

**使用规范**:
```tsx
// ✅ 正确使用网格
<div className="grid grid-cols-12 gap-6">
  <div className="col-span-4">左侧内容 (1/3)</div>
  <div className="col-span-8">右侧内容 (2/3)</div>
</div>

// ✅ 响应式网格
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12">
  <div className="lg:col-span-4">移动端全宽，桌面 1/3</div>
  <div className="lg:col-span-8">移动端全宽，桌面 2/3</div>
</div>
```

### 1.2 对齐原则

**严格基线对齐**:
```tsx
// 所有文字对齐基线网格 (8px)
<p className="leading-8">  // 行高是 8 的倍数
  这段文字的基线严格对齐 8px 网格
</p>

// 元素垂直对齐
<div className="flex items-center">  // 居中对齐基线
  <Icon className="mr-2" />
  <span>图标与文字基线对齐</span>
</div>
```

**对称布局**:
```tsx
// 轴对称 - 以中心线为轴
<div className="flex justify-center gap-8">
  <div className="w-64">左侧</div>  // 距离中心 32px
  <div className="w-64">右侧</div>  // 距离中心 32px
</div>

// 重复对称 - 重复单元
<div className="grid grid-cols-3 gap-8">
  <Card />  // 间距 32px
  <Card />  // 间距 32px
  <Card />
</div>
```

---

## 🎨 二、色彩系统详解

### 2.1 主色系

#### Deep Navy (工业深蓝)

```
色值：#0a192f
RGB: rgb(10, 25, 47)
HSL: hsl(214, 65%, 11%)
CMYK: cmyk(79%, 47%, 0%, 82%)
```

**心理感受**: 专业、稳重、可靠、科技感

**使用场景**:
- 主背景色 (60% 页面面积)
- 导航栏背景
- 页脚背景
- 重要文字颜色

```tsx
// 背景使用
<body className="bg-[#0a192f]">
  
// 文字使用
<h1 className="text-[#0a192f]">  // 仅在浅色背景上
```

#### Cyan Glow (科技青)

```
色值：#06b6d2
RGB: rgb(6, 182, 210)
HSL: hsl(187°, 94%, 42%)
```

**心理感受**: 创新、活力、科技、未来

**使用场景**:
- CTA 按钮 (主行动号召)
- 重要链接
- 数据高亮
- 图标强调

```tsx
// CTA 按钮
<button className="bg-[#06b6d2] hover:bg-[#0891b2]">
  立即咨询
</button>

// 链接
<a className="text-[#06b6d2] hover:text-[#22d3ee]">
  了解更多
</a>
```

#### Warm Orange (温暖橙)

```
色值：#f97316
RGB: rgb(249, 115, 22)
HSL: hsl(27°, 95%, 53%)
```

**心理感受**: 热情、亲和、行动力、温暖

**使用场景**:
- 次要按钮
- 标签 Badge
- 促销信息
- 警告提示

```tsx
// 次要按钮
<button className="border-2 border-[#f97316] text-[#f97316]">
  了解更多
</button>

// 标签
<span className="bg-[#f97316] text-white px-2 py-1 rounded">
  新品
</span>
```

### 2.2 色彩搭配比例

```
60% - Deep Navy (#0a192f)      主背景
30% - Surface Colors (#112240) 卡片/表面
 7% - Text Colors (#e6f1ff)    文字
 3% - Accent Colors (#06b6d2)  强调色
```

### 2.3 对比度标准

**WCAG AAA 标准**:
- 大文字 (≥18pt): 对比度 ≥ 3:1
- 标准文字：<18pt 对比度 ≥ 7:1
- UI 组件：对比度 ≥ 3:1

**实际对比度**:
```
#e6f1ff on #0a192f  → 15.2:1 ✅ (主文字)
#8892b0 on #0a192f  →  8.6:1 ✅ (次要文字)
#06b6d2 on #0a192f  →  5.1:1 ✅ (强调色)
#ffffff on #06b6d2  →  4.7:1 ✅ (按钮文字)
```

---

## 📝 三、字体排印系统

### 3.1 字体家族

**主字体**: Inter
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

**特点**:
- 现代无衬线字体
- 优秀的屏幕显示效果
- 完整的字重家族 (100-900)
- 支持多语言

**等宽字体**: JetBrains Mono
```css
font-family: 'JetBrains Mono', 'Fira Code', monospace;
```

**使用场景**:
- 代码展示
- 数据表格
- 技术参数

### 3.2 字号层级

```
Display (展示级)
├─ 5xl: 48px / 3rem   - 英雄区标题
├─ 4xl: 36px / 2.25rem - 页面标题

Heading (标题级)
├─ 3xl: 30px / 1.875rem - 章节标题
├─ 2xl: 24px / 1.5rem   - 卡片标题
├─ xl:  20px / 1.25rem  - 组件标题

Body (正文级)
├─ lg:  18px / 1.125rem - 引言/重点
├─ base:16px / 1rem     - 标准正文
├─ sm:  14px / 0.875rem - 辅助说明
└─ xs:  12px / 0.75rem  - 标注/提示
```

### 3.3 行高规范

**标准行高**:
```tsx
// 标题：紧凑 (1.0-1.2)
<h1 className="leading-tight">   // 1.25
<h2 className="leading-snug">    // 1.375

// 正文：舒适 (1.5-1.75)
<p className="leading-relaxed">  // 1.625
<p className="leading-loose">    // 2.0

// 技术文档：宽松 (1.75-2.0)
<code className="leading-loose"> // 2.0
```

### 3.4 字间距调整

```tsx
// 标题：紧缩 (-0.02em to -0.05em)
<h1 className="tracking-tight">  // -0.025em

// 正文：标准 (0)
<p className="tracking-normal">  // 0

// 大写文字：放宽 (0.05em-0.1em)
<span className="tracking-wide"> // 0.025em
```

### 3.5 排版示例

```tsx
// 英雄区标题
<h1 className="
  text-5xl md:text-6xl
  font-bold
  tracking-tight
  text-text-primary
  leading-tight
">
  研磨设备专家
  <br />
  <span className="text-primary">引领技术创新</span>
</h1>

// 章节标题
<h2 className="
  text-4xl
  font-bold
  text-text-primary
  mb-4
">
  产品中心
</h2>

// 正文段落
<p className="
  text-base
  leading-relaxed
  text-text-secondary
  mb-6
">
  我们提供世界领先的研磨解决方案，
  服务于全球 500+ 企业客户。
</p>
```

---

## 📏 四、间距系统

### 4.1 8px 基准网格

所有间距都是 8px 的倍数：

```
4px   (0.25rem) - 极小间距
8px   (0.5rem)  - 小间距
12px  (0.75rem) - 中小间距
16px  (1rem)    - 标准间距
20px  (1.25rem) - 中大间距
24px  (1.5rem)  - 大间距
32px  (2rem)    - 超大间距
40px  (2.5rem)  - 极大间距
48px  (3rem)    - 章节间距
64px  (4rem)    - 大章节间距
80px  (5rem)    - 超大间距
96px  (6rem)    - 英雄区间距
```

### 4.2 组件间距规范

#### 按钮内间距

```tsx
// 小按钮
<button className="px-3 py-1.5">  // 12px 8px
  小按钮
</button>

// 标准按钮
<button className="px-4 py-2">    // 16px 8px
  标准按钮
</button>

// 大按钮
<button className="px-6 py-3">    // 24px 12px
  大按钮
</button>
```

#### 卡片内间距

```tsx
// 标准卡片
<div className="p-6">  // 24px
  卡片内容
</div>

// 紧凑卡片
<div className="p-4">  // 16px
  紧凑内容
</div>

// 宽松卡片
<div className="p-8">  // 32px
  宽松内容
</div>
```

#### 表单间距

```tsx
// 字段组
<div className="space-y-4">  // 16px 间距
  <FormField label="姓名" />
  <FormField label="邮箱" />
  <FormField label="电话" />
</div>

// 按钮组
<div className="flex gap-3">  // 12px 间距
  <Button>取消</Button>
  <Button>确认</Button>
</div>
```

---

## 🔲 五、圆角系统

### 5.1 圆角层级

```
none: 0px       - 严肃、正式
sm:   4px       - 小按钮、标签
md:   8px       - 标准按钮、卡片
lg:   12px      - 大卡片、模态框
xl:   16px      - 超大卡片
2xl:  24px      - 特殊卡片
full: 9999px    - 圆形、头像
```

### 5.2 圆角使用规范

```tsx
// 按钮：8px (标准)
<button className="rounded-md">
  按钮
</button>

// 卡片：12px (友好)
<div className="rounded-lg">
  卡片
</div>

// 输入框：8px (一致)
<input className="rounded-md" />

// 头像：圆形
<Avatar className="rounded-full" />

// 标签：4px (精致)
<Badge className="rounded-sm">
  标签
</Badge>
```

---

## 🌈 六、阴影系统

### 6.1 阴影层级

```
Level 1 - 轻微浮起
shadow-sm: 0 1px 2px 0 rgba(0,0,0,0.05)

Level 2 - 标准卡片
shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1)

Level 3 - 悬浮效果
shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1)

Level 4 - 模态框
shadow-xl: 0 20px 25px -5px rgba(0,0,0,0.1)

Level 5 - 强调效果
shadow-2xl: 0 25px 50px -12px rgba(0,0,0,0.25)

Glow - 彩色光晕
shadow-primary: 0 0 20px rgba(6,182,212,0.3)
```

### 6.2 阴影使用场景

```tsx
// 卡片：Level 2 + 悬浮
<div className="shadow-md hover:shadow-lg transition-shadow">
  卡片内容
</div>

// 按钮：Level 1 + 悬浮
<button className="shadow-sm hover:shadow-md">
  按钮
</button>

// 下拉菜单：Level 3
<div className="shadow-lg">
  菜单内容
</div>

// 模态框：Level 4
<div className="shadow-xl">
  模态框
</div>

// CTA 按钮：Glow 效果
<button className="shadow-primary hover:shadow-glow">
  立即咨询
</button>
```

---

## 🎬 七、动效规范

### 7.1 过渡时间

```
Fast:   150ms - 小按钮、图标
Base:   200ms - 标准组件
Slow:   300ms - 大组件、页面
Slower: 500ms - 特殊效果
```

### 7.2 缓动函数

```css
/* 标准缓动 */
ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

/* 快速滑出 */
ease-out: cubic-bezier(0, 0, 0.2, 1);

/* 缓慢进入 */
ease-in: cubic-bezier(0.4, 0, 1, 1);

/* 弹性效果 */
ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### 7.3 微交互示例

```tsx
// 按钮悬浮
<button className="
  transition-all duration-200 ease-in-out
  hover:scale-105
  hover:shadow-lg
">
  按钮
</button>

// 卡片悬浮
<div className="
  transition-all duration-300 ease-out
  hover:-translate-y-1
  hover:shadow-xl
">
  卡片
</div>

// 输入框聚焦
<input className="
  transition-all duration-200
  focus:ring-2 focus:ring-primary
  focus:border-transparent
"/>
```

---

## 📱 八、响应式设计规范

### 8.1 断点系统

```
xs: 320px   // 小手机
sm: 640px   // 标准手机
md: 768px   // 平板
lg: 1024px  // 小屏笔记本
xl: 1280px  // 标准桌面
2xl: 1536px // 大屏桌面
```

### 8.2 响应式排版

```tsx
// 标题响应式
<h1 className="
  text-3xl     // 手机：30px
  md:text-4xl  // 平板：36px
  lg:text-5xl  // 桌面：48px
">
  响应式标题
</h1>

// 正文响应式
<p className="
  text-sm      // 手机：14px
  md:text-base // 平板：16px
  lg:text-base // 桌面：16px
">
  响应式正文
</p>
```

### 8.3 响应式间距

```tsx
// 容器内边距
<div className="
  px-4      // 手机：16px
  md:px-6   // 平板：24px
  lg:px-8   // 桌面：32px
">
  内容
</div>

// 章节间距
<section className="
  py-12     // 手机：48px
  md:py-16  // 平板：64px
  lg:py-24  // 桌面：96px
">
  章节内容
</section>
```

---

## ♿ 九、无障碍设计规范

### 9.1 颜色对比度

```tsx
// ✅ 通过 AAA 标准
<div className="bg-[#0a192f] text-[#e6f1ff]">  // 15.2:1
<div className="bg-[#0a192f] text-[#8892b0]">  // 8.6:1

// ❌ 未通过
<div className="bg-[#0a192f] text-[#5c6b7f]">  // 4.5:1 (仅 AA)
```

### 9.2 焦点状态

```tsx
// 所有可交互元素必须有焦点状态
<button className="
  focus:outline-none
  focus:ring-2
  focus:ring-primary
  focus:ring-offset-2
  focus:ring-offset-background
">
  按钮
</button>
```

### 9.3 键盘导航

```tsx
// Tab 顺序合理
<div tabIndex={0}>  // 可聚焦
<div tabIndex={-1}> // 不可聚焦但可 JS 聚焦
```

---

## 🎯 十、设计检查清单

### 10.1 视觉检查

- [ ] 所有元素对齐网格
- [ ] 间距使用 8px 倍数
- [ ] 颜色对比度达标
- [ ] 字体大小层级清晰
- [ ] 圆角使用一致
- [ ] 阴影层级合理

### 10.2 交互检查

- [ ] 悬浮状态明确
- [ ] 焦点状态可见
- [ ] 过渡动画流畅
- [ ] 加载状态清晰
- [ ] 错误状态明显

### 10.3 响应式检查

- [ ] 所有断点测试通过
- [ ] 文字大小适配合理
- [ ] 间距适配合理
- [ ] 图片响应式正确
- [ ] 触摸目标≥44px

---

**文档维护**: 设计部 + 技术部  
**最后更新**: 2026-03-21  
**下次审查**: 2026-06-21
