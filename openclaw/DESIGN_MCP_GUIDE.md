# 设计相关 MCP 工具集成指南

## 🎉 好消息！Trae 已经有设计 MCP 工具了！

### 可用的 MCP 工具

1. **shadcn-ui MCP** - UI 组件库和设计系统管理 ✅ **已可用**
2. **Chrome DevTools MCP** - 前端开发和设计调试
3. **知识图谱 MCP** - 设计知识管理（已集成）

---

## shadcn-ui MCP 工具使用指南

### 工具概览

shadcn-ui 提供了 405+ 个 UI 组件和示例，包括：
- 按钮 (Button)
- 卡片 (Card)
- 表单组件 (Form)
- 导航组件 (Navigation)
- 数据展示组件 (Data Display)
- 反馈组件 (Feedback)
- 布局组件 (Layout)

### 可用命令

#### 1. 查看项目注册表
```
使用 mcp_shadcn-ui_get_project_registries
```

#### 2. 列出组件库中的项目
```
使用 mcp_shadcn-ui_list_items_in_registries
参数:
  - registries: ["@shadcn"]
  - limit: 20 (可选，默认显示数量)
  - offset: 0 (可选，分页偏移)
```

#### 3. 搜索组件
```
使用 mcp_shadcn-ui_search_items_in_registries
参数:
  - registries: ["@shadcn"]
  - query: "button" (搜索关键词)
  - limit: 10
```

#### 4. 查看组件详情
```
使用 mcp_shadcn-ui_view_items_in_registries
参数:
  - items: ["@shadcn/button", "@shadcn/card"]
```

#### 5. 获取组件使用示例
```
使用 mcp_shadcn-ui_get_item_examples_from_registries
参数:
  - registries: ["@shadcn"]
  - query: "button-demo"
```

#### 6. 获取组件添加命令
```
使用 mcp_shadcn-ui_get_add_command_for_items
参数:
  - items: ["@shadcn/button", "@shadcn/card"]
```

---

## 快速开始：使用 shadcn-ui MCP

### 步骤 1：查看可用组件
先看看有哪些组件可用：
```
使用 mcp_shadcn-ui_list_items_in_registries 并设置 registries=["@shadcn"]
```

### 步骤 2：搜索你需要的组件
比如搜索按钮组件：
```
使用 mcp_shadcn-ui_search_items_in_registries 
参数：
  registries: ["@shadcn"]
  query: "button"
```

### 步骤 3：查看组件详情
找到想要的组件后，查看详情：
```
使用 mcp_shadcn-ui_view_items_in_registries
参数：
  items: ["@shadcn/button"]
```

### 步骤 4：查看使用示例
查看组件的使用示例：
```
使用 mcp_shadcn-ui_get_item_examples_from_registries
参数：
  registries: ["@shadcn"]
  query: "button-demo"
```

### 步骤 5：获取安装命令
获取将组件添加到项目的命令：
```
使用 mcp_shadcn-ui_get_add_command_for_items
参数：
  items: ["@shadcn/button"]
```

---

## 与现有设计系统结合

### 我们的设计系统特点
- **主色调**: #06b6d4 (青色)
- **字体**: Space Grotesk
- **主题**: 深色工业风格
- **组件**: 已有 btn-primary, btn-secondary, glass-panel, card 等

### 如何结合使用

1. **参考 shadcn-ui 的组件结构**
   - 查看 shadcn-ui 组件的实现方式
   - 借鉴其设计模式和最佳实践

2. **使用 shadcn-ui 作为组件参考库**
   - 搜索你需要的 UI 模式
   - 查看示例代码
   - 适配到我们的设计系统

3. **保持设计一致性**
   - 使用我们的颜色变量
   - 使用我们的字体
   - 遵循我们的间距系统

---

## 实用示例

### 示例 1：搜索按钮组件
```
使用 mcp_shadcn-ui_search_items_in_registries
参数:
  registries: ["@shadcn"]
  query: "button"
  limit: 10
```

### 示例 2：查看卡片组件
```
使用 mcp_shadcn-ui_view_items_in_registries
参数:
  items: ["@shadcn/card"]
```

### 示例 3：获取按钮示例
```
使用 mcp_shadcn-ui_get_item_examples_from_registries
参数:
  registries: ["@shadcn"]
  query: "button-demo"
```

### 示例 4：浏览所有组件
```
使用 mcp_shadcn-ui_list_items_in_registries
参数:
  registries: ["@shadcn"]
  limit: 50
```

---

## 设计工作流程建议

### 1. 设计需求分析
- 确定需要什么 UI 组件
- 参考我们的设计系统文档

### 2. 搜索 shadcn-ui 组件
- 使用搜索功能找到相关组件
- 查看多个组件进行比较

### 3. 查看组件详情和示例
- 了解组件的功能和用法
- 查看实际使用示例

### 4. 适配到我们的设计系统
- 调整颜色方案
- 调整字体和间距
- 保持整体风格一致

### 5. 实现和测试
- 编写组件代码
- 使用 Chrome DevTools 进行调试
- 测试响应式设计

---

## 可用的组件分类

### 基础组件
- button - 按钮
- card - 卡片
- badge - 徽章
- avatar - 头像
- alert - 警告框

### 表单组件
- input - 输入框
- checkbox - 复选框
- radio - 单选框
- select - 选择器
- switch - 开关

### 数据展示
- table - 表格
- pagination - 分页
- tabs - 标签页
- accordion - 手风琴

### 反馈组件
- dialog - 对话框
- toast - 提示
- tooltip - 工具提示
- popover - 弹出框

### 导航组件
- menu - 菜单
- dropdown - 下拉菜单
- breadcrumb - 面包屑

---

## 下一步行动

### 立即可以尝试
1. 浏览 shadcn-ui 组件库
2. 搜索与我们项目相关的组件
3. 查看按钮、卡片等基础组件的示例

### 短期目标
1. 建立 shadcn-ui 与我们设计系统的映射关系
2. 创建常用组件的适配指南
3. 记录设计决策和最佳实践

### 长期目标
1. 初始化 shadcn-ui 项目（如果需要）
2. 创建自定义组件库
3. 建立完整的设计系统文档

---

## 相关资源

- 我们的设计系统文档: `.trae/specs/frontend-refactor-2026/DESIGN_SYSTEM.md`
- 设计系统 CSS: `assets/css/design-system.css`
- shadcn-ui 官网: https://ui.shadcn.com

---

## 提示

- 每次使用 MCP 工具时，明确你想要做什么
- 先搜索，再查看详情，最后看示例
- 始终考虑如何与我们现有的设计系统结合
- 记录有用的组件和用法，方便以后参考
