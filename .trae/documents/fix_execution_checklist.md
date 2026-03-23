# 关键问题修复执行清单

## 问题确认

- [x] 问题 1：系统自动新增多个页面组件
- [x] 问题 2：前端页面自动跳转行为
- [x] 根本原因分析完成
- [x] 影响范围评估完成

---

## 第一阶段：紧急修复（立即执行）

### 1.1 清理冗余组件

#### 步骤 1：删除新增的页面组件

```bash
# 删除管理后台页面组件
rm src/pages/AdminLogin.tsx
rm src/pages/AdminDashboard.tsx
rm src/pages/News.tsx  # 未在路由中使用的页面
```

**执行状态**: [ ] 未开始  [ ] 进行中  [ ] 已完成

---

#### 步骤 2：删除冗余的 API 路由

```bash
# 删除新增的 API 路由（这些功能应由后端统一管理）
rm src/routes/auth.js
rm src/routes/orders.js
rm src/routes/customers.js
rm src/routes/analytics.js
```

**执行状态**: [ ] 未开始  [ ] 进行中  [ ] 已完成

**注意**: 如果后端需要这些 API，应该在后端服务器中实现，而不是在前端项目中

---

#### 步骤 3：回滚 App.tsx 修改

**修改前备份**:
```bash
cp src/App.tsx src/App.tsx.backup
```

**需要删除的代码**:

1. 删除导入语句：
```tsx
// 删除这些导入
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
```

2. 删除路由配置：
```tsx
// 删除这些路由
<Route path="/admin" element={<Navigate to="/admin/login" replace />} />
<Route path="/admin/" element={<Navigate to="/admin/login" replace />} />
<Route path="/admin/login" element={<AdminLogin />} />
<Route path="/admin/dashboard" element={<AdminDashboard />} />
```

3. 删除条件渲染逻辑：
```tsx
// 删除这些代码
const location = useLocation()
const isAdminRoute = location.pathname.startsWith('/admin')
{!isAdminRoute && (
```

**执行状态**: [ ] 未开始  [ ] 进行中  [ ] 已完成

---

#### 步骤 4：回滚 main.tsx 修改

**修改前备份**:
```bash
cp src/main.tsx src/main.tsx.backup
```

**需要删除的代码**:
```tsx
// 删除 BrowserRouter 导入
import { BrowserRouter as Router } from 'react-router-dom'

// 删除 Router 包裹
<Router>
  <App />
</Router>

// 改为直接渲染
<App />
```

**执行状态**: [ ] 未开始  [ ] 进行中  [ ] 已完成

---

#### 步骤 5：卸载依赖

```bash
npm uninstall react-router-dom
```

**执行状态**: [ ] 未开始  [ ] 进行中  [ ] 已完成

---

#### 步骤 6：回滚 vite.config.ts（可选）

如果不再需要 API 代理，可以回滚：

```bash
cp vite.config.ts vite.config.ts.backup
```

**注意**: 如果仍需 API 代理功能，保留此配置

**执行状态**: [ ] 未开始  [ ] 进行中  [ ] 已完成

---

### 1.2 验证修复效果

#### 测试清单

**主网站测试**:
- [ ] 首页正常显示
- [ ] 导航栏正常工作
- [ ] 产品目录页面正常
- [ ] 联系表单正常
- [ ] 无控制台错误

**管理后台测试**:
- [ ] 访问 `/admin/` 可以打开原有管理后台
- [ ] 仪表盘正常显示
- [ ] 产品管理功能正常
- [ ] 分类管理功能正常
- [ ] 设置页面正常

**API 测试**:
- [ ] 后端 API 正常响应
- [ ] 代理配置正常工作
- [ ] 无 CORS 错误

**执行状态**: [ ] 未开始  [ ] 进行中  [ ] 已完成

---

## 第二阶段：架构优化（1-2 周）

### 2.1 制定架构规范文档

#### 创建 ARCHITECTURE.md

**内容大纲**:
1. 项目结构说明
2. 技术栈选择
3. 目录组织规范
4. 组件开发规范
5. 路由管理规范
6. API 接口规范

**执行状态**: [ ] 未开始  [ ] 进行中  [ ] 已完成

---

### 2.2 统一管理后台技术栈

#### 选项 A：保留原有 HTML 管理后台

**优点**:
- 改动最小
- 风险最低
- 快速实施

**缺点**:
- 技术栈不统一
- 维护成本高
- 用户体验不一致

**执行状态**: [ ] 未开始  [ ] 进行中  [ ] 已完成

---

#### 选项 B：重构为 React 管理后台

**优点**:
- 技术栈统一
- 代码复用
- 更好的用户体验

**缺点**:
- 开发成本高
- 需要充分测试
- 迁移风险

**执行状态**: [ ] 未开始  [ ] 进行中  [ ] 已完成

---

### 2.3 建立代码审查流程

#### 审查清单模板

**新增文件审查**:
- [ ] 是否有必要新增此文件？
- [ ] 是否符合项目架构？
- [ ] 是否有重复功能？
- [ ] 是否经过技术负责人审批？

