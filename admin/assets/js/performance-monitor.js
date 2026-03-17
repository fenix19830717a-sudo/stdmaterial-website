class PerformanceMonitor {
    constructor() {
        this.metrics = {
            navigation: null,
            resources: [],
            paint: null,
            firstContentfulPaint: null,
            largestContentfulPaint: null
        };
        this.init();
    }

    init() {
        this.collectNavigationMetrics();
        this.collectResourceMetrics();
        this.collectPaintMetrics();
        this.setupMonitoring();
    }

    collectNavigationMetrics() {
        if ('performance' in window && 'navigation' in window.performance) {
            this.metrics.navigation = window.performance.navigation;
        }
    }

    collectResourceMetrics() {
        if ('performance' in window && 'getEntriesByType' in window.performance) {
            this.metrics.resources = window.performance.getEntriesByType('resource');
        }
    }

    collectPaintMetrics() {
        if ('performance' in window && 'getEntriesByType' in window.performance) {
            const paintEntries = window.performance.getEntriesByType('paint');
            paintEntries.forEach(entry => {
                if (entry.name === 'first-paint') {
                    this.metrics.paint = entry.startTime;
                } else if (entry.name === 'first-contentful-paint') {
                    this.metrics.firstContentfulPaint = entry.startTime;
                }
            });

            // 监听最大内容绘制
            if ('largestContentfulPaint' in window) {
                new PerformanceObserver((entries) => {
                    const lcpEntry = entries.getEntries()[0];
                    if (lcpEntry) {
                        this.metrics.largestContentfulPaint = lcpEntry.startTime;
                        this.logMetrics();
                    }
                }).observe({ type: 'largest-contentful-paint', buffered: true });
            }
        }
    }

    setupMonitoring() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.collectResourceMetrics();
                this.logMetrics();
                this.displayMetrics();
            }, 1000);
        });
    }

    logMetrics() {
        console.log('Performance Metrics:', {
            navigation: this.metrics.navigation,
            paint: this.metrics.paint,
            firstContentfulPaint: this.metrics.firstContentfulPaint,
            largestContentfulPaint: this.metrics.largestContentfulPaint,
            resourceCount: this.metrics.resources.length,
            totalResourceSize: this.calculateTotalResourceSize()
        });
    }

    calculateTotalResourceSize() {
        return this.metrics.resources.reduce((total, resource) => {
            return total + (resource.transferSize || 0);
        }, 0);
    }

    getMetrics() {
        return {
            ...this.metrics,
            totalResourceSize: this.calculateTotalResourceSize(),
            resourceCount: this.metrics.resources.length
        };
    }

    displayMetrics() {
        // 检查是否存在性能监控面板
        const metricsPanel = document.getElementById('performance-metrics');
        if (metricsPanel) {
            metricsPanel.innerHTML = this.generateMetricsHTML();
        }
    }

    generateMetricsHTML() {
        const metrics = this.getMetrics();
        return `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-dark-700/50 p-4 rounded-lg">
                    <h4 class="text-sm font-medium mb-2">页面加载时间</h4>
                    <p class="text-lg font-semibold">${(metrics.paint || 0).toFixed(2)}ms</p>
                    <p class="text-xs text-gray-400">首次绘制</p>
                </div>
                <div class="bg-dark-700/50 p-4 rounded-lg">
                    <h4 class="text-sm font-medium mb-2">首次内容绘制</h4>
                    <p class="text-lg font-semibold">${(metrics.firstContentfulPaint || 0).toFixed(2)}ms</p>
                    <p class="text-xs text-gray-400">FCP</p>
                </div>
                <div class="bg-dark-700/50 p-4 rounded-lg">
                    <h4 class="text-sm font-medium mb-2">最大内容绘制</h4>
                    <p class="text-lg font-semibold">${(metrics.largestContentfulPaint || 0).toFixed(2)}ms</p>
                    <p class="text-xs text-gray-400">LCP</p>
                </div>
                <div class="bg-dark-700/50 p-4 rounded-lg">
                    <h4 class="text-sm font-medium mb-2">资源统计</h4>
                    <p class="text-lg font-semibold">${metrics.resourceCount}</p>
                    <p class="text-xs text-gray-400">资源数量</p>
                </div>
                <div class="bg-dark-700/50 p-4 rounded-lg md:col-span-2">
                    <h4 class="text-sm font-medium mb-2">总资源大小</h4>
                    <p class="text-lg font-semibold">${(metrics.totalResourceSize / 1024).toFixed(2)}KB</p>
                    <p class="text-xs text-gray-400">所有资源的总大小</p>
                </div>
            </div>
        `;
    }
}

// 初始化性能监控
document.addEventListener('DOMContentLoaded', () => {
    window.performanceMonitor = new PerformanceMonitor();
});