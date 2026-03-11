/**
 * Lazy Loading Implementation for STD Material Website
 * Supports native lazy loading with IntersectionObserver fallback
 */

(function() {
    'use strict';

    // 检测浏览器是否支持原生懒加载
    const supportsNativeLazyLoading = 'loading' in HTMLImageElement.prototype;
    
    // IntersectionObserver 配置
    const observerOptions = {
        root: null,
        rootMargin: '50px 0px',
        threshold: 0.01
    };

    // 图片加载函数
    function loadImage(img) {
        const src = img.getAttribute('data-src');
        const srcset = img.getAttribute('data-srcset');
        
        if (!src) return;
        
        // 如果是picture元素内的source
        const sources = img.parentElement.tagName === 'PICTURE' 
            ? img.parentElement.querySelectorAll('source') 
            : [];
        
        sources.forEach(source => {
            const sourceSrcset = source.getAttribute('data-srcset');
            if (sourceSrcset) {
                source.srcset = sourceSrcset;
                source.removeAttribute('data-srcset');
            }
        });
        
        img.src = src;
        if (srcset) {
            img.srcset = srcset;
            img.removeAttribute('data-srcset');
        }
        img.removeAttribute('data-src');
        img.classList.add('lazy-loaded');
        img.classList.remove('lazy-loading');
    }

    // IntersectionObserver 回调
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                loadImage(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 初始化懒加载
    function initLazyLoading() {
        // 获取所有需要懒加载的图片
        const lazyImages = document.querySelectorAll('img[data-src], img[loading="lazy"]');
        
        lazyImages.forEach(img => {
            // 如果没有data-src但有loading="lazy"，将src转为data-src
            if (!img.getAttribute('data-src') && img.getAttribute('loading') === 'lazy') {
                img.setAttribute('data-src', img.src);
                // 使用占位图或空白
                img.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
            }
            
            // 添加加载状态类
            img.classList.add('lazy-loading');
            
            // 使用IntersectionObserver
            imageObserver.observe(img);
        });
    }

    // WebP 支持检测
    function checkWebPSupport() {
        return new Promise((resolve) => {
            const webP = new Image();
            webP.onload = webP.onerror = function() {
                resolve(webP.height === 2);
            };
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    }

    // 自动转换图片为WebP（如果浏览器支持）
    async function enableWebPConversion() {
        const supportsWebP = await checkWebPSupport();
        if (!supportsWebP) return;

        // 查找所有JPEG/PNG图片，优先加载WebP版本
        const images = document.querySelectorAll('img[src$=".jpg"], img[src$=".jpeg"], img[src$=".png"]');
        
        images.forEach(img => {
            const originalSrc = img.src;
            const webpSrc = originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
            
            // 如果WebP版本存在，添加source到picture元素
            if (img.parentElement.tagName !== 'PICTURE') {
                const picture = document.createElement('picture');
                const source = document.createElement('source');
                source.srcset = webpSrc;
                source.type = 'image/webp';
                
                img.parentNode.insertBefore(picture, img);
                picture.appendChild(source);
                picture.appendChild(img);
            }
        });
    }

    // 预加载关键图片
    function preloadCriticalImages() {
        const criticalImages = document.querySelectorAll('img[data-critical="true"]');
        criticalImages.forEach(img => {
            loadImage(img);
        });
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initLazyLoading();
            enableWebPConversion();
            preloadCriticalImages();
        });
    } else {
        initLazyLoading();
        enableWebPConversion();
        preloadCriticalImages();
    }

    // 暴露全局API
    window.LazyLoader = {
        load: loadImage,
        refresh: initLazyLoading
    };

})();
