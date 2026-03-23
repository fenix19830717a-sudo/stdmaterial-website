# 导入路径修复指南

**问题**: `Uncaught SyntaxError: The requested module '/src/lib/utils.js' does not provide an export named 'cn'`

**原因**: 组件文件中导入路径错误

---

## 🔍 问题描述

当看到以下错误时：

```
Uncaught SyntaxError: The requested module '/src/lib/utils.js' does not provide an export named 'cn'
```

这是因为组件文件中的导入路径不正确。

---

## ✅ 解决方案

### 1. 正确的导入路径规则

在 `apps/web/src/components/` 目录下的文件：

```typescript
// ❌ 错误 - 少了一层目录
import { cn } from '../lib/utils';

// ✅ 正确 - 使用 ../../ 回到 src 目录
import { cn } from '../../lib/utils';
```

### 2. 目录结构说明

```
apps/web/src/
├── components/
│   ├── ui/           ← 组件目录 (深度：2 层)
│   │   ├── Button.tsx
│   │   └── Card.tsx
│   ├── layout/       ← 布局组件 (深度：2 层)
│   │   └── Navigation.tsx
│   └── products/     ← 产品组件 (深度：2 层)
│       └── ProductCard.tsx
├── lib/
│   └── utils.ts      ← 工具函数 (深度：1 层)
└── pages/
    └── HomePage.tsx  ← 页面 (深度：1 层)
```

### 3. 路径计算规则

从组件目录到 lib 目录：
- `components/ui/Button.tsx` → `lib/utils.ts`
- 需要向上 2 层：`../../`
- 然后进入 lib：`../../lib/utils`

---

## 🛠️ 批量修复命令

### 检查所有错误的导入路径

```bash
cd /var/www/html/stdmaterial.com/stdmaterial-rewrite

# 查找所有使用错误路径的文件
grep -r "from '../lib/utils'" apps/web/src/components/
```

### 批量修复命令

```bash
# 修复所有错误的导入路径
find apps/web/src/components -name "*.tsx" -o -name "*.ts" | xargs sed -i "s|from '../lib/utils'|from '../../lib/utils'|g"
```

### 验证修复

```bash
# 验证所有文件都使用正确的路径
grep -r "from.*lib/utils" apps/web/src/components/
```

---

## 📋 常见场景路径对照表

| 文件位置 | 目标文件 | 错误路径 | 正确路径 |
|---------|---------|---------|---------|
| `components/ui/Button.tsx` | `lib/utils.ts` | `../lib/utils` | `../../lib/utils` |
| `components/layout/Navigation.tsx` | `lib/utils.ts` | `../lib/utils` | `../../lib/utils` |
| `components/products/ProductCard.tsx` | `lib/utils.ts` | `../lib/utils` | `../../lib/utils` |
| `pages/HomePage.tsx` | `lib/utils.ts` | `../lib/utils` | `./lib/utils` |
| `pages/HomePage.tsx` | `components/ui/Button` | `../components/ui/Button` | `./components/ui/Button` |

---

## 🎯 最佳实践

### 1. 使用绝对路径导入 (推荐)

在 `tsconfig.json` 中配置路径别名：

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["apps/web/src/*"],
      "@components/*": ["apps/web/src/components/*"],
      "@lib/*": ["apps/web/src/lib/*"]
    }
  }
}
```

使用方式：

```typescript
// ✅ 推荐 - 使用绝对路径
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
```

### 2. 创建导入检查脚本

在项目根目录创建 `.vscode/settings.json`:

```json
{
  "eslint.rules.customizations": [
    {
      "rule": "import/no-relative-packages",
      "severity": "error"
    }
  ]
}
```

### 3. 使用 ESLint 规则

在 `.eslintrc.cjs` 中添加：

```javascript
module.exports = {
  rules: {
    'import/no-relative-packages': 'error',
    'import/no-extraneous-dependencies': 'error'
  }
};
```

---

## 🔧 自动化修复脚本

创建脚本 `scripts/fix-imports.sh`:

```bash
#!/bin/bash

echo "🔍 检查导入路径..."

# 查找错误的导入
ERRORS=$(grep -r "from '../lib/utils'" apps/web/src/components/ 2>/dev/null)

if [ -n "$ERRORS" ]; then
  echo "❌ 发现错误的导入路径:"
  echo "$ERRORS"
  echo ""
  echo "🔧 正在修复..."
  
  # 批量修复
  find apps/web/src/components -name "*.tsx" -o -name "*.ts" | \
    xargs sed -i "s|from '../lib/utils'|from '../../lib/utils'|g"
  
  echo "✅ 修复完成!"
else
  echo "✅ 所有导入路径正确!"
fi
```

---

## 📝 检查清单

在提交代码前检查：

- [ ] 所有组件使用 `../../lib/utils` 导入工具函数
- [ ] 页面文件使用 `./lib/utils` 或 `@/lib/utils` 导入
- [ ] 没有使用 `../lib/utils` (少一层)
- [ ] 使用路径别名（如果配置了）
- [ ] 运行项目无导入错误

---

## 🚨 快速诊断步骤

1. **看到错误**: `does not provide an export named 'cn'`
2. **检查文件**: 打开报错的组件文件
3. **查看导入**: 检查 `import { cn } from ...` 的路径
4. **计算层级**: 数一下需要多少个 `../`
5. **修复路径**: 改为正确的相对路径或绝对路径
6. **保存刷新**: 保存文件，浏览器自动刷新

---

## 💡 记忆技巧

**"组件两层，页面一层"**

- 组件文件 (`components/`) → `lib/`: 需要 `../../`
- 页面文件 (`pages/`) → `lib/`: 需要 `./` 或 `@/`

**"UI 组件都一样"**

- 所有 `components/ui/*` 文件都使用 `../../lib/utils`
- 所有 `components/layout/*` 文件都使用 `../../lib/utils`
- 所有 `components/products/*` 文件都使用 `../../lib/utils`

---

**最后更新**: 2026-03-21  
**维护者**: Development Team  
**状态**: ✅ 已验证

