/**
 * Image Optimizer - Enhances image loading and display
 * Handles lazy loading, responsive images, and error handling
 */
const ImageOptimizer = {
    // Initialize image optimization
    init: function() {
        this.initLazyLoading();
        this.initErrorHandling();
        this.initResponsiveImages();
    },
    
    // Initialize lazy loading with Intersection Observer
    initLazyLoading: function() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadImage(img);
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px', // Load images when they're 50px from viewport
                threshold: 0.1
            });
            
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback for browsers without Intersection Observer
            this.fallbackLazyLoad();
        }
    },
    
    // Load image with animation
    loadImage: function(img) {
        if (!img) return;
        
        // Add loading class
        img.classList.add('image-loading');
        
        const src = img.getAttribute('data-src');
        if (src) {
            const tempImg = new Image();
            tempImg.onload = () => {
                img.src = src;
                img.classList.remove('image-loading');
                img.classList.add('image-loaded');
            };
            tempImg.onerror = () => {
                this.handleImageError(img);
                img.classList.remove('image-loading');
            };
            tempImg.src = src;
        }
    },
    
    // Fallback lazy loading for older browsers
    fallbackLazyLoad: function() {
        const images = document.querySelectorAll('img[data-src]');
        
        function checkImages() {
            images.forEach(img => {
                if (this.isInViewport(img)) {
                    this.loadImage(img);
                }
            });
        }
        
        window.addEventListener('scroll', checkImages.bind(this));
        window.addEventListener('resize', checkImages.bind(this));
        window.addEventListener('orientationchange', checkImages.bind(this));
        
        // Initial check
        checkImages.bind(this)();
    },
    
    // Check if element is in viewport
    isInViewport: function(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },
    
    // Initialize error handling for images
    initErrorHandling: function() {
        document.querySelectorAll('img').forEach(img => {
            img.addEventListener('error', (e) => {
                this.handleImageError(e.target);
            });
        });
    },
    
    // Handle image loading errors
    handleImageError: function(img) {
        if (!img) return;
        
        // Set fallback image
        img.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
        
        // Add error class
        img.classList.add('image-error');
        
        // Add retry functionality
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            const originalSrc = img.getAttribute('data-src') || img.getAttribute('data-original-src');
            if (originalSrc) {
                img.classList.remove('image-error');
                img.classList.add('image-loading');
                img.src = originalSrc;
            }
        });
    },
    
    // Initialize responsive image handling
    initResponsiveImages: function() {
        // Add responsive classes to images
        document.querySelectorAll('img').forEach(img => {
            img.classList.add('max-w-full', 'h-auto');
        });
        
        // Handle image aspect ratios
        document.querySelectorAll('.aspect-square img').forEach(img => {
            img.style.objectFit = 'cover';
        });
    },
    
    // Optimize product card images
    optimizeProductCardImages: function() {
        document.querySelectorAll('.product-card img').forEach(img => {
            this.optimizeImage(img);
        });
    },
    
    // Optimize a single image
    optimizeImage: function(img) {
        if (!img) return;
        
        // Store original source if not already stored
        if (!img.getAttribute('data-original-src') && img.src) {
            img.setAttribute('data-original-src', img.src);
        }
        
        // Set data-src for lazy loading if not already set
        if (!img.getAttribute('data-src') && img.src) {
            img.setAttribute('data-src', img.src);
            img.src = ''; // Clear src to enable lazy loading
        }
        
        // Add loading class
        img.classList.add('image-lazy');
    },
    
    // Update images when DOM changes (e.g., dynamic content loading)
    updateImages: function() {
        this.initLazyLoading();
        this.initErrorHandling();
        this.initResponsiveImages();
    }
};

// Add CSS for image loading and error states
const style = document.createElement('style');
style.textContent = `
    .image-lazy {
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
    }
    
    .image-loading {
        opacity: 0.5;
        background: linear-gradient(90deg, #16282c 25%, #101f22 50%, #16282c 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
    }
    
    .image-loaded {
        opacity: 1;
        transition: opacity 0.3s ease-in-out;
    }
    
    .image-error {
        opacity: 1;
        filter: grayscale(50%);
        transition: all 0.3s ease-in-out;
    }
    
    .image-error:hover {
        filter: grayscale(0%);
        transform: scale(1.05);
    }
    
    @keyframes loading {
        0% {
            background-position: 200% 0;
        }
        100% {
            background-position: -200% 0;
        }
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
    ImageOptimizer.init();
});

window.ImageOptimizer = ImageOptimizer;