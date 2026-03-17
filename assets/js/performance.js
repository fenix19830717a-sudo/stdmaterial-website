// 性能优化工具函数

/**
 * 节流函数 - 限制函数执行频率
 * @param {Function} func - 要执行的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Function} 节流后的函数
 */
function throttle(func, delay) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, delay);
        }
    };
}

/**
 * 防抖函数 - 延迟函数执行
 * @param {Function} func - 要执行的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Function} 防抖后的函数
 */
function debounce(func, delay) {
    let timeout;
    return function() {
        const args = arguments;
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}

/**
 * 优化的滚动动画处理
 */
function handleScrollAnimations() {
    const elements = document.querySelectorAll('.card, .card-warm, .glass-panel');
    const windowHeight = window.innerHeight;
    const elementVisible = 150;
    
    // 使用 requestAnimationFrame 优化动画
    requestAnimationFrame(() => {
        elements.forEach(element => {
            if (!element.classList.contains('animate-fade-in')) {
                const elementTop = element.getBoundingClientRect().top;
                if (elementTop < windowHeight - elementVisible) {
                    element.classList.add('animate-fade-in');
                }
            }
        });
    });
}

/**
 * 优化的导航栏滚动效果
 */
function handleNavScroll() {
    const nav = document.querySelector('nav');
    if (!nav) return;
    
    requestAnimationFrame(() => {
        if (window.scrollY > 50) {
            nav.classList.add('bg-background/95', 'backdrop-blur-lg', 'shadow-lg');
            nav.classList.remove('py-4');
            nav.classList.add('py-2');
        } else {
            nav.classList.remove('bg-background/95', 'backdrop-blur-lg', 'shadow-lg');
            nav.classList.remove('py-2');
            nav.classList.add('py-4');
        }
    });
}

/**
 * 图片懒加载优化
 */
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.src;
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

/**
 * 初始化性能优化
 */
function initPerformanceOptimizations() {
    // 节流滚动事件处理
    const throttledScroll = throttle(() => {
        handleScrollAnimations();
        handleNavScroll();
    }, 16); // 约60fps
    
    // 防抖窗口 resize 事件处理
    const debouncedResize = debounce(() => {
        handleScrollAnimations();
    }, 250);
    
    // 添加事件监听器
    window.addEventListener('scroll', throttledScroll);
    window.addEventListener('resize', debouncedResize);
    
    // 初始化懒加载
    initLazyLoading();
    
    // 初始执行一次
    handleScrollAnimations();
    handleNavScroll();
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPerformanceOptimizations);
} else {
    initPerformanceOptimizations();
}