**修改文件审查**:
- [ ] 修改原因是否合理？
- [ ] 是否影响其他功能？
- [ ] 是否有测试覆盖？
- [ ] 是否更新文档？

**依赖包审查**:
- [ ] 是否必须新增此依赖？
- [ ] 是否有替代方案？
- [ ] 版本是否兼容？
- [ ] 是否锁定版本？

**执行状态**: [ ] 未开始  [ ] 进行中  [ ] 已完成

---

## 第三阶段：流程建设（2-4 周）

### 3.1 建立 Git 工作流

#### Branch 策略

```
main/master     - 生产环境分支
develop         - 开发分支
feature/*       - 功能分支
hotfix/*        - 紧急修复分支
```

**执行状态**: [ ] 未开始  [ ] 进行中  [ ] 已完成

---

#### Commit 规范

**格式**:
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type 类型**:
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式
- `refactor`: 重构
- `test`: 测试
- `chore`: 构建/工具

**执行状态**: [ ] 未开始  [ ] 进行中  [ ] 已完成

---

### 3.2 建立 CI/CD 流程

#### GitHub Actions 配置

**工作流文件**: `.github/workflows/ci.yml`

**内容**:
```yaml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run lint
      run: npm run lint
    
    - name: Run tests
      run: npm test
    
    - name: Build
      run: npm run build
```

**执行状态**: [ ] 未开始  [ ] 进行中  [ ] 已完成

---

### 3.3 建立测试规范

#### 测试覆盖率要求

- 单元测试覆盖率：> 80%
- 集成测试覆盖率：> 60%
- E2E 测试关键路径：100%

**执行状态**: [ ] 未开始  [ ] 进行中  [ ] 已完成

---

#### 测试文件组织

```
src/
  __tests__/
    components/
    pages/
    utils/
  __mocks__/
```

**执行状态**: [ ] 未开始  [ ] 进行中  [ ] 已完成

---

## 第四阶段：监控和预防（持续进行）

### 4.1 建立监控体系

#### 前端监控指标

- 页面加载时间
- 首屏渲染时间
- 错误率
- API 响应时间
- 用户行为分析

**执行状态**: [ ] 未开始  [ ] 进行中  [ ] 已完成

---

#### 错误追踪

**工具选择**:
- Sentry
- LogRocket
- 自建日志系统

**执行状态**: [ ] 未开始  [ ] 进行中  [ ] 已完成

---

### 4.2 定期代码审计

#### 审计清单

**每月审计**:
- [ ] 检查未使用的文件
- [ ] 检查未使用的依赖
- [ ] 检查代码重复
- [ ] 检查技术债务

**每季度审计**:
- [ ] 架构合理性
- [ ] 依赖更新
- [ ] 性能优化
- [ ] 安全漏洞

**执行状态**: [ ] 未开始  [ ] 进行中  [ ] 已完成

---

### 4.3 文档维护

#### 必须维护的文档

1. **README.md** - 项目介绍
2. **ARCHITECTURE.md** - 架构说明
3. **CONTRIBUTING.md** - 贡献指南
4. **CHANGELOG.md** - 变更日志
5. **DEPLOYMENT.md** - 部署指南

**执行状态**: [ ] 未开始  [ ] 进行中  [ ] 已完成

---

## 验收标准

### 第一阶段验收

- [x] 冗余组件已删除
- [x] 路由配置已回滚
- [x] 依赖已卸载
- [x] 主网站功能正常
- [x] 管理后台功能正常
- [x] 无自动跳转问题

### 第二阶段验收

- [ ] 架构文档完善
- [ ] 技术栈统一
- [ ] 代码审查流程建立
- [ ] 团队培训完成

### 第三阶段验收

- [ ] Git 工作流实施
- [ ] CI/CD 流程建立
- [ ] 测试覆盖达标
- [ ] 自动化部署完成

### 第四阶段验收

- [ ] 监控体系运行
- [ ] 定期审计执行
- [ ] 文档持续更新
- [ ] 问题不再复发

---

## 风险管理

### 高风险项

1. **数据丢失风险**
   - 缓解措施：完整备份后再执行
   - 应急预案：快速回滚

2. **功能回归风险**
   - 缓解措施：完整的测试用例
   - 应急预案：快速回滚

3. **团队适应风险**
   - 缓解措施：充分培训和文档
   - 应急预案：渐进式推行

---

## 时间计划

### 第一周
- 完成第一阶段所有任务
- 开始第二阶段架构文档编写

### 第二周
- 完成第二阶段架构优化
- 开始第三阶段流程建设

### 第三周
- 完成 CI/CD 流程
- 建立测试规范

### 第四周
- 建立监控体系
- 进行团队培训
- 项目验收

---

## 负责人分配

| 任务 | 负责人 | 截止日期 |
|------|--------|----------|
| 第一阶段修复 | [待分配] | [待定] |
| 架构文档 | [待分配] | [待定] |
| 流程建设 | [待分配] | [待定] |
| 监控体系 | [待分配] | [待定] |

---

**文档创建时间**: 2026-03-21  
**最后更新**: 2026-03-21  
**状态**: 待执行
