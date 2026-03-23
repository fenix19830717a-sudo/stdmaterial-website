# 文档索引

## 📚 文档体系概览

本文档中心采用结构化组织方式，便于快速查找和查阅。

## 🗂️ 核心文档

### 1. [README.md](./README.md) - 文档中心首页
- **用途**: 文档导航和快速入门
- **目标读者**: 所有团队成员
- **更新频率**: 按需更新

### 2. [ARCHITECTURE.md](./ARCHITECTURE.md) - 系统架构文档
- **用途**: 描述系统整体架构设计
- **包含内容**:
  - 系统概述和业务目标
  - 整体架构图和技术分层
  - 核心系统模块说明
  - 功能模块详解
  - 部署架构
  - 性能优化策略
  - 安全架构
  - 监控与日志
- **目标读者**: 架构师、开发人员、新成员
- **更新频率**: 季度审查

### 3. [TECH_STACK.md](./TECH_STACK.md) - 技术栈说明
- **用途**: 记录项目使用的全部技术栈
- **包含内容**:
  - 前端技术栈 (React, TypeScript, TailwindCSS 等)
  - 后端技术栈 (Node.js, Express, MongoDB 等)
  - 开发工具 (Vite, Jest, ESLint 等)
  - 第三方服务
  - 部署工具
  - 浏览器支持
  - 技术选型理由
- **目标读者**: 开发人员、技术决策者
- **更新频率**: 技术变更时更新

### 4. [MODULES.md](./MODULES.md) - 模块划分文档
- **用途**: 详细描述系统模块划分
- **包含内容**:
  - 核心系统模块 (Logger, ErrorHandler, EventBus 等)
  - 前端页面模块 (Home, Products, Simulator 等)
  - 业务功能模块 (ProductManager, RecommendEngine 等)
  - 后端服务模块 (API Gateway, Auth, Product Service 等)
  - 工具函数库
  - 模块依赖关系图
  - 模块通信机制
- **目标读者**: 开发人员
- **更新频率**: 模块变更时更新

### 5. [API_REFERENCE.md](./API_REFERENCE.md) - 接口定义文档
- **用途**: 定义所有 API 接口规范
- **包含内容**:
  - API 设计规范
  - 认证接口
  - 产品接口
  - 分类接口
  - 客户接口
  - 订单接口
  - 销售线索接口
  - 分析统计接口
  - 错误码定义
  - 请求头规范
- **目标读者**: 前端开发、后端开发、测试人员
- **更新频率**: API 变更时实时更新

### 6. [DATA_FLOW.md](./DATA_FLOW.md) - 数据流程文档
- **用途**: 描述数据流转和存储方案
- **包含内容**:
  - 数据模型设计 (Product, Category, Customer, Order 等)
  - 索引设计
  - 数据流转过程
  - 数据存储方案
  - 缓存策略
  - 数据同步机制
  - 数据备份策略
  - 数据安全
- **目标读者**: 后端开发、数据库管理员
- **更新频率**: 数据模型变更时更新

### 7. [DEPLOYMENT.md](./DEPLOYMENT.md) - 部署流程文档
- **用途**: 指导系统部署和配置
- **包含内容**:
  - 环境要求
  - 部署前准备
  - 应用部署步骤
  - 进程管理 (PM2)
  - Nginx 配置
  - SSL 证书配置
  - 监控和日志
  - 备份策略
  - CI/CD 配置
  - 回滚方案
- **目标读者**: 运维人员、DevOps 工程师
- **更新频率**: 部署流程变更时更新

### 8. [MAINTENANCE.md](./MAINTENANCE.md) - 维护指南文档
- **用途**: 系统日常维护和故障排查指南
- **包含内容**:
  - 日常维护任务 (每日/每周/每月)
  - 故障排查指南
  - 性能优化建议
  - 安全维护
  - 监控告警配置
  - 备份和恢复
  - 文档维护规范
  - 团队协作流程
  - 持续改进计划
- **目标读者**: 运维人员、值班工程师
- **更新频率**: 月度审查

## 📁 归档文档

位于 `archive/` 目录，包含历史文档和参考资料:

- 旧版 API 文档
- 历史设计文档
- 项目审计报告
- 样式规范文档
- 管理后台文档
- 其他参考资料

## 🎯 快速查找指南

### 按角色查找

