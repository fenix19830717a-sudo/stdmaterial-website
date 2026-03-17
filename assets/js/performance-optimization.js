const PerformanceOptimization = {
    config: {
        imageQuality: 0.8,
        lazyLoadThreshold: 100,
        debounceDelay: 250,
        cacheExpiry: 24 * 60 * 60 * 1000 // 24 hours
    },
    
    state: {
        cachedResources: {},
        debounceTimers: {}
    },
    
    init: function() {
        this.initLazyLoading();
        this.initDebounce();
        this.initResourceCaching();
        this.initPerformanceMonitoring();
        this.optimizeCriticalRenderingPath();
    },
    
    initLazyLoading: function() {
        // 图片懒加载
        this.lazyLoadImages();
        
        // 组件懒加载
        this.lazyLoadComponents();
        
        // 监听滚动事件，处理懒加载
        window.addEventListener('scroll', this.debounce(() => {
            this.lazyLoadImages();
            this.lazyLoadComponents();
        }, this.config.debounceDelay));
        
        // 监听 resize 事件
        window.addEventListener('resize', this.debounce(() => {
            this.lazyLoadImages();
            this.lazyLoadComponents();
        }, this.config.debounceDelay));
    },
    
    lazyLoadImages: function() {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            if (this.isInViewport(img, this.config.lazyLoadThreshold)) {
                this.loadImage(img);
            }
        });
    },
    
    loadImage: function(img) {
        const src = img.getAttribute('data-src');
        if (!src) return;
        
        const image = new Image();
        image.src = src;
        image.onload = () => {
            img.src = src;
            img.removeAttribute('data-src');
            img.classList.remove('lazy');
            img.classList.add('loaded');
        };
        
        img.onerror = () => {
            console.error('Error loading image:', src);
        };
    },
    
    lazyLoadComponents: function() {
        const components = document.querySelectorAll('[data-component]');
        components.forEach(component => {
            if (this.isInViewport(component, this.config.lazyLoadThreshold)) {
                this.loadComponent(component);
            }
        });
    },
    
    loadComponent: function(component) {
        const componentName = component.getAttribute('data-component');
        if (!componentName) return;
        
        // 这里可以根据组件名称加载对应的组件
        console.log('Loading component:', componentName);
        
        // 示例：加载图表组件
        if (componentName === 'chart') {
            this.initChartComponent(component);
        }
        
        component.removeAttribute('data-component');
    },
    
    initChartComponent: function(component) {
        const chartType = component.getAttribute('data-chart-type');
        const chartId = component.getAttribute('data-chart-id');
        
        if (chartType && chartId && window.DataVisualization) {
            // 这里可以初始化图表
            console.log('Initializing chart:', chartId, chartType);
        }
    },
    
    isInViewport: function(element, threshold = 0) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) + threshold &&
            rect.left <= (window.innerWidth || document.documentElement.clientWidth) + threshold &&
            rect.bottom >= -threshold &&
            rect.right >= -threshold
        );
    },
    
    initDebounce: function() {
        // 添加全局 debounce 函数
        window.debounce = this.debounce;
    },
    
    debounce: function(func, wait) {
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(window.debounceTimers[func]);
                func(...args);
            };
            clearTimeout(window.debounceTimers[func]);
            window.debounceTimers[func] = setTimeout(later, wait);
        };
    },
    
    initResourceCaching: function() {
        // 缓存静态资源
        this.cacheStaticResources();
        
        // 监听网络状态变化
        window.addEventListener('online', () => {
            this.cacheStaticResources();
        });
    },
    
    cacheStaticResources: function() {
        const staticResources = [
            '/assets/css/admin.css',
            '/assets/js/admin.js',
            '/assets/js/data-visualization.js',
            '/assets/js/notification-system.js',
            '/assets/js/bulk-actions.js'
        ];
        
        staticResources.forEach(resource => {
            this.cacheResource(resource);
        });
    },
    
    cacheResource: async function(url) {
        try {
            const cached = this.getCachedResource(url);
            if (cached) {
                console.log('Using cached resource:', url);
                return cached;
            }
            
            const response = await fetch(url);
            if (response.ok) {
                const content = await response.text();
                this.setCachedResource(url, content);
                return content;
            }
        } catch (error) {
            console.error('Error caching resource:', url, error);
        }
    },
    
    getCachedResource: function(url) {
        const cached = this.state.cachedResources[url];
        if (cached && Date.now() < cached.expiry) {
            return cached.content;
        }
        return null;
    },
    
    setCachedResource: function(url, content) {
        this.state.cachedResources[url] = {
            content,
            expiry: Date.now() + this.config.cacheExpiry
        };
    },
    
    initPerformanceMonitoring: function() {
        // 监控页面加载性能
        if (window.performance && window.performance.timing) {
            window.addEventListener('load', () => {
                this.measurePerformance();
            });
        }
        
        // 监控用户交互性能
        this.monitorUserInteractions();
    },
    
    measurePerformance: function() {
        const timing = window.performance.timing;
        const metrics = {
            loadTime: timing.loadEventEnd - timing.navigationStart,
            domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
            firstPaint: window.performance.getEntriesByName('first-paint')[0]?.startTime || 0,
            firstContentfulPaint: window.performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
        };
        
        console.log('Performance Metrics:', metrics);
        
        // 可以将性能数据发送到服务器进行分析
        this.sendPerformanceData(metrics);
    },
    
    sendPerformanceData: function(metrics) {
        // 这里可以发送性能数据到服务器
        // fetch('/api/performance', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(metrics)
        // });
    },
    
    monitorUserInteractions: function() {
        const interactions = ['click', 'keydown', 'scroll', 'resize'];
        interactions.forEach(eventType => {
            document.addEventListener(eventType, (e) => {
                const startTime = Date.now();
                
                // 监听事件处理完成
                setTimeout(() => {
                    const endTime = Date.now();
                    const duration = endTime - startTime;
                    
                    if (duration > 100) {
                        console.warn(`Slow ${eventType} event: ${duration}ms`);
                    }
                }, 0);
            });
        });
    },
    
    optimizeCriticalRenderingPath: function() {
        // 优化关键渲染路径
        this.preloadCriticalResources();
        this.minimizeRenderBlockingCSS();
        this.deferNonCriticalJavaScript();
    },
    
    preloadCriticalResources: function() {
        const criticalResources = [
            {
                href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap',
                rel: 'preload',
                as: 'style'
            },
            {
                href: 'https://fonts.googleapis.com/icon?family=Material+Icons',
                rel: 'preload',
                as: 'style'
            }
        ];
        
        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.href = resource.href;
            link.rel = resource.rel;
            link.as = resource.as;
            document.head.appendChild(link);
        });
    },
    
    minimizeRenderBlockingCSS: function() {
        // 内联关键CSS
        const criticalCSS = this.extractCriticalCSS();
        if (criticalCSS) {
            const style = document.createElement('style');
            style.textContent = criticalCSS;
            document.head.appendChild(style);
        }
    },
    
    extractCriticalCSS: function() {
        // 这里可以提取关键CSS
        // 示例：返回基本的布局CSS
        return `
            .admin-layout {
                display: flex;
                height: 100vh;
                overflow: hidden;
            }
            .admin-sidebar {
                width: 256px;
                background: #162326;
                border-right: 1px solid #24373b;
                flex-shrink: 0;
            }
            .admin-main {
                flex: 1;
                overflow: auto;
                background: #101f22;
            }
            .admin-header {
                position: sticky;
                top: 0;
                z-index: 40;
            }
        `;
    },
    
    deferNonCriticalJavaScript: function() {
        // 延迟加载非关键JavaScript
        const scripts = document.querySelectorAll('script:not([defer]):not([async])');
        scripts.forEach(script => {
            if (!script.src.includes('cdn.tailwindcss.com') && !script.src.includes('googletagmanager.com')) {
                script.setAttribute('defer', 'defer');
            }
        });
    },
    
    optimizeImageLoading: function() {
        // 优化图片加载
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.src) return;
            
            // 添加图片加载失败处理
            img.onerror = function() {
                this.src = '/assets/images/placeholder.png';
                this.alt = 'Image not available';
            };
            
            // 添加图片加载成功处理
            img.onload = function() {
                this.classList.add('loaded');
            };
        });
    },
    
    optimizeMemoryUsage: function() {
        // 优化内存使用
        window.addEventListener('unload', () => {
            // 清理缓存
            this.state.cachedResources = {};
            this.state.debounceTimers = {};
        });
        
        // 定期清理缓存
        setInterval(() => {
            this.cleanupCache();
        }, 60 * 60 * 1000); // 每小时清理一次
    },
    
    cleanupCache: function() {
        const now = Date.now();
        for (const url in this.state.cachedResources) {
            if (this.state.cachedResources[url].expiry < now) {
                delete this.state.cachedResources[url];
            }
        }
    },
    
    getPerformanceScore: function() {
        // 计算性能得分
        const timing = window.performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        
        let score = 100;
        if (loadTime > 2000) {
            score -= (loadTime - 2000) / 100;
        }
        
        score = Math.max(0, Math.min(100, score));
        return score;
    },
    
    showPerformanceMetrics: function() {
        // 显示性能指标
        const score = this.getPerformanceScore();
        console.log(`Performance Score: ${score}/100`);
        
        // 可以在界面上显示性能指标
        const performanceElement = document.getElementById('performance-metrics');
        if (performanceElement) {
            performanceElement.innerHTML = `
                <div class="p-4 bg-dark-700 rounded-lg">
                    <h3 class="text-sm font-medium mb-2">Performance Metrics</h3>
                    <div class="space-y-2">
                        <div class="flex justify-between text-xs">
                            <span>Performance Score:</span>
                            <span class="font-medium ${score >= 80 ? 'text-green-400' : score >= 60 ? 'text-yellow-400' : 'text-red-400'}">${score}/100</span>
                        </div>
                    </div>
                </div>
            `;
        }
    }
};

document.addEventListener('DOMContentLoaded', function() {
    PerformanceOptimization.init();
    
    // 页面加载完成后显示性能指标
    window.addEventListener('load', function() {
        setTimeout(() => {
            PerformanceOptimization.showPerformanceMetrics();
        }, 1000);
    });
});
