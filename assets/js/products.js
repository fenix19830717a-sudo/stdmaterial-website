const ProductManager = {
    products: [],
    filteredProducts: [],
    currentPage: 1,
    itemsPerPage: 12,
    currentFilters: {
        category: '',
        material: '',
        search: ''
    },

    init: async function() {
        await this.loadProducts();
        this.initFilters();
        this.initSearch();
        this.renderProducts();
    },

    loadProducts: async function() {
        try {
            const response = await fetch('./data/products.json');
            const data = await response.json();
            this.products = data.products || [];
            this.filteredProducts = [...this.products];
            console.log(`Loaded ${this.products.length} products`);
        } catch (error) {
            console.error('Error loading products:', error);
        }
    },

    initFilters: function() {
        const categoryFilter = document.getElementById('category-filter');
        const materialFilter = document.getElementById('material-filter');
        
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.currentFilters.category = e.target.value;
                this.applyFilters();
            });
        }
        
        if (materialFilter) {
            materialFilter.addEventListener('change', (e) => {
                this.currentFilters.material = e.target.value;
                this.applyFilters();
            });
        }

        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filterType = e.target.dataset.filter;
                const filterValue = e.target.dataset.value;
                
                document.querySelectorAll(`.filter-btn[data-filter="${filterType}"]`).forEach(b => {
                    b.classList.remove('active');
                });
                e.target.classList.add('active');
                
                this.currentFilters[filterType] = filterValue;
                this.applyFilters();
            });
        });
    },

    initSearch: function() {
        const searchInput = document.getElementById('product-search');
        
        if (searchInput) {
            searchInput.addEventListener('input', GrindingEquipmentB2B.debounce((e) => {
                this.currentFilters.search = e.target.value.toLowerCase();
                this.applyFilters();
            }, 300));
        }
    },

    applyFilters: function() {
        this.filteredProducts = this.products.filter(product => {
            const matchesCategory = !this.currentFilters.category || 
                product.category.toLowerCase().includes(this.currentFilters.category.toLowerCase());
            
            const matchesMaterial = !this.currentFilters.material || 
                product.material.toLowerCase().includes(this.currentFilters.material.toLowerCase());
            
            const matchesSearch = !this.currentFilters.search || 
                product.name.toLowerCase().includes(this.currentFilters.search) ||
                product.description.toLowerCase().includes(this.currentFilters.search) ||
                product.id.toLowerCase().includes(this.currentFilters.search);
            
            return matchesCategory && matchesMaterial && matchesSearch;
        });
        
        this.currentPage = 1;
        this.renderProducts();
    },

    renderProducts: function() {
        const container = document.getElementById('products-grid');
        if (!container) return;

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const productsToShow = this.filteredProducts.slice(startIndex, endIndex);

        container.innerHTML = productsToShow.map(product => this.createProductCard(product)).join('');
        
        this.renderPagination();
        this.initProductCardEvents();
    },

    createProductCard: function(product) {
        const imageUrl = product.images && product.images.length > 0 
            ? product.images[0] 
            : 'https://via.placeholder.com/400x300?text=No+Image';
        
        const categoryClass = this.getCategoryClass(product.category);
        const materialLabel = this.getMaterialLabel(product.material);
        
        return `
            <div class="product-card group bg-background-dark rounded-xl border border-white/5 overflow-hidden hover:shadow-xl flex flex-col animate-on-scroll" data-product-id="${product.id}">
                <div class="relative aspect-square bg-secondary-dark overflow-hidden">
                    <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                         alt="${product.name}" 
                         src="${imageUrl}" 
                         loading="lazy">
                    <div class="absolute top-3 left-3 flex flex-col gap-2">
                        <span class="bg-primary text-background-dark text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">${product.category.toUpperCase()}</span>
                        <span class="bg-secondary-dark border border-primary/30 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">${materialLabel}</span>
                    </div>
                    ${product.stock === 'Limited Stock' ? '<span class="absolute top-3 right-3 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">LIMITED</span>' : ''}
                </div>
                <div class="p-5 flex-1 flex flex-col">
                    <div class="mb-3">
                        <span class="text-[10px] font-mono text-primary font-bold tracking-widest">SKU: ${product.id}</span>
                        <h3 class="text-lg font-bold mt-1 group-hover:text-primary transition-colors leading-tight text-white">${product.name}</h3>
                    </div>
                    <div class="space-y-2 mb-6">
                        <div class="flex justify-between text-xs py-1 border-b border-white/5">
                            <span class="text-slate-400">Working Volume</span>
                            <span class="font-medium text-white">${product.volume}</span>
                        </div>
                        <div class="flex justify-between text-xs py-1 border-b border-white/5">
                            <span class="text-slate-400">Material</span>
                            <span class="font-medium text-white">${product.material}</span>
                        </div>
                        <div class="flex justify-between text-xs py-1 border-b border-white/5">
                            <span class="text-slate-400">Purity</span>
                            <span class="font-medium text-white">${product.purity}</span>
                        </div>
                    </div>
                    <button class="w-full py-2.5 bg-primary text-background-dark font-bold rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 mt-auto group view-product-btn" data-product-id="${product.id}">
                        <span>View Details</span>
                        <span class="material-icons text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </button>
                </div>
            </div>
        `;
    },

    getCategoryClass: function(category) {
        const classes = {
            'Grinding Jars': 'jar',
            'Grinding Media': 'media',
            'Equipment': 'equipment',
            'Accessories': 'accessories'
        };
        return classes[category] || 'default';
    },

    getMaterialLabel: function(material) {
        if (material.includes('Alumina')) return 'ALUMINA';
        if (material.includes('Zirconia')) return 'ZIRCONIA';
        if (material.includes('Stainless')) return 'STAINLESS STEEL';
        if (material.includes('Tungsten')) return 'TUNGSTEN CARBIDE';
        if (material.includes('Titanium')) return 'TITANIUM';
        if (material.includes('PTFE')) return 'PTFE';
        if (material.includes('Nylon')) return 'NYLON';
        if (material.includes('PU')) return 'POLYURETHANE';
        if (material.includes('HDPE')) return 'HDPE';
        if (material.includes('Agate')) return 'AGATE';
        if (material.includes('Silicon Nitride')) return 'SILICON NITRIDE';
        if (material.includes('Hastelloy')) return 'HASTELLOY';
        return material.toUpperCase().substring(0, 15);
    },

    renderPagination: function() {
        const paginationContainer = document.getElementById('pagination');
        if (!paginationContainer) return;

        const totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
        
        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }

        let paginationHTML = '';
        
        paginationHTML += `
            <button class="pagination-btn" ${this.currentPage === 1 ? 'disabled' : ''} data-page="${this.currentPage - 1}">
                <span class="material-icons">chevron_left</span>
            </button>
        `;

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
                paginationHTML += `
                    <button class="pagination-btn ${i === this.currentPage ? 'active' : ''}" data-page="${i}">
                        ${i}
                    </button>
                `;
            } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
                paginationHTML += '<span class="pagination-ellipsis">...</span>';
            }
        }

        paginationHTML += `
            <button class="pagination-btn" ${this.currentPage === totalPages ? 'disabled' : ''} data-page="${this.currentPage + 1}">
                <span class="material-icons">chevron_right</span>
            </button>
        `;

        paginationContainer.innerHTML = paginationHTML;
        
        paginationContainer.querySelectorAll('.pagination-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const page = parseInt(e.currentTarget.dataset.page);
                if (page && page !== this.currentPage) {
                    this.currentPage = page;
                    this.renderProducts();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        });
    },

    initProductCardEvents: function() {
        document.querySelectorAll('.view-product-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.currentTarget.dataset.productId;
                this.viewProduct(productId);
            });
        });
    },

    viewProduct: function(productId) {
        window.location.href = `product-detail.html?id=${productId}`;
    },

    getProductById: function(productId) {
        return this.products.find(p => p.id === productId);
    },

    getRelatedProducts: function(productId, limit = 4) {
        const product = this.getProductById(productId);
        if (!product) return [];
        
        return this.products
            .filter(p => p.id !== productId && p.category === product.category)
            .slice(0, limit);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('products-grid')) {
        ProductManager.init();
    }
});

window.ProductManager = ProductManager;
