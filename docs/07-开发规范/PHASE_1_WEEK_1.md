# Phase 1 - Week 1: Monorepo 架构搭建

**阶段**: Phase 1 (项目初始化)  
**周次**: Week 1  
**优先级**: P0 - 关键路径  
**预计工时**: 3 天

---

## 🎯 本周目标

搭建完整的 Monorepo 项目架构，为后续开发提供统一的基础设施。

---

## 📋 任务清单

### 任务 1.1: 创建 pnpm workspace 配置

**任务 ID**: PHASE1-W1-T1  
**复杂度**: 低  
**预计时间**: 2 小时

#### 任务描述
配置 pnpm workspace，实现多包管理和依赖共享。

#### 实施步骤

**步骤 1: 创建项目根目录结构**
```bash
# 创建新项目目录
mkdir -p stdmaterial-rewrite
cd stdmaterial-rewrite

# 初始化 git 仓库
git init

# 创建 .gitignore
cat > .gitignore << EOF
node_modules
dist
.build
*.local
.DS_Store
EOF
```

**步骤 2: 创建 pnpm-workspace.yaml**
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'tools/*'
```

**步骤 3: 创建根 package.json**
```json
{
  "name": "stdmaterial-rewrite",
  "version": "1.0.0",
  "private": true,
  "packageManager": "pnpm@9.0.0",
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "clean": "turbo run clean"
  },
  "devDependencies": {
    "turbo": "^2.0.0"
  }
}
```

**步骤 4: 创建 turbo.json**
```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**"]
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["build"]
    },
    "clean": {
      "cache": false
    }
  }
}
```

#### 验收标准
- ✅ pnpm workspace 配置正确
- ✅ 可以执行 `pnpm install` 无错误
- ✅ turbo 可以识别工作区包
- ✅ 根 scripts 可以正常运行

---

### 任务 1.2: 创建应用目录结构

**任务 ID**: PHASE1-W1-T2  
**复杂度**: 低  
**预计时间**: 3 小时

#### 任务描述
创建标准化的 Monorepo 目录结构。

#### 目录结构

```
stdmaterial-rewrite/
├── apps/
│   ├── web/                    # 主网站应用
│   │   ├── src/
│   │   │   ├── app/           # React Router 路由
│   │   │   ├── components/    # 页面级组件
│   │   │   ├── hooks/         # React Hooks
│   │   │   ├── lib/           # 工具库
│   │   │   ├── styles/        # 全局样式
│   │   │   ├── types/         # TypeScript 类型
│   │   │   └── main.tsx       # 入口文件
│   │   ├── public/
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── vite.config.ts
│   │   └── tailwind.config.js
│   │
│   └── admin/                  # 管理后台应用 (预留)
│       ├── src/
│       ├── package.json
│       └── ...
│
├── packages/
│   ├── ui/                     # 共享 UI 组件库
│   │   ├── src/
│   │   │   ├── button/
│   │   │   ├── input/
│   │   │   ├── card/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   │
│   ├── config/                 # 共享配置
│   │   ├── eslint-config/
│   │   ├── typescript-config/
│   │   └── tailwind-config/
│   │
│   └── utils/                  # 共享工具函数
│       ├── src/
│       ├── package.json
│       └── tsconfig.json
│
├── tools/
│   ├── scripts/                # 构建脚本
│   └── generators/             # 代码生成器
│
├── docs/                       # 项目文档
├── package.json                # 根 package.json
├── pnpm-workspace.yaml
├── turbo.json
└── tsconfig.json               # 根 TypeScript 配置
```

#### 实施步骤

**步骤 1: 创建目录**
```bash
# 创建应用目录
mkdir -p apps/web/src/{app,components,hooks,lib,styles,types}
mkdir -p apps/web/public
mkdir -p apps/admin/src

# 创建包目录
mkdir -p packages/ui/src/{button,input,card}
mkdir -p packages/config/{eslint-config,typescript-config,tailwind-config}
mkdir -p packages/utils/src

# 创建工具目录
mkdir -p tools/{scripts,generators}

# 创建文档目录
mkdir -p docs
```

**步骤 2: 创建 apps/web/package.json**
```json
{
  "name": "@stdmaterial/web",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.0.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.0.0",
    "vite": "^8.0.0"
  }
}
```

**步骤 3: 创建 packages/ui/package.json**
```json
{
  "name": "@stdmaterial/ui",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./button": "./src/button/index.ts",
    "./input": "./src/input/index.ts",
    "./card": "./src/card/index.ts"
  },
  "scripts": {
    "build": "tsc",
    "lint": "eslint . --ext ts,tsx",
    "typecheck": "tsc --noEmit"
  },
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@stdmaterial/config-typescript": "workspace:*",
    "typescript": "^5.0.0"
  }
}
```

#### 验收标准
- ✅ 目录结构完整
- ✅ 所有 package.json 配置正确
- ✅ workspace 依赖解析正常
- ✅ 可以执行 `pnpm install`

---

### 任务 1.3: 配置 TypeScript 项目引用

**任务 ID**: PHASE1-W1-T3  
**复杂度**: 中  
**预计时间**: 4 小时

#### 任务描述
配置 TypeScript 项目引用，实现类型安全的包间引用。

#### 实施步骤

**步骤 1: 创建根 tsconfig.json**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "composite": true,
    "baseUrl": ".",
    "paths": {
      "@stdmaterial/ui": ["packages/ui/src"],
      "@stdmaterial/ui/*": ["packages/ui/src/*"],
      "@stdmaterial/utils": ["packages/utils/src"],
      "@stdmaterial/utils/*": ["packages/utils/src/*"]
    }
  },
  "include": ["apps/**/*", "packages/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**步骤 2: 创建 packages/config/typescript-config/base.json**
```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "display": "Default",
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

