/**
 * 动态加载通用组件（导航栏和页脚）
 * 减少代码重复，确保全站一致性
 */

(function() {
    'use strict';

    /**
     * 加载 HTML 文件内容
     * @param {string} url - HTML 文件路径
     * @returns {Promise<string>} HTML 内容
     */
    async function fetchHTML(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to load ${url}: ${response.status} ${response.statusText}`);
        }
        return await response.text();
    }

    /**
     * 设置当前页面导航链接高亮
     * @param {HTMLElement} navElement - 导航元素
     */
    function highlightCurrentPage(navElement) {
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop() || 'index.html';
        
        const navLinks = navElement.querySelectorAll('a[href]');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage) {
                link.classList.add('text-primary');
                link.classList.remove('text-slate-300', 'text-text-secondary');
                
                // 添加高亮样式（根据页面类型）
                if (href.includes('simulator.html')) {
                    link.classList.add('border-b-2', 'border-primary');
                }
                if (href.includes('news.html')) {
                    link.classList.add('font-semibold');
                }
            }
        });
    }

    /**
     * 加载导航栏
     * @param {string} containerId - 容器 ID
     * @param {string} componentPath - 组件文件路径
     */
    async function loadNavigation(containerId, componentPath) {
        try {
            const container = document.getElementById(containerId);
            if (!container) {
                console.warn(`Navigation container #${containerId} not found`);
                return;
            }

            const html = await fetchHTML(componentPath);
            container.innerHTML = html;

            // 设置当前页高亮
            highlightCurrentPage(container);

            // 触发事件，通知导航已加载
            window.dispatchEvent(new CustomEvent('navigation-loaded'));
        } catch (error) {
            console.error('Error loading navigation:', error);
        }
    }

    /**
     * 加载页脚
     * @param {string} containerId - 容器 ID
     * @param {string} componentPath - 组件文件路径
     */
    async function loadFooter(containerId, componentPath) {
        try {
            const container = document.getElementById(containerId);
            if (!container) {
                console.warn(`Footer container #${containerId} not found`);
                return;
            }

            const html = await fetchHTML(componentPath);
            container.innerHTML = html;

            // 触发事件，通知页脚已加载
            window.dispatchEvent(new CustomEvent('footer-loaded'));
        } catch (error) {
            console.error('Error loading footer:', error);
        }
    }

    /**
     * 初始化组件加载
     */
    function init() {
        // 等待 DOM 加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        // 加载导航栏（默认路径）
        const navContainer = document.getElementById('nav-placeholder');
        if (navContainer && !navContainer.dataset.loaded) {
            navContainer.dataset.loaded = 'true';
            loadNavigation('nav-placeholder', 'assets/components/navigation.html');
        }

        // 加载页脚（默认路径）
        const footerContainer = document.getElementById('footer-placeholder');
        if (footerContainer && !footerContainer.dataset.loaded) {
            footerContainer.dataset.loaded = 'true';
            loadFooter('footer-placeholder', 'assets/components/footer.html');
        }
    }

    // 暴露全局方法供外部调用
    window.loadComponents = {
        navigation: loadNavigation,
        footer: loadFooter,
        init: init
    };

    // 自动初始化
    init();
})();
