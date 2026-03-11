/**
 * News Manager - Article listing with pagination
 */
const NewsManager = {
    articles: [],
    filteredArticles: [],
    currentPage: 1,
    itemsPerPage: 9,
    currentCategory: 'all',
    
    init: async function() {
        await this.loadArticles();
        this.initFilters();
        this.renderArticles();
    },
    
    loadArticles: async function() {
        try {
            const response = await fetch('data/articles.json');
            const data = await response.json();
            this.articles = data.articles || [];
            this.filteredArticles = [...this.articles];
            console.log(`Loaded ${this.articles.length} articles`);
        } catch (error) {
            console.error('Error loading articles:', error);
            this.articles = [];
            this.filteredArticles = [];
        }
    },
    
    initFilters: function() {
        const self = this;
        document.querySelectorAll('.news-tab').forEach(tab => {
            tab.addEventListener('click', function() {
                // Update active state
                document.querySelectorAll('.news-tab').forEach(t => {
                    t.classList.remove('bg-primary', 'text-deep-navy');
                    t.classList.add('bg-surface-dark', 'text-slate-300');
                });
                this.classList.remove('bg-surface-dark', 'text-slate-300');
                this.classList.add('bg-primary', 'text-deep-navy');
                
                // Filter articles
                self.currentCategory = this.dataset.category;
                self.currentPage = 1;
                self.applyFilter();
            });
        });
    },
    
    applyFilter: function() {
        if (this.currentCategory === 'all') {
            this.filteredArticles = [...this.articles];
        } else {
            this.filteredArticles = this.articles.filter(article => 
                article.category === this.currentCategory
            );
        }
        this.renderArticles();
    },
    
    renderArticles: function() {
        const container = document.getElementById('articles-grid');
        const featuredContainer = document.getElementById('featured-article');
        if (!container) return;
        
        // Get non-featured articles for grid
        const gridArticles = this.filteredArticles.filter(a => !a.featured);
        
        // Calculate pagination
        const totalPages = Math.ceil(gridArticles.length / this.itemsPerPage);
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const articlesToShow = gridArticles.slice(startIndex, endIndex);
        
        // Render featured article (only on first page, all category)
        if (featuredContainer && this.currentPage === 1 && this.currentCategory === 'all') {
            const featured = this.filteredArticles.find(a => a.featured);
            if (featured) {
                featuredContainer.innerHTML = this.createFeaturedArticleHTML(featured);
                featuredContainer.style.display = 'block';
            } else {
                featuredContainer.style.display = 'none';
            }
        } else if (featuredContainer) {
            featuredContainer.style.display = 'none';
        }
        
        // Render grid
        if (articlesToShow.length === 0) {
            container.innerHTML = '<div class="col-span-full text-center py-12 text-slate-400">No articles found</div>';
        } else {
            container.innerHTML = articlesToShow.map(article => this.createArticleCardHTML(article)).join('');
        }
        
        // Render pagination
        this.renderPagination(totalPages);
    },
    
    createFeaturedArticleHTML: function(article) {
        return `
            <div class="glass-panel rounded-2xl overflow-hidden">
                <div class="grid lg:grid-cols-2">
                    <div class="relative h-64 lg:h-auto">
                        <img src="${article.image}" alt="${article.title}" class="w-full h-full object-cover">
                        <div class="absolute top-4 left-4">
                            <span class="bg-primary text-deep-navy text-xs font-bold px-3 py-1 rounded">FEATURED</span>
                        </div>
                    </div>
                    <div class="p-8 lg:p-12 flex flex-col justify-center">
                        <div class="flex items-center gap-4 mb-4">
                            <span class="text-primary text-xs font-bold uppercase tracking-wider">${article.categoryLabel}</span>
                            <span class="text-slate-500 text-xs">${article.date}</span>
                        </div>
                        <h2 class="text-2xl lg:text-3xl font-bold text-white mb-4">${article.title}</h2>
                        <p class="text-slate-400 mb-6">${article.excerpt}</p>
                        <a href="#" class="inline-flex items-center gap-2 text-primary font-medium hover:text-accent transition-colors">
                            Read Full Article
                            <span class="material-symbols-outlined text-sm">arrow_forward</span>
                        </a>
                    </div>
                </div>
            </div>
        `;
    },
    
    createArticleCardHTML: function(article) {
        const categoryColors = {
            industry: 'bg-blue-500',
            company: 'bg-green-500',
            guide: 'bg-orange-500'
        };
        const colorClass = categoryColors[article.category] || 'bg-slate-500';
        
        return `
            <article class="glass-panel rounded-xl overflow-hidden group hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all" data-category="${article.category}">
                <div class="relative h-48 overflow-hidden">
                    <img src="${article.image}" alt="${article.title}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                    <div class="absolute top-3 left-3">
                        <span class="${colorClass} text-white text-xs font-bold px-2 py-1 rounded">${article.categoryLabel}</span>
                    </div>
                </div>
                <div class="p-6">
                    <div class="flex items-center gap-3 mb-3">
                        <span class="text-slate-500 text-xs">${article.date}</span>
                        <span class="text-slate-600">•</span>
                        <span class="text-slate-500 text-xs">${article.readTime}</span>
                    </div>
                    <h3 class="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">${article.title}</h3>
                    <p class="text-slate-400 text-sm mb-4">${article.excerpt}</p>
                    <a href="#" class="text-primary text-sm font-medium hover:text-accent transition-colors">Read More →</a>
                </div>
            </article>
        `;
    },
    
    renderPagination: function(totalPages) {
        const container = document.getElementById('pagination-container');
        if (!container) return;
        
        if (totalPages <= 1) {
            container.innerHTML = '';
            return;
        }
        
        let paginationHTML = '<div class="flex items-center gap-2">';
        
        // Previous button
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
        
        // Next button
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
                    self.renderArticles();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('articles-grid')) {
        NewsManager.init();
    }
});

window.NewsManager = NewsManager;
