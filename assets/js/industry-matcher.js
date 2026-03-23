class IndustryMatcher {
    constructor() {
        this.products = [];
        this.industries = [];
        this.selectedIndustry = null;
        this.init();
    }
    
    async init() {
        await this.loadProducts();
        this.extractIndustries();
        this.renderIndustries();
        this.setupEventListeners();
    }
    
    async loadProducts() {
        try {
            const response = await fetch('data/products.json');
            const data = await response.json();
            this.products = data.products || [];
        } catch (error) {
            console.error('Error loading products:', error);
            this.loadSampleData();
        }
    }
    
    loadSampleData() {
        this.products = [
            {
                id: 'sample-1',
                nameEn: 'Planetary Ball Mill 4L',
                name: '行星球磨机4L',
                category: 'Planetary Ball Mills',
                applications: ['Nanomaterials', 'Ceramics', 'Battery Materials'],
                price: 'Contact for Quote',
                images: ['assets/images/products/PL-360-196.jpg'],
                descriptionEn: 'Professional planetary ball mill for nano-material grinding'
            },
            {
                id: 'sample-2',
                nameEn: 'Zirconia Grinding Jar',
                name: '氧化锆球磨罐',
                category: 'Grinding Jars',
                applications: ['Laboratory', 'Ceramics', 'Pharmaceuticals'],
                price: 'Contact for Quote',
                images: ['assets/images/products/gj-al-500.jpg'],
                descriptionEn: 'High quality zirconia grinding jar for anti-contamination'
            },
            {
                id: 'sample-3',
                nameEn: 'Laboratory Jaw Crusher',
                name: '实验颚式破碎机',
                category: 'Crushing Series',
                applications: ['Mining', 'Chemical Industry', 'Materials Research'],
                price: 'Contact for Quote',
                images: ['assets/images/products/gm-ss-8.jpg'],
                descriptionEn: 'Professional jaw crusher for laboratory use'
            }
        ];
    }
    
    extractIndustries() {
        const industrySet = new Set();
        
        this.products.forEach(product => {
            if (product.applications && Array.isArray(product.applications)) {
                product.applications.forEach(app => {
                    industrySet.add(app.trim());
                });
            }
        });
        
        this.industries = Array.from(industrySet).sort();
        
        if (this.industries.length === 0) {
            this.industries = [
                'Nanomaterials',
                'Ceramics',
                'Battery Materials',
                'Mining',
                'Chemical Industry',
                'Materials Research',
                'Laboratory',
                'Pharmaceuticals',
                'Electronics',
                'Metallurgy'
            ];
        }
    }
    
    getIndustryIcon(industry) {
        const icons = {
            'Nanomaterials': 'science',
            'Ceramics': 'palette',
            'Battery Materials': 'battery_full',
            'Mining': 'terrain',
            'Chemical Industry': 'science',
            'Materials Research': 'search',
            'Laboratory': 'science',
            'Pharmaceuticals': 'medical_services',
            'Electronics': 'memory',
            'Metallurgy': 'factory',
            'default': 'work'
        };
        
        return icons[industry] || icons['default'];
    }
    
    renderIndustries() {
        const grid = document.getElementById('industry-grid');
        if (!grid) return;
        
        grid.innerHTML = this.industries.map(industry => `
            <div class="industry-card glass-panel rounded-xl p-6 border border-white/10 cursor-pointer hover:border-primary transition-all" 
                 data-industry="${industry}">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span class="material-symbols-outlined text-primary text-2xl">${this.getIndustryIcon(industry)}</span>
                    </div>
                    <div>
                        <h3 class="font-bold text-white text-lg">${industry}</h3>
                        <p class="text-text-secondary text-sm">
                            ${this.getProductCountForIndustry(industry)} products available
                        </p>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    getProductCountForIndustry(industry) {
        return this.products.filter(product => 
            product.applications && product.applications.includes(industry)
        ).length;
    }
    
    getRecommendedProducts(industry) {
        const matchingProducts = this.products.filter(product => 
            product.applications && product.applications.includes(industry)
        );
        
        return matchingProducts.sort((a, b) => {
            const aCount = a.applications ? a.applications.length : 0;
            const bCount = b.applications ? b.applications.length : 0;
            return bCount - aCount;
        }).slice(0, 9);
    }
    
    renderProducts(products, industry) {
        const grid = document.getElementById('products-grid');
        const industryName = document.getElementById('selected-industry-name');
        const recommendationsSection = document.getElementById('recommendations-section');
        
        if (!grid || !industryName || !recommendationsSection) return;
        
        industryName.textContent = industry;
        
        if (products.length === 0) {
            grid.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <span class="material-symbols-outlined text-6xl text-text-muted mb-4">inbox</span>
                    <p class="text-text-secondary text-lg">No products found for this industry</p>
                </div>
            `;
        } else {
            grid.innerHTML = products.map(product => {
                const productName = product.nameEn || product.name;
                const productImage = (product.images && product.images[0]) || 'https://via.placeholder.com/400x300/ffffff/06b6d4?text=Product';
                const productCategory = product.category || 'Industrial Equipment';
                
                return `
                    <div class="card overflow-hidden">
                        <div class="product-image-container h-48">
                            <img src="${productImage}" alt="${productName}" 
                                 class="w-full h-full object-contain p-4"
                                 onerror="this.src='https://via.placeholder.com/400x300/ffffff/06b6d4?text=Product'">
                        </div>
                        <div class="p-6">
                            <p class="text-xs text-primary font-semibold uppercase tracking-wider mb-2">${productCategory}</p>
                            <h3 class="font-bold text-white text-lg mb-2 line-clamp-2">${productName}</h3>
                            <p class="text-text-secondary text-sm mb-4 line-clamp-2">${product.descriptionEn || product.description || ''}</p>
                            ${product.applications ? `
                                <div class="flex flex-wrap gap-2 mb-4">
                                    ${product.applications.slice(0, 3).map(app => `
                                        <span class="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">${app}</span>
                                    `).join('')}
                                </div>
                            ` : ''}
                            <div class="flex items-center justify-between">
                                <span class="text-primary font-bold">${product.price || 'Contact for Quote'}</span>
                                <button class="btn-primary text-sm py-2 px-4">
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }
        
        recommendationsSection.classList.remove('hidden');
        recommendationsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    setupEventListeners() {
        const industryGrid = document.getElementById('industry-grid');
        if (industryGrid) {
            industryGrid.addEventListener('click', (e) => {
                const card = e.target.closest('.industry-card');
                if (card) {
                    const industry = card.dataset.industry;
                    this.selectIndustry(industry, card);
                }
            });
        }
        
        const resetBtn = document.getElementById('reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetSelection());
        }
    }
    
    selectIndustry(industry, cardElement) {
        document.querySelectorAll('.industry-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        cardElement.classList.add('selected');
        this.selectedIndustry = industry;
        
        const recommendedProducts = this.getRecommendedProducts(industry);
        this.renderProducts(recommendedProducts, industry);
    }
    
    resetSelection() {
        document.querySelectorAll('.industry-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        const recommendationsSection = document.getElementById('recommendations-section');
        if (recommendationsSection) {
            recommendationsSection.classList.add('hidden');
        }
        
        this.selectedIndustry = null;
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.industryMatcher = new IndustryMatcher();
});
