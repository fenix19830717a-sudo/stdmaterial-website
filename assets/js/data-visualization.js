const DataVisualization = {
    config: {
        defaultColors: [
            '#13c8ec',
            '#fbbf24',
            '#3b82f6',
            '#22c55e',
            '#a855f7',
            '#ef4444',
            '#6366f1',
            '#14b8a6'
        ],
        animationDuration: 1000
    },
    
    charts: {},
    
    init: function() {
        this.initCharts();
        this.bindEvents();
    },
    
    bindEvents: function() {
        // 绑定图表相关事件
        document.addEventListener('change', (e) => {
            if (e.target.id === 'revenuePeriod') {
                this.updateRevenueChart(e.target.value);
            }
        });
    },
    
    initCharts: function() {
        this.initRevenueChart();
        this.initOrderStatusChart();
        this.initSalesTrendChart();
        this.initProductPerformanceChart();
        this.initCustomerAnalysisChart();
    },
    
    initRevenueChart: function() {
        const ctx = document.getElementById('revenueChart');
        if (!ctx) return;
        
        this.charts.revenue = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Revenue',
                    data: [12000, 19000, 15000, 25000, 22000, 30000, 28000],
                    borderColor: this.config.defaultColors[0],
                    backgroundColor: `${this.config.defaultColors[0]}20`,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: this.config.defaultColors[0],
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: this.config.animationDuration
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(22, 35, 38, 0.9)',
                        titleColor: '#fff',
                        bodyColor: '#e5e7eb',
                        borderColor: 'rgba(19, 200, 236, 0.2)',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return `Revenue: $${context.parsed.y.toLocaleString()}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        },
                        ticks: {
                            color: '#9ca3af',
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#9ca3af'
                        }
                    }
                }
            }
        });
    },
    
    initOrderStatusChart: function() {
        const ctx = document.getElementById('orderStatusChart');
        if (!ctx) return;
        
        this.charts.orderStatus = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Pending', 'Processing', 'Shipped', 'Delivered'],
                datasets: [{
                    data: [5, 8, 12, 25],
                    backgroundColor: [
                        this.config.defaultColors[1],
                        this.config.defaultColors[2],
                        this.config.defaultColors[0],
                        this.config.defaultColors[3]
                    ],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    animateScale: true,
                    animateRotate: true,
                    duration: this.config.animationDuration
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(22, 35, 38, 0.9)',
                        titleColor: '#fff',
                        bodyColor: '#e5e7eb',
                        borderColor: 'rgba(19, 200, 236, 0.2)',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: true,
                        callbacks: {
                            label: function(context) {
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${context.label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                },
                cutout: '70%'
            }
        });
    },
    
    initSalesTrendChart: function() {
        const ctx = document.getElementById('salesTrendChart');
        if (!ctx) return;
        
        this.charts.salesTrend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [
                    {
                        label: '2024',
                        data: [12000, 19000, 15000, 25000, 22000, 30000, 35000, 32000, 38000, 42000, 45000, 50000],
                        borderColor: this.config.defaultColors[0],
                        backgroundColor: `${this.config.defaultColors[0]}20`,
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: '2023',
                        data: [8000, 12000, 10000, 15000, 18000, 22000, 25000, 28000, 30000, 32000, 35000, 38000],
                        borderColor: this.config.defaultColors[2],
                        backgroundColor: 'transparent',
                        tension: 0.4,
                        borderDash: [5, 5]
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: this.config.animationDuration
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: '#e5e7eb',
                            usePointStyle: true,
                            padding: 20
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(22, 35, 38, 0.9)',
                        titleColor: '#fff',
                        bodyColor: '#e5e7eb',
                        borderColor: 'rgba(19, 200, 236, 0.2)',
                        borderWidth: 1,
                        padding: 12
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        },
                        ticks: {
                            color: '#9ca3af',
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#9ca3af'
                        }
                    }
                }
            }
        });
    },
    
    initProductPerformanceChart: function() {
        const ctx = document.getElementById('productPerformanceChart');
        if (!ctx) return;
        
        this.charts.productPerformance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Grinding Jars', 'Grinding Media', 'Equipment', 'Accessories'],
                datasets: [{
                    label: 'Sales',
                    data: [125000, 85000, 65000, 35000],
                    backgroundColor: this.config.defaultColors.map(color => `${color}80`),
                    borderRadius: 4,
                    barThickness: 20
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: this.config.animationDuration
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(22, 35, 38, 0.9)',
                        titleColor: '#fff',
                        bodyColor: '#e5e7eb',
                        borderColor: 'rgba(19, 200, 236, 0.2)',
                        borderWidth: 1,
                        padding: 12,
                        callbacks: {
                            label: function(context) {
                                return `Sales: $${context.parsed.y.toLocaleString()}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        },
                        ticks: {
                            color: '#9ca3af',
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#9ca3af'
                        }
                    }
                }
            }
        });
    },
    
    initCustomerAnalysisChart: function() {
        const ctx = document.getElementById('customerAnalysisChart');
        if (!ctx) return;
        
        this.charts.customerAnalysis = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['VIP', 'Enterprise', 'Premium', 'Standard'],
                datasets: [{
                    data: [15, 25, 30, 30],
                    backgroundColor: this.config.defaultColors,
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    animateScale: true,
                    animateRotate: true,
                    duration: this.config.animationDuration
                },
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: '#e5e7eb',
                            usePointStyle: true,
                            padding: 20
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(22, 35, 38, 0.9)',
                        titleColor: '#fff',
                        bodyColor: '#e5e7eb',
                        borderColor: 'rgba(19, 200, 236, 0.2)',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: true,
                        callbacks: {
                            label: function(context) {
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${context.label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    },
    
    updateRevenueChart: function(period) {
        if (!this.charts.revenue) return;
        
        let labels, data;
        
        switch (period) {
            case '7':
                labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                data = [12000, 19000, 15000, 25000, 22000, 30000, 28000];
                break;
            case '30':
                labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
                data = [60000, 80000, 95000, 110000];
                break;
            case '90':
                labels = ['Jan', 'Feb', 'Mar'];
                data = [250000, 320000, 380000];
                break;
            default:
                labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                data = [12000, 19000, 15000, 25000, 22000, 30000, 28000];
        }
        
        this.charts.revenue.data.labels = labels;
        this.charts.revenue.data.datasets[0].data = data;
        this.charts.revenue.update();
    },
    
    updateChartData: function(chartId, data, labels) {
        const chart = this.charts[chartId];
        if (chart) {
            chart.data.labels = labels;
            chart.data.datasets[0].data = data;
            chart.update();
        }
    },
    
    createCustomChart: function(canvasId, type, data, options = {}) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;
        
        const defaultOptions = {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: this.config.animationDuration
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#e5e7eb'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(22, 35, 38, 0.9)',
                    titleColor: '#fff',
                    bodyColor: '#e5e7eb',
                    borderColor: 'rgba(19, 200, 236, 0.2)',
                    borderWidth: 1,
                    padding: 12
                }
            },
            scales: {
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    },
                    ticks: {
                        color: '#9ca3af'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    },
                    ticks: {
                        color: '#9ca3af'
                    }
                }
            }
        };
        
        const mergedOptions = { ...defaultOptions, ...options };
        
        return new Chart(ctx, {
            type,
            data,
            options: mergedOptions
        });
    },
    
    destroyChart: function(chartId) {
        if (this.charts[chartId]) {
            this.charts[chartId].destroy();
            delete this.charts[chartId];
        }
    }
};

document.addEventListener('DOMContentLoaded', function() {
    DataVisualization.init();
});
