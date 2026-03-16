/**
 * Content Manager - Core module for managing website content
 * Handles dynamic content loading, caching, and management
 */
const ContentManager = {
    contentCache: new Map(),
    language: 'en',
    isLoading: false,
    
    init: function() {
        this.loadLanguage();
        this.bindLanguageSwitcher();
    },
    
    loadLanguage: function() {
        const savedLang = localStorage.getItem('language') || 'en';
        this.language = savedLang;
        document.documentElement.lang = savedLang;
    },
    
    bindLanguageSwitcher: function() {
        const switchers = document.querySelectorAll('[data-lang]');
        switchers.forEach(switcher => {
            switcher.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = switcher.dataset.lang;
                this.setLanguage(lang);
            });
        });
        
        const selectSwitcher = document.getElementById('language-select');
        if (selectSwitcher) {
            selectSwitcher.value = this.language;
            selectSwitcher.addEventListener('change', (e) => {
                this.setLanguage(e.target.value);
            });
        }
    },
    
    setLanguage: function(lang) {
        this.language = lang;
        localStorage.setItem('language', lang);
        document.documentElement.lang = lang;
        
        // Update active state of language switchers
        document.querySelectorAll('[data-lang]').forEach(switcher => {
            switcher.classList.toggle('active', switcher.dataset.lang === lang);
        });
        
        const selectSwitcher = document.getElementById('language-select');
        if (selectSwitcher) {
            selectSwitcher.value = lang;
        }
        
        // Reload content for the new language
        this.reloadContent();
    },
    
    reloadContent: function() {
        // Reload all dynamic content
        this.loadPageContent(window.location.pathname);
    },
    
    loadPageContent: async function(pagePath) {
        try {
            const cacheKey = `${this.language}:${pagePath}`;
            
            // Check cache first
            if (this.contentCache.has(cacheKey)) {
                const cachedContent = this.contentCache.get(cacheKey);
                this.renderContent(cachedContent);
                return cachedContent;
            }
            
            this.isLoading = true;
            
            // Load content based on page path
            let content;
            if (pagePath.includes('product-catalog')) {
                content = await this.loadProductCatalogContent();
            } else if (pagePath.includes('product-detail')) {
                const productId = new URLSearchParams(window.location.search).get('id');
                content = await this.loadProductDetailContent(productId);
            } else {
                content = await this.loadGeneralPageContent(pagePath);
            }
            
            // Cache the content
            this.contentCache.set(cacheKey, content);
            
            // Render the content
            this.renderContent(content);
            
            this.isLoading = false;
            return content;
        } catch (error) {
            console.error('Error loading page content:', error);
            this.isLoading = false;
            return null;
        }
    },
    
    loadGeneralPageContent: async function(pagePath) {
        // Load general page content
        // For now, we'll return a basic structure
        return {
            title: document.title,
            content: 'Page content loaded dynamically',
            language: this.language
        };
    },
    
    loadProductCatalogContent: async function() {
        // Load product catalog content
        // This will be handled by the ProductManager
        return {
            title: 'Product Catalog',
            content: 'Product catalog content',
            language: this.language
        };
    },
    
    loadProductDetailContent: async function(productId) {
        // Load product detail content
        // This will be handled by the ProductManager
        return {
            title: 'Product Detail',
            content: 'Product detail content',
            language: this.language,
            productId: productId
        };
    },
    
    renderContent: function(content) {
        // Render content to the page
        // This will be overridden by specific page implementations
        console.log('Rendering content:', content);
    },
    
    getContent: function(key) {
        const cacheKey = `${this.language}:${key}`;
        return this.contentCache.get(cacheKey);
    },
    
    setContent: function(key, content) {
        const cacheKey = `${this.language}:${key}`;
        this.contentCache.set(cacheKey, content);
    },
    
    clearCache: function() {
        this.contentCache.clear();
    },
    
    isContentLoaded: function(key) {
        const cacheKey = `${this.language}:${key}`;
        return this.contentCache.has(cacheKey);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    ContentManager.init();
});

window.ContentManager = ContentManager;