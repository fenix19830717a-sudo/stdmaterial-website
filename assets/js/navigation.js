function toggleMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('hidden');
    }
}

function toggleTechToolsMenu() {
    const techToolsSubmenu = document.querySelector('.tech-tools-submenu');
    if (techToolsSubmenu) {
        techToolsSubmenu.classList.toggle('hidden');
    }
}

function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('#specifications, #applications, #documentation');
    const tabIndicator = document.querySelector('.tab-indicator');
    
    if (tabButtons.length > 0 && tabIndicator) {
        // Initialize indicator position
        const activeButton = document.querySelector('.tab-btn.active');
        if (activeButton) {
            updateIndicatorPosition(activeButton, tabIndicator);
        }
        
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                tabButtons.forEach(btn => {
                    btn.classList.remove('active', 'text-white');
                    btn.classList.add('text-text-secondary');
                });
                
                // Add active class to clicked button
                this.classList.add('active', 'text-white');
                this.classList.remove('text-text-secondary');
                
                // Update indicator position
                updateIndicatorPosition(this, tabIndicator);
                
                // Hide all tab contents
                tabContents.forEach(content => {
                    if (content) content.classList.add('hidden');
                });
                
                // Show the corresponding tab content
                const tabId = this.dataset.tab;
                const targetContent = document.getElementById(tabId);
                if (targetContent) {
                    targetContent.classList.remove('hidden');
                }
            });
        });
    }
}

function updateIndicatorPosition(button, indicator) {
    const rect = button.getBoundingClientRect();
    const parentRect = button.parentElement.getBoundingClientRect();
    
    indicator.style.left = `${rect.left - parentRect.left}px`;
    indicator.style.width = `${rect.width}px`;
}

document.addEventListener('DOMContentLoaded', function() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && (currentPath.includes(href) || (currentPath === '/' && href === 'index.html'))) {
            link.classList.add('text-primary');
            link.classList.remove('text-text-secondary');
        }
    });
    
    // Setup tab navigation for product detail page
    setupTabNavigation();
});