**步骤 3: 创建 apps/web/tsconfig.json**
```json
{
  "extends": "@stdmaterial/config-typescript/base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@lib/*": ["./src/lib/*"],
      "@styles/*": ["./src/styles/*"],
      "@types/*": ["./src/types/*"]
    }
  },
  "include": ["src"],
  "references": [
    { "path": "../../packages/ui" },
    { "path": "../../packages/utils" }
  ]
}
```

**步骤 4: 创建 packages/ui/tsconfig.json**
```json
{
  "extends": "@stdmaterial/config-typescript/base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

#### 验收标准
- ✅ TypeScript 编译无错误
- ✅ 路径别名工作正常
- ✅ 包间类型引用正确
- ✅ 类型检查通过

---

### 任务 1.4: 配置 ESLint + Prettier

**任务 ID**: PHASE1-W1-T4  
**复杂度**: 中  
**预计时间**: 4 小时

#### 任务描述
配置统一的代码规范和格式化标准。

#### 实施步骤

**步骤 1: 创建根 .eslintrc.cjs**
```javascript
module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  settings: {
    react: {
      version: 'detect'
    }
  },
  env: {
    browser: true,
    es2022: true,
    node: true
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
    ],
    'no-console': ['warn', { allow: ['warn', 'error'] }]
  }
};
```

**步骤 2: 创建 .prettierrc**
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "none",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

**步骤 3: 创建 .prettierignore**
```
node_modules
dist
build
*.local
pnpm-lock.yaml
```

**步骤 4: 创建 packages/config/eslint-config/package.json**
```json
{
  "name": "@stdmaterial/eslint-config",
  "version": "1.0.0",
  "private": true,
  "main": "index.cjs",
  "dependencies": {
    "@typescript-eslint/eslint-plugin": "^7.0.0",
    "@typescript-eslint/parser": "^7.0.0",
    "eslint": "^9.0.0",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-react": "^7.34.0",
    "eslint-plugin-react-hooks": "^4.6.0"
  }
}
```

**步骤 5: 安装依赖**
```bash
pnpm add -D eslint prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-config-prettier eslint-plugin-react eslint-plugin-react-hooks prettier-plugin-tailwindcss -w
```

#### 验收标准
- ✅ ESLint 检查通过
- ✅ Prettier 格式化正常
- ✅ 无代码规范错误
- ✅ Git 提交前自动检查

---

### 任务 1.5: 配置 Husky + lint-staged

**任务 ID**: PHASE1-W1-T5  
**复杂度**: 低  
**预计时间**: 2 小时

#### 任务描述
配置 Git 钩子，实现提交前自动检查和格式化。

#### 实施步骤

**步骤 1: 安装依赖**
```bash
pnpm add -D husky lint-staged -w
```

**步骤 2: 初始化 Husky**
```bash
pnpm exec husky init
```

**步骤 3: 配置 .husky/pre-commit**
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

**步骤 4: 配置 package.json lint-staged**
```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

#### 验收标准
- ✅ Git 提交触发 pre-commit 钩子
- ✅ 自动修复代码格式
- ✅ 自动运行 ESLint 检查
- ✅ 检查失败阻止提交

---

## 🎯 本周交付物

1. ✅ 完整的 Monorepo 项目结构
2. ✅ pnpm workspace 配置
3. ✅ Turborepo 构建系统
4. ✅ TypeScript 项目引用
5. ✅ ESLint + Prettier 代码规范
6. ✅ Husky + lint-staged Git 钩子

---

## ⚠️ 关键约束

### 全英文网站约束
- ✅ 所有注释使用英文
- ✅ 所有变量名使用英文
- ✅ 所有文件名使用英文
- ✅ 所有目录名使用英文

### 产品 ID 分离约束
- ✅ 在类型定义中明确区分 productId、sku、name
- ✅ 不使用模糊的 id 或 name 字段

### 代码规范约束
- ✅ 必须通过 ESLint 检查
- ✅ 必须通过 Prettier 格式化
- ✅ 必须通过 TypeScript 类型检查
- ✅ 禁止使用 `any` 类型

---

## 📚 参考文档

- [pnpm workspace](https://pnpm.io/workspaces)
- [Turborepo](https://turbo.build/repo)
- [TypeScript Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [Husky](https://typicode.github.io/husky/)

---

**文档维护**: 技术部  
**最后更新**: 2026-03-21
