class ProductCatalog {
  constructor() {
    this.products = [];
    this.filteredProducts = [];
    this.currentPage = 1;
    this.itemsPerPage = 12;
    this.searchQuery = '';
    this.selectedCategory = '';
    this.isLoading = false;
  }

  async init() {
    try {
      this.isLoading = true;
      await this.loadProducts();
      this.setupEventListeners();
      this.renderProducts();
    } catch (error) {
      console.error('Failed to initialize product catalog:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async loadProducts() {
    try {
      const response = await fetch('data/products.json');
      if (!response.ok) {
        throw new Error('Failed to load products');
      }
      const data = await response.json();
      this.products = data.products;
      this.filteredProducts = [...this.products];
    } catch (error) {
      console.error('Error loading products:', error);
      this.products = this.getMockProducts();
      this.filteredProducts = [...this.products];
    }
  }

  getMockProducts() {
    return [
      {
        id: 'PL-001',
        name: '行星球磨机',
        nameEn: 'Planetary Ball Mill',
        category: 'Planetary Ball Mills',
        categoryCn: '行星球磨机',
        description: '高性能行星球磨机，适用于实验室和工业应用',
        descriptionEn: 'High performance planetary ball mill for laboratory and industrial applications',
        features: ['变频调速', '行星运动机构', '高效研磨'],
        applications: ['纳米材料', '陶瓷', '电池材料'],
        price: 'Contact for Quote',
        stock: 'In Stock',
        images: ['images/products/planetary-ball-mill.webp'],
        specifications: {
          '球磨罐数量': '4只',
          '磨罐规格': '50ml~1L',
          '调速范围': '0~600rpm'
        }
      },
      {
        id: 'GR-001',
        name: '搅拌球磨机',
        nameEn: 'Stirred Ball Mill',
        category: 'Stirring Mills',
        categoryCn: '搅拌球磨机',
        description: '高效搅拌球磨机，适用于细磨和超细磨',
        descriptionEn: 'High efficiency stirred ball mill for fine and ultra-fine grinding',
        features: ['高能量密度', '低能耗', '精细研磨'],
        applications: ['涂料', '油墨', '颜料'],
        price: 'Contact for Quote',
        stock: 'In Stock',
        images: ['images/products/stirred-ball-mill.webp'],
        specifications: {
          '有效容积': '1~100L',
          '电机功率': '1.5~30kW',
          '研磨介质': '氧化锆球'
        }
      },
      {
        id: 'RM-001',
        name: '滚筒球磨机',
        nameEn: 'Roller Ball Mill',
        category: 'Roller Mills',
        categoryCn: '滚筒球磨机',
        description: '传统滚筒球磨机，适用于大规模生产',
        descriptionEn: 'Traditional roller ball mill for large-scale production',
        features: ['结构简单', '运行稳定', '维护成本低'],
        applications: ['建材', '化工', '冶金'],
        price: 'Contact for Quote',
        stock: 'In Stock',
        images: ['images/products/roller-ball-mill.webp'],
        specifications: {
          '滚筒直径': '500~2000mm',
          '滚筒长度': '1000~5000mm',
          '转速': '15~45rpm'
        }
      },
      {
        id: 'GM-001',
        name: '研磨介质',
        nameEn: 'Grinding Media',
        category: 'Grinding Media',
        categoryCn: '研磨介质',
        description: '高质量研磨介质，提高研磨效率',
        descriptionEn: 'High quality grinding media for improved grinding efficiency',
        features: ['高硬度', '耐磨', '耐腐蚀'],
        applications: ['各种球磨机', '搅拌磨机'],
        price: 'Contact for Quote',
        stock: 'In Stock',
        images: ['images/products/grinding-media.webp'],
        specifications: {
          '材质': '氧化锆/氧化铝/不锈钢',
          '直径': '0.1~30mm',
          '形状': '球形/圆柱形'
        }
      },
      {
        id: 'PL-002',
        name: '实验室行星球磨机',
        nameEn: 'Laboratory Planetary Ball Mill',
        category: 'Planetary Ball Mills',
        categoryCn: '行星球磨机',
        description: '小型实验室专用行星球磨机',
        descriptionEn: 'Small planetary ball mill for laboratory use',
        features: [' compact design', '精确控制', '低噪音'],
        applications: ['科研', '教学', '小批量生产'],
        price: 'Contact for Quote',
        stock: 'In Stock',
        images: ['images/products/sbworld/lab-planetary-mill-1.webp'],
        specifications: {
          '球磨罐数量': '4只',
          '磨罐规格': '50~500ml',
          '调速范围': '0~600rpm'
        }
      },
      {
        id: 'PL-003',
        name: '生产型行星球磨机',
        nameEn: 'Production Planetary Ball Mill',
        category: 'Planetary Ball Mills',
        categoryCn: '行星球磨机',
        description: '大型生产用行星球磨机',
        descriptionEn: 'Large planetary ball mill for production use',
        features: ['高产量', '连续运行', '自动化控制'],
        applications: ['工业生产', '规模化加工'],
        price: 'Contact for Quote',
        stock: 'In Stock',
        images: ['images/products/sbworld/production-planetary-mill.webp'],
        specifications: {
          '球磨罐数量': '4只',
          '磨罐规格': '1~10L',
          '调速范围': '0~400rpm'
        }
      }
    ];
  }

  setupEventListeners() {
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const paginationElements = document.querySelectorAll('.pagination button');
    const filterButtons = document.querySelectorAll('.filter-btn');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase();
        this.currentPage = 1;
        this.filterProducts();
      });
    }

