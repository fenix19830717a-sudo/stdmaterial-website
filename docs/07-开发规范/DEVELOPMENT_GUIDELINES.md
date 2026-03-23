# 开发规范文档

## 1. 项目架构

### 1.1 技术栈
- **前端框架**: React 19 + TypeScript
- **构建工具**: Vite 8 (使用 rolldown)
- **样式方案**: Tailwind CSS + 自定义 CSS
- **路由**: React Router v6
- **状态管理**: React useState + useContext (轻量级)
- **图标**: Material Symbols

### 1.2 目录结构
```
stdmaterial-rewrite/
├── apps/
│   ├── web/           # 主网站应用
│   │   ├── src/
│   │   │   ├── components/    # 通用组件
│   │   │   ├── pages/         # 页面组件
│   │   │   ├── data/          # 静态数据
│   │   │   ├── lib/           # 工具库
│   │   │   ├── styles/        # 全局样式
│   │   │   ├── types/         # TypeScript 类型
│   │   │   ├── App.tsx        # 应用根组件
│   │   │   └── main.tsx       # 应用入口
│   └── admin/        # 管理后台应用
├── packages/         # 共享包
└── docs/             # 文档
```

## 2. 编码规范

### 2.1 TypeScript 规范
- **严格模式**: 启用 `strict` 模式
- **类型定义**: 为所有组件和函数添加类型注解
- **接口命名**: 使用 `PascalCase` 命名接口
- **类型导出**: 优先使用 `export type` 导出类型
- **可选属性**: 使用 `?` 标记可选属性

### 2.2 React 规范
- **函数组件**: 优先使用函数组件和 Hooks
- **命名规范**: 组件名使用 `PascalCase`，变量和函数使用 `camelCase`
- **Props 传递**: 使用解构赋值和默认值
- **Hooks 顺序**: 遵循 Hooks 调用规则，放在组件顶部
- **状态管理**: 优先使用 `useState`，复杂状态使用 `useReducer`

### 2.3 样式规范
- **Tailwind 优先**: 优先使用 Tailwind 类名
- **自定义样式**: 复杂样式使用 CSS 类
- **命名规范**: CSS 类名使用 `kebab-case`
- **主题变量**: 使用 Tailwind 配置中的主题变量
- **响应式设计**: 使用 Tailwind 响应式前缀

## 3. 导入路径规范

### 3.1 路径别名
使用 `@/` 前缀作为项目根路径别名：
```typescript
// 推荐
import { Button } from '@/components/ui/Button';
import { labMillsCategories } from '@/data/labMillsProducts';

// 不推荐
import { Button } from '../../components/ui/Button';
```

### 3.2 导入顺序
1. 第三方库
2. 项目共享组件
3. 本地组件和工具
4. 样式文件

## 4. 组件开发规范

### 4.1 组件结构
- **单一职责**: 每个组件只负责一个功能
- **可复用性**: 设计通用组件时考虑可复用性
- **Props 接口**: 为组件定义清晰的 Props 接口
- **默认值**: 为可选 Props 提供默认值

### 4.2 组件命名
- **页面组件**: `[PageName]Page.tsx` (如 `HomePage.tsx`)
- **功能组件**: `[ComponentName].tsx` (如 `Button.tsx`)
- **布局组件**: 放在 `components/layout/` 目录
- **UI 组件**: 放在 `components/ui/` 目录
- **业务组件**: 放在 `components/[business]/` 目录

## 5. 白屏问题排查与修复

### 5.1 常见白屏原因
1. **BrowserRouter 重复**: 在 `main.tsx` 和 `App.tsx` 中同时使用 BrowserRouter
2. **TypeScript 类型错误**: 类型不匹配导致编译失败
3. **导入路径错误**: 相对路径引用错误
4. **组件渲染错误**: 组件内部逻辑错误
5. **Browser 扩展冲突**: 某些浏览器扩展可能导致白屏

### 5.2 解决方案
1. **BrowserRouter 重复**:
   - 只在 `main.tsx` 中使用 BrowserRouter
   - 从 `App.tsx` 中移除 BrowserRouter

2. **TypeScript 类型错误**:
   - 运行 `npm run typecheck` 检查类型错误
   - 修复所有类型错误
   - 确保类型定义正确

3. **导入路径错误**:
   - 使用 `@/` 路径别名
   - 检查文件路径是否正确
   - 确保文件存在

4. **组件渲染错误**:
   - 检查组件内部逻辑
   - 使用 React DevTools 调试
   - 检查控制台错误信息

5. **Browser 扩展冲突**:
   - 禁用浏览器扩展
   - 使用隐私模式测试
   - 检查网络请求

## 6. 性能优化

### 6.1 代码分割
- 使用 React.lazy() 进行组件懒加载
- 按路由分割代码
- 避免一次性加载所有资源

### 6.2 渲染优化
- 使用 useMemo() 缓存计算结果
- 使用 useCallback() 缓存函数
- 避免不必要的重渲染
- 合理使用 key 属性

### 6.3 资源优化
- 图片优化: 使用适当的图片格式和大小
- 字体优化: 按需加载字体
- 代码压缩: 启用生产环境压缩

## 7. 测试规范

### 7.1 测试类型
- **单元测试**: 测试单个组件和函数
- **集成测试**: 测试组件之间的交互
- **端到端测试**: 测试完整的用户流程

### 7.2 测试工具
- **Jest**: 单元测试框架
- **React Testing Library**: 组件测试
- **Cypress**: 端到端测试

