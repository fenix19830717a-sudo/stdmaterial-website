# 高端工业B2B独立站完整重构 - 产品需求文档

## Overview
- **Summary**: 完全重构面向国际市场的工业研磨设备独立站，构建符合国际顶级B2B品牌标准的完整体系。重点强化核心竞争优势：研磨模拟器和基于目标行业的智能产品匹配推荐系统，打造完整的电商业务流程。

- **Purpose**: 彻底改造当前前端设计幼稚问题，打造具有行业领先水平的视觉体验，充分发挥研磨模拟器和智能推荐的核心优势，大幅提升品牌形象和转化率。

- **Target Users**: 海外企业采购决策者、实验室工程师、研发人员、B2B国际客户。

## Goals
- 建立完整且一致的高端设计系统（Design System）
- 实现现代工业风的高端视觉语言，符合国际B2B品牌标准
- **强化并完善研磨模拟器功能
- **实现并优化基于目标行业的智能产品匹配和推荐系统
- 构建完整的B2B电商流程（产品展示→询价→订单管理
- 完善后端管理系统
- 提升页面加载性能和响应式体验
- **产品图片展示使用白色背景
- 确保代码架构的可维护性和可扩展性

## Non-Goals (Out of Scope)
- 不实现多语言功能（**仅保留英文**）
- 不重构底层服务器架构

## Background & Context
当前项目是面向国际市场的行星球磨机等工业研磨设备B2B独立站。已有的核心功能：
- 完整的产品数据体系，包含applications（应用领域）字段
- selection.html 材料选择指南页面
- simulator.html 研磨过程模拟器
- product-simulator.js 3D产品模拟器

存在的问题：
1. 前端视觉设计缺乏专业感和层次感
2. 代码架构混乱，组件复用性差
3. **核心竞争优势（研磨模拟器、智能推荐）未充分发挥
4. 缺乏完整的B2B电商业务流程
5. 后端管理系统功能不完善

## Functional Requirements
- **FR-1**: 建立完整的设计系统，包括色彩、字体、间距、阴影、组件规范
- **FR-2**: 重构所有前端页面，打造具有国际顶级B2B水准的视觉体验
- **FR-3**: **产品图片统一使用白色背景展示
- **FR-4**: **强化并完善研磨模拟器功能，提升用户体验和实用性
- **FR-5**: **实现基于目标行业的智能产品匹配和推荐系统
- **FR-6**: 构建完整的产品展示体系（目录、详情、参数对比）
- **FR-7**: 完善询价和订单管理业务流程
- **FR-8**: 重构并完善后端管理系统
- **FR-9**: 优化整体交互体验，实现专业的微动画效果

## Non-Functional Requirements
- **NFR-1**: 首屏加载时间 < 2秒
- **NFR-2**: Lighthouse Performance评分 ≥ 90
- **NFR-3**: 移动端响应式体验优秀
- **NFR-4**: 代码模块化，组件可复用
- **NFR-5**: 无障碍访问（WCAG 2.1 AA标准）
- **NFR-6**: 研磨模拟器响应时间 < 500ms
- **NFR-7**: 智能推荐响应时间 < 300ms

## Constraints
- **Technical**: 继续使用HTML/CSS/JavaScript技术栈，保持现有技术架构的兼容性
- **Business**: 仅支持英文界面
- **Dependencies**: 保留现有数据结构和图片资源

## Assumptions
- 现有JSON数据结构保持不变但可扩展
- 现有图片资源可用，部分需要处理为白色背景
- 用户使用英文浏览
- 目标设备包括桌面端、平板和移动端

## Acceptance Criteria

### AC-1: 设计系统完整性
- **Given**: 设计系统文档存在
- **When**: 检查所有UI组件
- **Then**: 所有组件遵循统一的色彩、字体、间距规范
- **Verification**: `human-judgment`

### AC-2: 前端视觉效果
- **Given**: 用户访问网站
- **When**: 浏览各页面
- **Then**: 视觉效果符合国际顶级B2B品牌标准，专业且有冲击力
- **Verification**: `human-judgment`

### AC-3: 产品图片白色背景
- **Given**: 用户浏览产品图片
- **When**: 查看任意产品图片
- **Then**: 产品图片使用白色背景展示
- **Verification**: `human-judgment`

### AC-4: 研磨模拟器功能
- **Given**: 用户使用研磨模拟器
- **When**: 输入参数并运行模拟
- **Then**: 模拟器响应快速，结果准确，交互体验优秀
- **Verification**: `programmatic`

### AC-5: 智能产品推荐
- **Given**: 用户选择目标行业或浏览产品
- **When**: 系统进行推荐
- **Then**: 推荐结果相关且准确，展示方式专业
- **Verification**: `programmatic` + `human-judgment`

### AC-6: 产品展示体系
- **Given**: 用户浏览产品
- **When**: 使用产品目录、详情页、参数对比
- **Then**: 信息展示清晰专业，交互流畅
- **Verification**: `human-judgment`

### AC-7: 业务流程完整性
- **Given**: 用户进行采购流程
- **When**: 从产品浏览到询价到订单管理
- **Then**: 流程完整顺畅，用户体验优秀
- **Verification**: `programmatic`

### AC-8: 响应式体验
- **Given**: 用户在不同设备上访问
- **When**: 调整屏幕尺寸
- **Then**: 页面布局自适应，所有功能可用
- **Verification**: `programmatic`

### AC-9: 页面性能
- **Given**: 页面已部署
- **When**: 运行Lighthouse测试
- **Then**: Performance评分 ≥ 90，首屏加载 < 2秒
- **Verification**: `programmatic`

### AC-10: 后端管理系统
- **Given**: 管理员登录后台
- **When**: 使用各项管理功能
- **Then**: 功能完整，操作便捷，界面专业
- **Verification**: `human-judgment`

### AC-11: 代码质量
- **Given**: 重构完成
- **When**: 审查代码结构
- **Then**: 代码模块化，组件可复用，无冗余代码
- **Verification**: `human-judgment`
