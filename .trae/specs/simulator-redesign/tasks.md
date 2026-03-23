# 模拟器重新设计 - 实现计划

## [x] Task 1: 重新设计状态管理和设备控制模式
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 添加编辑模式状态，区分当前显示参数和编辑中的参数
  - 添加提交历史记录，支持撤销
  - 重构状态类型，包含临时编辑状态
- **Acceptance Criteria Addressed**: AC-2, AC-3
- **Test Requirements**:
  - `human-judgement` TR-1.1: 检查设备控制面板是否有编辑模式的视觉提示
  - `human-judgement` TR-1.2: 检查是否有提交和撤销按钮
  - `programmatic` TR-1.3: TypeScript类型检查通过
- **Notes**: 保持与现有状态的兼容性

## [x] Task 2: 重新设计Time Progress和Real-time Data整合布局
- **Priority**: P0
- **Depends On**: Task 1
- **Description**: 
  - 将Time Progress和Real-time Data整合到同一个板块
  - 重新设计整体布局，使其更加直观
  - 时间轴和数据卡片并排展示
- **Acceptance Criteria Addressed**: AC-1, AC-4
- **Test Requirements**:
  - `human-judgement` TR-2.1: 检查布局是否清晰直观
  - `human-judgement` TR-2.2: 检查时间轴和数据是否在同一板块
  - `human-judgement` TR-2.3: 检查响应式布局在不同屏幕下的表现

## [x] Task 3: 实现自动演示功能
- **Priority**: P1
- **Depends On**: Task 2
- **Description**: 
  - 添加自动演示计时器
  - 用户无操作30秒后自动开始演示
  - 演示过程播放完整模拟，速度适中
  - 演示过程中用户操作可以中断演示
- **Acceptance Criteria Addressed**: AC-5
- **Test Requirements**:
  - `human-judgement` TR-3.1: 检查等待30秒后是否自动开始演示
  - `human-judgement` TR-3.2: 检查演示过程是否流畅
  - `human-judgement` TR-3.3: 检查用户操作是否能正确中断演示

## [x] Task 4: 实现时间轴操作标记和详情展示
- **Priority**: P1
- **Depends On**: Task 1
- **Description**: 
  - 在时间轴上可视化标记操作点
  - 点击操作点可以查看详细信息
  - 操作点有视觉区分（电源、转速、振动等）
- **Acceptance Criteria Addressed**: AC-1, AC-7
- **Test Requirements**:
  - `human-judgement` TR-4.1: 检查时间轴上是否有操作标记
  - `human-judgement` TR-4.2: 检查点击标记是否显示详情
  - `human-judgement` TR-4.3: 检查不同操作类型的视觉区分

## [x] Task 5: 合并温度和颗粒度图表到双Y轴图表
- **Priority**: P1
- **Depends On**: None
- **Description**: 
  - 配置Chart.js支持双Y轴
  - 左侧Y轴显示温度，右侧Y轴显示颗粒度
  - 图表动态更新，与时间进度同步
  - 保留图例，区分两条曲线
- **Acceptance Criteria Addressed**: AC-6
- **Test Requirements**:
  - `human-judgement` TR-5.1: 检查图表是否有两个Y轴
  - `human-judgement` TR-5.2: 检查温度和颗粒度数据是否正确显示
  - `human-judgement` TR-5.3: 检查图表是否随时间进度动态更新
  - `programmatic` TR-5.4: 检查TypeScript类型和Chart.js配置

## [x] Task 6: 完善设备控制面板提交/撤销功能
- **Priority**: P0
- **Depends On**: Task 1
- **Description**: 
  - 设备控制参数在编辑模式下不立即生效
  - 点击提交按钮后，参数生效并记录到时间轴
  - 点击撤销按钮，回退到上一次提交前的状态
  - 提交后触发数据重新计算
- **Acceptance Criteria Addressed**: AC-2, AC-3
- **Test Requirements**:
  - `human-judgement` TR-6.1: 检查编辑模式下参数是否不立即生效
  - `human-judgement` TR-6.2: 检查提交后参数是否生效并记录
  - `human-judgement` TR-6.3: 检查撤销功能是否正常工作
  - `human-judgement` TR-6.4: 检查数据是否在提交后重新计算

## [/] Task 7: 综合测试和优化
- **Priority**: P2
- **Depends On**: Task 1-6
- **Description**: 
  - 端到端测试整个流程
  - 优化性能，确保流畅运行
  - 修复发现的bug
  - 检查所有验收标准是否满足
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-3, AC-4, AC-5, AC-6, AC-7
- **Test Requirements**:
  - `human-judgement` TR-7.1: 完整走查所有功能
  - `human-judgement` TR-7.2: 检查性能和流畅度
  - `programmatic` TR-7.3: 运行完整构建检查TypeScript错误
  - `human-judgement` TR-7.4: 验证所有验收标准
