const AdminPanel = {
    config: {
        sessionKey: 'admin_session',
        loginPage: '/admin/login.html',
        dashboardPage: '/admin/dashboard.html',
        apiBaseUrl: ''
    },
    state: {
        isLoggedIn: false,
        currentUser: null,
        currentSection: 'dashboard',
        sidebarCollapsed: false,
        sidebarOpen: false
    },
    init: function() {
        this.checkAuth();
        this.initSidebar();
        this.initSidebarToggle();
        this.initMobileMenu();
        this.initLogout();
        this.initNotifications();
        if (this.state.isLoggedIn) {
            this.loadDashboardData();
            this.initRealTimeUpdates();
        }
    },
    checkAuth: function() {
        // 首先检查 localStorage 中的 session
        const session = localStorage.getItem(this.config.sessionKey);
        if (session) {
            try {
                const sessionData = JSON.parse(session);
                if (sessionData.expiry > Date.now()) {
                    this.state.isLoggedIn = true;
                    this.state.currentUser = sessionData.user;
                } else {
                    this.logout();
                }
            } catch (error) {
                this.logout();
            }
        }
        
        // 如果 localStorage 中没有 session，检查 sessionStorage
        if (!this.state.isLoggedIn) {
            const userRole = sessionStorage.getItem('userRole');
            const userInfo = sessionStorage.getItem('userInfo');
            if (userRole || userInfo) {
                this.state.isLoggedIn = true;
                try {
                    this.state.currentUser = userInfo ? JSON.parse(userInfo) : { role: userRole };
                } catch (e) {
                    this.state.currentUser = { role: userRole };
                }
            }
        }
        
        const currentPath = window.location.pathname;
        const isAdminPage = currentPath.includes('admin/') && !currentPath.includes('login.html');
        if (isAdminPage && !this.state.isLoggedIn) {
            window.location.href = this.config.loginPage;
        }
    },
    login: async function(username, password) {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: username, password: password })
            });
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data) {
                    const sessionData = {
                        user: {
                            id: data.data.user.id,
                            username: data.data.user.name,
                            role: data.data.user.role,
                            name: data.data.user.name
                        },
                        token: data.data.token,
                        expiry: Date.now() + (24 * 60 * 60 * 1000)
                    };
                    localStorage.setItem(this.config.sessionKey, JSON.stringify(sessionData));
                    this.state.isLoggedIn = true;
                    this.state.currentUser = sessionData.user;
                    return { success: true, message: 'Login successful' };
                } else {
                    return { success: false, message: 'Invalid response from server' };
                }
            } else {
                const errorData = await response.json();
                return { success: false, message: errorData.error?.message || errorData.message || 'Invalid credentials' };
            }
        } catch (error) {
            console.error('API login failed:', error);
            return { success: false, message: 'Login failed: ' + error.message };
        }
    },
    logout: function() {
        localStorage.removeItem(this.config.sessionKey);
        this.state.isLoggedIn = false;
        this.state.currentUser = null;
        window.location.href = this.config.loginPage;
    },
    getAuthHeader: function() {
        const session = localStorage.getItem(this.config.sessionKey);
        if (session) {
            try {
                const sessionData = JSON.parse(session);
                return { 'Authorization': `Bearer ${sessionData.token}` };
            } catch (error) {
                return {};
            }
        }
        return {};
    },
    initSidebar: function() {
        const sidebarLinks = document.querySelectorAll('.sidebar-link');
        sidebarLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.currentTarget.dataset.section;
                this.navigateToSection(section);
            });
        });
    },
    initSidebarToggle: function() {
        const sidebarToggle = document.querySelector('.sidebar-toggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                this.toggleSidebar();
            });
        }
    },
    toggleSidebar: function() {
        this.state.sidebarCollapsed = !this.state.sidebarCollapsed;
        const sidebar = document.querySelector('.admin-sidebar');
        const main = document.querySelector('.admin-main');
        if (sidebar && main) {
            if (this.state.sidebarCollapsed) {
                sidebar.classList.add('collapsed');
                main.classList.add('expanded');
            } else {
                sidebar.classList.remove('collapsed');
                main.classList.remove('expanded');
            }
        }
    },
    initMobileMenu: function() {
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }
    },
    toggleMobileMenu: function() {
        this.state.sidebarOpen = !this.state.sidebarOpen;
        const sidebar = document.querySelector('.admin-sidebar');
        if (sidebar) {
            if (this.state.sidebarOpen) {
                sidebar.classList.add('open');
            } else {
                sidebar.classList.remove('open');
            }
        }
    },
    navigateToSection: function(section) {
        this.state.currentSection = section;
        document.querySelectorAll('.sidebar-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.section === section) {
                link.classList.add('active');
            }
        });
        document.querySelectorAll('.admin-section').forEach(s => {
            s.classList.add('hidden');
        });
        const targetSection = document.getElementById(`${section}-section`);
        if (targetSection) {
            targetSection.classList.remove('hidden');
            this.animateSectionIn(targetSection);
        }
        this.loadSectionData(section);
        this.closeMobileMenu();
    },
    animateSectionIn: function(section) {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, 10);
    },
    closeMobileMenu: function() {
        if (this.state.sidebarOpen) {
            this.state.sidebarOpen = false;
            const sidebar = document.querySelector('.admin-sidebar');
            if (sidebar) {
                sidebar.classList.remove('open');
            }
        }
    },
    initLogout: function() {
        const logoutButton = document.querySelector('.logout-btn');
        if (logoutButton) {
            logoutButton.addEventListener('click', () => {
                this.logout();
            });
        }
    },
    initNotifications: function() {
        const notificationButton = document.querySelector('.notification-btn');
        if (notificationButton) {
            notificationButton.addEventListener('click', () => {
                this.showNotifications();
            });
        }
    },
    showNotifications: function() {
        const notificationsPanel = document.querySelector('.notifications-panel');
        if (notificationsPanel) {
            notificationsPanel.classList.toggle('show');
        }
    },
    initRealTimeUpdates: function() {
        this.setupPolling();
        this.setupWebSocket();
        this.initDataCache();
    },
    
    initDataCache: function() {
        this.state.dataCache = {
            products: null,
            orders: null,
            customers: null,
            dashboard: null,
            lastUpdate: {
                products: 0,
                orders: 0,
                customers: 0,
                dashboard: 0
            }
        };
    },
    
    setupPolling: function() {
        // 智能轮询配置
        const pollingConfig = {
            dashboard: 15000,  // 仪表盘数据每15秒更新
            products: 30000,   // 产品数据每30秒更新
            orders: 10000,     // 订单数据每10秒更新
            customers: 20000   // 客户数据每20秒更新
        };
        
        // 按模块设置不同频率的轮询
        Object.entries(pollingConfig).forEach(([module, interval]) => {
            setInterval(() => {
                if (this.state.isLoggedIn && !this.state.wsConnected) {
                    this.updateModuleData(module);
                }
            }, interval);
        });
        
        // 高频数据轮询 - 每3秒更新一次关键数据（仅当WebSocket不可用时）
        setInterval(() => {
            if (this.state.isLoggedIn && !this.state.wsConnected) {
                this.updateHighFrequencyData();
            }
        }, 3000);
    },
    
    setupWebSocket: function() {
        // WebSocket 服务未配置，直接使用轮询模式
        console.log('WebSocket not available, using polling mode');
        this.state.wsConnected = false;
        return;
        
        // 以下代码保留，待服务器配置 WebSocket 后启用
        /*
        // 尝试建立WebSocket连接
        if (window.WebSocket) {
            const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            const wsUrl = `${wsProtocol}//${window.location.host}/ws`;
            
            try {
                const socket = new WebSocket(wsUrl);
                
                socket.onopen = () => {
                    console.log('WebSocket connected');
                    this.state.wsConnected = true;
                    this.showNotification('连接状态', '实时数据连接已建立', 'success');
                    // 发送订阅消息
                    this.subscribeToTopics();
                };
                
                socket.onmessage = (event) => {
                    try {
                        const data = JSON.parse(event.data);
                        this.handleWebSocketMessage(data);
                    } catch (error) {
                        console.error('Error parsing WebSocket message:', error);
                    }
                };
                
                socket.onclose = (event) => {
                    console.log('WebSocket disconnected:', event.code, event.reason);
                    this.state.wsConnected = false;
                    this.showNotification('连接状态', '实时数据连接已断开，切换到轮询模式', 'warning');
                    // 尝试重连，使用指数退避策略
                    this.scheduleReconnect();
                };
                
                socket.onerror = (error) => {
                    console.error('WebSocket error:', error);
                    this.showNotification('连接错误', '实时数据连接发生错误', 'error');
                };
                
                this.state.wsSocket = socket;
                this.state.reconnectAttempts = 0;
            } catch (error) {
                console.error('WebSocket connection failed:', error);
                this.showNotification('连接错误', '无法建立实时数据连接，使用轮询模式', 'warning');
                // 如果WebSocket失败，回退到轮询
            }
        } else {
            console.warn('WebSocket not supported, falling back to polling');
            this.showNotification('浏览器提示', '您的浏览器不支持WebSocket，使用轮询模式', 'info');
        }
        */
    },
    
    scheduleReconnect: function() {
        // 指数退避重连策略
        this.state.reconnectAttempts = (this.state.reconnectAttempts || 0) + 1;
        const maxAttempts = 5;
        const baseDelay = 5000;
        
        if (this.state.reconnectAttempts <= maxAttempts) {
            const delay = baseDelay * Math.pow(2, this.state.reconnectAttempts - 1);
            console.log(`Attempting to reconnect in ${delay}ms...`);
            setTimeout(() => {
                this.setupWebSocket();
            }, delay);
        } else {
            console.error('Max reconnection attempts reached');
            this.showNotification('连接错误', '无法重新建立实时数据连接，将持续使用轮询模式', 'error');
        }
    },
    
    subscribeToTopics: function() {
        // 订阅相关主题
        const topics = ['orders', 'inventory', 'customers', 'sales'];
        topics.forEach(topic => {
            this.sendWebSocketMessage('subscribe', { topic });
        });
    },
    
    sendWebSocketMessage: function(type, data) {
        if (this.state.wsSocket && this.state.wsSocket.readyState === WebSocket.OPEN) {
            try {
                this.state.wsSocket.send(JSON.stringify({ type, data }));
            } catch (error) {
                console.error('Error sending WebSocket message:', error);
            }
        }
    },
    
    handleWebSocketMessage: function(data) {
        switch (data.type) {
            case 'order_update':
                this.handleOrderUpdate(data.payload);
                break;
            case 'inventory_update':
                this.handleInventoryUpdate(data.payload);
                break;
            case 'customer_update':
                this.handleCustomerUpdate(data.payload);
                break;
            case 'sales_update':
                this.handleSalesUpdate(data.payload);
                break;
            case 'batch_update':
                this.handleBatchUpdate(data.payload);
                break;
        }
    },
    
    handleBatchUpdate: function(updates) {
        // 处理批量更新
        if (updates.orders) {
            updates.orders.forEach(order => this.handleOrderUpdate(order));
        }
        if (updates.inventory) {
            updates.inventory.forEach(product => this.handleInventoryUpdate(product));
        }
        if (updates.customers) {
            updates.customers.forEach(customer => this.handleCustomerUpdate(customer));
        }
        if (updates.sales) {
            this.handleSalesUpdate(updates.sales);
        }
    },
    
    updateModuleData: function(module) {
        const now = Date.now();
        const lastUpdate = this.state.dataCache.lastUpdate[module] || 0;
        const minInterval = 5000; // 最小更新间隔
        
        // 防止过于频繁的更新
        if (now - lastUpdate < minInterval) {
            return;
        }
        
        this.state.dataCache.lastUpdate[module] = now;
        
        switch (module) {
            case 'dashboard':
                this.loadDashboardData();
                break;
            case 'products':
                this.loadProductsData();
                break;
            case 'customers':
                this.loadCustomersData();
                break;
            case 'orders':
                this.loadOrdersData();
                break;
        }
    },
    
    updateRealtimeData: function() {
        // 根据当前页面更新对应的数据
        this.updateModuleData(this.state.currentSection);
    },
    
    updateHighFrequencyData: function() {
        // 更新高频数据，如订单状态、库存变化
        if (this.state.currentSection === 'dashboard') {
            this.loadInventoryAlerts(this.getCachedProducts());
        }
        
        // 检查关键数据的时效性
        this.checkDataFreshness();
    },
    
    checkDataFreshness: function() {
        const now = Date.now();
        const maxAge = 60000; // 数据最大有效期60秒
        
        Object.entries(this.state.dataCache.lastUpdate).forEach(([module, timestamp]) => {
            if (now - timestamp > maxAge) {
                console.log(`Data for ${module} is stale, updating...`);
                this.updateModuleData(module);
            }
        });
    },
    
    handleOrderUpdate: function(order) {
        console.log('Order update received:', order);
        
        // 更新缓存中的订单数据
        if (this.state.dataCache.orders) {
            const orderIndex = this.state.dataCache.orders.findIndex(o => o.id === order.id);
            if (orderIndex !== -1) {
                this.state.dataCache.orders[orderIndex] = order;
            } else {
                this.state.dataCache.orders.push(order);
            }
        }
        
        // 显示通知
        this.showNotification('订单更新', `订单 ${order.id} 状态已更新为 ${order.status}`, 'info');
        
        // 只在相关页面更新数据
        if (this.state.currentSection === 'orders') {
            this.loadOrdersData();
        } else if (this.state.currentSection === 'dashboard') {
            this.loadDashboardData();
        }
    },
    
    handleInventoryUpdate: function(product) {
        console.log('Inventory update received:', product);
        
        // 更新缓存中的产品数据
        if (this.state.dataCache.products) {
            const productIndex = this.state.dataCache.products.findIndex(p => p.id === product.id);
            if (productIndex !== -1) {
                this.state.dataCache.products[productIndex] = product;
            }
        }
        
        // 库存预警
        if (product.stock <= 10) {
            this.showNotification('库存预警', `产品 ${product.name} 库存不足: ${product.stock} 件`, 'warning');
        }
        
        // 只在相关页面更新数据
        if (this.state.currentSection === 'products') {
            this.loadProductsData();
        } else if (this.state.currentSection === 'dashboard') {
            // 只更新库存警报，不重新加载整个仪表盘
            this.loadInventoryAlerts(this.getCachedProducts());
        }
    },
    
    handleCustomerUpdate: function(customer) {
        console.log('Customer update received:', customer);
        
        // 更新缓存中的客户数据
        if (this.state.dataCache.customers) {
            const customerIndex = this.state.dataCache.customers.findIndex(c => c.id === customer.id);
            if (customerIndex !== -1) {
                this.state.dataCache.customers[customerIndex] = customer;
            } else {
                this.state.dataCache.customers.push(customer);
            }
        }
        
        // 只在客户页面更新数据
        if (this.state.currentSection === 'customers') {
            this.loadCustomersData();
        }
    },
    
    handleSalesUpdate: function(salesData) {
        console.log('Sales update received:', salesData);
        
        // 更新缓存中的销售数据
        this.state.dataCache.sales = salesData;
        
        // 只在仪表盘页面更新数据
        if (this.state.currentSection === 'dashboard') {
            this.loadDashboardData();
        }
    },
    
    showNotification: function(title, message, type = 'info') {
        const notificationsPanel = document.querySelector('.notifications-panel');
        if (!notificationsPanel) return;
        
        const notification = document.createElement('div');
        notification.className = `p-3 mb-2 rounded-lg ${type === 'info' ? 'bg-blue-500/20 border border-blue-500/30' : 
                                                                 type === 'warning' ? 'bg-yellow-500/20 border border-yellow-500/30' : 
                                                                 type === 'error' ? 'bg-red-500/20 border border-red-500/30' : 
                                                                 'bg-green-500/20 border border-green-500/30'}`;
        notification.innerHTML = `
            <div class="flex items-start gap-3">
                <div class="w-8 h-8 rounded-full bg-${type === 'info' ? 'blue' : type === 'warning' ? 'yellow' : type === 'error' ? 'red' : 'green'}-500/20 flex items-center justify-center flex-shrink-0">
                    <span class="material-icons text-${type === 'info' ? 'blue' : type === 'warning' ? 'yellow' : type === 'error' ? 'red' : 'green'}-400 text-sm">
                        ${type === 'info' ? 'info' : type === 'warning' ? 'warning' : type === 'error' ? 'error' : 'check_circle'}
                    </span>
                </div>
                <div class="flex-1">
                    <h4 class="font-medium text-sm">${title}</h4>
                    <p class="text-xs text-gray-300 mt-1">${message}</p>
                </div>
                <button class="text-gray-400 hover:text-white" onclick="this.parentElement.parentElement.remove()">
                    <span class="material-icons text-xs">close</span>
                </button>
            </div>
        `;
        
        notificationsPanel.insertBefore(notification, notificationsPanel.firstChild);
        
        // 3秒后自动移除通知
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(-10px)';
            notification.style.transition = 'all 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    },
    
    getCachedProducts: function() {
        // 从本地存储获取缓存的产品数据
        const cached = localStorage.getItem('admin_products');
        return cached ? JSON.parse(cached) : [];
    },
    
    cacheProducts: function(products) {
        // 缓存产品数据到本地存储
        localStorage.setItem('admin_products', JSON.stringify(products));
    },
    loadSectionData: async function(section) {
        // 检查是否有缓存数据，且缓存未过期
        const now = Date.now();
        const lastUpdate = this.state.dataCache.lastUpdate[section] || 0;
        const cacheValidity = 10000; // 缓存有效期10秒
        
        if (now - lastUpdate < cacheValidity && this.state.dataCache[section]) {
            console.log(`Using cached data for ${section}`);
            return;
        }
        
        switch (section) {
            case 'dashboard':
                await this.loadDashboardData();
                break;
            case 'products':
                await this.loadProductsData();
                break;
            case 'customers':
                await this.loadCustomersData();
                break;
            case 'orders':
                await this.loadOrdersData();
                break;
            case 'content':
                await this.loadContentData();
                break;
        }
    },
    loadDashboardData: async function() {
        console.log('Loading dashboard data...');
        try {
            // 并行请求数据，提高性能
            const [productsResponse, ordersResponse, customersResponse, analyticsResponse] = await Promise.all([
                fetch('/api/products'),
                fetch('/api/orders/stats', { headers: this.getAuthHeader() }),
                fetch('/api/customers/stats', { headers: this.getAuthHeader() }),
                fetch('/api/analytics', { headers: this.getAuthHeader() })
            ]);
            
            // 处理响应
            const products = await productsResponse.json();
            const ordersStats = await ordersResponse.json();
            const customersStats = await customersResponse.json();
            const analytics = await analyticsResponse.json() || {};
            
            // 更新缓存
            this.state.dataCache.dashboard = {
                products,
                ordersStats,
                customersStats,
                analytics
            };
            this.state.dataCache.lastUpdate.dashboard = Date.now();
            
            // 计算指标
            const totalRevenue = ordersStats.totalRevenue || 0;
            const totalOrders = ordersStats.totalOrders || 0;
            const totalInquiries = analytics.totalInquiries || 0;
            const totalCustomers = customersStats.totalCustomers || 0;
            const totalProductsCount = products.length;
            const conversionRate = analytics.conversionRate || 0;
            const averageOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0;
            const websiteVisits = analytics.websiteVisits || 0;
            
            // 更新统计元素
            this.updateStatElement('totalRevenue', '¥' + totalRevenue.toLocaleString());
            this.updateStatElement('totalOrders', totalOrders);
            this.updateStatElement('totalInquiries', totalInquiries);
            this.updateStatElement('totalCustomers', totalCustomers);
            this.updateStatElement('totalProducts', totalProductsCount);
            this.updateStatElement('conversionRate', conversionRate + '%');
            this.updateStatElement('averageOrderValue', '¥' + averageOrderValue);
            this.updateStatElement('websiteVisits', websiteVisits);
            
            // 更新关键指标
            if (typeof updateKeyMetrics === 'function') {
                updateKeyMetrics({
                    conversionRate: conversionRate,
                    averageOrderValue: averageOrderValue,
                    retentionRate: analytics.retentionRate || 0,
                    inventoryTurnover: analytics.inventoryTurnover || 0
                });
            }
            
            // 更新变化指标
            this.updateChangeIndicators(ordersStats, analytics);
            
            // 加载库存警报
            this.loadInventoryAlerts(products);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            // 加载模拟数据用于演示
            this.loadMockDashboardData();
        }
    },
    loadInventoryAlerts: function(products) {
        const lowStockProducts = products.filter(p => (p.stock || 0) > 0 && (p.stock || 0) <= 10);
        const outOfStockProducts = products.filter(p => (p.stock || 0) === 0);
        
        const alertsContainer = document.getElementById('inventoryAlerts');
        if (alertsContainer) {
            if (lowStockProducts.length === 0 && outOfStockProducts.length === 0) {
                alertsContainer.innerHTML = '<p class="text-green-400">所有产品库存充足</p>';
            } else {
                alertsContainer.innerHTML = '';
                
                // Add out of stock alerts
                outOfStockProducts.forEach(product => {
                    alertsContainer.innerHTML += `
                        <div class="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                                    <span class="material-icons text-red-400">inventory_off</span>
                                </div>
                                <div>
                                    <p class="font-medium">${product.name}</p>
                                    <p class="text-xs text-red-400">缺货</p>
                                </div>
                            </div>
                            <a href="./products.html" class="text-primary text-sm hover:underline">查看</a>
                        </div>
                    `;
                });
                
                // Add low stock alerts
                lowStockProducts.forEach(product => {
                    alertsContainer.innerHTML += `
                        <div class="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                                    <span class="material-icons text-yellow-400">inventory</span>
                                </div>
                                <div>
                                    <p class="font-medium">${product.name}</p>
                                    <p class="text-xs text-yellow-400">库存不足: ${product.stock} 件</p>
                                </div>
                            </div>
                            <a href="./products.html" class="text-primary text-sm hover:underline">查看</a>
                        </div>
                    `;
                });
            }
        }
    },
    updateChangeIndicators: function(ordersStats, analytics) {
        // Update revenue change
        const revenueChange = ordersStats.revenueChange || 0;
        const revenueChangeElement = document.getElementById('revenueChange');
        if (revenueChangeElement) {
            revenueChangeElement.textContent = (revenueChange > 0 ? '+' : '') + revenueChange + '%';
            revenueChangeElement.parentElement.className = revenueChange > 0 ? 'text-xs text-green-400 mt-1 flex items-center gap-1' : 
                                                      revenueChange < 0 ? 'text-xs text-red-400 mt-1 flex items-center gap-1' : 
                                                      'text-xs text-yellow-400 mt-1 flex items-center gap-1';
            revenueChangeElement.previousElementSibling.textContent = revenueChange > 0 ? 'arrow_upward' : 
                                                                     revenueChange < 0 ? 'arrow_downward' : 'remove';
        }
        
        // Update orders change
        const ordersChange = ordersStats.ordersChange || 0;
        const ordersChangeElement = document.getElementById('ordersChange');
        if (ordersChangeElement) {
            ordersChangeElement.textContent = (ordersChange > 0 ? '+' : '') + ordersChange + '%';
            ordersChangeElement.parentElement.className = ordersChange > 0 ? 'text-xs text-green-400 mt-1 flex items-center gap-1' : 
                                                      ordersChange < 0 ? 'text-xs text-red-400 mt-1 flex items-center gap-1' : 
                                                      'text-xs text-yellow-400 mt-1 flex items-center gap-1';
            ordersChangeElement.previousElementSibling.textContent = ordersChange > 0 ? 'arrow_upward' : 
                                                                     ordersChange < 0 ? 'arrow_downward' : 'remove';
        }
        
        // Update inquiries change
        const inquiriesChange = analytics.inquiriesChange || 0;
        const inquiriesChangeElement = document.getElementById('inquiriesChange');
        if (inquiriesChangeElement) {
            inquiriesChangeElement.textContent = (inquiriesChange > 0 ? '+' : '') + inquiriesChange + '%';
            inquiriesChangeElement.parentElement.className = inquiriesChange > 0 ? 'text-xs text-green-400 mt-1 flex items-center gap-1' : 
                                                      inquiriesChange < 0 ? 'text-xs text-red-400 mt-1 flex items-center gap-1' : 
                                                      'text-xs text-yellow-400 mt-1 flex items-center gap-1';
            inquiriesChangeElement.previousElementSibling.textContent = inquiriesChange > 0 ? 'arrow_upward' : 
                                                                     inquiriesChange < 0 ? 'arrow_downward' : 'remove';
        }
        
        // Update customers change
        const customersChange = analytics.customersChange || 0;
        const customersChangeElement = document.getElementById('customersChange');
        if (customersChangeElement) {
            customersChangeElement.textContent = (customersChange > 0 ? '+' : '') + customersChange + '%';
            customersChangeElement.parentElement.className = customersChange > 0 ? 'text-xs text-green-400 mt-1 flex items-center gap-1' : 
                                                      customersChange < 0 ? 'text-xs text-red-400 mt-1 flex items-center gap-1' : 
                                                      'text-xs text-yellow-400 mt-1 flex items-center gap-1';
            customersChangeElement.previousElementSibling.textContent = customersChange > 0 ? 'arrow_upward' : 
                                                                     customersChange < 0 ? 'arrow_downward' : 'remove';
        }
    },
    loadMockDashboardData: function() {
        // Mock data for demo purposes
        const mockData = {
            totalRevenue: 125000,
            totalOrders: 156,
            totalInquiries: 89,
            totalCustomers: 452,
            totalProducts: 128,
            conversionRate: 3.2,
            averageOrderValue: 801.28,
            websiteVisits: 3240,
            revenueChange: 12.5,
            ordersChange: 8.3,
            inquiriesChange: 5.1,
            customersChange: 3.8,
            retentionRate: 75.5,
            inventoryTurnover: 4.2
        };
        
        // Update stat elements with mock data
        this.updateStatElement('totalRevenue', '¥' + mockData.totalRevenue.toLocaleString());
        this.updateStatElement('totalOrders', mockData.totalOrders);
        this.updateStatElement('totalInquiries', mockData.totalInquiries);
        this.updateStatElement('totalCustomers', mockData.totalCustomers);
        this.updateStatElement('totalProducts', mockData.totalProducts);
        this.updateStatElement('conversionRate', mockData.conversionRate + '%');
        this.updateStatElement('averageOrderValue', '¥' + mockData.averageOrderValue);
        this.updateStatElement('websiteVisits', mockData.websiteVisits);
        
        // Update key metrics
        if (typeof updateKeyMetrics === 'function') {
            updateKeyMetrics({
                conversionRate: mockData.conversionRate,
                averageOrderValue: mockData.averageOrderValue,
                retentionRate: mockData.retentionRate,
                inventoryTurnover: mockData.inventoryTurnover
            });
        }
        
        // Update change indicators
        const revenueChangeElement = document.getElementById('revenueChange');
        if (revenueChangeElement) {
            revenueChangeElement.textContent = '+' + mockData.revenueChange + '%';
            revenueChangeElement.parentElement.className = 'text-xs text-green-400 mt-1 flex items-center gap-1';
            revenueChangeElement.previousElementSibling.textContent = 'arrow_upward';
        }
        
        const ordersChangeElement = document.getElementById('ordersChange');
        if (ordersChangeElement) {
            ordersChangeElement.textContent = '+' + mockData.ordersChange + '%';
            ordersChangeElement.parentElement.className = 'text-xs text-green-400 mt-1 flex items-center gap-1';
            ordersChangeElement.previousElementSibling.textContent = 'arrow_upward';
        }
        
        const inquiriesChangeElement = document.getElementById('inquiriesChange');
        if (inquiriesChangeElement) {
            inquiriesChangeElement.textContent = '+' + mockData.inquiriesChange + '%';
            inquiriesChangeElement.parentElement.className = 'text-xs text-green-400 mt-1 flex items-center gap-1';
            inquiriesChangeElement.previousElementSibling.textContent = 'arrow_upward';
        }
        
        const customersChangeElement = document.getElementById('customersChange');
        if (customersChangeElement) {
            customersChangeElement.textContent = '+' + mockData.customersChange + '%';
            customersChangeElement.parentElement.className = 'text-xs text-green-400 mt-1 flex items-center gap-1';
            customersChangeElement.previousElementSibling.textContent = 'arrow_upward';
        }
        
        // Load mock inventory alerts
        const mockProducts = [
            { id: '1', name: 'Stainless Steel Grinding Media', stock: 0, category: 'Grinding Media' },
            { id: '2', name: 'Zirconia Grinding Jars', stock: 5, category: 'Grinding Jars' },
            { id: '3', name: 'Agate Mortar and Pestle', stock: 2, category: 'Accessories' }
        ];
        this.loadInventoryAlerts(mockProducts);
    },
    updateStatElement: function(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.transition = 'all 0.5s ease';
            element.style.transform = 'scale(1.1)';
            setTimeout(() => {
                element.textContent = value;
                element.style.transform = 'scale(1)';
            }, 100);
        }
    },
    loadProductsData: async function() {
        console.log('Loading products data...');
        const productsTable = document.getElementById('products-table-body');
        if (!productsTable) return;
        
        try {
            const response = await fetch('/api/products');
            const products = await response.json();
            
            // 更新缓存
            this.state.dataCache.products = products;
            this.state.dataCache.lastUpdate.products = Date.now();
            
            // 缓存产品数据到本地存储
            this.cacheProducts(products);
            
            // 优化渲染性能，使用文档片段
            const fragment = document.createDocumentFragment();
            products.forEach(product => {
                const row = document.createElement('tr');
                row.className = 'border-b border-white/5 hover:bg-white/5 transition-all duration-200';
                row.innerHTML = `
                    <td class="px-4 py-3 text-sm font-mono">${product.id}</td>
                    <td class="px-4 py-3 text-sm">${product.name}</td>
                    <td class="px-4 py-3 text-sm">${product.category}</td>
                    <td class="px-4 py-3 text-sm">${product.material || '-'}</td>
                    <td class="px-4 py-3 text-sm">${product.stock || 0}</td>
                    <td class="px-4 py-3 text-sm">${product.price || 0}</td>
                    <td class="px-4 py-3">
                        <div class="flex gap-2">
                            <button class="btn-edit text-primary hover:text-primary/80 transition-all" data-id="${product.id}">
                                <span class="material-icons text-sm">edit</span>
                            </button>
                            <button class="btn-delete text-red-400 hover:text-red-300 transition-all" data-id="${product.id}">
                                <span class="material-icons text-sm">delete</span>
                            </button>
                        </div>
                    </td>
                `;
                fragment.appendChild(row);
            });
            
            // 一次性更新DOM
            productsTable.innerHTML = '';
            productsTable.appendChild(fragment);
            
            this.initProductActions();
        } catch (error) {
            console.error('Error loading products:', error);
        }
    },
    initProductActions: function() {
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => {
                const productId = btn.dataset.id;
                this.editProduct(productId);
            });
        });
        
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', () => {
                const productId = btn.dataset.id;
                this.deleteProduct(productId);
            });
        });
    },
    editProduct: async function(productId) {
        try {
            const response = await fetch(`/api/products/${productId}`);
            const product = await response.json();
            console.log('Editing product:', product);
        } catch (error) {
            console.error('Error editing product:', error);
        }
    },
    deleteProduct: async function(productId) {
        if (confirm('Are you sure you want to delete this product?')) {
            try {
                const response = await fetch(`/api/products/${productId}`, {
                    method: 'DELETE',
                    headers: this.getAuthHeader()
                });
                if (response.ok) {
                    this.loadProductsData();
                }
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    },
    loadCustomersData: async function() {
        console.log('Loading customers data...');
        const customersTable = document.getElementById('customers-table-body');
        if (!customersTable) return;
        
        try {
            const response = await fetch('/api/customers', { headers: this.getAuthHeader() });
            const data = await response.json();
            const customers = data.customers || [];
            
            // 更新缓存
            this.state.dataCache.customers = customers;
            this.state.dataCache.lastUpdate.customers = Date.now();
            
            // 优化渲染性能，使用文档片段
            const fragment = document.createDocumentFragment();
            customers.forEach(customer => {
                const row = document.createElement('tr');
                row.className = 'border-b border-white/5 hover:bg-white/5 transition-all duration-200';
                row.innerHTML = `
                    <td class="px-4 py-3 text-sm font-mono">${customer.id}</td>
                    <td class="px-4 py-3 text-sm">${customer.company}</td>
                    <td class="px-4 py-3 text-sm">${customer.contactPerson || '-'}</td>
                    <td class="px-4 py-3 text-sm">${customer.email}</td>
                    <td class="px-4 py-3 text-sm">${customer.country || '-'}</td>
                    <td class="px-4 py-3 text-sm">${customer.status || 'Active'}</td>
                    <td class="px-4 py-3">
                        <div class="flex gap-2">
                            <button class="btn-edit text-primary hover:text-primary/80 transition-all" data-id="${customer.id}">
                                <span class="material-icons text-sm">edit</span>
                            </button>
                            <button class="btn-delete text-red-400 hover:text-red-300 transition-all" data-id="${customer.id}">
                                <span class="material-icons text-sm">delete</span>
                            </button>
                        </div>
                    </td>
                `;
                fragment.appendChild(row);
            });
            
            // 一次性更新DOM
            customersTable.innerHTML = '';
            customersTable.appendChild(fragment);
            
            this.initCustomerActions();
        } catch (error) {
            console.error('Error loading customers:', error);
        }
    },
    initCustomerActions: function() {
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => {
                const customerId = btn.dataset.id;
                this.editCustomer(customerId);
            });
        });
        
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', () => {
                const customerId = btn.dataset.id;
                this.deleteCustomer(customerId);
            });
        });
    },
    editCustomer: async function(customerId) {
        try {
            const response = await fetch(`/api/customers/${customerId}`, { headers: this.getAuthHeader() });
            const customer = await response.json();
            console.log('Editing customer:', customer);
        } catch (error) {
            console.error('Error editing customer:', error);
        }
    },
    deleteCustomer: async function(customerId) {
        if (confirm('Are you sure you want to delete this customer?')) {
            try {
                const response = await fetch(`/api/customers/${customerId}`, {
                    method: 'DELETE',
                    headers: this.getAuthHeader()
                });
                if (response.ok) {
                    this.loadCustomersData();
                }
            } catch (error) {
                console.error('Error deleting customer:', error);
            }
        }
    },
    loadOrdersData: async function() {
        console.log('Loading orders data...');
        const ordersTable = document.getElementById('orders-table-body');
        if (!ordersTable) return;
        
        try {
            const response = await fetch('/api/orders', { headers: this.getAuthHeader() });
            const data = await response.json();
            const orders = data.orders || [];
            
            // 更新缓存
            this.state.dataCache.orders = orders;
            this.state.dataCache.lastUpdate.orders = Date.now();
            
            // 优化渲染性能，使用文档片段
            const fragment = document.createDocumentFragment();
            orders.forEach(order => {
                const row = document.createElement('tr');
                row.className = 'border-b border-white/5 hover:bg-white/5 transition-all duration-200';
                row.innerHTML = `
                    <td class="px-4 py-3 text-sm font-mono">${order.id}</td>
                    <td class="px-4 py-3 text-sm">${order.customerName}</td>
                    <td class="px-4 py-3 text-sm">${order.orderDate}</td>
                    <td class="px-4 py-3 text-sm">${order.total}</td>
                    <td class="px-4 py-3 text-sm">${order.status}</td>
                    <td class="px-4 py-3 text-sm">${order.paymentStatus || 'Pending'}</td>
                    <td class="px-4 py-3">
                        <div class="flex gap-2">
                            <button class="btn-edit text-primary hover:text-primary/80 transition-all" data-id="${order.id}">
                                <span class="material-icons text-sm">edit</span>
                            </button>
                            <button class="btn-delete text-red-400 hover:text-red-300 transition-all" data-id="${order.id}">
                                <span class="material-icons text-sm">delete</span>
                            </button>
                        </div>
                    </td>
                `;
                fragment.appendChild(row);
            });
            
            // 一次性更新DOM
            ordersTable.innerHTML = '';
            ordersTable.appendChild(fragment);
            
            this.initOrderActions();
        } catch (error) {
            console.error('Error loading orders:', error);
        }
    },
    initOrderActions: function() {
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => {
                const orderId = btn.dataset.id;
                this.editOrder(orderId);
            });
        });
        
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', () => {
                const orderId = btn.dataset.id;
                this.deleteOrder(orderId);
            });
        });
    },
    editOrder: async function(orderId) {
        try {
            const response = await fetch(`/api/orders/${orderId}`, { headers: this.getAuthHeader() });
            const order = await response.json();
            console.log('Editing order:', order);
        } catch (error) {
            console.error('Error editing order:', error);
        }
    },
    deleteOrder: async function(orderId) {
        if (confirm('Are you sure you want to delete this order?')) {
            try {
                const response = await fetch(`/api/orders/${orderId}`, {
                    method: 'DELETE',
                    headers: this.getAuthHeader()
                });
                if (response.ok) {
                    this.loadOrdersData();
                }
            } catch (error) {
                console.error('Error deleting order:', error);
            }
        }
    },
    loadContentData: async function() {
        console.log('Loading content data...');
        const contentTable = document.getElementById('content-table-body');
        if (!contentTable) return;
        
        try {
            const response = await fetch('/api/content');
            const content = await response.json();
            
            contentTable.innerHTML = content.map(item => `
                <tr class="border-b border-white/5 hover:bg-white/5 transition-all duration-200">
                    <td class="px-4 py-3 text-sm font-mono">${item.id}</td>
                    <td class="px-4 py-3 text-sm">${item.title}</td>
                    <td class="px-4 py-3 text-sm">${item.type}</td>
                    <td class="px-4 py-3 text-sm">${item.status}</td>
                    <td class="px-4 py-3 text-sm">${item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-'}</td>
                    <td class="px-4 py-3">
                        <div class="flex gap-2">
                            <button class="btn-edit text-primary hover:text-primary/80 transition-all" data-id="${item.id}">
                                <span class="material-icons text-sm">edit</span>
                            </button>
                            <button class="btn-delete text-red-400 hover:text-red-300 transition-all" data-id="${item.id}">
                                <span class="material-icons text-sm">delete</span>
                            </button>
                        </div>
                    </td>
                </tr>
            `).join('');
            
            this.initContentActions();
        } catch (error) {
            console.error('Error loading content:', error);
        }
    },
    initContentActions: function() {
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => {
                const contentId = btn.dataset.id;
                this.editContent(contentId);
            });
        });
        
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', () => {
                const contentId = btn.dataset.id;
                this.deleteContent(contentId);
            });
        });
    },
    editContent: async function(contentId) {
        try {
            const response = await fetch(`/api/content/${contentId}`);
            const content = await response.json();
            console.log('Editing content:', content);
        } catch (error) {
            console.error('Error editing content:', error);
        }
    },
    deleteContent: async function(contentId) {
        if (confirm('Are you sure you want to delete this content?')) {
            try {
                const response = await fetch(`/api/content/${contentId}`, {
                    method: 'DELETE',
                    headers: this.getAuthHeader()
                });
                if (response.ok) {
                    this.loadContentData();
                }
            } catch (error) {
                console.error('Error deleting content:', error);
            }
        }
    }
};

document.addEventListener('DOMContentLoaded', function() {
    AdminPanel.init();
});