    if (categoryFilter) {
      categoryFilter.addEventListener('change', (e) => {
        this.selectedCategory = e.target.value;
        this.currentPage = 1;
        this.filterProducts();
      });
    }

    if (filterButtons.length > 0) {
      filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          // Update active state
          filterButtons.forEach(btn => btn.classList.remove('active'));
          e.target.classList.add('active');
          
          // Set selected category
          this.selectedCategory = e.target.dataset.category || '';
          this.currentPage = 1;
          this.filterProducts();
        });
      });
    }

    paginationElements.forEach(button => {
      button.addEventListener('click', (e) => {
        const page = parseInt(e.target.dataset.page) || 1;
        this.currentPage = page;
        this.renderProducts();
      });
    });
  }

  filterProducts() {
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = !this.searchQuery || 
        product.name.toLowerCase().includes(this.searchQuery) ||
        product.nameEn.toLowerCase().includes(this.searchQuery) ||
        product.description.toLowerCase().includes(this.searchQuery) ||
        product.descriptionEn.toLowerCase().includes(this.searchQuery);
      
      const matchesCategory = !this.selectedCategory || 
        product.category === this.selectedCategory ||
        product.categoryCn === this.selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
    
    this.renderProducts();
  }

  getCategories() {
    const categories = new Set();
    this.products.forEach(product => {
      categories.add(product.category);
      categories.add(product.categoryCn);
    });
    return Array.from(categories).sort();
  }

  renderCategories() {
    const categoryFilter = document.getElementById('category-filter');
    if (!categoryFilter) return;

    categoryFilter.innerHTML = '<option value="">All Categories</option>';
    this.getCategories().forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });
  }

  renderProducts() {
    const productContainer = document.getElementById('product-container');
    const paginationContainer = document.getElementById('pagination');
    const loadingElement = document.getElementById('loading');
    const noResultsElement = document.getElementById('no-results');

    if (loadingElement) {
      loadingElement.style.display = this.isLoading ? 'block' : 'none';
    }

    if (!productContainer) return;

    if (this.filteredProducts.length === 0) {
      if (noResultsElement) {
        noResultsElement.style.display = 'block';
      }
      productContainer.innerHTML = '';
      if (paginationContainer) {
        paginationContainer.style.display = 'none';
      }
      return;
    }

    if (noResultsElement) {
      noResultsElement.style.display = 'none';
    }

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);

    productContainer.innerHTML = '';
    paginatedProducts.forEach(product => {
      const productCard = this.createProductCard(product);
      productContainer.appendChild(productCard);
    });

    if (paginationContainer) {
      this.renderPagination();
      paginationContainer.style.display = 'flex';
    }
  }

  createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const imageUrl = product.images && product.images.length > 0 
      ? product.images[0] 
      : 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=industrial%20grinding%20equipment%20product%20photo&image_size=square';

    card.innerHTML = `
      <div class="product-image">
        <img src="${imageUrl}" alt="${product.name}">
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <div class="product-category">${product.categoryCn || product.category}</div>
        <div class="product-stock">${product.stock}</div>
        <div class="product-price">${product.price}</div>
        <button class="view-details" data-id="${product.id}">View Details</button>
      </div>
    `;

    const viewButton = card.querySelector('.view-details');
    if (viewButton) {
      viewButton.addEventListener('click', () => {
        this.viewProductDetails(product.id);
      });
    }

    return card;
  }

  renderPagination() {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) return;

    const totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    paginationContainer.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
      const button = document.createElement('button');
      button.textContent = i;
      button.dataset.page = i;
      button.className = this.currentPage === i ? 'active' : '';
      paginationContainer.appendChild(button);
    }

    paginationContainer.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON') {
        const page = parseInt(e.target.dataset.page);
        if (!isNaN(page)) {
          this.currentPage = page;
          this.renderProducts();
        }
      }
    });
  }

  viewProductDetails(productId) {
    window.location.href = `product-detail.html?id=${productId}`;
  }

  updateUrlParams() {
    const params = new URLSearchParams();
    if (this.searchQuery) {
      params.set('search', this.searchQuery);
    }
    if (this.selectedCategory) {
      params.set('category', this.selectedCategory);
    }
    if (this.currentPage > 1) {
      params.set('page', this.currentPage);
    }
    
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, '', newUrl);
  }

  loadFromUrlParams() {
    const params = new URLSearchParams(window.location.search);
    this.searchQuery = params.get('search') || '';
    this.selectedCategory = params.get('category') || '';
    this.currentPage = parseInt(params.get('page')) || 1;

    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');

    if (searchInput) {
      searchInput.value = this.searchQuery;
    }

    if (categoryFilter) {
      categoryFilter.value = this.selectedCategory;
    }

    this.filterProducts();
  }
}

if (typeof window !== 'undefined') {
  window.ProductCatalog = ProductCatalog;
  
  document.addEventListener('DOMContentLoaded', async () => {
    const catalog = new ProductCatalog();
    await catalog.init();
    catalog.loadFromUrlParams();
    catalog.renderCategories();
  });
}

export default ProductCatalog;
