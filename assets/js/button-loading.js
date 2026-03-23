// 按钮加载动画管理
export class ButtonLoading {
  /**
   * 为按钮添加加载状态
   * @param {HTMLElement} button - 按钮元素
   * @param {string} type - 加载动画类型: 'spinner', 'progress', 'skeleton'
   * @param {string} text - 加载时的文本
   */
  static startLoading(button, type = 'spinner', text = 'Loading...') {
    if (!button) return;
    
    // 保存原始状态
    button.dataset.originalText = button.innerHTML;
    button.dataset.originalClass = button.className;
    
    // 设置加载状态
    button.innerHTML = text;
    button.className = `${button.dataset.originalClass} btn-loading btn-loading-${type}`;
    button.disabled = true;
  }
  
  /**
   * 移除按钮的加载状态
   * @param {HTMLElement} button - 按钮元素
   */
  static stopLoading(button) {
    if (!button || !button.dataset.originalText) return;
    
    // 恢复原始状态
    button.innerHTML = button.dataset.originalText;
    button.className = button.dataset.originalClass;
    button.disabled = false;
    
    // 清除保存的状态
    delete button.dataset.originalText;
    delete button.dataset.originalClass;
  }
  
  /**
   * 为按钮添加点击事件，自动处理加载状态
   * @param {HTMLElement} button - 按钮元素
   * @param {Function} callback - 点击回调函数，返回Promise
   * @param {string} type - 加载动画类型
   * @param {string} loadingText - 加载时的文本
   */
  static addLoadingHandler(button, callback, type = 'spinner', loadingText = 'Loading...') {
    if (!button || typeof callback !== 'function') return;
    
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      
      // 开始加载
      ButtonLoading.startLoading(button, type, loadingText);
      
      try {
        // 执行回调
        await callback(e);
      } catch (error) {
        console.error('Button callback error:', error);
      } finally {
        // 结束加载
        ButtonLoading.stopLoading(button);
      }
    });
  }
}

// 自动初始化所有带有data-loading属性的按钮
document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('[data-loading]');
  
  buttons.forEach(button => {
    const type = button.dataset.loadingType || 'spinner';
    const loadingText = button.dataset.loadingText || 'Loading...';
    const duration = parseInt(button.dataset.loadingDuration) || 2000;
    
    ButtonLoading.addLoadingHandler(button, () => {
      return new Promise(resolve => {
        setTimeout(resolve, duration);
      });
    }, type, loadingText);
  });
});