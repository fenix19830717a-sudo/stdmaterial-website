const BulkActions = {
    config: {
        batchSize: 5,
        maxSelection: 100
    },
    
    init: function() {
        this.bindEvents();
    },
    
    bindEvents: function() {
        // 绑定通用批量操作事件
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('bulk-checkbox')) {
                this.updateSelectionCount();
            }
        });
    },
    
    updateSelectionCount: function() {
        const checkboxes = document.querySelectorAll('.bulk-checkbox:checked');
        const count = checkboxes.length;
        const selectedCountEl = document.getElementById('selectedCount');
        const bulkActionsEl = document.getElementById('bulkActions');
        
        if (selectedCountEl) {
            selectedCountEl.textContent = count;
        }
        
        if (bulkActionsEl) {
            if (count > 0) {
                bulkActionsEl.classList.remove('hidden');
            } else {
                bulkActionsEl.classList.add('hidden');
            }
        }
    },
    
    toggleSelectAll: function(selectAllId, checkboxClass) {
        const selectAll = document.getElementById(selectAllId);
        const checkboxes = document.querySelectorAll('.' + checkboxClass);
        
        if (selectAll) {
            checkboxes.forEach(checkbox => {
                checkbox.checked = selectAll.checked;
            });
            this.updateSelectionCount();
        }
    },
    
    cancelBulkActions: function(selectAllId, checkboxClass) {
        const selectAll = document.getElementById(selectAllId);
        const checkboxes = document.querySelectorAll('.' + checkboxClass);
        
        if (selectAll) {
            selectAll.checked = false;
        }
        
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        this.updateSelectionCount();
    },
    
    getSelectedIds: function(checkboxClass) {
        const checkboxes = document.querySelectorAll('.' + checkboxClass + ':checked');
        return Array.from(checkboxes).map(checkbox => checkbox.value);
    },
    
    executeBulkAction: async function(action, selectedIds, options = {}) {
        const { 
            type = 'products', 
            confirmMessage = null, 
            successMessage = '操作成功', 
            batchProcessing = true
        } = options;
        
        if (!action || selectedIds.length === 0) {
            alert('请选择操作和项目');
            return false;
        }
        
        if (selectedIds.length > this.config.maxSelection) {
            alert(`最多只能选择 ${this.config.maxSelection} 个项目`);
            return false;
        }
        
        if (confirmMessage) {
            if (!confirm(confirmMessage)) {
                return false;
            }
        }
        
        try {
            if (batchProcessing && selectedIds.length > this.config.batchSize) {
                return await this.processInBatches(action, selectedIds, type, successMessage);
            } else {
                return await this.processAll(action, selectedIds, type, successMessage);
            }
        } catch (error) {
            console.error('批量操作失败:', error);
            alert('操作失败，请重试');
            return false;
        }
    },
    
    processInBatches: async function(action, selectedIds, type, successMessage) {
        const batches = [];
        for (let i = 0; i < selectedIds.length; i += this.config.batchSize) {
            batches.push(selectedIds.slice(i, i + this.config.batchSize));
        }
        
        let successCount = 0;
        
        for (const batch of batches) {
            const batchSuccess = await this.processAll(action, batch, type, null);
            if (batchSuccess) {
                successCount += batch.length;
            }
        }
        
        if (successCount > 0) {
            alert(`${successMessage} (${successCount}/${selectedIds.length})`);
            return true;
        } else {
            alert('操作失败，请重试');
            return false;
        }
    },
    
    processAll: async function(action, selectedIds, type, successMessage) {
        switch (type) {
            case 'products':
                return await this.processProductAction(action, selectedIds, successMessage);
            case 'orders':
                return await this.processOrderAction(action, selectedIds, successMessage);
            case 'customers':
                return await this.processCustomerAction(action, selectedIds, successMessage);
            default:
                return false;
        }
    },
    
    processProductAction: async function(action, selectedIds, successMessage) {
        const token = this.getAuthToken();
        
        for (const id of selectedIds) {
            switch (action) {
                case 'delete':
                    await fetch(`/api/products/${id}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    break;
                case 'category':
                    const newCategory = prompt('请输入新分类:');
                    if (newCategory) {
                        await fetch(`/api/products/${id}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({ category: newCategory })
                        });
                    }
                    break;
                case 'stock':
                    const newStock = parseInt(prompt('请输入新库存数量:'));
                    if (!isNaN(newStock)) {
                        await fetch(`/api/products/${id}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({ stock: newStock })
                        });
                    }
                    break;
            }
        }
        
        return true;
    },
    
    processOrderAction: async function(action, selectedIds, successMessage) {
        const token = this.getAuthToken();
        
        for (const id of selectedIds) {
            switch (action) {
                case 'status':
                    const newStatus = prompt('请选择新状态:\n1. pending - 待处理\n2. confirmed - 已确认\n3. processing - 处理中\n4. shipped - 已发货\n5. delivered - 已送达\n6. cancelled - 已取消');
                    if (newStatus && ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].includes(newStatus)) {
                        await fetch(`/api/orders/${id}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({ status: newStatus })
                        });
                    }
                    break;
                case 'delete':
                    await fetch(`/api/orders/${id}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    break;
            }
        }
        
        return true;
    },
    
    processCustomerAction: async function(action, selectedIds, successMessage) {
        const token = this.getAuthToken();
        
        for (const id of selectedIds) {
            switch (action) {
                case 'delete':
                    await fetch(`/api/customers/${id}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    break;
                case 'status':
                    const newStatus = prompt('请选择新状态:\n1. active - 活跃\n2. inactive - 非活跃\n3. lead - 潜在客户');
                    if (newStatus && ['active', 'inactive', 'lead'].includes(newStatus)) {
                        await fetch(`/api/customers/${id}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({ status: newStatus })
                        });
                    }
                    break;
            }
        }
        
        return true;
    },
    
    getAuthToken: function() {
        const session = localStorage.getItem('admin_session');
        if (session) {
            try {
                const sessionData = JSON.parse(session);
                return sessionData.token;
            } catch (error) {
                return null;
            }
        }
        return null;
    },
    
    exportSelected: function(items, filename = 'export.csv') {
        const csvContent = this.generateCSV(items);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },
    
    generateCSV: function(items) {
        if (!items || items.length === 0) return '';
        
        const headers = Object.keys(items[0]);
        const rows = items.map(item => {
            return headers.map(header => {
                const value = item[header];
                if (typeof value === 'object' && value !== null) {
                    return JSON.stringify(value).replace(/"/g, '""');
                }
                return `"${String(value).replace(/"/g, '""')}"`;
            });
        });
        
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');
        
        return csvContent;
    }
};

document.addEventListener('DOMContentLoaded', function() {
    BulkActions.init();
});
