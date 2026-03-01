const AdminPanel = {
    config: {
        sessionKey: 'admin_session',
        loginPage: 'admin/login.html',
        dashboardPage: 'admin/dashboard.html'
    },

    state: {
        isLoggedIn: false,
        currentUser: null,
        currentSection: 'dashboard'
    },

    init: function() {
        this.checkAuth();
        this.initSidebar();
        this.initLogout();
        
        if (this.state.isLoggedIn) {
            this.loadDashboardData();
        }
    },

    checkAuth: function() {
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

        const currentPage = window.location.pathname.split('/').pop();
        const isAdminPage = currentPage.startsWith('admin/') && currentPage !== 'login.html';
        
        if (isAdminPage && !this.state.isLoggedIn) {
            window.location.href = this.config.loginPage;
        }
    },

    login: async function(username, password) {
        if (username === 'admin' && password === 'admin123') {
            const sessionData = {
                user: {
                    id: 1,
                    username: username,
                    role: 'admin',
                    name: 'Administrator'
                },
                expiry: Date.now() + (24 * 60 * 60 * 1000)
            };
            
            localStorage.setItem(this.config.sessionKey, JSON.stringify(sessionData));
            this.state.isLoggedIn = true;
            this.state.currentUser = sessionData.user;
            
            return { success: true, message: 'Login successful' };
        }
        
        return { success: false, message: 'Invalid credentials' };
    },

    logout: function() {
        localStorage.removeItem(this.config.sessionKey);
        this.state.isLoggedIn = false;
        this.state.currentUser = null;
        window.location.href = this.config.loginPage;
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
        }

        this.loadSectionData(section);
    },

    loadSectionData: async function(section) {
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
            case 'inquiries':
                await this.loadInquiriesData();
                break;
            case 'marketing':
                await this.loadMarketingData();
                break;
            case 'ai-services':
                await this.loadAIServicesData();
                break;
        }
    },

    loadDashboardData: async function() {
        console.log('Loading dashboard data...');
        
        const stats = {
            totalProducts: 20,
            totalCustomers: 10,
            totalOrders: 5,
            pendingInquiries: 3,
            revenue: '$54,870',
            conversionRate: '12.5%'
        };

        Object.keys(stats).forEach(key => {
            const element = document.getElementById(`stat-${key}`);
            if (element) {
                element.textContent = stats[key];
            }
        });
    },

    loadProductsData: async function() {
        console.log('Loading products data...');
        
        const productsTable = document.getElementById('products-table-body');
        if (!productsTable) return;

        try {
            const response = await fetch('../data/products.json');
            const data = await response.json();
            const products = data.products || [];

            productsTable.innerHTML = products.map(product => `
                <tr class="border-b border-white/5 hover:bg-white/5">
                    <td class="px-4 py-3 text-sm font-mono">${product.id}</td>
                    <td class="px-4 py-3 text-sm">${product.name}</td>
                    <td class="px-4 py-3 text-sm">${product.category}</td>
                    <td class="px-4 py-3 text-sm">${product.material}</td>
                    <td class="px-4 py-3 text-sm">${product.stock}</td>
                    <td class="px-4 py-3 text-sm">${product.price}</td>
                    <td class="px-4 py-3">
                        <div class="flex gap-2">
                            <button class="btn-edit text-primary hover:text-primary/80" data-id="${product.id}">
                                <span class="material-icons text-sm">edit</span>
                            </button>
                            <button class="btn-delete text-red-400 hover:text-red-300" data-id="${product.id}">
                                <span class="material-icons text-sm">delete</span>
                            </button>
                        </div>
                    </td>
                </tr>
            `).join('');

            this.initProductActions();
        } catch (error) {
            console.error('Error loading products:', error);
        }
    },

    initProductActions: function() {
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.currentTarget.dataset.id;
                this.editProduct(productId);
            });
        });

        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.currentTarget.dataset.id;
                this.deleteProduct(productId);
            });
        });
    },

    editProduct: function(productId) {
        console.log('Editing product:', productId);
        GrindingEquipmentB2B.showToast(`Edit product: ${productId}`, 'info');
    },

    deleteProduct: async function(productId) {
        if (confirm(`Are you sure you want to delete product ${productId}?`)) {
            console.log('Deleting product:', productId);
            GrindingEquipmentB2B.showToast(`Product ${productId} deleted`, 'success');
        }
    },

    loadCustomersData: async function() {
        console.log('Loading customers data...');
        
        const customersTable = document.getElementById('customers-table-body');
        if (!customersTable) return;

        try {
            const response = await fetch('../data/customers.json');
            const data = await response.json();
            const customers = data.customers || [];

            customersTable.innerHTML = customers.map(customer => `
                <tr class="border-b border-white/5 hover:bg-white/5">
                    <td class="px-4 py-3 text-sm font-mono">${customer.id}</td>
                    <td class="px-4 py-3 text-sm">${customer.company}</td>
                    <td class="px-4 py-3 text-sm">${customer.contactPerson}</td>
                    <td class="px-4 py-3 text-sm">${customer.country}</td>
                    <td class="px-4 py-3 text-sm">${customer.industry}</td>
                    <td class="px-4 py-3 text-sm">${customer.totalOrders}</td>
                    <td class="px-4 py-3 text-sm">${customer.totalSpent}</td>
                    <td class="px-4 py-3">
                        <span class="px-2 py-1 rounded text-xs ${customer.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}">
                            ${customer.status}
                        </span>
                    </td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Error loading customers:', error);
        }
    },

    loadOrdersData: async function() {
        console.log('Loading orders data...');
        
        const ordersTable = document.getElementById('orders-table-body');
        if (!ordersTable) return;

        try {
            const response = await fetch('../data/orders.json');
            const data = await response.json();
            const orders = data.orders || [];

            ordersTable.innerHTML = orders.map(order => `
                <tr class="border-b border-white/5 hover:bg-white/5">
                    <td class="px-4 py-3 text-sm font-mono">${order.id}</td>
                    <td class="px-4 py-3 text-sm">${order.customerName}</td>
                    <td class="px-4 py-3 text-sm">${GrindingEquipmentB2B.formatDate(order.orderDate)}</td>
                    <td class="px-4 py-3 text-sm">${order.total}</td>
                    <td class="px-4 py-3">
                        <span class="px-2 py-1 rounded text-xs ${this.getStatusClass(order.status)}">
                            ${order.status}
                        </span>
                    </td>
                    <td class="px-4 py-3">
                        <button class="btn-view text-primary hover:text-primary/80" data-id="${order.id}">
                            <span class="material-icons text-sm">visibility</span>
                        </button>
                    </td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Error loading orders:', error);
        }
    },

    loadInquiriesData: async function() {
        console.log('Loading inquiries data...');
        
        const inquiriesTable = document.getElementById('inquiries-table-body');
        if (!inquiriesTable) return;

        try {
            const response = await fetch('../data/inquiries.json');
            const data = await response.json();
            const inquiries = data.inquiries || [];

            inquiriesTable.innerHTML = inquiries.map(inquiry => `
                <tr class="border-b border-white/5 hover:bg-white/5">
                    <td class="px-4 py-3 text-sm font-mono">${inquiry.id}</td>
                    <td class="px-4 py-3 text-sm">${inquiry.company}</td>
                    <td class="px-4 py-3 text-sm">${inquiry.contactPerson}</td>
                    <td class="px-4 py-3 text-sm">${inquiry.country}</td>
                    <td class="px-4 py-3 text-sm">${inquiry.industry}</td>
                    <td class="px-4 py-3">
                        <span class="px-2 py-1 rounded text-xs ${this.getPriorityClass(inquiry.priority)}">
                            ${inquiry.priority}
                        </span>
                    </td>
                    <td class="px-4 py-3">
                        <span class="px-2 py-1 rounded text-xs ${this.getStatusClass(inquiry.status)}">
                            ${inquiry.status}
                        </span>
                    </td>
                    <td class="px-4 py-3">
                        <button class="btn-view text-primary hover:text-primary/80" data-id="${inquiry.id}">
                            <span class="material-icons text-sm">visibility</span>
                        </button>
                    </td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Error loading inquiries:', error);
        }
    },

    loadMarketingData: async function() {
        console.log('Loading marketing data...');
    },

    loadAIServicesData: async function() {
        console.log('Loading AI services data...');
        
        const aiStatusContainer = document.getElementById('ai-services-status');
        if (!aiStatusContainer) return;

        const agents = [
            { id: 'main_agent', name: '运营总监', status: 'active', tasks: 5 },
            { id: 'product_operations', name: '产品运营专员', status: 'active', tasks: 3 },
            { id: 'marketing_promotion', name: '营销推广专员', status: 'active', tasks: 8 },
            { id: 'customer_service', name: '客户服务专员', status: 'active', tasks: 12 },
            { id: 'data_analysis', name: '数据分析专员', status: 'idle', tasks: 2 },
            { id: 'technical_support', name: '技术支持专员', status: 'active', tasks: 1 }
        ];

        aiStatusContainer.innerHTML = agents.map(agent => `
            <div class="bg-secondary-dark rounded-lg p-4 border border-white/5">
                <div class="flex items-center justify-between mb-3">
                    <h4 class="font-bold text-white">${agent.name}</h4>
                    <span class="px-2 py-1 rounded text-xs ${agent.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}">
                        ${agent.status.toUpperCase()}
                    </span>
                </div>
                <div class="text-sm text-slate-400">
                    <p>Pending Tasks: ${agent.tasks}</p>
                    <p>Last Activity: Just now</p>
                </div>
                <div class="mt-3 flex gap-2">
                    <button class="px-3 py-1 bg-primary text-background-dark text-xs rounded hover:bg-primary/90" onclick="AdminPanel.executeAITask('${agent.id}')">
                        Execute Task
                    </button>
                    <button class="px-3 py-1 bg-white/10 text-white text-xs rounded hover:bg-white/20" onclick="AdminPanel.viewAgentLogs('${agent.id}')">
                        View Logs
                    </button>
                </div>
            </div>
        `).join('');
    },

    executeAITask: async function(agentId) {
        console.log('Executing AI task for agent:', agentId);
        GrindingEquipmentB2B.showToast(`Task sent to ${agentId}`, 'info');
        
        try {
            const result = await OpenClawAPI.sendCommand(agentId, 'execute_pending_task');
            console.log('Task result:', result);
            GrindingEquipmentB2B.showToast('Task completed successfully', 'success');
        } catch (error) {
            console.error('Task execution error:', error);
            GrindingEquipmentB2B.showToast('Task execution failed', 'error');
        }
    },

    viewAgentLogs: function(agentId) {
        console.log('Viewing logs for agent:', agentId);
        GrindingEquipmentB2B.showToast(`Viewing logs for ${agentId}`, 'info');
    },

    getStatusClass: function(status) {
        const classes = {
            'Active': 'bg-green-500/20 text-green-400',
            'New': 'bg-blue-500/20 text-blue-400',
            'In Progress': 'bg-yellow-500/20 text-yellow-400',
            'Responded': 'bg-purple-500/20 text-purple-400',
            'Pending': 'bg-yellow-500/20 text-yellow-400',
            'Processing': 'bg-blue-500/20 text-blue-400',
            'Shipped': 'bg-purple-500/20 text-purple-400',
            'Delivered': 'bg-green-500/20 text-green-400'
        };
        return classes[status] || 'bg-gray-500/20 text-gray-400';
    },

    getPriorityClass: function(priority) {
        const classes = {
            'High': 'bg-red-500/20 text-red-400',
            'Medium': 'bg-yellow-500/20 text-yellow-400',
            'Low': 'bg-green-500/20 text-green-400'
        };
        return classes[priority] || 'bg-gray-500/20 text-gray-400';
    },

    initLogout: function() {
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    AdminPanel.init();
});

window.AdminPanel = AdminPanel;
