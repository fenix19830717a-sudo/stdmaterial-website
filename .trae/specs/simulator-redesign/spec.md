# 模拟器重新设计 - Product Requirement Document

## Overview
- **Summary**: 重新设计模拟器的时间进度、设备控制和数据展示功能，使其更加直观和易用。
- **Purpose**: 解决当前Time Progress混乱的问题，提供更好的用户交互体验，整合数据展示，增加自动演示功能。
- **Target Users**: 需要使用模拟器进行研磨过程优化的工程师和研究人员。

## Goals
- 重新设计Time Progress组件，使其清晰易用
- 实现设备控制的提交/撤销机制
- 整合运行数据和时间轴到一个板块
- 添加30秒自动演示功能
- 合并温度趋势和颗粒度分布到一个动态图表

## Non-Goals (Out of Scope)
- 不修改左侧配置参数面板
- 不修改推荐面板的内容
- 不修改设备选择功能

## Background & Context
当前实现存在以下问题：
1. Time Progress组件布局混乱，设备操作记录与进度条挤在一起
2. 设备控制没有提交机制，每次操作都立即生效且不可撤销
3. 运行数据和时间轴分开，不够直观
4. 没有自动演示功能
5. 两个图表分离展示，占用空间且不直观

## Functional Requirements
- **FR-1**: 重新设计Time Progress组件，包含清晰的时间轴和操作记录
- **FR-2**: 实现设备控制的编辑模式，用户可以先调整参数，然后点击提交按钮确认
- **FR-3**: 实现操作撤销功能，可以撤销上一次提交的操作
- **FR-4**: 将运行数据（Real-time Data）和时间轴整合到同一个板块
- **FR-5**: 实现自动演示功能，用户无操作时30秒内自动演示完整过程
- **FR-6**: 合并温度趋势和颗粒度分布到同一个动态图表中，支持双Y轴
- **FR-7**: 在时间轴上标记设备操作点，点击可以查看详情

## Non-Functional Requirements
- **NFR-1**: 界面响应式，在不同屏幕尺寸上都能良好显示
- **NFR-2**: 自动演示功能流畅，无卡顿
- **NFR-3**: 图表更新及时，与时间进度同步

## Constraints
- **Technical**: 使用现有的React + TypeScript + Chart.js技术栈
- **Business**: 保持与现有左侧配置面板和推荐面板的兼容性
- **Dependencies**: 依赖现有的Chart.js和react-chartjs-2库

## Assumptions
- 用户理解时间轴上的操作标记含义
- 自动演示的30秒时长是合适的
- 双Y轴图表可以同时展示温度和颗粒度数据

## Acceptance Criteria

### AC-1: 清晰的Time Progress设计
- **Given**: 用户打开模拟器页面
- **When**: 查看Analysis Center
- **Then**: 时间进度条清晰展示，操作记录有序排列，时间轴上有操作点标记
- **Verification**: `human-judgment`
- **Notes**: 检查界面是否整洁有序

### AC-2: 设备控制提交机制
- **Given**: 用户在设备控制面板调整参数
- **When**: 点击提交按钮
- **Then**: 操作被记录在时间轴上，数据重新计算
- **Verification**: `human-judgment`

### AC-3: 操作撤销功能
- **Given**: 用户已提交过设备操作
- **When**: 点击撤销按钮
- **Then**: 上一次提交的操作被撤销，数据回退到操作前的状态
- **Verification**: `human-judgment`

### AC-4: 运行数据和时间轴整合
- **Given**: 用户查看Analysis Center
- **When**: 滚动到数据展示区域
- **Then**: 运行数据和时间轴在同一个板块内，布局清晰直观
- **Verification**: `human-judgment`

### AC-5: 自动演示功能
- **Given**: 用户打开模拟器页面且没有进行任何操作
- **When**: 等待30秒
- **Then**: 自动开始演示完整的模拟过程，时间进度条自动前进
- **Verification**: `human-judgment`

### AC-6: 合并图表展示
- **Given**: 用户查看数据图表
- **When**: 观察图表区域
- **Then**: 温度趋势和颗粒度分布在同一个图表中，支持双Y轴展示
- **Verification**: `human-judgment`

### AC-7: 时间轴操作标记
- **Given**: 用户已提交设备操作
- **When**: 查看时间轴
- **Then**: 操作点在时间轴上有清晰标记，点击可查看操作详情
- **Verification**: `human-judgment`

## Open Questions
- [ ] 自动演示是否需要可以暂停/重新开始？
- [ ] 撤销功能是否需要支持多级撤销？
- [ ] 操作点标记的视觉样式需要什么特殊设计？
