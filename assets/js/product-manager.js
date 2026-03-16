/**
 * Product Manager - Core module for managing product data
 * Handles product data loading, filtering, and management
 */
const ProductManager = {
    products: [],
    filteredProducts: [],
    currentPage: 1,
    itemsPerPage: 12,
    currentFilters: {
        category: '',
        material: '',
        search: '',
        equipment: '',
        sort: 'recommended'
    },
    isLoading: false,
    
    init: async function() {
        await this.loadProducts();
        this.initFilters();
        this.initSearch();
        this.initSorting();
        this.renderProducts();
    },
    
    loadProducts: async function() {
        try {
            this.isLoading = true;
            
            // Try API first, fallback to local JSON
            let data;
            try {
                const response = await fetch('/api/products');
                data = await response.json();
            } catch (apiError) {
                console.log('API not available, using local data');
                const response = await fetch('assets/data/products.json');
                data = await response.json();
            }
            
            // Handle different data formats and remove duplicates by slug
            let products = (data.data && data.data.products) ? data.data.products : (data.products || data);
            
            // Remove duplicates based on slug
            const seenSlugs = new Set();
            this.products = products.filter(p => {
                if (seenSlugs.has(p.slug)) return false;
                seenSlugs.add(p.slug);
                return true;
            });
            
            // Enrich product data with derived fields
            this.products = this.products.map(p => this.enrichProduct(p));
            
            this.filteredProducts = [...this.products];
            console.log(`Loaded ${this.products.length} unique products`);
            
            this.isLoading = false;
        } catch (error) {
            console.error('Error loading products:', error);
            this.products = [];
            this.filteredProducts = [];
            this.isLoading = false;
        }
    },
    
    // Enrich product with derived fields for filtering and display
    enrichProduct: function(product) {
        const name = product.name || '';
        const desc = product.description || '';
        const slug = product.slug || '';
        
        // Derive material from name/description
        let material = '';
        if (name.includes('氧化锆') || desc.includes('氧化锆')) material = 'Zirconia';
        else if (name.includes('氧化铝') || desc.includes('氧化铝') || name.includes('刚玉')) material = 'Alumina';
        else if (name.includes('玛瑙') || desc.includes('玛瑙')) material = 'Agate';
        else if (name.includes('不锈钢') || desc.includes('不锈钢')) material = 'Stainless Steel';
        else if (name.includes('聚四氟乙烯') || name.includes('PTFE')) material = 'PTFE';
        else if (name.includes('硬质合金') || name.includes('钨钢')) material = 'Tungsten Carbide';
        else if (name.includes('陶瓷')) material = 'Ceramic';
        else if (name.includes('尼龙')) material = 'Nylon';
        
        // Derive equipment type from slug/name
        let equipment = [];
        if (slug.includes('planetary') || name.includes('行星')) equipment.push('Planetary');
        if (slug.includes('drum') || name.includes('滚筒')) equipment.push('Drum');
        if (slug.includes('sand') || name.includes('砂磨')) equipment.push('Sand Mill');
        if (slug.includes('vibration') || name.includes('振动')) equipment.push('Vibration');
        if (slug.includes('crusher') || name.includes('破碎') || name.includes('粉碎')) equipment.push('Crusher');
        if (slug.includes('screen') || name.includes('筛')) equipment.push('Screening');
        if (name.includes('研磨球') || name.includes('grinding-ball')) equipment.push('Grinding Media');
        if (name.includes('球磨罐') || name.includes('mill-jar')) equipment.push('Grinding Jar');
        
        // Derive volume from name if present
        let volume = '';
        const volumeMatch = name.match(/(\d+)\s*(ml|L)/i);
        if (volumeMatch) volume = volumeMatch[0];
        
        // Get image URL - handle both old and new data formats
        let imageUrl = 'https://via.placeholder.com/400x300?text=No+Image';
        if (product.images && product.images.length > 0) {
            imageUrl = product.images[0];
        } else if (product.image_url) {
            imageUrl = product.image_url;
        } else if (product.local_image) {
            imageUrl = product.local_image;
        }
        
        // Ensure image URL is absolute or correct relative path
        if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('https')) {
            // If path starts with /, it's absolute from root
            if (imageUrl.startsWith('/')) {
                imageUrl = imageUrl;
            } else {
                // Otherwise, make it relative to the current directory
                imageUrl = 'assets/images/products/' + imageUrl;
            }
        }
        
        // Get category display name
        const categoryMap = {
            'grinding-series': 'Grinding Series',
            'broken-series': 'Crushing Series',
            'screening-series': 'Screening Series',
            'research-equipment': 'Research Equipment',
            'mixed-series': 'Mixing Series',
            'glovebox': 'Glove Box',
            'Crushing Series': 'Crushing Series',
            'Grinding Jars': 'Grinding Accessories',
            'Planetary Ball Mills': 'Planetary Ball Mills',
            'Roller Ball Mills': 'Roller Ball Mills',
            'Stirring Ball Mills': 'Stirring Ball Mills',
            'Vibration Ball Mills': 'Vibration Ball Mills',
            'Sand Mills': 'Sand Mills',
            'Large Grinding Equipment': 'Large Grinding Equipment',
            'Screening Series': 'Screening Series',
            'Mixing Series': 'Mixing Series',
            'Press Forming': 'Press Forming',
            'Sintering Series': 'Sintering Series',
            'Glove Box Series': 'Glove Box Series',
            'Research Equipment': 'Research Equipment'
        };
        
        return {
            ...product,
            id: product.id || product.slug,
            material: material,
            equipment: equipment,
            volume: volume,
            images: [imageUrl],
            categoryLabel: categoryMap[product.category] || product.category,
            purity: '99.9%'
        };
    },
    
    initFilters: function() {
        const self = this;
        
        // Filter buttons - equipment type
        document.querySelectorAll('.filter-btn[data-filter="equipment"]').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const filterValue = this.dataset.value;
                
                // Toggle active state
                document.querySelectorAll('.filter-btn[data-filter="equipment"]').forEach(b => {
                    b.classList.remove('active');
                });
                
                if (self.currentFilters.equipment === filterValue) {
                    // Deselect if clicking same button
                    self.currentFilters.equipment = '';
                } else {
                    this.classList.add('active');
                    self.currentFilters.equipment = filterValue;
                }
                
                self.currentPage = 1;
                self.applyFilters();
            });
        });
        
        // Category filter from checkboxes
        document.querySelectorAll('input[type="checkbox"]').forEach(input => {
            input.addEventListener('change', () => {
                self.currentPage = 1;
                self.applyFilters();
            });
        });
        
        // Volume filter from radios
        document.querySelectorAll('input[type="radio"][name="vol"]').forEach(input => {
            input.addEventListener('change', () => {
                self.currentPage = 1;
                self.applyFilters();
            });
        });
        
        // Reset buttons
        const resetBtn = document.getElementById('reset-filters');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetFilters());
        }
        
        const resetMobileBtn = document.getElementById('reset-filters-mobile');
        if (resetMobileBtn) {
            resetMobileBtn.addEventListener('click', () => this.resetFilters());
        }
        
        // Mobile apply button
        const applyMobileBtn = document.getElementById('apply-filters-mobile');
        if (applyMobileBtn) {
            applyMobileBtn.addEventListener('click', () => {
                self.applyFilters();
                // Hide mobile panel
                document.getElementById('mobile-filter-panel')?.classList.add('hidden');
            });
        }
    },
    
    resetFilters: function() {
        this.currentFilters = { category: '', material: '', search: '', equipment: '', sort: 'recommended' };
        
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
        document.querySelectorAll('input[type="radio"]').forEach(radio => radio.checked = false);
        
        // Reset sort select
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.value = 'recommended';
        }
        
        this.currentPage = 1;
        this.filteredProducts = [...this.products];
        this.filteredProducts = this.sortProducts(this.filteredProducts);
        this.renderProducts();
    },
    
    initSearch: function() {
        const searchInput = document.getElementById('global-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentFilters.search = e.target.value.toLowerCase();
                this.currentPage = 1;
                this.applyFilters();
            });
        }
    },
    
    initSorting: function() {
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentFilters.sort = e.target.value;
                this.currentPage = 1;
                this.applyFilters();
            });
        }
    },
    
    sortProducts: function(products) {
        const sortBy = this.currentFilters.sort;
        
        return [...products].sort((a, b) => {
            switch (sortBy) {
                case 'price-asc':
                    return (a.price || 0) - (b.price || 0);
                case 'price-desc':
                    return (b.price || 0) - (a.price || 0);
                case 'newest':
                    const dateA = new Date(a.created_at || 0);
                    const dateB = new Date(b.created_at || 0);
                    return dateB - dateA;
                case 'popular':
                    return (b.popularity || 0) - (a.popularity || 0);
                case 'recommended':
                default:
                    // Default sorting by name
                    return (a.name || '').localeCompare(b.name || '');
            }
        });
    },
    
    applyFilters: function() {
        const self = this;
        
        // Get selected materials from checkboxes
        const selectedMaterials = [];
        document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
            const label = checkbox.nextElementSibling?.textContent?.trim();
            if (label) {
                if (label.includes('Ceramic')) selectedMaterials.push('Ceramic', 'Alumina', 'Zirconia');
                if (label.includes('Metal')) selectedMaterials.push('Stainless', 'Tungsten');
                if (label.includes('Plastic')) selectedMaterials.push('Nylon', 'PTFE');
                if (label.includes('Natural')) selectedMaterials.push('Agate');
            }
        });
        
        // Get selected volume
        let selectedVolume = '';
        document.querySelectorAll('input[type="radio"][name="vol"]:checked').forEach(radio => {
            selectedVolume = radio.nextElementSibling?.textContent?.trim();
        });
        
        // Get selected equipment type
        const selectedEquipment = this.currentFilters.equipment;
        
        // Apply filters
        this.filteredProducts = this.products.filter(product => {
            // Search filter
            if (this.currentFilters.search) {
                const searchTerm = this.currentFilters.search.toLowerCase();
                const name = (product.name || '').toLowerCase();
                const desc = (product.description || '').toLowerCase();
                const slug = (product.slug || '').toLowerCase();
                if (!name.includes(searchTerm) && !desc.includes(searchTerm) && !slug.includes(searchTerm)) {
                    return false;
                }
            }
            
            // Material filter
            if (selectedMaterials.length > 0) {
                const productMaterial = (product.material || '').toLowerCase();
                const hasMatch = selectedMaterials.some(m => productMaterial.includes(m.toLowerCase()));
                if (!hasMatch) return false;
            }
            
            // Volume filter
            if (selectedVolume) {
                const productVolume = product.volume || '';
                const volumeNum = parseInt(productVolume);
                // Only filter if volume is available
                if (!isNaN(volumeNum)) {
                    if (selectedVolume.includes('10ml') && volumeNum > 50) return false;
                    if (selectedVolume.includes('100ml') && (volumeNum < 100 || volumeNum > 1000)) return false;
                    if (selectedVolume.includes('2L') && volumeNum < 2000) return false;
                }
            }
            
            // Equipment filter
            if (selectedEquipment) {
                const productEquipment = product.equipment || [];
                const hasMatch = productEquipment.some(eq => {
                    const eqLower = eq.toLowerCase();
                    if (selectedEquipment === 'Planetary') return eqLower.includes('planetary');
                    if (selectedEquipment === 'Stirred') return eqLower.includes('stir') || eqLower.includes('sand');
                    if (selectedEquipment === 'Vibration') return eqLower.includes('vibration');
                    if (selectedEquipment === 'Airflow') return eqLower.includes('air') || eqLower.includes('drum');
                    return false;
                });
                if (!hasMatch) return false;
            }
            
            return true;
        });
        
        // Apply sorting
        this.filteredProducts = this.sortProducts(this.filteredProducts);
        
        this.renderProducts();
    },
    
    renderProducts: function() {
        const container = document.getElementById('products-grid');
        const countEl = document.getElementById('product-count');
        if (!container) return;
        
        // Update count
        if (countEl) {
            countEl.textContent = this.filteredProducts.length;
        }
        
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const productsToShow = this.filteredProducts.slice(startIndex, endIndex);
        
        if (productsToShow.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <span class="material-symbols-outlined text-4xl text-slate-500 mb-4">inventory_2</span>
                    <p class="text-slate-400">No products found matching your criteria</p>
                </div>
            `;
        } else {
            container.innerHTML = productsToShow.map(product => this.createProductCard(product)).join('');
        }
        
        this.renderPagination();
        this.initProductCardEvents();
    },
    
    createProductCard: function(product) {
        const imageUrl = product.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image';
        const materialLabel = this.getMaterialLabel(product.material);
        const categoryLabel = product.categoryLabel || product.category || 'PRODUCT';
        
        return `
            <div class="product-card group bg-surface-dark rounded-xl border border-white/5 overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all duration-300 flex flex-col" data-product-id="${product.slug}">
                <div class="relative aspect-square bg-deep-navy overflow-hidden">
                    <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 image-lazy"
                        alt="${product.name}"
                        data-src="${imageUrl}"
                        loading="lazy">
                    <div class="absolute top-3 left-3 flex flex-col gap-2">
                        <span class="bg-primary text-background-dark text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">${categoryLabel.toUpperCase()}</span>
                        ${materialLabel ? `<span class="bg-deep-navy border border-primary/30 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">${materialLabel}</span>` : ''}
                    </div>
                    <div class="absolute inset-0 bg-gradient-to-t from-background-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                        <div class="p-4 w-full">
                            <p class="text-xs text-white line-clamp-2">${product.description?.substring(0, 80) || ''}...</p>
                        </div>
                    </div>
                </div>
                <div class="p-5 flex-1 flex flex-col">
                    <div class="mb-3">
                        <span class="text-[10px] font-mono text-primary font-bold tracking-widest">SKU: ${product.slug?.split('/').pop() || 'N/A'}</span>
                        <h3 class="text-lg font-bold mt-1 group-hover:text-primary transition-colors leading-tight text-white">${product.name}</h3>
                    </div>
                    <div class="space-y-2 mb-6">
                        ${product.volume ? `
                        <div class="flex justify-between text-xs py-1 border-b border-white/5">
                            <span class="text-slate-400">容量</span>
                            <span class="font-medium text-white">${product.volume}</span>
                        </div>` : ''}
                        ${product.material ? `
                        <div class="flex justify-between text-xs py-1 border-b border-white/5">
                            <span class="text-slate-400">材料</span>
                            <span class="font-medium text-white">${product.material}</span>
                        </div>` : ''}
                        ${product.purity ? `
                        <div class="flex justify-between text-xs py-1 border-b border-white/5">
                            <span class="text-slate-400">纯度</span>
                            <span class="font-medium text-white">${product.purity}</span>
                        </div>` : ''}
                    </div>
                    <button class="w-full py-2.5 bg-primary text-background-dark font-bold rounded-lg hover:bg-primary/90 hover:shadow-[0_0_15px_rgba(19,200,236,0.3)] transition-all duration-300 flex items-center justify-center gap-2 mt-auto group view-product-btn"
                        data-product-id="${product.slug}">
                        <span>查看详情</span>
                        <span class="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </button>
                </div>
            </div>
        `;
    },
    
    getMaterialLabel: function(material) {
        if (!material) return '';
        const labels = {
            'Alumina': 'Ceramic',
            'Zirconia': 'Ceramic',
            'Ceramic': 'Ceramic',
            'Stainless Steel': 'Metal',
            'Tungsten Carbide': 'Metal',
            'Nylon': 'Plastic',
            'PTFE': 'Plastic',
            'Agate': 'Natural'
        };
        return labels[material] || '';
    },
    
    renderPagination: function() {
        const container = document.getElementById('pagination');
        if (!container) return;
        
        const totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
        if (totalPages <= 1) {
            container.innerHTML = '';
            return;
        }
        
        let paginationHTML = '<div class="flex items-center gap-2">';
        
        // Previous
        paginationHTML += `
            <button class="pagination-btn w-10 h-10 rounded-lg flex items-center justify-center transition-all ${this.currentPage === 1 ? 'bg-surface-dark text-slate-500 cursor-not-allowed' : 'bg-surface-dark text-white hover:bg-primary hover:text-deep-navy'}"
                ${this.currentPage === 1 ? 'disabled' : ''} data-page="${this.currentPage - 1}">
                <span class="material-symbols-outlined text-sm">chevron_left</span>
            </button>
        `;
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
                paginationHTML += `
                    <button class="pagination-btn w-10 h-10 rounded-lg font-medium transition-all ${i === this.currentPage ? 'bg-primary text-deep-navy' : 'bg-surface-dark text-white hover:bg-primary/20'}"
                        data-page="${i}">${i}</button>
                `;
            } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
                paginationHTML += '<span class="text-slate-500 px-2">...</span>';
            }
        }
        
        // Next
        paginationHTML += `
            <button class="pagination-btn w-10 h-10 rounded-lg flex items-center justify-center transition-all ${this.currentPage === totalPages ? 'bg-surface-dark text-slate-500 cursor-not-allowed' : 'bg-surface-dark text-white hover:bg-primary hover:text-deep-navy'}"
                ${this.currentPage === totalPages ? 'disabled' : ''} data-page="${this.currentPage + 1}">
                <span class="material-symbols-outlined text-sm">chevron_right</span>
            </button>
        `;
        
        paginationHTML += '</div>';
        container.innerHTML = paginationHTML;
        
        // Bind events
        const self = this;
        container.querySelectorAll('.pagination-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const page = parseInt(this.dataset.page);
                if (page && page !== self.currentPage) {
                    self.currentPage = page;
                    self.renderProducts();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        });
    },
    
    initProductCardEvents: function() {
        document.querySelectorAll('.view-product-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.currentTarget.dataset.productId;
                if (productId) {
                    window.location.href = `product-detail.html?id=${encodeURIComponent(productId)}`;
                }
            });
        });
        
        // Optimize images after rendering
        if (window.ImageOptimizer) {
            window.ImageOptimizer.updateImages();
        }
    },
    
    getProductById: function(productId) {
        return this.products.find(p => p.id === productId || p.slug === productId);
    },
    
    getRelatedProducts: function(productId, limit = 4) {
        const product = this.getProductById(productId);
        if (!product) return [];
        return this.products.filter(p => p.id !== productId && p.category === product.category).slice(0, limit);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('products-grid')) {
        ProductManager.init();
    }
});

window.ProductManager = ProductManager;