// Notification System Module
class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.unreadCount = 0;
        this.init();
    }

    init() {
        this.loadNotifications();
        this.bindEvents();
        this.updateUnreadCount();
    }

    // Load notifications from local storage or API
    loadNotifications() {
        // In a real app, this would fetch from an API
        // For demo purposes, we'll use mock data
        this.notifications = [
            {
                id: 1,
                type: 'order',
                title: 'New order received',
                message: 'Order #12345 has been placed by John Doe',
                time: '5 minutes ago',
                read: false
            },
            {
                id: 2,
                type: 'inventory',
                title: 'Low inventory alert',
                message: 'Product "Grinding Balls" is running low on stock',
                time: '15 minutes ago',
                read: false
            },
            {
                id: 3,
                type: 'system',
                title: 'System update completed',
                message: 'The system has been updated to version 2.1.0',
                time: '1 hour ago',
                read: true
            },
            {
                id: 4,
                type: 'order',
                title: 'Order shipped',
                message: 'Order #12344 has been shipped',
                time: '2 hours ago',
                read: true
            },
            {
                id: 5,
                type: 'inventory',
                title: 'Low inventory alert',
                message: 'Product "Milling Media" is running low on stock',
                time: '3 hours ago',
                read: false
            },
            {
                id: 6,
                type: 'system',
                title: 'Backup completed',
                message: 'Daily backup has been completed successfully',
                time: '4 hours ago',
                read: true
            },
            {
                id: 7,
                type: 'order',
                title: 'Payment received',
                message: 'Payment for order #12343 has been received',
                time: '5 hours ago',
                read: true
            },
            {
                id: 8,
                type: 'inventory',
                title: 'New inventory received',
                message: 'Product "Grinding Balls" has been restocked',
                time: '6 hours ago',
                read: true
            }
        ];

        this.unreadCount = this.notifications.filter(n => !n.read).length;
    }

    // Get notification icon based on type
    getNotificationIcon(type) {
        switch(type) {
            case 'order':
                return { icon: 'shopping_cart', color: 'primary' };
            case 'inventory':
                return { icon: 'inventory_2', color: 'yellow' };
            case 'system':
                return { icon: 'system_update', color: 'blue' };
            default:
                return { icon: 'notifications', color: 'gray' };
        }
    }

    // Render notifications in the dropdown
    renderDropdownNotifications() {
        const notificationPanel = document.querySelector('.notifications-panel');
        if (!notificationPanel) return;

        const notificationList = notificationPanel.querySelector('.space-y-4');
        if (!notificationList) return;

        // Show only the latest 5 notifications
        const latestNotifications = this.notifications.slice(0, 5);

        notificationList.innerHTML = latestNotifications.map(notification => {
            const { icon, color } = this.getNotificationIcon(notification.type);
            return `
                <div class="flex items-start gap-3 p-3 rounded-lg hover:bg-dark-700 transition-colors ${!notification.read ? 'bg-dark-700/30 border-l-2 border-primary' : ''}">
                    <div class="w-8 h-8 rounded-full bg-${color}-500/20 flex items-center justify-center flex-shrink-0">
                        <span class="material-icons text-${color}-400 text-sm">${icon}</span>
                    </div>
                    <div class="flex-1">
                        <p class="text-sm font-medium ${!notification.read ? 'font-semibold' : ''}">${notification.title}</p>
                        <p class="text-xs text-gray-400">${notification.message}</p>
                        <p class="text-xs text-gray-500 mt-1">${notification.time}</p>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Render notifications in the notifications page
    renderPageNotifications(filter = 'all') {
        const notificationList = document.getElementById('notificationList');
        if (!notificationList) return;

        let filteredNotifications = this.notifications;

        // Apply filter
        if (filter === 'unread') {
            filteredNotifications = this.notifications.filter(n => !n.read);
        } else if (filter !== 'all') {
            filteredNotifications = this.notifications.filter(n => n.type === filter);
        }

        // Render notifications
        notificationList.innerHTML = filteredNotifications.map(notification => {
            const { icon, color } = this.getNotificationIcon(notification.type);
            return `
                <div class="flex items-start gap-3 p-3 rounded-lg hover:bg-dark-700 transition-colors ${!notification.read ? 'bg-dark-700/30 border-l-2 border-primary' : ''}">
                    <input type="checkbox" class="notification-checkbox mt-1 w-4 h-4 rounded border-dark-600 text-primary focus:ring-primary" data-id="${notification.id}">
                    <div class="w-8 h-8 rounded-full bg-${color}-500/20 flex items-center justify-center flex-shrink-0">
                        <span class="material-icons text-${color}-400 text-sm">${icon}</span>
                    </div>
                    <div class="flex-1">
                        <div class="flex items-center justify-between">
                            <p class="text-sm font-medium ${!notification.read ? 'font-semibold' : ''}">${notification.title}</p>
                            <button class="text-gray-400 hover:text-primary transition-colors p-1" onclick="notificationSystem.markAsRead(${notification.id})">
                                <span class="material-icons text-xs">mark_email_read</span>
                            </button>
                        </div>
                        <p class="text-xs text-gray-400">${notification.message}</p>
                        <p class="text-xs text-gray-500 mt-1">${notification.time}</p>
                    </div>
                    <button class="text-gray-400 hover:text-red-400 transition-colors p-1" onclick="notificationSystem.deleteNotification(${notification.id})">
                        <span class="material-icons text-xs">delete</span>
                    </button>
                </div>
            `;
        }).join('');

        this.updateUnreadCount();
    }

    // Update unread count badge
    updateUnreadCount() {
        this.unreadCount = this.notifications.filter(n => !n.read).length;
        
        // Update sidebar badge
        const sidebarBadge = document.querySelector('.sidebar-link[data-section="notifications"] span');
        if (sidebarBadge) {
            if (this.unreadCount > 0) {
                sidebarBadge.textContent = this.unreadCount;
                sidebarBadge.classList.remove('hidden');
            } else {
                sidebarBadge.classList.add('hidden');
            }
        }

        // Update header notification badge
        const headerBadge = document.querySelector('.notification-btn span');
        if (headerBadge) {
            if (this.unreadCount > 0) {
                headerBadge.classList.remove('hidden');
            } else {
                headerBadge.classList.add('hidden');
            }
        }
    }

    // Mark notification as read
    markAsRead(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification) {
            notification.read = true;
            this.renderDropdownNotifications();
            this.renderPageNotifications(document.getElementById('notificationFilter')?.value || 'all');
            this.updateUnreadCount();
        }
    }

    // Mark all notifications as read
    markAllAsRead() {
        this.notifications.forEach(notification => {
            notification.read = true;
        });
        this.renderDropdownNotifications();
        this.renderPageNotifications(document.getElementById('notificationFilter')?.value || 'all');
        this.updateUnreadCount();
    }

    // Delete notification
    deleteNotification(id) {
        const index = this.notifications.findIndex(n => n.id === id);
        if (index !== -1) {
            this.notifications.splice(index, 1);
            this.renderDropdownNotifications();
            this.renderPageNotifications(document.getElementById('notificationFilter')?.value || 'all');
            this.updateUnreadCount();
        }
    }

    // Delete selected notifications
    deleteSelected() {
        const checkboxes = document.querySelectorAll('.notification-checkbox:checked');
        const idsToDelete = Array.from(checkboxes).map(cb => parseInt(cb.dataset.id));
        
        for (let i = this.notifications.length - 1; i >= 0; i--) {
            if (idsToDelete.includes(this.notifications[i].id)) {
                this.notifications.splice(i, 1);
            }
        }
        
        this.renderDropdownNotifications();
        this.renderPageNotifications(document.getElementById('notificationFilter')?.value || 'all');
        this.updateUnreadCount();
    }

    // Add new notification
    addNotification(notification) {
        const newNotification = {
            id: Date.now(),
            read: false,
            time: 'just now',
            ...notification
        };
        
        this.notifications.unshift(newNotification);
        this.renderDropdownNotifications();
        this.renderPageNotifications(document.getElementById('notificationFilter')?.value || 'all');
        this.updateUnreadCount();
        
        // Show notification animation
        this.showNotificationAnimation();
    }

    // Show notification animation
    showNotificationAnimation() {
        const notificationBtn = document.querySelector('.notification-btn');
        if (notificationBtn) {
            notificationBtn.classList.add('animate-pulse');
            setTimeout(() => {
                notificationBtn.classList.remove('animate-pulse');
            }, 2000);
        }
    }

    // Bind events
    bindEvents() {
        // Notification button click
        const notificationBtn = document.querySelector('.notification-btn');
        const notificationPanel = document.querySelector('.notifications-panel');
        
        if (notificationBtn && notificationPanel) {
            notificationBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                notificationPanel.classList.toggle('hidden');
            });

            // Close panel when clicking outside
            document.addEventListener('click', (e) => {
                if (!notificationBtn.contains(e.target) && !notificationPanel.contains(e.target)) {
                    notificationPanel.classList.add('hidden');
                }
            });
        }

        // Mark all read button
        const markAllReadBtn = document.getElementById('markAllRead');
        if (markAllReadBtn) {
            markAllReadBtn.addEventListener('click', () => {
                this.markAllAsRead();
            });
        }

        // Delete selected button
        const deleteSelectedBtn = document.getElementById('deleteSelected');
        if (deleteSelectedBtn) {
            deleteSelectedBtn.addEventListener('click', () => {
                this.deleteSelected();
            });
        }

        // Notification filter
        const notificationFilter = document.getElementById('notificationFilter');
        if (notificationFilter) {
            notificationFilter.addEventListener('change', (e) => {
                this.renderPageNotifications(e.target.value);
            });
        }
    }
}

// Initialize notification system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.notificationSystem = new NotificationSystem();
});