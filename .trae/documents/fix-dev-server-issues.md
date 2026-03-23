# 开发服务器问题修复计划

**日期**: 2026-03-21  
**目标**: 系统性地解决开发服务器问题，确保页面正常展示

---

## 🎯 问题分析

### 当前问题
1. **端口不固定** - 服务器在不同端口间切换（3000/3002/3003/3004）
2. **导入路径错误** - 组件文件使用了错误的相对路径
3. **Vite 配置问题** - manualChunks 与 Vite 8 不兼容
4. **页面无法显示** - 用户无法在浏览器中看到页面内容

### 根本原因
- 多个服务器实例同时运行，占用多个端口
- 组件导入路径层级计算错误
- Vite 8 使用 rolldown 替代 rollup，配置不兼容
- 没有系统性地排查和验证每个修复步骤

---

## ✅ 解决方案

### 阶段 1: 清理环境 (5 分钟)
1. 停止所有运行的 Node.js/Vite 进程
2. 清理占用的端口（3000-3004）
3. 确认环境干净

### 阶段 2: 修复配置 (10 分钟)
1. **修复 vite.config.ts**
   - 移除 manualChunks 配置
   - 设置固定端口为 3000
   - 配置正确的 host 和 open 选项

2. **修复 tsconfig.json**
   - 配置路径别名 (@/ @components/ @lib/)
   - 确保 TypeScript 识别正确的导入路径

3. **创建路径别名文档**
   - 记录所有可用的路径别名
   - 提供使用示例

### 阶段 3: 批量修复导入路径 (15 分钟)
1. 扫描所有组件文件
2. 识别错误的导入路径
3. 批量修复为正确的相对路径或路径别名
4. 验证修复结果

### 阶段 4: 启动并验证 (10 分钟)
1. 启动开发服务器（固定端口 3000）
2. 检查编译错误
3. 验证所有页面路由
4. 测试热更新功能

### 阶段 5: 创建维护文档 (10 分钟)
1. 开发服务器故障排查指南
2. 导入路径速查表
3. 端口管理规范
4. 日常开发检查清单

---

## 📋 执行步骤

### Step 1: 环境清理
```bash
# 停止所有 node 进程
pkill -f "vite"
pkill -f "pnpm dev"

# 检查端口占用
lsof -i :3000
lsof -i :3001
lsof -i :3002
lsof -i :3003
lsof -i :3004

# 如有占用，强制释放
kill -9 <PID>
```

### Step 2: 修复 Vite 配置
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@lib': path.resolve(__dirname, './src/lib'),
    }
  },
  server: {
    port: 3000,        // 固定端口
    host: '0.0.0.0',   // 允许外部访问
    strictPort: true,  // 端口被占用时报错而不是切换
    open: true         // 自动打开浏览器
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: true
    // 移除了 manualChunks
  }
});
```

### Step 3: 修复 TypeScript 配置
```json
// tsconfig.json
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

### Step 4: 批量修复导入路径
```bash
# 查找并修复所有错误的导入
find apps/web/src/components -name "*.tsx" -o -name "*.ts" | while read file; do
  sed -i "s|from '../lib/utils'|from '@/lib/utils'|g" "$file"
  sed -i "s|from '../ui/|from '@/components/ui/|g" "$file"
  sed -i "s|from '../layout/|from '@/components/layout/|g" "$file"
  sed -i "s|from '../products/|from '@/components/products/|g" "$file"
done
```

### Step 5: 启动验证
```bash
cd /var/www/html/stdmaterial.com/stdmaterial-rewrite
pnpm dev

# 访问 http://localhost:3000 验证
# - 首页应该正常显示
# - 导航链接应该工作
# - HMR 应该正常
```

---

## ✅ 验收标准

### 功能验收
- [ ] 服务器固定在端口 3000
- [ ] 端口被占用时报错而不是自动切换
- [ ] 浏览器自动打开
- [ ] 首页正常显示（无白屏）
- [ ] 所有路由页面可访问
- [ ] 热更新正常工作
- [ ] 控制台无编译错误

### 代码验收
- [ ] 所有组件使用路径别名导入
- [ ] TypeScript 无类型错误
- [ ] ESLint 无警告
- [ ] 导入路径统一规范

### 文档验收
- [ ] 故障排查指南已创建
- [ ] 路径别名使用文档已创建
- [ ] 端口管理规范已记录
- [ ] 检查清单已提供

---

## 📝 预期结果

1. **稳定的开发环境**
   - 固定端口 3000
   - 自动打开浏览器
   - 端口冲突时明确报错

2. **统一的导入规范**
   - 使用路径别名 (@/ @components/ @lib/)
   - 不再出现相对路径错误
   - 导入清晰易读

3. **完整的文档支持**
   - 故障排查指南
   - 快速参考文档
   - 日常检查清单

---

## 🚨 风险评估

### 高风险
- 路径别名配置错误导致所有导入失败
  - **缓解**: 逐步测试，先配置最简单的别名

### 中风险
- 批量替换引入新的错误
  - **缓解**: 使用 git 备份，可快速回滚

### 低风险
- 端口 3000 被其他服务占用
  - **缓解**: 使用 strictPort: true 明确报错，手动清理

---

## 📊 时间估算

| 阶段 | 预计时间 | 实际时间 |
|------|---------|---------|
| 环境清理 | 5 分钟 | - |
| 配置修复 | 10 分钟 | - |
| 导入修复 | 15 分钟 | - |
| 验证测试 | 10 分钟 | - |
| 文档创建 | 10 分钟 | - |
| **总计** | **50 分钟** | - |

---

**下一步**: 等待用户确认计划后开始执行
