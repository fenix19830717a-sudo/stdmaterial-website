/**
 * STD Material Website - Internationalization (i18n) Module
 * Simple JSON-based i18n solution without external frameworks
 */

const I18n = {
    // Configuration
    config: {
        defaultLang: 'en',
        supportedLangs: ['en', 'zh'],
        storageKey: 'std-language-preference',
        translationsPath: '/assets/i18n/'
    },

    // State
    currentLang: 'en',
    translations: {},
    isReady: false,
    callbacks: [],

    /**
     * Initialize the i18n module
     */
    init: async function() {
        console.log('[i18n] Initializing...');
        
        // Load saved language preference or detect from browser
        this.currentLang = this.getSavedLanguage() || this.detectLanguage();
        
        // Validate language
        if (!this.config.supportedLangs.includes(this.currentLang)) {
            this.currentLang = this.config.defaultLang;
        }

        // Load translations
        await this.loadTranslations(this.currentLang);
        
        // Apply translations to the page
        this.applyTranslations();
        
        // Setup language switcher
        this.setupLanguageSwitcher();
        
        // Update HTML lang attribute
        document.documentElement.lang = this.currentLang === 'zh' ? 'zh-CN' : 'en';
        
        this.isReady = true;
        this.notifyReady();
        
        console.log('[i18n] Initialized with language:', this.currentLang);
    },

    /**
     * Load translations for a specific language
     */
    loadTranslations: async function(lang) {
        try {
            const response = await fetch(`${this.config.translationsPath}${lang}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load ${lang}.json`);
            }
            this.translations = await response.json();
        } catch (error) {
            console.error('[i18n] Error loading translations:', error);
            // Fallback to empty object
            this.translations = {};
        }
    },

    /**
     * Get saved language preference from localStorage
     */
    getSavedLanguage: function() {
        try {
            return localStorage.getItem(this.config.storageKey);
        } catch (e) {
            return null;
        }
    },

    /**
     * Save language preference to localStorage
     */
    saveLanguage: function(lang) {
        try {
            localStorage.setItem(this.config.storageKey, lang);
        } catch (e) {
            console.warn('[i18n] Could not save language preference');
        }
    },

    /**
     * Detect language from browser settings
     */
    detectLanguage: function() {
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang && browserLang.toLowerCase().startsWith('zh')) {
            return 'zh';
        }
        return this.config.defaultLang;
    },

    /**
     * Switch to a different language
     */
    switchLanguage: async function(lang) {
        if (!this.config.supportedLangs.includes(lang)) {
            console.error('[i18n] Unsupported language:', lang);
            return;
        }

        if (lang === this.currentLang) {
            return;
        }

        console.log('[i18n] Switching to:', lang);
        
        // Add loading state
        this.addLoadingState();
        
        // Load new translations
        await this.loadTranslations(lang);
        
        // Update state
        this.currentLang = lang;
        
        // Save preference
        this.saveLanguage(lang);
        
        // Update HTML lang attribute
        document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
        
        // Apply translations with animation
        this.applyTranslationsWithAnimation();
        
        // Update language switcher UI
        this.updateSwitcherUI();
        
        // Remove loading state
        this.removeLoadingState();
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('languageChanged', { 
            detail: { language: lang } 
        }));
        
        console.log('[i18n] Language switched to:', lang);
    },

    /**
     * Add loading state to language switcher
     */
    addLoadingState: function() {
        document.querySelectorAll('[data-lang]').forEach(btn => {
            btn.disabled = true;
            btn.classList.add('opacity-50');
        });
    },

    /**
     * Remove loading state from language switcher
     */
    removeLoadingState: function() {
        document.querySelectorAll('[data-lang]').forEach(btn => {
            btn.disabled = false;
            btn.classList.remove('opacity-50');
        });
    },

    /**
     * Apply translations with fade animation
     */
    applyTranslationsWithAnimation: function() {
        // Select all elements with data-i18n attribute
        const elements = document.querySelectorAll('[data-i18n], [data-i18n-html]');
        
        // Fade out
        elements.forEach(el => {
            el.style.transition = 'opacity 0.3s ease';
            el.style.opacity = '0';
        });
        
        // Apply translations after fade out
        setTimeout(() => {
            this.applyTranslations();
            
            // Fade in
            elements.forEach(el => {
                el.style.opacity = '1';
            });
        }, 150);
    },

    /**
     * Get a translation by key (supports nested keys with dot notation)
     */
    t: function(key, fallback) {
        const keys = key.split('.');
        let value = this.translations;
        
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return fallback !== undefined ? fallback : key;
            }
        }
        
        return value !== undefined ? value : (fallback !== undefined ? fallback : key);
    },

    /**
     * Apply translations to all elements with data-i18n attribute
     */
    applyTranslations: function() {
        // Translate elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = this.t(key);
            
            if (el.hasAttribute('data-i18n-attr')) {
                // Translate specific attribute
                const attr = el.getAttribute('data-i18n-attr');
                el.setAttribute(attr, translation);
            } else if (el.hasAttribute('placeholder')) {
                // Translate placeholder
                el.setAttribute('placeholder', translation);
            } else {
                // Translate text content
                el.textContent = translation;
            }
        });

        // Translate elements with data-i18n-html attribute (for HTML content)
        document.querySelectorAll('[data-i18n-html]').forEach(el => {
            const key = el.getAttribute('data-i18n-html');
            el.innerHTML = this.t(key);
        });
    },

    /**
     * Setup language switcher event listeners
     */
    setupLanguageSwitcher: function() {
        // Find all language switcher buttons
        document.querySelectorAll('[data-lang]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = btn.getAttribute('data-lang');
                this.switchLanguage(lang);
            });
        });

        // Find select elements for language
        document.querySelectorAll('#language-select').forEach(select => {
            select.value = this.currentLang;
            select.addEventListener('change', (e) => {
                this.switchLanguage(e.target.value);
            });
        });

        this.updateSwitcherUI();
    },

    /**
     * Update language switcher UI to reflect current language
     */
    updateSwitcherUI: function() {
        // Update buttons
        document.querySelectorAll('[data-lang]').forEach(btn => {
            const lang = btn.getAttribute('data-lang');
            if (lang === this.currentLang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Update select
        document.querySelectorAll('#language-select').forEach(select => {
            select.value = this.currentLang;
        });
    },

    /**
     * Register a callback to be called when i18n is ready
     */
    onReady: function(callback) {
        if (this.isReady) {
            callback();
        } else {
            this.callbacks.push(callback);
        }
    },

    /**
     * Notify all registered callbacks that i18n is ready
     */
    notifyReady: function() {
        this.callbacks.forEach(cb => cb());
        this.callbacks = [];
    },

    /**
     * Get current language
     */
    getCurrentLanguage: function() {
        return this.currentLang;
    },

    /**
     * Check if a translation exists
     */
    hasTranslation: function(key) {
        return this.t(key) !== key;
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    I18n.init();
});

// Expose to global scope
window.I18n = I18n;