**新成员入职**:
1. [README.md](./README.md) - 了解项目概况
2. [ARCHITECTURE.md](./ARCHITECTURE.md) - 理解系统架构
3. [TECH_STACK.md](./TECH_STACK.md) - 熟悉技术栈
4. [MODULES.md](./MODULES.md) - 了解模块划分

**前端开发人员**:
1. [MODULES.md](./MODULES.md) - 前端模块说明
2. [API_REFERENCE.md](./API_REFERENCE.md) - API 接口定义
3. [TECH_STACK.md](./TECH_STACK.md) - 前端技术栈
4. [DATA_FLOW.md](./DATA_FLOW.md) - 数据模型

**后端开发人员**:
1. [ARCHITECTURE.md](./ARCHITECTURE.md) - 系统架构
2. [API_REFERENCE.md](./API_REFERENCE.md) - API 设计
3. [DATA_FLOW.md](./DATA_FLOW.md) - 数据模型和流转
4. [MODULES.md](./MODULES.md) - 后端服务模块

**运维人员**:
1. [DEPLOYMENT.md](./DEPLOYMENT.md) - 部署流程
2. [MAINTENANCE.md](./MAINTENANCE.md) - 维护指南
3. [ARCHITECTURE.md](./ARCHITECTURE.md) - 系统架构
4. [TECH_STACK.md](./TECH_STACK.md) - 技术栈说明

**测试人员**:
1. [API_REFERENCE.md](./API_REFERENCE.md) - 接口定义
2. [MODULES.md](./MODULES.md) - 模块功能
3. [DATA_FLOW.md](./DATA_FLOW.md) - 数据流转

**技术决策者**:
1. [ARCHITECTURE.md](./ARCHITECTURE.md) - 整体架构
2. [TECH_STACK.md](./TECH_STACK.md) - 技术选型
3. [DEPLOYMENT.md](./DEPLOYMENT.md) - 部署方案
4. [MAINTENANCE.md](./MAINTENANCE.md) - 运维成本

### 按场景查找

**系统故障排查**:
- [MAINTENANCE.md](./MAINTENANCE.md) - 故障排查指南
- [ARCHITECTURE.md](./ARCHITECTURE.md) - 系统架构参考

**新功能开发**:
- [MODULES.md](./MODULES.md) - 模块划分
- [API_REFERENCE.md](./API_REFERENCE.md) - API 设计
- [DATA_FLOW.md](./DATA_FLOW.md) - 数据模型

**性能优化**:
- [MAINTENANCE.md](./MAINTENANCE.md) - 性能优化建议
- [ARCHITECTURE.md](./ARCHITECTURE.md) - 性能优化策略

**系统部署**:
- [DEPLOYMENT.md](./DEPLOYMENT.md) - 完整部署流程
- [TECH_STACK.md](./TECH_STACK.md) - 环境要求

**数据迁移**:
- [DATA_FLOW.md](./DATA_FLOW.md) - 数据模型和迁移方案
- [DEPLOYMENT.md](./DEPLOYMENT.md) - 备份恢复流程

## 📊 文档统计

| 文档类型 | 数量 | 总页数 | 最后更新 |
|---------|------|--------|----------|
| 核心文档 | 8 | ~120 | 2026-03-21 |
| 归档文档 | 15+ | ~200 | 历史版本 |

## 🔄 文档更新流程

### 发起更新
1. 确定更新需求
2. 评估影响范围
3. 分配文档负责人

### 编写更新
1. 更新文档内容
2. 更新修订历史
3. 检查文档一致性

### 审查发布
1. 技术审查
2. 格式审查
3. 发布通知

## 📝 文档规范

### 命名规范
- 文件名使用大写英文，单词间用下划线分隔
- 中文文档使用 UTF-8 编码
- 重要文档附带英文版本

### 格式规范
- 使用 Markdown 格式
- 遵循统一的标题层级
- 添加修订历史记录
- 包含明确的目录结构

### 内容规范
- 准确反映当前系统状态
- 提供实际可用的示例
- 包含必要的图表说明
- 明确目标读者和更新频率

## 🔗 相关链接

- [项目根目录](../)
- [源码目录](../src/)
- [管理后台](../admin/)
- [配置文件](../config/)
- [归档文档](./archive/)

## 📞 联系方式

如有文档相关问题，请联系:
- **技术部**: tech@stdmaterial.com
- **文档负责人**: [待指定]

---

**文档维护**: 技术部  
**最后更新**: 2026-03-21  
**下次审查**: 2026-06-21
