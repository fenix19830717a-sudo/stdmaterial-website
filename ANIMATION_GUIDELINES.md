# 动效设计规范

## 1. 动效持续时间规范

所有动效持续时间必须严格控制在 **200-300毫秒** 区间内，以确保动画流畅且不影响用户体验。

### 具体时间分配
- **快速过渡**：200ms（适用于微交互，如按钮点击、表单元素焦点）
- **标准过渡**：250ms（适用于大多数元素的状态变化）
- **慢速过渡**：300ms（适用于页面级过渡、复杂元素的入场/退场）

## 2. 帧率控制

- 确保动画帧率稳定在 **60fps**
- 避免使用会导致布局抖动的动画属性（如width、height、top、left）
- 优先使用GPU加速的属性：transform、opacity

## 3. 性能优化措施

### 3.1 使用GPU加速
- 对动画元素添加 `will-change: transform, opacity` 属性
- 避免在动画过程中触发重排（reflow）

### 3.2 减少动画复杂度
- 避免同时执行多个复杂动画
- 对复杂动画使用 `requestAnimationFrame` 优化
- 考虑使用 `transform: translateZ(0)` 强制启用GPU加速

### 3.3 响应式调整
- 在移动设备上，可适当减少动画效果或简化动画
- 使用媒体查询检测设备性能并调整动画策略

## 4. 统一动效规范

### 4.1 缓动函数
- 标准缓动：`cubic-bezier(0.4, 0, 0.2, 1)`（ease-in-out）
- 入场动画：`cubic-bezier(0, 0, 0.2, 1)`（ease-out）
- 退场动画：`cubic-bezier(0.4, 0, 1, 1)`（ease-in）

### 4.2 动效类型及使用场景

| 动效类型 | 持续时间 | 适用场景 |
|---------|---------|----------|
| 颜色过渡 | 200ms | 按钮悬停、状态变化 |
| 大小过渡 | 250ms | 元素展开/收起 |
| 位置过渡 | 250ms | 导航菜单、下拉列表 |
| 透明度过渡 | 200ms | 模态框、提示信息 |
| 缩放过渡 | 250ms | 卡片悬停、图片预览 |
| 旋转过渡 | 250ms | 加载图标、状态指示器 |

### 4.3 组合动效
- 悬停效果：缩放(1.05x) + 阴影增强 + 轻微上移(4px)
- 点击效果：缩放(0.95x) + 阴影减弱
- 入场效果：淡入 + 上移(20px)
- 退场效果：淡出 + 下移(20px)

## 5. 避免过度动画

- 不要在所有元素上都添加动画效果
- 优先为用户交互频繁的元素添加动画
- 避免使用闪烁、抖动等可能引起不适的动画
- 确保动画不会分散用户注意力或造成操作延迟

## 6. 代码实现规范

### 6.1 CSS变量使用
```css
:root {
  --transition-fast: 0.2s ease;
  --transition-normal: 0.25s ease;
  --transition-slow: 0.3s ease;
}
```

### 6.2 标准动画类
- `.transition-all`：所有属性过渡
- `.transition-colors`：颜色属性过渡
- `.transition-transform`：变换属性过渡
- `.transition-opacity`：透明度过渡
- `.hover-lift`：悬停提升效果
- `.hover-scale`：悬停缩放效果
- `.hover-glow`：悬停发光效果

### 6.3 JavaScript动画优化
- 使用 `requestAnimationFrame` 进行复杂动画
- 避免在动画回调中执行重计算
- 对批量动画使用防抖/节流

## 7. 可访问性考虑

- 尊重用户的 `prefers-reduced-motion` 设置
- 确保动画不会干扰屏幕阅读器
- 为动画元素提供适当的替代文本

## 8. 测试与验证

- 在不同设备和浏览器上测试动画性能
- 使用浏览器开发者工具分析动画帧率
- 监控动画对页面加载和交互性能的影响

## 9. 示例代码

### 基本过渡效果
```css
.button {
  transition: all var(--transition-normal);
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}
```

### 入场动画
```css
.element {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity var(--transition-slow), transform var(--transition-slow);
}

.element.animate-in {
  opacity: 1;
  transform: translateY(0);
}
```

### 性能优化示例
```css
.animated-element {
  will-change: transform, opacity;
  transform: translateZ(0); /* 强制GPU加速 */
}
```

## 10. 维护与更新

- 定期审查动画效果，确保符合性能标准
- 随着浏览器和设备的发展，及时更新动画策略
- 收集用户反馈，调整动画效果以提升用户体验

---

本规范旨在确保动效设计既美观又高效，为用户提供流畅、一致的交互体验。所有开发人员在实现动画效果时应严格遵循本规范。