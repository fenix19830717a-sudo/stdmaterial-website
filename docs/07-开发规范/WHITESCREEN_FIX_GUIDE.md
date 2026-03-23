# 白屏问题修复指南

## 问题描述
在 Vite + React 项目重构过程中，页面出现白屏，HTML 返回正常但 `<div id="root"></div>` 为空。

## 根本原因与解决方案

### 1. BrowserRouter 重复问题

**问题现象**: React Router 嵌套导致路由失效

**根本原因**: 
- `main.tsx` 中使用了 `<BrowserRouter>`
- `App.tsx` 中又使用了 `<BrowserRouter>`
- 导致路由嵌套，页面无法渲染

**解决方案**:
```typescript
// main.tsx - 只在这里使用 BrowserRouter
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// App.tsx - 移除 BrowserRouter，只使用 Routes 和 Route
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/* 其他路由 */}
    </Routes>
  );
}
```

### 2. TypeScript 类型错误

**问题现象**: 编译通过但运行时出错，或类型检查失败

**常见错误**:
- Button 组件 `size` 属性使用了 `"large"` 而不是 `"lg"`
- 导入的类型不匹配（如 `Product` vs `ProductDocument`）
- 函数参数类型不匹配

**解决方案**:
```typescript
// 错误
<Button size="large">Click</Button>

// 正确
<Button size="lg">Click</Button>

// 确保类型定义和导入一致
export interface Product {
  productId: string;
  name: string;
  // ...
}

// 使用时导入正确的类型
import { Product } from '@/types/product';
```

### 3. 导入路径问题

**问题现象**: 模块找不到或导入错误

**常见错误**:
- 相对路径层级错误（`../lib/utils` vs `../../lib/utils`）
- 路径别名配置不正确
- 循环导入

**解决方案**:
```typescript
// 使用路径别名替代相对路径
// 错误
import { cn } from '../../lib/utils';

// 正确
import { cn } from '@/lib/utils';

// vite.config.ts 中配置路径别名
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@lib': path.resolve(__dirname, './src/lib'),
    },
  },
});

// tsconfig.json 中同步配置
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@lib/*": ["./src/lib/*"]
    }
  }
}
```

### 4. 组件导出/导入不匹配

**问题现象**: 导入的组件为 undefined 或类型错误

**常见错误**:
- 默认导出 vs 命名导出混淆
- 重新导出时丢失类型

**解决方案**:
```typescript
// 默认导出
export default function HomePage() { }

// 命名导出
export function ProductCard() { }
export { ProductCard, ProductCardSkeleton };

// 重新导出时保留类型
export { ProductCard, ProductCardSkeleton } from './ProductCard';
export type { Product } from './ProductCard';
```

### 5. Vite 缓存问题

**问题现象**: 修改代码后页面没有更新

**解决方案**:
```bash
# 清除 Vite 缓存
rm -rf node_modules/.vite

# 重启开发服务器
pnpm dev
```

## 排查流程

1. **检查浏览器控制台** - 查看 JavaScript 错误
2. **检查网络请求** - 确认 JS/CSS 文件加载正常
3. **检查 TypeScript 编译** - 运行 `npx tsc --noEmit`
4. **检查 Vite 日志** - 查看终端输出
5. **清除缓存重启** - 清除 `.vite` 缓存并重启服务器

## 预防措施

1. **使用路径别名** - 避免复杂的相对路径
2. **统一导出方式** - 每个模块使用一致的导出方式
3. **类型检查** - 提交前运行 TypeScript 检查
4. **代码审查** - 重点检查路由和导入语句
5. **测试验证** - 每次修改后验证页面正常显示

## 快速修复命令

```bash
# 1. 清除缓存
rm -rf node_modules/.vite apps/web/node_modules/.vite

# 2. 检查类型错误
cd apps/web && npx tsc --noEmit

# 3. 重启服务器
pnpm dev
```
