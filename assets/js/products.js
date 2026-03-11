/**
 * Product Manager - Product catalog with filtering and pagination
 * Fixed version for stdmaterial.com
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
        equipment: ''
    },
    
    init: async function() {
        await this.loadProducts();
        this.initFilters();
        this.initSearch();
        this.renderProducts();
    },
    
    loadProducts: async function() {
        try {
            // Try API first, fallback to local JSON
            let data;
            try {
                const response = await fetch('/api/products');
                data = await response.json();
            } catch (apiError) {
                console.log('API not available, using local data');
                const response = await fetch('/assets/data/products.json');
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
        } catch (error) {
            console.error('Error loading products:', error);
            this.products = [];
            this.filteredProducts = [];
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
        
        // Get category display name
        const categoryMap = {
            'grinding-series': '研磨系列',
            'broken-series': '破碎系列',
            'screening-series': '筛分系列',
            'research-equipment': '实验设备',
            'mixed-series': '混合系列',
            'glovebox': '手套箱',
            'Crushing Series': '破碎系列',
            'Grinding Jars': '研磨配件',
            'Planetary Ball Mills': '行星球磨机',
            'Roller Ball Mills': '滚筒球磨机',
            'Stirring Ball Mills': '搅拌球磨机',
            'Vibration Ball Mills': '振动球磨机',
            'Sand Mills': '砂磨机',
            'Large Grinding Equipment': '大型研磨设备',
            'Screening Series': '筛分系列',
            'Mixing Series': '混合系列',
            'Press Forming': '压制成型',
            'Sintering Series': '烧结系列',
            'Glove Box Series': '手套箱系列',
            'Research Equipment': '科研设备'
        };
        
        return {
            ...product,
            id: product.id || product.slug, // Use id or slug as ID
            material: material,
            equipment: equipment,
            volume: volume,
            images: [imageUrl],
            categoryLabel: categoryMap[product.category] || product.category,
            purity: '99.9%' // Default purity
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
        const applyMobileBtn = document.querySelector('#mobile-filter-panel button');
        if (applyMobileBtn && applyMobileBtn.textContent.includes('应用')) {
            applyMobileBtn.addEventListener('click', () => {
                self.applyFilters();
                // Hide mobile panel
                document.getElementById('mobile-filter-panel')?.classList.add('hidden');
            });
        }
    },
    
    resetFilters: function() {
        this.currentFilters = { category: '', material: '', search: '', equipment: '' };
        
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
        document.querySelectorAll('input[type="radio"]').forEach(radio => radio.checked = false);
        
        this.currentPage = 1;
        this.filteredProducts = [...this.products];
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
    
    applyFilters: function() {
        const self = this;
        
        // Get selected materials from checkboxes
        const selectedMaterials = [];
        document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
            const label = checkbox.nextElementSibling?.textContent?.trim();
            if (label) {
                if (label.includes('陶瓷')) selectedMaterials.push('Ceramic', 'Alumina', 'Zirconia');
                if (label.includes('金属')) selectedMaterials.push('Stainless', 'Tungsten');
                if (label.includes('塑料')) selectedMaterials.push('Nylon', 'PTFE');
                if (label.includes('天然')) selectedMaterials.push('Agate');
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
                if (selectedVolume.includes('10ml') && volumeNum > 50) return false;
                if (selectedVolume.includes('100ml') && (volumeNum < 100 || volumeNum > 1000)) return false;
                if (selectedVolume.includes('2L') && volumeNum < 2000) return false;
            }
            
            // Equipment filter
            if (selectedEquipment) {
                const productEquipment = product.equipment || [];
                const hasMatch = productEquipment.some(eq => {
                    const eqLower = eq.toLowerCase();
                    if (selectedEquipment === '行星式') return eqLower.includes('planetary');
                    if (selectedEquipment === '搅拌式') return eqLower.includes('stir') || eqLower.includes('sand');
                    if (selectedEquipment === '振动式') return eqLower.includes('vibration');
                    if (selectedEquipment === '气流式') return eqLower.includes('air') || eqLower.includes('drum');
                    return false;
                });
                if (!hasMatch) return false;
            }
            
            return true;
        });
        
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
                    <p class="text-slate-400">没有找到符合条件的产品</p>
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
            <div class="product-card group bg-surface-dark rounded-xl border border-white/5 overflow-hidden hover:shadow-xl flex flex-col" data-product-id="${product.id}">
                <div class="relative aspect-square bg-deep-navy overflow-hidden">
                    <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        alt="${product.name}"
                        src="${imageUrl}"
                        loading="lazy"
                        onerror="this.src='https://via.placeholder.com/400x300?text=Image+Not+Available'">
                    <div class="absolute top-3 left-3 flex flex-col gap-2">
                        <span class="bg-primary text-background-dark text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">${categoryLabel.toUpperCase()}</span>
                        ${materialLabel ? `<span class="bg-deep-navy border border-primary/30 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">${materialLabel}</span>` : ''}
                    </div>
                </div>
                <div class="p-5 flex-1 flex flex-col">
                    <div class="mb-3">
                        <span class="text-[10px] font-mono text-primary font-bold tracking-widest">SKU: ${product.id || product.slug?.split('/').pop() || 'N/A'}</span>
                        <h3 class="text-lg font-bold mt-1 group-hover:text-primary transition-colors leading-tight text-white">${product.name}</h3>
                    </div>
                    <p class="text-xs text-slate-400 mb-4 line-clamp-2">${product.description?.substring(0, 100) || ''}...</p>
                    <div class="space-y-2 mb-6">
                        ${product.volume ? `
                        <div class="flex justify-between text-xs py-1 border-b border-white/5">
                            <span class="text-slate-400">容量</span>
                            <span class="font-medium text-white">${product.volume}</span>
                        </div>` : ''}
                        ${product.material ? `
                        <div class="flex justify-between text-xs py-1 border-b border-white/5">
                            <span class="text-slate-400">材质</span>
                            <span class="font-medium text-white">${product.material}</span>
                        </div>` : ''}
                    </div>
                    <button class="w-full py-2.5 bg-primary text-background-dark font-bold rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 mt-auto group view-product-btn"
                        data-product-id="${product.id}">
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
            'Alumina': '陶瓷',
            'Zirconia': '陶瓷',
            'Ceramic': '陶瓷',
            'Stainless Steel': '金属',
            'Tungsten Carbide': '金属',
            'Nylon': '塑料',
            'PTFE': '塑料',
            'Agate': '天然'
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