## 8. 部署规范

### 8.1 构建流程
1. 运行 `npm run build` 构建生产版本
2. 检查构建输出是否正确
3. 部署到服务器

### 8.2 环境配置
- **开发环境**: `.env.development`
- **生产环境**: `.env.production`
- **环境变量**: 使用 `import.meta.env` 访问

## 9. 代码审查规范

### 9.1 审查要点
- 代码质量: 可读性、可维护性
- 类型安全: TypeScript 类型检查
- 性能问题: 潜在的性能瓶颈
- 安全问题: 潜在的安全漏洞
- 代码风格: 遵循项目规范

### 9.2 审查流程
1. 提交代码到分支
2. 创建 Pull Request
3. 团队成员审查
4. 修复问题
5. 合并代码

## 10. 常见问题解决方案

### 10.1 白屏问题
**症状**: 页面空白，控制台有错误信息
**解决方案**: 检查 BrowserRouter 配置、TypeScript 类型、导入路径

### 10.2 路由问题
**症状**: 路由跳转失败，404 错误
**解决方案**: 检查路由配置、路径匹配、重定向设置

### 10.3 状态管理问题
**症状**: 状态更新不生效，组件不重新渲染
**解决方案**: 检查状态更新逻辑、依赖项数组、不可变数据

### 10.4 样式问题
**症状**: 样式不生效，布局错乱
**解决方案**: 检查 Tailwind 类名、CSS 选择器、响应式设计

## 11. 开发工具推荐

### 11.1 VS Code 扩展
- **ESLint**: 代码质量检查
- **Prettier**: 代码格式化
- **TypeScript**: TypeScript 支持
- **Tailwind CSS IntelliSense**: Tailwind 类名提示
- **React DevTools**: React 调试

### 11.2 命令行工具
- **npm**: 包管理
- **Vite**: 开发服务器
- **ESLint**: 代码检查
- **Prettier**: 代码格式化

## 12. 最佳实践

### 12.1 代码组织
- 按功能模块组织代码
- 使用文件夹结构清晰表达代码关系
- 保持文件大小合理（单个文件不超过 500 行）

### 12.2 命名规范
- **文件命名**: 使用 `kebab-case`
- **组件命名**: 使用 `PascalCase`
- **变量命名**: 使用 `camelCase`
- **常量命名**: 使用 `UPPER_SNAKE_CASE`

### 12.3 注释规范
- **文件注释**: 描述文件用途和功能
- **函数注释**: 描述函数参数和返回值
- **复杂逻辑**: 为复杂逻辑添加注释
- **TODO 注释**: 使用 `// TODO:` 标记待完成的任务

### 12.4 错误处理
- 使用 try-catch 捕获异常
- 提供友好的错误提示
- 记录错误日志
- 防止错误影响整个应用

## 13. 版本控制

### 13.1 Git 规范
- **分支命名**: `feature/[feature-name]`, `bugfix/[bug-name]`
- **提交信息**: 清晰描述提交内容
- **代码合并**: 使用 Pull Request
- **版本标签**: 按语义化版本号标记

### 13.2 提交信息格式
```
<type>(<scope>): <subject>

<body>

<footer>
```

**类型**:
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码风格调整
- `refactor`: 代码重构
- `test`: 测试更新
- `chore`: 构建或依赖更新

## 14. 文档管理

### 14.1 项目文档
- **README.md**: 项目概述和安装说明
- **CHANGELOG.md**: 版本更新记录
- **CONTRIBUTING.md**: 贡献指南
- **CODE_OF_CONDUCT.md**: 行为规范

### 14.2 技术文档
- **架构文档**: 系统架构设计
- **API 文档**: API 接口说明
- **开发规范**: 本文档
- **问题排查**: 常见问题解决方案

## 15. 安全规范

### 15.1 安全注意事项
- 避免 XSS 攻击: 对用户输入进行过滤
- 避免 CSRF 攻击: 使用 CSRF token
- 避免 SQL 注入: 使用参数化查询
- 密码安全: 使用加密存储
- API 安全: 使用 JWT 认证

### 15.2 安全检查
- 定期进行安全扫描
- 检查依赖包漏洞
- 遵循安全最佳实践
- 保持软件更新

---

## 附录

### 附录 A: 常用命令
- `npm run dev`: 启动开发服务器
- `npm run build`: 构建生产版本
- `npm run preview`: 预览生产构建
- `npm run lint`: 代码检查
- `npm run typecheck`: TypeScript 类型检查
- `npm run format`: 代码格式化

### 附录 B: 环境变量
| 变量名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| `VITE_API_URL` | string | `http://localhost:3000` | API 基础 URL |
| `VITE_APP_ENV` | string | `development` | 应用环境 |
| `VITE_APP_VERSION` | string | `1.0.0` | 应用版本 |

### 附录 C: 组件库
- **布局组件**: Navigation, Footer, Breadcrumb
- **UI 组件**: Button, Input, Card, Modal, Dropdown
- **业务组件**: ProductCard, FilterPanel, WaterfallProductGrid
- **表单组件**: Form, FormInput, FormSelect, FormCheckbox

### 附录 D: 设计系统
- **颜色**: deep-navy #020617, primary #06b6d4, secondary #f97316
- **字体**: Space Grotesk (标题), Inter (正文)
- **图标**: Material Symbols
- **间距**: 4px, 8px, 16px, 24px, 32px, 48px
- **圆角**: 4px, 8px, 12px, 16px, 24px

---

**最后更新**: 2026-03-22
