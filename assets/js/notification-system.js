const NotificationSystem = {
    config: {
        storageKey: 'admin_notifications',
        maxNotifications: 50,
        checkInterval: 60000 // 1分钟检查一次新通知
    },
    
    state: {
        notifications: [],
        unreadCount: 0
    },
    
    init: function() {
        this.loadNotifications();
        this.bindEvents();
        this.startCheckInterval();
        this.updateNotificationBadge();
    },
    
    bindEvents: function() {
        // 绑定通知面板相关事件
        document.addEventListener('click', (e) => {
            if (e.target.closest('.notification-btn')) {
                this.toggleNotificationsPanel();
            } else if (!e.target.closest('.notifications-panel')) {
                this.hideNotificationsPanel();
            }
        });
        
        // 绑定通知操作事件
        document.addEventListener('click', (e) => {
            if (e.target.closest('.notification-action')) {
                const action = e.target.closest('.notification-action').dataset.action;
                const notificationId = e.target.closest('.notification-item').dataset.id;
                this.handleNotificationAction(action, notificationId);
            }
        });
    },
    
    loadNotifications: function() {
        try {
            const stored = localStorage.getItem(this.config.storageKey);
            if (stored) {
                this.state.notifications = JSON.parse(stored);
                this.updateUnreadCount();
            }
        } catch (error) {
            console.error('Error loading notifications:', error);
            this.state.notifications = [];
        }
    },
    
    saveNotifications: function() {
        try {
            // 限制通知数量
            if (this.state.notifications.length > this.config.maxNotifications) {
                this.state.notifications = this.state.notifications.slice(0, this.config.maxNotifications);
            }
            localStorage.setItem(this.config.storageKey, JSON.stringify(this.state.notifications));
            this.updateUnreadCount();
            this.updateNotificationBadge();
        } catch (error) {
            console.error('Error saving notifications:', error);
        }
    },
    
    updateUnreadCount: function() {
        this.state.unreadCount = this.state.notifications.filter(n => !n.read).length;
    },
    
    updateNotificationBadge: function() {
        const badge = document.querySelector('.notification-btn .bg-red-500');
        if (badge) {
            if (this.state.unreadCount > 0) {
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }
        }
    },
    
    toggleNotificationsPanel: function() {
        const panel = document.querySelector('.notifications-panel');
        if (panel) {
            panel.classList.toggle('hidden');
            if (!panel.classList.contains('hidden')) {
                this.renderNotifications();
                this.markAllAsRead();
            }
        }
    },
    
    hideNotificationsPanel: function() {
        const panel = document.querySelector('.notifications-panel');
        if (panel) {
            panel.classList.add('hidden');
        }
    },
    
    renderNotifications: function() {
        const panel = document.querySelector('.notifications-panel');
        if (!panel) return;
        
        const notificationsContainer = panel.querySelector('.space-y-4');
        if (!notificationsContainer) return;
        
        if (this.state.notifications.length === 0) {
            notificationsContainer.innerHTML = `
                <div class="text-center py-8 text-gray-400">
                    <span class="material-icons text-4xl mb-2">notifications_off</span>
                    <p class="text-sm">No notifications</p>
                </div>
            `;
            return;
        }
        
        notificationsContainer.innerHTML = this.state.notifications.map(notification => `
            <div class="notification-item ${!notification.read ? 'bg-dark-700/30 border-l-2 border-primary' : ''}" data-id="${notification.id}">
                <div class="flex items-start gap-3 p-3 rounded-lg hover:bg-dark-700 transition-colors">
                    <div class="w-8 h-8 rounded-full ${this.getNotificationIconClass(notification.type)} flex items-center justify-center flex-shrink-0">
                        <span class="material-icons text-sm">${this.getNotificationIcon(notification.type)}</span>
                    </div>
                    <div class="flex-1">
                        <p class="text-sm font-medium">${notification.title}</p>
                        <p class="text-xs text-gray-400">${notification.message}</p>
                        <p class="text-xs text-gray-500 mt-1">${this.formatNotificationTime(notification.timestamp)}</p>
                    </div>
                    <div class="flex flex-col gap-1">
                        ${notification.actions && notification.actions.length > 0 ? notification.actions.map(action => `
                            <button class="notification-action p-1 rounded hover:bg-dark-600 text-gray-400 hover:text-white" data-action="${action.action}">
                                <span class="material-icons text-xs">${action.icon}</span>
                            </button>
                        `).join('') : ''}
                    </div>
                </div>
            </div>
        `).join('');
    },
    
    getNotificationIconClass: function(type) {
        switch (type) {
            case 'order':
                return 'bg-primary/20 text-primary';
            case 'inventory':
                return 'bg-yellow-500/20 text-yellow-400';
            case 'inquiry':
                return 'bg-blue-500/20 text-blue-400';
            case 'customer':
                return 'bg-green-500/20 text-green-400';
            case 'system':
                return 'bg-purple-500/20 text-purple-400';
            default:
                return 'bg-gray-500/20 text-gray-400';
        }
    },
    
    getNotificationIcon: function(type) {
        switch (type) {
            case 'order':
                return 'shopping_cart';
            case 'inventory':
                return 'inventory';
            case 'inquiry':
                return 'mail';
            case 'customer':
                return 'person';
            case 'system':
                return 'info';
            default:
                return 'notifications';
        }
    },
    
    formatNotificationTime: function(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
        
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    },
    
    addNotification: function(notification) {
        const newNotification = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            timestamp: Date.now(),
            read: false,
            ...notification
        };
        
        this.state.notifications.unshift(newNotification);
        this.saveNotifications();
        this.showNotificationToast(newNotification);
        
        if (!document.querySelector('.notifications-panel')?.classList.contains('hidden')) {
            this.renderNotifications();
        }
    },
    
    showNotificationToast: function(notification) {
        const toast = document.createElement('div');
        toast.className = `fixed top-4 right-4 max-w-sm glass rounded-lg p-4 shadow-lg z-50 transform transition-all duration-300 translate-x-full`;
        toast.innerHTML = `
            <div class="flex items-start gap-3">
                <div class="w-8 h-8 rounded-full ${this.getNotificationIconClass(notification.type)} flex items-center justify-center flex-shrink-0">
                    <span class="material-icons text-sm">${this.getNotificationIcon(notification.type)}</span>
                </div>
                <div class="flex-1">
                    <p class="text-sm font-medium">${notification.title}</p>
                    <p class="text-xs text-gray-400">${notification.message}</p>
                </div>
                <button class="text-gray-400 hover:text-white" onclick="this.parentElement.parentElement.remove()">
                    <span class="material-icons text-xs">close</span>
                </button>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // 显示动画
        setTimeout(() => {
            toast.classList.remove('translate-x-full');
        }, 10);
        
        // 自动隐藏
        setTimeout(() => {
            toast.classList.add('translate-x-full');
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 5000);
    },
    
    markAsRead: function(notificationId) {
        const notification = this.state.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            this.saveNotifications();
        }
    },
    
    markAllAsRead: function() {
        this.state.notifications.forEach(notification => {
            notification.read = true;
        });
        this.saveNotifications();
    },
    
    deleteNotification: function(notificationId) {
        this.state.notifications = this.state.notifications.filter(n => n.id !== notificationId);
        this.saveNotifications();
        this.renderNotifications();
    },
    
    deleteAllNotifications: function() {
        this.state.notifications = [];
        this.saveNotifications();
        this.renderNotifications();
    },
    
    handleNotificationAction: function(action, notificationId) {
        switch (action) {
            case 'view':
                this.markAsRead(notificationId);
                // 导航到相关页面
                break;
            case 'dismiss':
                this.deleteNotification(notificationId);
                break;
            case 'mark_read':
                this.markAsRead(notificationId);
                this.renderNotifications();
                break;
        }
    },
    
    startCheckInterval: function() {
        setInterval(() => {
            this.checkForNewNotifications();
        }, this.config.checkInterval);
    },
    
    checkForNewNotifications: function() {
        // 这里可以从服务器获取新通知
        // 现在使用模拟数据
        this.simulateNewNotifications();
    },
    
    simulateNewNotifications: function() {
        // 模拟新通知
        const notificationTypes = [
            {
                type: 'order',
                title: '新订单',
                message: '收到新订单 #ORD-' + Math.floor(Math.random() * 10000),
                actions: [
                    { action: 'view', icon: 'visibility' },
                    { action: 'dismiss', icon: 'close' }
                ]
            },
            {
                type: 'inventory',
                title: '库存预警',
                message: '产品库存不足，需要补货',
                actions: [
                    { action: 'view', icon: 'inventory' },
                    { action: 'dismiss', icon: 'close' }
                ]
            },
            {
                type: 'inquiry',
                title: '新询盘',
                message: '收到新的产品询盘',
                actions: [
                    { action: 'view', icon: 'mail' },
                    { action: 'dismiss', icon: 'close' }
                ]
            }
        ];
        
        // 随机生成通知
        if (Math.random() > 0.7) {
            const randomNotification = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
            this.addNotification(randomNotification);
        }
    },
    
    getNotificationsByType: function(type) {
        return this.state.notifications.filter(n => n.type === type);
    },
    
    getUnreadNotifications: function() {
        return this.state.notifications.filter(n => !n.read);
    },
    
    getRecentNotifications: function(limit = 10) {
        return this.state.notifications.slice(0, limit);
    }
};

document.addEventListener('DOMContentLoaded', function() {
    NotificationSystem.init();
});
