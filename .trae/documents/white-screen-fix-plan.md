# Vite React 白屏问题完整修复计划

**问题**: 页面显示 HTML 但内容为空（白屏）
**日期**: 2026-03-21

---

## 🔍 根本原因分析

根据 Vite 官方文档，白屏问题可能由以下原因导致：

### 1. 浏览器扩展阻止 (最常见)
- 广告拦截器
- 隐私保护扩展
- 安全插件

### 2. Vite 客户端连接问题
- Vite client 无法连接到 dev server
- WebSocket 连接失败
- HMR 无法工作

### 3. 导入路径问题
- 路径别名未正确解析
- 模块加载失败
- 循环依赖

### 4. React 渲染问题
- 组件返回 null
- 渲染错误
- 路由配置错误

---

## ✅ 修复步骤

### Step 1: 检查浏览器扩展（5分钟）

**操作**:
1. 打开浏览器无痕/隐私模式
2. 访问 http://localhost:3000
3. 检查页面是否正常显示

**或者**:
1. 禁用所有浏览器扩展
2. 刷新页面
3. 逐个启用扩展找出问题扩展

**常见冲突扩展**:
- AdBlock / uBlock Origin
- Privacy Badger
- HTTPS Everywhere
- 其他安全/隐私扩展

### Step 2: 检查 Vite Client 连接

**操作**:
1. 打开浏览器开发者工具 (F12)
2. 查看 Network 标签
3. 检查是否有 `@vite/client` 请求
4. 检查 WebSocket 连接状态

**预期结果**:
- 应该看到 `vite` WebSocket 连接
- 应该看到 `@vite/client` 加载成功

### Step 3: 简化测试

**操作**: 创建最简单的 App 组件测试

```typescript
// src/App.tsx
function App() {
  return (
    <div style={{ padding: '20px', background: 'red', color: 'white' }}>
      <h1>TEST - If you see this, React is working!</h1>
    </div>
  )
}

export default App
```

**检查**:
- 如果显示红色背景文字 → React 工作正常
- 如果仍然白屏 → 有其他问题

### Step 4: 检查控制台错误

**操作**:
1. F12 打开开发者工具
2. 切换到 Console 标签
3. 检查是否有任何错误（红色）

**常见错误**:
- `Failed to load module`
- `Cannot find module`
- `TypeError`
- `SyntaxError`

### Step 5: 检查网络请求

**操作**:
1. Network 标签
2. 刷新页面
3. 检查所有请求状态

**检查项**:
- [ ] main.tsx 是否 200
- [ ] @vite/client 是否 200
- [ ] 所有 .tsx 文件是否 200
- [ ] 没有 404 错误

### Step 6: 完全重置

如果以上都无效：

```bash
# 1. 停止服务器
pkill -f vite

# 2. 清理所有缓存
rm -rf node_modules/.vite
rm -rf apps/web/node_modules/.vite
rm -rf dist

# 3. 重新安装依赖
pnpm install

# 4. 重启服务器
pnpm dev
```

---

## 🎯 诊断清单

### 浏览器端检查
- [ ] 无痕模式下是否正常
- [ ] 禁用扩展后是否正常
- [ ] 控制台是否有错误
- [ ] Network 中所有请求是否 200
- [ ] WebSocket 是否连接成功

### 服务器端检查
- [ ] 服务器运行在 3000 端口
- [ ] 终端无编译错误
- [ ] Vite 显示 "ready"
- [ ] HMR 正常工作

### 代码检查
- [ ] App.tsx 返回有效 JSX
- [ ] main.tsx 正确挂载
- [ ] 所有导入路径正确
- [ ] 没有循环依赖

---

## 🚨 快速修复方案

### 方案 1: 使用无痕模式
```
Chrome: Ctrl+Shift+N
Firefox: Ctrl+Shift+P
Edge: Ctrl+Shift+N
```

### 方案 2: 禁用扩展
```
Chrome: chrome://extensions/ → 全部禁用
Firefox: about:addons → 全部禁用
```

### 方案 3: 更换浏览器
尝试使用不同的浏览器访问

### 方案 4: 检查 hosts 文件
确保 localhost 解析正确
```
127.0.0.1 localhost
```

---

## 📊 预期结果

修复后应该：
- [ ] 页面正常显示内容
- [ ] 控制台无错误
- [ ] Network 所有请求 200
- [ ] WebSocket 连接正常
- [ ] HMR 工作正常

---

## 📝 记录和反馈

如果问题仍然存在，请记录：
1. 浏览器类型和版本
2. 安装的扩展列表
3. 控制台完整错误信息
4. Network 标签截图
5. 终端完整日志
