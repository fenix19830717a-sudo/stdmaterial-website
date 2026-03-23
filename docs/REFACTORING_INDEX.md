# 重构规划文档索引

**最后更新**: 2026-03-21  
**状态**: 📋 待启动

---

## 📚 文档体系

本次重构规划形成了完整的文档体系，包括：

```
docs/
├── REFACTORING_SUMMARY.md      ← 📋 执行摘要（快速了解）
├── REFACTORING_PLAN.md         ← 📖 完整方案（详细规划）
├── REFACTORING_TASKS.md        ← ✅ 任务清单（执行跟踪）
├── REFACTORING_INDEX.md        ← 📇 本文档（索引导航）
│
├── ARCHITECTURE.md             ← 🏗️ 系统架构
├── TECH_STACK.md               ← 🛠️ 技术栈说明
├── MODULES.md                  ← 🧩 模块划分
├── API_REFERENCE.md            ← 🔌 接口定义
├── DATA_FLOW.md                ← 💾 数据流程
├── DEPLOYMENT.md               ← 🚀 部署流程
├── MAINTENANCE.md              ← 🔧 维护指南
└── DOCUMENTATION_REPORT.md     ← 📊 文档整理报告
```

---

## 🎯 快速导航

### 我想了解...

#### 项目概况
→ [执行摘要](./REFACTORING_SUMMARY.md) (5 分钟阅读)
- 一句话总结
- 当前问题
- 重构目标
- 预期收益
- 立即行动

#### 详细规划
→ [完整方案](./REFACTORING_PLAN.md) (30 分钟阅读)
- 技术债务梳理
- 重构目标与技术选型
- 视觉设计规范
- 组件化架构
- 实施优先级
- 质量验收指标
- 风险应对策略

#### 执行细节
→ [任务清单](./REFACTORING_TASKS.md) (10 分钟阅读)
- 分周任务分解
- 工时估算
- 进度跟踪
- 交付物清单

#### 技术架构
→ [架构文档](./ARCHITECTURE.md)
- 系统架构图
- 技术分层
- 核心模块

#### 技术栈
→ [技术栈说明](./TECH_STACK.md)
- 前端技术栈
- 后端技术栈
- 开发工具
- 技术选型理由

---

## 📋 按角色查阅

### 项目经理/决策者

