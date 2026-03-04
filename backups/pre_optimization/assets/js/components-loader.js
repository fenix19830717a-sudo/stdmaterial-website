/**
 * 晟通达独立站 - 组件加载器
 * 自动加载共享的 header 和 footer 组件
 * 
 * 使用方法:
 * 1. 在页面 <head> 中引入此脚本
 * 2. 在页面 <body> 中添加 <div id="header-container"></div> 和 <div id="footer-container"></div>
 * 3. 组件将自动加载到对应位置
 */

document.addEventListener('DOMContentLoaded', function() {
    const componentsPath = '../components/';
    
    // 加载 Header
    fetch(componentsPath + 'header.html')
        .then(response => response.text())
        .then(html => {
            const headerContainer = document.getElementById('header-container');
            if (headerContainer) {
                headerContainer.innerHTML = html;
                // 修复链接路径
                fixLinks(headerContainer, getRelativePath(window.location.pathname));
            }
        })
        .catch(err => console.error('Failed to load header:', err));
    
    // 加载 Footer
    fetch(componentsPath + 'footer.html')
        .then(response => response.text())
        .then(html => {
            const footerContainer = document.getElementById('footer-container');
            if (footerContainer) {
                footerContainer.innerHTML = html;
            }
        })
        .catch(err => console.error('Failed to load footer:', err));
    
    // 计算相对路径
    function getRelativePath(pathname) {
        const depth = pathname.split('/').filter(p => p && !p.includes('.html')).length;
        return depth > 0 ? '../'.repeat(depth) : './';
    }
    
    // 修复内部链接的相对路径
    function fixLinks(container, basePath) {
        container.querySelectorAll('a[href], link[href], script[src]').forEach(el => {
            const attr = el.tagName === 'SCRIPT' ? 'src' : 'href';
            const value = el.getAttribute(attr);
            if (value && !value.startsWith('http') && !value.startsWith('//') && !value.startsWith('#')) {
                // 如果链接指向页面（非资源文件），添加相对路径
                if (value.endsWith('.html') || value.endsWith('.css') || value.endsWith('.js')) {
                    // 已经是完整路径或相对路径，保持原样
                }
            }
        });
    }
});
