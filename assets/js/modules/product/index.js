import Logger from '../../core/logger.js';
import eventBus from '../../core/event-bus.js';
import { validateProductData, prepareProductData } from './product-schema.js';
import productIndex from './product-index.js';
import productSearch from './product-search.js';

class ProductManager {
  constructor() {
    this.logger = new Logger('ProductManager');
    this.logger.info('ProductManager initialized');
  }

  // 添加商品
  async addProduct(productData) {
    try {
      // 准备商品数据
      const preparedData = prepareProductData(productData);
      
      // 验证商品数据
      const validation = validateProductData(preparedData);
      if (!validation.valid) {
        throw new Error('Product validation failed: ' + JSON.stringify(validation.errors));
      }

      // 添加到索引
      productIndex.addProduct(validation.data);

      // 触发事件
      eventBus.emit('product:added', validation.data);

      this.logger.info(`Product added: ${validation.data.id}`);
      return validation.data;
    } catch (error) {
      this.logger.error('Failed to add product:', error);
      throw error;
    }
  }

  // 更新商品
  async updateProduct(productId, productData) {
    try {
      // 检查商品是否存在
      const existingProduct = productIndex.getById(productId);
      if (!existingProduct) {
        throw new Error(`Product not found: ${productId}`);
      }

      // 准备商品数据
      const preparedData = {
        ...existingProduct,
        ...productData,
        id: productId,
        updatedAt: new Date().toISOString()
      };

      // 验证商品数据
      const validation = validateProductData(preparedData);
      if (!validation.valid) {
        throw new Error('Product validation failed: ' + JSON.stringify(validation.errors));
      }

      // 更新索引
      productIndex.updateProduct(validation.data);

      // 触发事件
      eventBus.emit('product:updated', validation.data);

      this.logger.info(`Product updated: ${productId}`);
      return validation.data;
    } catch (error) {
      this.logger.error('Failed to update product:', error);
      throw error;
    }
  }

  // 删除商品
  async deleteProduct(productId) {
    try {
      const success = productIndex.removeProduct(productId);
      if (!success) {
        throw new Error(`Product not found: ${productId}`);
      }

      // 触发事件
      eventBus.emit('product:deleted', productId);

      this.logger.info(`Product deleted: ${productId}`);
      return true;
    } catch (error) {
      this.logger.error('Failed to delete product:', error);
      throw error;
    }
  }

  // 获取商品
  getProduct(productId) {
    return productIndex.getById(productId);
  }

  // 获取所有商品
  getAllProducts() {
    return productIndex.getAll();
  }

  // 根据类别获取商品
  getProductsByCategory(category) {
    return productIndex.getByCategory(category);
  }

  // 根据价格范围获取商品
  getProductsByPriceRange(minPrice, maxPrice) {
    return productIndex.getByPriceRange(minPrice, maxPrice);
  }

  // 搜索商品
  searchProducts(query, options = {}) {
    return productSearch.search(query, options);
  }

  // 获取搜索建议
  getSearchSuggestions(query) {
    return productSearch.getSuggestions(query);
  }

  // 高级搜索
  advancedSearch(filters) {
    return productSearch.advancedSearch(filters);
  }

  // 获取商品数量
  getProductCount() {
    return productIndex.getCount();
  }

  // 批量添加商品
  async addProducts(products) {
    const results = [];
    const errors = [];

    for (let i = 0; i < products.length; i++) {
      try {
        const product = await this.addProduct(products[i]);
        results.push(product);
      } catch (error) {
        errors.push({ index: i, error: error.message });
      }
    }

    return {
      success: results.length,
      failed: errors.length,
      results,
      errors
    };
  }

  // 清空所有商品
  clearProducts() {
    productIndex.clear();
    eventBus.emit('products:cleared');
    this.logger.info('All products cleared');
  }
}

const productManager = new ProductManager();
export default productManager;
