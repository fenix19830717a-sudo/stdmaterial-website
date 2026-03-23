# 开发服务器维护指南

**最后更新**: 2026-03-21  
**状态**: ✅ 已验证  
**端口**: 3000 (固定)

---

## 🎯 快速启动

### 启动开发服务器
```bash
cd /var/www/html/stdmaterial.com/stdmaterial-rewrite
pnpm dev
```

**访问地址**: http://localhost:3000

---

## 🔧 配置说明

### Vite 配置 (vite.config.ts)

```typescript
{
  server: {
    port: 3000,        // 固定端口
    host: true,        // 允许外部访问
    open: true,        // 自动打开浏览器
    strictPort: true   // 端口被占用时报错
  },
  resolve: {
    alias: {
      '@': './src',
      '@components': './src/components',
      '@lib': './src/lib',
      // ... 其他别名
    }
  }
}
```

### TypeScript 配置 (tsconfig.json)

```json
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

---

## 📋 路径别名使用

### ✅ 推荐：使用路径别名

```typescript
// 组件导入
import { Button } from '@/components/ui/Button';
import { Navigation } from '@/components/layout/Navigation';

// 工具函数导入
import { cn } from '@/lib/utils';

// 类型导入
import { Product } from '@/types/product';
```

### ❌ 避免：使用相对路径

```typescript
// 不推荐 - 容易出错
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';
```

---

## 🚨 故障排查

### 问题 1: 端口被占用

**错误信息**:
```
Error: Port 3000 is in use
```

**解决方案**:
```bash
# 1. 查找占用端口的进程
lsof -i :3000

# 2. 杀死进程
kill -9 <PID>

# 3. 或者使用快捷命令
pkill -f "vite"
pkill -f "pnpm dev"

# 4. 重新启动服务器
pnpm dev
```

### 问题 2: 导入路径错误

**错误信息**:
```
Uncaught SyntaxError: The requested module '/src/lib/utils.js' does not provide an export named 'cn'
```

**原因**: 使用了错误的相对路径

**解决方案**:
```bash
# 批量修复导入路径
find apps/web/src/components apps/web/src/pages -name "*.tsx" -o -name "*.ts" | \
  xargs sed -i "s|from '../../lib/utils'|from '@/lib/utils'|g"

# 或者手动修改为路径别名
import { cn } from '@/lib/utils';
```

### 问题 3: 页面白屏

**检查步骤**:
1. 打开浏览器控制台 (F12)
2. 查看是否有 JavaScript 错误
3. 检查 Network 标签是否有失败的请求
4. 确认服务器正在运行 (http://localhost:3000)

**常见原因**:
- React 组件导入错误
- 路由配置错误
- 缺少依赖

**解决方案**:
```bash
# 1. 清理并重新安装依赖
rm -rf node_modules
pnpm install

# 2. 清理缓存
pnpm dev -- --force

# 3. 检查 TypeScript 错误
npx tsc --noEmit
```

### 问题 4: HMR 不工作

**症状**: 文件保存后页面不更新

**解决方案**:
```bash
# 1. 重启开发服务器
pkill -f "vite"
pnpm dev

# 2. 检查文件是否被正确监听
# 查看终端是否有 "hmr update" 消息

# 3. 清除浏览器缓存
# Ctrl+Shift+R (硬刷新)
```

---

## 📊 端口管理规范

### 固定端口分配

| 服务 | 端口 | 说明 |
|------|------|------|
| 开发服务器 | 3000 | 主开发服务器 |
| API 服务器 | 3001 | 后端 API (如果本地运行) |
| 数据库 | 27017 | MongoDB |

### 端口冲突处理

如果端口 3000 被占用：

1. **不要**自动切换到其他端口
2. **应该**清理占用的进程
3. 使用 `strictPort: true` 确保配置生效

---

## ✅ 日常检查清单

### 启动前检查
- [ ] 端口 3000 未被占用
- [ ] 所有依赖已安装
- [ ] 环境变量已配置

### 开发中检查
- [ ] 服务器运行正常
- [ ] HMR 工作正常
- [ ] 控制台无错误
- [ ] 页面显示正常

### 提交前检查
- [ ] TypeScript 无错误
- [ ] ESLint 无警告
- [ ] 所有导入使用路径别名
- [ ] 代码已格式化

---

## 🔍 调试技巧

### 查看详细日志
```bash
# 启用 Vite 详细日志
pnpm dev -- --debug

# 查看特定模块的日志
VITE_DEBUG=1 pnpm dev
```

### 性能分析
```bash
# 构建分析
pnpm build -- --mode analyze

# 查看 bundle 大小
npx vite-bundle-visualizer
```

### 网络调试
```bash
# 检查服务器响应
curl -I http://localhost:3000

# 查看网络连接
netstat -tlnp | grep 3000
```

---

## 📝 最佳实践

### 1. 始终使用路径别名
```typescript
// ✅ 好
import { cn } from '@/lib/utils';

// ❌ 不好
import { cn } from '../../lib/utils';
```

### 2. 定期清理缓存
```bash
# 每周清理一次
rm -rf node_modules/.vite
pnpm dev
```

### 3. 使用 Git 钩子
```bash
# 安装 Husky
pnpm install -D husky
npx husky install

# 添加预提交钩子
npx husky add .husky/pre-commit "pnpm lint && pnpm typecheck"
```

### 4. 监控端口状态
```bash
# 创建监控脚本
cat > scripts/check-port.sh << 'SCRIPT'
#!/bin/bash
if lsof -i :3000 | grep -q LISTEN; then
  echo "✅ Port 3000 is available"
else
  echo "❌ Port 3000 is in use"
  lsof -i :3000
fi
SCRIPT
```

---

## 🆘 紧急修复

### 完全重置
```bash
# 1. 停止所有进程
pkill -f "vite"
pkill -f "node"

# 2. 清理端口
kill -9 $(lsof -t -i :3000)

# 3. 清理缓存
rm -rf node_modules/.vite
rm -rf dist
rm -rf .turbo

# 4. 重新安装
pnpm install

# 5. 重启服务器
pnpm dev
```

---

## 📞 获取帮助

如果遇到问题：

1. 检查本文档的故障排查部分
2. 查看 Vite 官方文档：https://vitejs.dev
3. 查看项目 README.md
4. 联系开发团队

---

**维护者**: Development Team  
**文档版本**: 1.0  
**最后审查**: 2026-03-21

