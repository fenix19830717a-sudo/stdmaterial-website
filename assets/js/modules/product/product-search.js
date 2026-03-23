import Logger from '../../core/logger.js';
import productIndex from './product-index.js';

class ProductSearch {
  constructor() {
    this.logger = new Logger('ProductSearch');
  }

  // 全文搜索
  search(query, options = {}) {
    if (!query || typeof query !== 'string' || query.trim() === '') {
      return [];
    }

    const { 
      limit = 20, 
      category = null, 
      minPrice = null, 
      maxPrice = null 
    } = options;

    // 预处理查询词
    const tokens = this._tokenize(query);
    if (tokens.length === 0) {
      return [];
    }

    // 获取候选商品
    let candidates = this._getCandidateProducts(category);

    // 过滤价格范围
    if (minPrice !== null || maxPrice !== null) {
      candidates = candidates.filter(product => {
        const price = product.price || 0;
        if (minPrice !== null && price < minPrice) return false;
        if (maxPrice !== null && price > maxPrice) return false;
        return true;
      });
    }

    // 计算相关度并排序
    const results = candidates
      .map(product => ({
        product,
        score: this._calculateScore(product, tokens)
      }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.product);

    this.logger.info(`Search completed for query: "${query}", found ${results.length} results`);
    return results;
  }

  // 分词处理
  _tokenize(text) {
    return text
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, ' ')
      .split(/\s+/)
      .filter(token => token.length > 0);
  }

  // 获取候选商品
  _getCandidateProducts(category) {
    if (category) {
      return productIndex.getByCategory(category);
    }
    return productIndex.getAll();
  }

  // 计算相关度分数
  _calculateScore(product, tokens) {
    let score = 0;

    // 检查商品名称
    if (product.name) {
      const nameLower = product.name.toLowerCase();
      tokens.forEach(token => {
        if (nameLower.includes(token)) {
          score += 3; // 名称匹配权重最高
        }
      });
    }

    // 检查商品描述
    if (product.description) {
      const descLower = product.description.toLowerCase();
      tokens.forEach(token => {
        if (descLower.includes(token)) {
          score += 2; // 描述匹配权重次之
        }
      });
    }

    // 检查商品标签
    if (product.tags && Array.isArray(product.tags)) {
      const tagsLower = product.tags.map(tag => tag.toLowerCase());
      tokens.forEach(token => {
        if (tagsLower.includes(token)) {
          score += 2.5; // 标签匹配权重较高
        }
      });
    }

    // 检查商品类别
    if (product.category) {
      const categoryLower = product.category.toLowerCase();
      tokens.forEach(token => {
        if (categoryLower.includes(token)) {
          score += 1; // 类别匹配权重较低
        }
      });
    }

    // 检查商品规格
    if (product.specifications) {
      const specText = JSON.stringify(product.specifications).toLowerCase();
      tokens.forEach(token => {
        if (specText.includes(token)) {
          score += 1.5; // 规格匹配权重适中
        }
      });
    }

    return score;
  }

  // 搜索建议
  getSuggestions(query) {
    if (!query || typeof query !== 'string' || query.trim() === '') {
      return [];
    }

    const tokens = this._tokenize(query);
    if (tokens.length === 0) {
      return [];
    }

    const allProducts = productIndex.getAll();
    const suggestions = new Set();

    // 从商品名称中提取建议
    allProducts.forEach(product => {
      if (product.name) {
        const nameLower = product.name.toLowerCase();
        if (nameLower.includes(query.toLowerCase())) {
          suggestions.add(product.name);
        }
      }

      // 从标签中提取建议
      if (product.tags && Array.isArray(product.tags)) {
        product.tags.forEach(tag => {
          if (tag.toLowerCase().includes(query.toLowerCase())) {
            suggestions.add(tag);
          }
        });
      }
    });

    return Array.from(suggestions).slice(0, 10);
  }

  // 高级搜索
  advancedSearch(filters) {
    const { 
      query = '', 
      category = null, 
      minPrice = null, 
      maxPrice = null, 
      tags = [], 
      limit = 20 
    } = filters;

    // 先进行全文搜索
    let results = this.search(query, { category, minPrice, maxPrice, limit: 100 });

    // 过滤标签
    if (tags && tags.length > 0) {
      results = results.filter(product => {
        if (!product.tags || !Array.isArray(product.tags)) {
          return false;
        }
        return tags.some(tag => product.tags.includes(tag));
      });
    }

    return results.slice(0, limit);
  }
}

const productSearch = new ProductSearch();
export default productSearch;
