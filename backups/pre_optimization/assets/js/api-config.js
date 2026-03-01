/**
 * API Configuration Manager
 * 管理大模型API配置和LLM网关接入
 */

const APIConfig = {
    // 存储键名
    storageKeys: {
        configs: 'llm_configs',
        defaultSettings: 'llm_default_settings',
        usageStats: 'llm_usage_stats'
    },

    // 提供商配置模板
    providers: {
        openai: {
            name: 'OpenAI',
            baseUrl: 'https://api.openai.com/v1',
            models: ['gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo'],
            defaultModel: 'gpt-4-turbo',
            temperature: 0.7,
            maxTokens: 4000
        },
        deepseek: {
            name: 'DeepSeek',
            baseUrl: 'https://api.deepseek.com/v1',
            models: ['deepseek-chat', 'deepseek-coder', 'deepseek-reasoner'],
            defaultModel: 'deepseek-chat',
            temperature: 0.7,
            maxTokens: 4000
        },
        anthropic: {
            name: 'Anthropic Claude',
            baseUrl: 'https://api.anthropic.com/v1',
            models: ['claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'],
            defaultModel: 'claude-3-sonnet-20240229',
            temperature: 0.7,
            maxTokens: 4000
        },
        silicon: {
            name: 'Silicon Flow',
            baseUrl: 'https://api.siliconflow.cn/v1',
            models: ['deepseek-ai/DeepSeek-V3', 'deepseek-ai/DeepSeek-R1', 'Qwen/Qwen2.5-72B-Instruct'],
            defaultModel: 'deepseek-ai/DeepSeek-V3',
            temperature: 0.7,
            maxTokens: 4000
        }
    },

    /**
     * 获取所有API配置
     */
    getAllConfigs() {
        return JSON.parse(localStorage.getItem(this.storageKeys.configs) || '{}');
    },

    /**
     * 获取指定提供商配置
     */
    getProviderConfig(provider) {
        const configs = this.getAllConfigs();
        return configs[provider] || null;
    },

    /**
     * 保存提供商配置
     */
    saveProviderConfig(provider, config) {
        const configs = this.getAllConfigs();
        configs[provider] = {
            ...config,
            updatedAt: new Date().toISOString()
        };
        localStorage.setItem(this.storageKeys.configs, JSON.stringify(configs));
        return true;
    },

    /**
     * 删除提供商配置
     */
    removeProviderConfig(provider) {
        const configs = this.getAllConfigs();
        delete configs[provider];
        localStorage.setItem(this.storageKeys.configs, JSON.stringify(configs));
        return true;
    },

    /**
     * 获取默认设置
     */
    getDefaultSettings() {
        return JSON.parse(localStorage.getItem(this.storageKeys.defaultSettings) || '{}');
    },

    /**
     * 保存默认设置
     */
    saveDefaultSettings(settings) {
        localStorage.setItem(this.storageKeys.defaultSettings, JSON.stringify({
            ...settings,
            updatedAt: new Date().toISOString()
        }));
        return true;
    },

    /**
     * 获取默认提供商
     */
    getDefaultProvider() {
        const settings = this.getDefaultSettings();
        return settings.defaultProvider || 'openai';
    },

    /**
     * 获取默认模型
     */
    getDefaultModel() {
        const settings = this.getDefaultSettings();
        const provider = this.getDefaultProvider();
        return settings.defaultModel || this.providers[provider].defaultModel;
    },

    /**
     * 获取有效的API配置（已配置且有API Key）
     */
    getActiveProviders() {
        const configs = this.getAllConfigs();
        return Object.keys(configs).filter(provider => {
            return configs[provider] && configs[provider].apiKey;
        });
    },

    /**
     * 测试API连接
     */
    async testConnection(provider) {
        const config = this.getProviderConfig(provider);
        if (!config || !config.apiKey) {
            return { success: false, error: 'API Key未配置' };
        }

        try {
            const providerConfig = this.providers[provider];
            
            // 构建测试请求
            const testPayload = {
                model: config.model || providerConfig.defaultModel,
                messages: [{ role: 'user', content: 'Hello' }],
                max_tokens: 10
            };

            // 根据不同提供商构建请求
            let url, headers, body;
            
            switch (provider) {
                case 'openai':
                case 'deepseek':
                case 'silicon':
                    url = `${providerConfig.baseUrl}/chat/completions`;
                    headers = {
                        'Authorization': `Bearer ${config.apiKey}`,
                        'Content-Type': 'application/json'
                    };
                    body = JSON.stringify(testPayload);
                    break;
                case 'anthropic':
                    url = `${providerConfig.baseUrl}/messages`;
                    headers = {
                        'x-api-key': config.apiKey,
                        'anthropic-version': '2023-06-01',
                        'Content-Type': 'application/json'
                    };
                    body = JSON.stringify({
                        model: config.model || providerConfig.defaultModel,
                        max_tokens: 10,
                        messages: [{ role: 'user', content: 'Hello' }]
                    });
                    break;
                default:
                    return { success: false, error: '不支持的提供商' };
            }

            const response = await fetch(url, {
                method: 'POST',
                headers,
                body
            });

            if (response.ok) {
                return { success: true, message: '连接成功' };
            } else {
                const error = await response.text();
                return { success: false, error: `API错误: ${response.status}` };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    /**
     * 记录API调用统计
     */
    recordUsage(provider, tokens, success = true) {
        const stats = JSON.parse(localStorage.getItem(this.storageKeys.usageStats) || '{}');
        const today = new Date().toISOString().split('T')[0];
        
        if (!stats[provider]) {
            stats[provider] = {};
        }
        
        if (!stats[provider][today]) {
            stats[provider][today] = {
                calls: 0,
                tokens: 0,
                success: 0,
                failed: 0
            };
        }
        
        stats[provider][today].calls++;
        stats[provider][today].tokens += tokens || 0;
        
        if (success) {
            stats[provider][today].success++;
        } else {
            stats[provider][today].failed++;
        }
        
        localStorage.setItem(this.storageKeys.usageStats, JSON.stringify(stats));
    },

    /**
     * 获取使用统计
     */
    getUsageStats(provider, days = 30) {
        const stats = JSON.parse(localStorage.getItem(this.storageKeys.usageStats) || '{}');
        const result = {};
        
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        
        if (provider) {
            // 获取指定提供商的统计
            const providerStats = stats[provider] || {};
            for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                const dateStr = d.toISOString().split('T')[0];
                result[dateStr] = providerStats[dateStr] || { calls: 0, tokens: 0, success: 0, failed: 0 };
            }
        } else {
            // 获取所有提供商的统计
            Object.keys(stats).forEach(p => {
                result[p] = {};
                for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                    const dateStr = d.toISOString().split('T')[0];
                    result[p][dateStr] = stats[p][dateStr] || { calls: 0, tokens: 0, success: 0, failed: 0 };
                }
            });
        }
        
        return result;
    },

    /**
     * 加密API Key（简单Base64，生产环境应使用更强的加密）
     */
    encryptApiKey(apiKey) {
        return btoa(apiKey);
    },

    /**
     * 解密API Key
     */
    decryptApiKey(encryptedKey) {
        try {
            return atob(encryptedKey);
        } catch {
            return encryptedKey;
        }
    },

    /**
     * 导出配置
     */
    exportConfig() {
        const config = {
            providers: this.getAllConfigs(),
            defaultSettings: this.getDefaultSettings(),
            usageStats: JSON.parse(localStorage.getItem(this.storageKeys.usageStats) || '{}'),
            exportedAt: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `api-config-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    },

    /**
     * 导入配置
     */
    importConfig(configJson) {
        try {
            const config = JSON.parse(configJson);
            
            if (config.providers) {
                localStorage.setItem(this.storageKeys.configs, JSON.stringify(config.providers));
            }
            
            if (config.defaultSettings) {
                localStorage.setItem(this.storageKeys.defaultSettings, JSON.stringify(config.defaultSettings));
            }
            
            if (config.usageStats) {
                localStorage.setItem(this.storageKeys.usageStats, JSON.stringify(config.usageStats));
            }
            
            return { success: true, message: '配置导入成功' };
        } catch (error) {
            return { success: false, error: '配置格式错误: ' + error.message };
        }
    },

    /**
     * 清除所有配置
     */
    clearAllConfigs() {
        localStorage.removeItem(this.storageKeys.configs);
        localStorage.removeItem(this.storageKeys.defaultSettings);
        localStorage.removeItem(this.storageKeys.usageStats);
        return true;
    }
};

/**
 * LLM Gateway - 大模型接入网关
 * 统一的LLM调用接口，支持多提供商切换
 */
const LLMGateway = {
    /**
     * 发送聊天请求
     */
    async chat(messages, options = {}) {
        const provider = options.provider || APIConfig.getDefaultProvider();
        const config = APIConfig.getProviderConfig(provider);
        
        if (!config || !config.apiKey) {
            throw new Error(`Provider ${provider} not configured`);
        }

        const providerConfig = APIConfig.providers[provider];
        const model = options.model || config.model || providerConfig.defaultModel;
        const temperature = options.temperature !== undefined ? options.temperature : (config.temperature || providerConfig.temperature);
        const maxTokens = options.maxTokens || config.maxTokens || providerConfig.maxTokens;
        const stream = options.stream !== undefined ? options.stream : true;

        let url, headers, body;

        switch (provider) {
            case 'openai':
            case 'deepseek':
            case 'silicon':
                url = `${providerConfig.baseUrl}/chat/completions`;
                headers = {
                    'Authorization': `Bearer ${config.apiKey}`,
                    'Content-Type': 'application/json'
                };
                body = JSON.stringify({
                    model,
                    messages,
                    temperature,
                    max_tokens: maxTokens,
                    stream
                });
                break;

            case 'anthropic':
                url = `${providerConfig.baseUrl}/messages`;
                headers = {
                    'x-api-key': config.apiKey,
                    'anthropic-version': '2023-06-01',
                    'Content-Type': 'application/json'
                };
                body = JSON.stringify({
                    model,
                    messages,
                    max_tokens: maxTokens,
                    temperature,
                    stream
                });
                break;

            default:
                throw new Error(`Unsupported provider: ${provider}`);
        }

        const startTime = Date.now();
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers,
                body
            });

            if (!response.ok) {
                const error = await response.text();
                APIConfig.recordUsage(provider, 0, false);
                throw new Error(`API Error: ${response.status} - ${error}`);
            }

            const duration = Date.now() - startTime;

            if (stream) {
                return this.handleStreamResponse(response, provider);
            } else {
                const data = await response.json();
                const tokens = data.usage?.total_tokens || 0;
                APIConfig.recordUsage(provider, tokens, true);
                return {
                    content: this.extractContent(data, provider),
                    tokens,
                    duration,
                    provider
                };
            }
        } catch (error) {
            APIConfig.recordUsage(provider, 0, false);
            throw error;
        }
    },

    /**
     * 处理流式响应
     */
    async *handleStreamResponse(response, provider) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let totalTokens = 0;

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop();

                for (const line of lines) {
                    if (line.trim() === '' || line.trim() === 'data: [DONE]') continue;
                    
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            const content = this.extractStreamContent(data, provider);
                            if (content) {
                                totalTokens++;
                                yield { content, done: false };
                            }
                        } catch (e) {
                            // Ignore parse errors
                        }
                    }
                }
            }

            APIConfig.recordUsage(provider, totalTokens, true);
            yield { content: '', done: true, totalTokens };
        } finally {
            reader.releaseLock();
        }
    },

    /**
     * 从响应中提取内容
     */
    extractContent(data, provider) {
        switch (provider) {
            case 'openai':
            case 'deepseek':
            case 'silicon':
                return data.choices?.[0]?.message?.content || '';
            case 'anthropic':
                return data.content?.[0]?.text || '';
            default:
                return '';
        }
    },

    /**
     * 从流式响应中提取内容
     */
    extractStreamContent(data, provider) {
        switch (provider) {
            case 'openai':
            case 'deepseek':
            case 'silicon':
                return data.choices?.[0]?.delta?.content || '';
            case 'anthropic':
                return data.delta?.text || '';
            default:
                return '';
        }
    },

    /**
     * 生成产品描述
     */
    async generateProductDescription(productData, options = {}) {
        const prompt = `请为以下研磨设备产品生成专业的英文产品描述：

产品名称: ${productData.name}
分类: ${productData.category}
材料: ${productData.material || 'N/A'}
规格: ${productData.specifications || 'N/A'}

要求：
1. 突出产品特点和优势
2. 包含技术参数
3. 适合B2B客户阅读
4. SEO友好，包含相关关键词
5. 长度200-300词

请直接返回产品描述内容。`;

        const messages = [{ role: 'user', content: prompt }];
        const response = await this.chat(messages, options);
        return response.content;
    },

    /**
     * 生成营销内容
     */
    async generateMarketingContent(type, params, options = {}) {
        let prompt = '';
        
        switch (type) {
            case 'blog_post':
                prompt = `请撰写一篇关于研磨设备/材料的专业博客文章。
主题: ${params.topic}
关键词: ${params.keywords?.join(', ') || 'grinding equipment, ball mill'}
目标受众: B2B工业客户
字数: ${params.length || '1000-1500词'}

要求：
1. 专业且易读
2. 包含实用信息
3. SEO优化
4. 包含小标题
5. 结尾有CTA`;
                break;
            
            case 'social_post':
                prompt = `请为${params.platform || 'LinkedIn'}撰写一条社交媒体推广文案。
产品: ${params.product || '研磨设备'}
语调: ${params.tone || 'professional'}

要求：
1. 简洁有力
2. 包含相关hashtag
3. 吸引B2B客户
4. 适合${params.platform || 'LinkedIn'}平台`;
                break;
            
            case 'email':
                prompt = `请撰写一封B2B营销邮件。
主题: ${params.subject || '产品推广'}
收件人: ${params.recipient || '潜在客户'}

要求：
1. 专业礼貌
2. 突出产品价值
3. 清晰的CTA
4. 适合商务场景`;
                break;
            
            default:
                prompt = params.prompt || '请生成营销内容';
        }

        const messages = [{ role: 'user', content: prompt }];
        const response = await this.chat(messages, options);
        return response.content;
    },

    /**
     * 分析客户询盘
     */
    async analyzeInquiry(inquiryData, options = {}) {
        const prompt = `请分析以下客户询盘并提供建议：

客户信息:
- 姓名: ${inquiryData.customerName}
- 公司: ${inquiryData.company || 'N/A'}
- 邮箱: ${inquiryData.email}

询盘内容:
${inquiryData.message}

感兴趣的产品: ${inquiryData.productInterest || 'N/A'}

请提供：
1. 客户意图分析
2. 购买意向评分 (1-10)
3. 建议回复要点
4. 推荐跟进策略

以JSON格式返回。`;

        const messages = [{ role: 'user', content: prompt }];
        const response = await this.chat(messages, options);
        
        try {
            return JSON.parse(response.content);
        } catch {
            return { analysis: response.content };
        }
    },

    /**
     * 生成询盘回复
     */
    async generateInquiryReply(inquiryData, analysis, options = {}) {
        const prompt = `请为以下客户询盘撰写专业回复：

客户信息:
- 姓名: ${inquiryData.customerName}
- 公司: ${inquiryData.company || 'N/A'}

询盘内容:
${inquiryData.message}

分析结果:
${JSON.stringify(analysis)}

要求：
1. 专业且友好
2. 直接回答客户问题
3. 提供相关产品信息
4. 引导下一步行动
5. 包含联系方式
6. 英文回复

请直接返回邮件正文。`;

        const messages = [{ role: 'user', content: prompt }];
        const response = await this.chat(messages, options);
        return response.content;
    }
};

// 导出模块
window.APIConfig = APIConfig;
window.LLMGateway = LLMGateway;
