/**
 * AI Chat Widget - PRECISION GRIND
 * 智能客服聊天组件
 */

const AIChatWidget = {
    config: {
        widgetId: 'ai-chat-widget',
        apiEndpoint: '/api/chat',
        welcomeMessage: 'Hello! Welcome to PRECISION GRIND. How can I assist you with your grinding equipment needs today?',
        quickReplies: [
            'Product information',
            'Request a quote',
            'Technical support',
            'Shipping information'
        ]
    },

    state: {
        isOpen: false,
        messages: [],
        isTyping: false
    },

    // 产品知识库
    knowledgeBase: {
        products: {
            'planetary ball mill': {
                name: 'Planetary Ball Mill',
                description: 'High-energy planetary ball mill for ultra-fine grinding of materials down to nanometer scale. Features 4 grinding stations and digital control.',
                specs: 'Capacity: 4x500ml, Speed: 0-400 rpm, Voltage: 220V/50Hz'
            },
            'grinding jar': {
                name: 'Grinding Jars',
                description: 'Available in various materials including Alumina, Zirconia, Stainless Steel, Tungsten Carbide, and Agate.',
                specs: 'Sizes: 50ml to 2000ml, Materials: 10+ options'
            },
            'grinding media': {
                name: 'Grinding Media',
                description: 'High-quality grinding balls in Alumina, Zirconia, Stainless Steel, and Tungsten Carbide materials.',
                specs: 'Sizes: 0.1mm to 50mm, Precision grade'
            }
        },
        shipping: 'We offer worldwide shipping via DHL, FedEx, and sea freight. Lead time is typically 7-14 business days depending on your location.',
        warranty: 'All our equipment comes with a 1-year standard warranty. Extended warranty options are available.',
        quote: 'To request a quote, please visit our contact page or email us at sales@precisiongrind.com with your specific requirements.'
    },

    init: function() {
        console.log('Initializing AI Chat Widget...');
        this.createWidget();
        this.bindEvents();
        console.log('AI Chat Widget initialized');
    },

    createWidget: function() {
        const widgetHTML = `
            <div id="${this.config.widgetId}" class="fixed bottom-6 right-6 z-50">
                <!-- Floating Button -->
                <button id="chat-toggle-btn" class="w-16 h-16 bg-primary rounded-full shadow-2xl flex items-center justify-center hover:bg-accent transition-all hover:scale-110 group">
                    <span class="material-symbols-outlined text-deep-navy text-3xl group-hover:scale-110 transition-transform">chat</span>
                    <span class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center animate-pulse">1</span>
                </button>

                <!-- Chat Window -->
                <div id="chat-window" class="absolute bottom-20 right-0 w-96 h-[550px] bg-surface-dark rounded-2xl shadow-2xl border border-white/10 overflow-hidden hidden flex-col">
                    <!-- Header -->
                    <div class="bg-gradient-to-r from-primary to-accent p-4 flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                <span class="material-symbols-outlined text-white text-xl">smart_toy</span>
                            </div>
                            <div>
                                <h3 class="text-white font-bold">PRECISION GRIND AI</h3>
                                <p class="text-white/70 text-xs">Online • Ready to help</p>
                            </div>
                        </div>
                        <button id="chat-close-btn" class="text-white/70 hover:text-white transition-colors">
                            <span class="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <!-- Messages -->
                    <div id="chat-messages" class="flex-1 overflow-y-auto p-4 space-y-4 bg-deep-navy/50">
                        <div class="flex gap-3">
                            <div class="w-8 h-8 bg-primary/20 rounded-full flex-shrink-0 flex items-center justify-center">
                                <span class="material-symbols-outlined text-primary text-sm">smart_toy</span>
                            </div>
                            <div class="flex-1">
                                <div class="bg-surface-dark/80 rounded-2xl rounded-tl-none p-4 border border-white/10">
                                    <p class="text-slate-200 text-sm">${this.config.welcomeMessage}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Quick Replies -->
                    <div class="px-4 py-3 bg-surface-dark/50 border-t border-white/5">
                        <div class="flex gap-2 overflow-x-auto pb-2">
                            ${this.config.quickReplies.map(reply => `
                                <button class="quick-reply px-3 py-1.5 bg-primary/10 text-primary text-xs rounded-full border border-primary/30 hover:bg-primary/20 transition-all whitespace-nowrap">
                                    ${reply}
                                </button>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Input Area -->
                    <div class="p-4 bg-surface-dark border-t border-white/10">
                        <div class="flex gap-2">
                            <input type="text" id="chat-input" placeholder="Type your message..." 
                                   class="flex-1 bg-deep-navy/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all">
                            <button id="chat-send-btn" class="w-12 h-12 bg-primary rounded-xl flex items-center justify-center hover:bg-accent transition-all">
                                <span class="material-symbols-outlined text-deep-navy">send</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', widgetHTML);
    },

    bindEvents: function() {
        const toggleBtn = document.getElementById('chat-toggle-btn');
        const closeBtn = document.getElementById('chat-close-btn');
        const sendBtn = document.getElementById('chat-send-btn');
        const chatInput = document.getElementById('chat-input');
        const quickReplies = document.querySelectorAll('.quick-reply');

        toggleBtn?.addEventListener('click', () => this.toggle());
        closeBtn?.addEventListener('click', () => this.close());
        sendBtn?.addEventListener('click', () => this.sendMessage());
        
        chatInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        quickReplies.forEach(btn => {
            btn.addEventListener('click', () => {
                this.sendMessage(btn.textContent);
            });
        });
    },

    toggle: function() {
        const chatWindow = document.getElementById('chat-window');
        this.state.isOpen = !this.state.isOpen;
        
        if (this.state.isOpen) {
            chatWindow?.classList.remove('hidden');
            chatWindow?.classList.add('flex');
            document.getElementById('chat-toggle-btn')?.querySelector('.animate-pulse')?.remove();
        } else {
            chatWindow?.classList.add('hidden');
            chatWindow?.classList.remove('flex');
        }
    },

    close: function() {
        const chatWindow = document.getElementById('chat-window');
        this.state.isOpen = false;
        chatWindow?.classList.add('hidden');
        chatWindow?.classList.remove('flex');
    },

    sendMessage: function(text) {
        const chatInput = document.getElementById('chat-input');
        const messageText = text || chatInput?.value.trim();
        
        if (!messageText) return;

        // Add user message
        this.addMessage(messageText, 'user');
        
        if (chatInput) {
            chatInput.value = '';
        }

        // Show typing indicator
        this.showTyping();

        // Simulate AI response
        setTimeout(() => {
            this.hideTyping();
            const response = this.generateResponse(messageText);
            this.addMessage(response, 'ai');
        }, 1000 + Math.random() * 1500);
    },

    addMessage: function(text, sender) {
        const messagesContainer = document.getElementById('chat-messages');
        if (!messagesContainer) return;

        const messageHTML = sender === 'user' ? `
            <div class="flex gap-3 justify-end">
                <div class="flex-1 flex justify-end">
                    <div class="bg-primary text-deep-navy rounded-2xl rounded-tr-none p-4 max-w-[80%]">
                        <p class="text-sm font-medium">${this.escapeHTML(text)}</p>
                    </div>
                </div>
                <div class="w-8 h-8 bg-accent/20 rounded-full flex-shrink-0 flex items-center justify-center">
                    <span class="material-symbols-outlined text-accent text-sm">person</span>
                </div>
            </div>
        ` : `
            <div class="flex gap-3">
                <div class="w-8 h-8 bg-primary/20 rounded-full flex-shrink-0 flex items-center justify-center">
                    <span class="material-symbols-outlined text-primary text-sm">smart_toy</span>
                </div>
                <div class="flex-1">
                    <div class="bg-surface-dark/80 rounded-2xl rounded-tl-none p-4 border border-white/10 max-w-[80%]">
                        <p class="text-slate-200 text-sm whitespace-pre-line">${this.escapeHTML(text)}</p>
                    </div>
                </div>
            </div>
        `;

        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        this.state.messages.push({ text, sender, timestamp: new Date() });
    },

    showTyping: function() {
        const messagesContainer = document.getElementById('chat-messages');
        if (!messagesContainer) return;

        const typingHTML = `
            <div id="typing-indicator" class="flex gap-3">
                <div class="w-8 h-8 bg-primary/20 rounded-full flex-shrink-0 flex items-center justify-center">
                    <span class="material-symbols-outlined text-primary text-sm">smart_toy</span>
                </div>
                <div class="flex-1">
                    <div class="bg-surface-dark/80 rounded-2xl rounded-tl-none p-4 border border-white/10">
                        <div class="flex gap-1">
                            <div class="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                            <div class="w-2 h-2 bg-primary rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                            <div class="w-2 h-2 bg-primary rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        messagesContainer.insertAdjacentHTML('beforeend', typingHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        this.state.isTyping = true;
    },

    hideTyping: function() {
        document.getElementById('typing-indicator')?.remove();
        this.state.isTyping = false;
    },

    generateResponse: function(userMessage) {
        const message = userMessage.toLowerCase();

        // Product queries
        if (message.includes('mill') || message.includes('ball mill')) {
            const product = this.knowledgeBase.products['planetary ball mill'];
            return `${product.name}\n\n${product.description}\n\nSpecifications: ${product.specs}\n\nWould you like a quote for this equipment?`;
        }
        
        if (message.includes('jar') || message.includes('container')) {
            const product = this.knowledgeBase.products['grinding jar'];
            return `${product.name}\n\n${product.description}\n\n${product.specs}`;
        }
        
        if (message.includes('media') || message.includes('ball')) {
            const product = this.knowledgeBase.products['grinding media'];
            return `${product.name}\n\n${product.description}\n\n${product.specs}`;
        }

        // Shipping queries
        if (message.includes('ship') || message.includes('delivery') || message.includes('shipping')) {
            return this.knowledgeBase.shipping;
        }

        // Warranty queries
        if (message.includes('warranty') || message.includes('guarantee')) {
            return this.knowledgeBase.warranty;
        }

        // Quote requests
        if (message.includes('quote') || message.includes('price') || message.includes('cost')) {
            return this.knowledgeBase.quote;
        }

        // Technical support
        if (message.includes('support') || message.includes('help') || message.includes('technical')) {
            return 'Our technical support team is ready to assist you! Please email support@precisiongrind.com with your question, or call us at +86-XXX-XXXX-XXXX during business hours (9:00-18:00 UTC+8).';
        }

        // Default responses
        const defaults = [
            "Thank you for your question! I'd be happy to help you with our grinding equipment. Could you please provide more details about your specific requirements?",
            "Great question! We offer a wide range of planetary milling solutions. What type of material are you looking to grind?",
            "I'm here to assist! For immediate assistance, you can also reach our sales team at sales@precisiongrind.com or call us directly."
        ];

        return defaults[Math.floor(Math.random() * defaults.length)];
    },

    escapeHTML: function(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    AIChatWidget.init();
});

window.AIChatWidget = AIChatWidget;