**必读**:
1. [执行摘要](./REFACTORING_SUMMARY.md) - 快速了解项目
2. [完整方案 - 第一章](./REFACTORING_PLAN.md#一现有技术债务全面梳理) - 了解问题严重性
3. [完整方案 - 第五章](./REFACTORING_PLAN.md#五实施优先级与时间规划) - 时间规划
4. [完整方案 - 第七章](./REFACTORING_PLAN.md#七风险识别与应对策略) - 风险管理

**选读**:
- [完整方案 - 第六章](./REFACTORING_PLAN.md#六质量验收指标) - 验收标准
- [完整方案 - 第九章](./REFACTORING_PLAN.md#九成功标准与后续规划) - 成功标准

**时间**: 约 30 分钟

---

### 技术负责人/架构师

**必读**:
1. [完整方案](./REFACTORING_PLAN.md) - 完整技术方案
2. [架构文档](./ARCHITECTURE.md) - 当前架构
3. [技术栈说明](./TECH_STACK.md) - 技术选型
4. [模块划分](./MODULES.md) - 模块设计

**选读**:
- [任务清单](./REFACTORING_TASKS.md) - 任务分解
- [数据流程](./DATA_FLOW.md) - 数据设计

**时间**: 约 2 小时

---

### 前端开发人员

**必读**:
1. [完整方案 - 第三章](./REFACTORING_PLAN.md#三视觉设计规范统一) - 设计规范
2. [完整方案 - 第四章](./REFACTORING_PLAN.md#四组件化架构优化) - 组件架构
3. [任务清单](./REFACTORING_TASKS.md) - 具体任务
4. [模块划分 - 前端模块](./MODULES.md#4-前端页面模块) - 模块说明

**选读**:
- [技术栈说明 - 前端](./TECH_STACK.md#2-前端技术栈) - 技术细节
- [架构文档 - 前端架构](./ARCHITECTURE.md#22-前端架构) - 架构设计

**时间**: 约 1.5 小时

---

### 后端开发人员

**必读**:
1. [完整方案 - 第一章](./REFACTORING_PLAN.md#一现有技术债务全面梳理) - 技术债务
2. [任务清单 - Phase 4](./REFACTORING_TASKS.md#phase-4-技术债务清理-week-12-15) - 债务清理
3. [数据流程](./DATA_FLOW.md) - 数据设计
4. [接口定义](./API_REFERENCE.md) - API 规范

**选读**:
- [架构文档 - 后端架构](./ARCHITECTURE.md#23-后端架构) - 架构设计
- [部署流程](./DEPLOYMENT.md) - 部署说明

**时间**: 约 1 小时

---

### UI/UX设计师

**必读**:
1. [完整方案 - 第三章](./REFACTORING_PLAN.md#三视觉设计规范统一) - 设计规范
2. [完整方案 - 附件 - 设计系统](./REFACTORING_PLAN.md#31-设计系统design-system) - 设计系统

**选读**:
- [组件化架构 - 组件分层](./REFACTORING_PLAN.md#41-组件分层架构) - 组件设计

**时间**: 约 40 分钟

---

### 测试人员

**必读**:
1. [任务清单 - Phase 5](./REFACTORING_TASKS.md#phase-5-收尾与上线-week-16-17) - 测试任务
2. [完整方案 - 第六章](./REFACTORING_PLAN.md#六质量验收指标) - 验收标准

**选读**:
- [维护指南 - 故障排查](./MAINTENANCE.md#2-故障排查指南) - 排查流程

**时间**: 约 30 分钟

---

### 运维人员

**必读**:
1. [部署流程](./DEPLOYMENT.md) - 部署步骤
2. [维护指南](./MAINTENANCE.md) - 维护任务
3. [任务清单 - Phase 5](./REFACTORING_TASKS.md#week-17-灰度上线与监控) - 上线流程

**选读**:
- [架构文档 - 部署架构](./ARCHITECTURE.md#6-部署架构) - 架构说明

**时间**: 约 1 小时

---

## 📊 文档统计

| 文档 | 大小 | 页数 | 阅读时间 |
|------|------|------|---------|
| REFACTORING_SUMMARY.md | 15KB | 3 | 5 分钟 |
| REFACTORING_PLAN.md | 120KB | 25 | 30 分钟 |
| REFACTORING_TASKS.md | 80KB | 15 | 10 分钟 |
| ARCHITECTURE.md | 21KB | 8 | 15 分钟 |
| TECH_STACK.md | 13KB | 6 | 10 分钟 |
| MODULES.md | 25KB | 12 | 20 分钟 |
| 其他文档 | 60KB | 20 | 30 分钟 |
| **总计** | **334KB** | **99** | **2 小时** |

---

## 🎯 阅读路径建议

### 路径 1: 快速了解 (15 分钟)

适合：决策者、新加入成员

```
1. REFACTORING_SUMMARY.md (5 分钟)
   └─ 了解项目概况和目标

2. REFACTORING_PLAN.md 第一章 (5 分钟)
   └─ 了解技术债务问题

3. REFACTORING_PLAN.md 第九章 (5 分钟)
   └─ 了解预期收益
```

---

### 路径 2: 全面掌握 (2 小时)

适合：技术负责人、核心开发人员

```
1. REFACTORING_SUMMARY.md (5 分钟)
   └─ 快速概览

2. REFACTORING_PLAN.md 完整阅读 (30 分钟)
   └─ 详细方案

3. ARCHITECTURE.md (15 分钟)
   └─ 架构设计

4. TECH_STACK.md (10 分钟)
   └─ 技术选型

5. MODULES.md (20 分钟)
   └─ 模块划分

6. REFACTORING_TASKS.md (10 分钟)
   └─ 任务分解

7. 其他相关文档 (30 分钟)
   └─ 深入理解
```

---

### 路径 3: 执行准备 (1 小时)

适合：即将参与项目的开发人员

```
1. REFACTORING_SUMMARY.md (5 分钟)
   └─ 项目概况

2. REFACTORING_PLAN.md 第三、四章 (20 分钟)
   └─ 设计和组件规范

3. REFACTORING_TASKS.md (10 分钟)
   └─ 具体任务

4. TECH_STACK.md (10 分钟)
   └─ 技术栈复习

5. 相关技术文档 (15 分钟)
   └─ 查漏补缺
```

---

## 🔗 外部资源

### 技术文档

- [React 官方文档](https://react.dev/)
- [TypeScript 文档](https://www.typescriptlang.org/docs/)
- [Vite 文档](https://vitejs.dev/)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)

### 设计系统参考

- [Material Design](https://material.io/design)
- [Carbon Design System](https://www.carbondesignsystem.com/)
- [shadcn/ui](https://ui.shadcn.com/)

### 工具链

- [pnpm workspace](https://pnpm.io/workspaces)
- [Storybook](https://storybook.js.org/)
- [Vitest](https://vitest.dev/)
- [Playwright](https://playwright.dev/)

---

## 📞 联系方式

**文档维护**: 技术部  
**问题反馈**: tech@stdmaterial.com  
**文档更新**: 每周一审查和更新

---

## 📝 修订历史

| 版本 | 日期 | 变更内容 | 作者 |
|------|------|---------|------|
| 1.0 | 2026-03-21 | 初始版本 | 技术部 |

---

**最后审查**: 2026-03-21  
**下次审查**: 2026-03-28  
**文档状态**: ✅ 已批准
