const OpenClawAPI = {
    config: {
        baseUrl: '/api/openclaw',
        apiKey: '',
        timeout: 30000,
        retryAttempts: 3
    },

    state: {
        isConnected: false,
        currentAgent: null,
        pendingTasks: []
    },

    init: function(config = {}) {
        this.config = { ...this.config, ...config };
        console.log('OpenClaw API initialized');
        this.checkConnection();
    },

    checkConnection: async function() {
        try {
            const response = await this.request('/health', 'GET');
            this.state.isConnected = response.status === 'ok';
            console.log('OpenClaw connection status:', this.state.isConnected);
            return this.state.isConnected;
        } catch (error) {
            console.error('OpenClaw connection check failed:', error);
            this.state.isConnected = false;
            return false;
        }
    },

    request: async function(endpoint, method = 'GET', data = null) {
        const url = `${this.config.baseUrl}${endpoint}`;
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.config.apiKey}`
            }
        };

        if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
            options.body = JSON.stringify(data);
        }

        let lastError;
        for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
            try {
                const response = await fetch(url, options);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return await response.json();
            } catch (error) {
                lastError = error;
                console.warn(`OpenClaw API attempt ${attempt} failed:`, error);
                if (attempt < this.config.retryAttempts) {
                    await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
                }
            }
        }

        throw lastError;
    },

    sendCommand: async function(agentId, command, params = {}) {
        const payload = {
            agentId,
            command,
            params,
            timestamp: new Date().toISOString()
        };

        try {
            const response = await this.request('/command', 'POST', payload);
            console.log('Command sent:', { agentId, command, response });
            return response;
        } catch (error) {
            console.error('Error sending command:', error);
            throw error;
        }
    },

    getAgentStatus: async function(agentId) {
        try {
            return await this.request(`/agents/${agentId}/status`, 'GET');
        } catch (error) {
            console.error('Error getting agent status:', error);
            return null;
        }
    },

    listAgents: async function() {
        try {
            return await this.request('/agents', 'GET');
        } catch (error) {
            console.error('Error listing agents:', error);
            return [];
        }
    },

    executeTask: async function(task) {
        const payload = {
            task: task.description,
            agent: task.agent || 'main_agent',
            priority: task.priority || 'normal',
            context: task.context || {},
            callback: task.callback || null
        };

        try {
            const response = await this.request('/tasks/execute', 'POST', payload);
            console.log('Task executed:', response);
            return response;
        } catch (error) {
            console.error('Error executing task:', error);
            throw error;
        }
    },

    getTaskStatus: async function(taskId) {
        try {
            return await this.request(`/tasks/${taskId}/status`, 'GET');
        } catch (error) {
            console.error('Error getting task status:', error);
            return null;
        }
    },

    cancelTask: async function(taskId) {
        try {
            return await this.request(`/tasks/${taskId}/cancel`, 'POST');
        } catch (error) {
            console.error('Error canceling task:', error);
            return null;
        }
    },

    uploadProduct: async function(productData) {
        return this.executeTask({
            description: 'Upload new product to website',
            agent: 'product_operations',
            priority: 'high',
            context: {
                action: 'upload_product',
                product: productData
            }
        });
    },

    updateProduct: async function(productId, productData) {
        return this.executeTask({
            description: `Update product ${productId}`,
            agent: 'product_operations',
            priority: 'normal',
            context: {
                action: 'update_product',
                productId,
                product: productData
            }
        });
    },

    generateProductDescription: async function(productData) {
        return this.executeTask({
            description: 'Generate product description',
            agent: 'marketing_promotion',
            priority: 'normal',
            context: {
                action: 'generate_description',
                product: productData
            }
        });
    },

    analyzeMarketTrends: async function(industry) {
        return this.executeTask({
            description: `Analyze market trends for ${industry}`,
            agent: 'data_analysis',
            priority: 'low',
            context: {
                action: 'market_analysis',
                industry
            }
        });
    },

    handleCustomerInquiry: async function(inquiryData) {
        return this.executeTask({
            description: 'Process customer inquiry',
            agent: 'customer_service',
            priority: 'high',
            context: {
                action: 'handle_inquiry',
                inquiry: inquiryData
            }
        });
    },

    generateMarketingContent: async function(type, params) {
        return this.executeTask({
            description: `Generate ${type} marketing content`,
            agent: 'marketing_promotion',
            priority: 'normal',
            context: {
                action: 'generate_content',
                type,
                params
            }
        });
    },

    scheduleSocialMediaPost: async function(content, platforms, scheduleTime) {
        return this.executeTask({
            description: 'Schedule social media post',
            agent: 'marketing_promotion',
            priority: 'normal',
            context: {
                action: 'schedule_post',
                content,
                platforms,
                scheduleTime
            }
        });
    },

    generateSEOReport: async function() {
        return this.executeTask({
            description: 'Generate SEO performance report',
            agent: 'data_analysis',
            priority: 'low',
            context: {
                action: 'seo_report'
            }
        });
    },

    getBusinessMetrics: async function() {
        try {
            return await this.request('/metrics/business', 'GET');
        } catch (error) {
            console.error('Error getting business metrics:', error);
            return null;
        }
    },

    subscribeToEvents: function(callback) {
        if (typeof EventSource !== 'undefined') {
            const eventSource = new EventSource(`${this.config.baseUrl}/events`);
            
            eventSource.onmessage = (event) => {
                const data = JSON.parse(event.data);
                callback(data);
            };
            
            eventSource.onerror = (error) => {
                console.error('EventSource error:', error);
            };
            
            return eventSource;
        }
        return null;
    }
};

const AgentCommands = {
    PRODUCT_OPERATIONS: {
        UPLOAD_PRODUCT: 'upload_product',
        UPDATE_PRODUCT: 'update_product',
        DELETE_PRODUCT: 'delete_product',
        SCRAPE_PRODUCTS: 'scrape_products',
        SYNC_INVENTORY: 'sync_inventory'
    },
    MARKETING: {
        GENERATE_DESCRIPTION: 'generate_description',
        CREATE_BLOG_POST: 'create_blog_post',
        SCHEDULE_POST: 'schedule_post',
        SEND_EMAIL_CAMPAIGN: 'send_email_campaign',
        OPTIMIZE_SEO: 'optimize_seo'
    },
    CUSTOMER_SERVICE: {
        HANDLE_INQUIRY: 'handle_inquiry',
        SEND_QUOTE: 'send_quote',
        FOLLOW_UP: 'follow_up',
        RESOLVE_COMPLAINT: 'resolve_complaint'
    },
    DATA_ANALYSIS: {
        MARKET_ANALYSIS: 'market_analysis',
        SALES_REPORT: 'sales_report',
        CUSTOMER_INSIGHTS: 'customer_insights',
        SEO_REPORT: 'seo_report'
    }
};

document.addEventListener('DOMContentLoaded', () => {
    OpenClawAPI.init();
});

window.OpenClawAPI = OpenClawAPI;
window.AgentCommands = AgentCommands;
