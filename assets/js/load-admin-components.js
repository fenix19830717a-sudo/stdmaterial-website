/**
 * 后台管理页面组件加载脚本
 * 加载侧边栏和顶部导航栏
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
     * 设置侧边栏当前页高亮
     * @param {HTMLElement} sidebarElement - 侧边栏元素
     */
    function highlightCurrentPage(sidebarElement) {
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop() || 'admin-dashboard.html';
        
        const sidebarLinks = sidebarElement.querySelectorAll('a[href]');
        sidebarLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage) {
                link.classList.add('active', 'bg-primary/10', 'border-primary');
                link.classList.remove('border-transparent');
                
                const icon = link.querySelector('.material-symbols-outlined');
                if (icon) {
                    icon.classList.remove('text-slate-400');
                    icon.classList.add('text-primary');
                }
                
                const text = link.querySelector('span.text-sm, span.font-medium');
                if (text) {
                    text.classList.remove('text-slate-300');
                    text.classList.add('text-white');
                }
            }
        });
    }

    /**
     * 加载侧边栏
     * @param {string} containerId - 容器 ID
     * @param {string} componentPath - 组件文件路径
     */
    async function loadSidebar(containerId, componentPath) {
        try {
            const container = document.getElementById(containerId);
            if (!container) {
                console.warn(`Sidebar container #${containerId} not found`);
                return;
            }

            const html = await fetchHTML(componentPath);
            container.innerHTML = html;

            // 设置当前页高亮
            highlightCurrentPage(container);

            // 触发事件
            window.dispatchEvent(new CustomEvent('sidebar-loaded'));
        } catch (error) {
            console.error('Error loading sidebar:', error);
        }
    }

    /**
     * 加载顶部导航栏
     * @param {string} containerId - 容器 ID
     * @param {string} componentPath - 组件文件路径
     */
    async function loadHeader(containerId, componentPath) {
        try {
            const container = document.getElementById(containerId);
            if (!container) {
                console.warn(`Header container #${containerId} not found`);
                return;
            }

            const html = await fetchHTML(componentPath);
            container.innerHTML = html;

            // 触发事件
            window.dispatchEvent(new CustomEvent('header-loaded'));
        } catch (error) {
            console.error('Error loading header:', error);
        }
    }

    /**
     * 初始化组件加载
     */
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        // 加载侧边栏
        const sidebarContainer = document.getElementById('admin-sidebar-placeholder');
        if (sidebarContainer && !sidebarContainer.dataset.loaded) {
            sidebarContainer.dataset.loaded = 'true';
            loadSidebar('admin-sidebar-placeholder', 'assets/components/admin-sidebar.html');
        }

        // 加载顶部导航栏
        const headerContainer = document.getElementById('admin-header-placeholder');
        if (headerContainer && !headerContainer.dataset.loaded) {
            headerContainer.dataset.loaded = 'true';
            loadHeader('admin-header-placeholder', 'assets/components/admin-header.html');
        }
    }

    // 暴露全局方法
    window.adminComponents = {
        sidebar: loadSidebar,
        header: loadHeader,
        init: init
    };

    // 自动初始化
    init();
})();
