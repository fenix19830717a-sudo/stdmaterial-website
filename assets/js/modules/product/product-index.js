import Logger from '../../core/logger.js';

class ProductIndex {
  constructor() {
    this.products = new Map(); // 按ID索引
    this.categoryIndex = new Map(); // 按类别索引
    this.priceIndex = []; // 按价格排序的索引
    this.logger = new Logger('ProductIndex');
  }

  // 添加商品到索引
  addProduct(product) {
    if (!product || !product.id) {
      throw new Error('Product must have an ID');
    }

    // 添加到ID索引
    this.products.set(product.id, product);

    // 添加到类别索引
    if (product.category) {
      if (!this.categoryIndex.has(product.category)) {
        this.categoryIndex.set(product.category, new Set());
      }
      this.categoryIndex.get(product.category).add(product.id);
    }

    // 添加到价格索引
    this._addtoPriceIndex(product);

    this.logger.info(`Product added to index: ${product.id}`);
  }

  // 从索引中删除商品
  removeProduct(productId) {
    const product = this.products.get(productId);
    if (!product) {
      return false;
    }

    // 从ID索引中删除
    this.products.delete(productId);

    // 从类别索引中删除
    if (product.category && this.categoryIndex.has(product.category)) {
      this.categoryIndex.get(product.category).delete(productId);
    }

    // 从价格索引中删除
    this._removeFromPriceIndex(productId);

    this.logger.info(`Product removed from index: ${productId}`);
    return true;
  }

  // 更新商品
  updateProduct(product) {
    if (!product || !product.id) {
      throw new Error('Product must have an ID');
    }

    // 先删除旧的索引
    this.removeProduct(product.id);
    // 再添加新的索引
    this.addProduct(product);

    this.logger.info(`Product updated in index: ${product.id}`);
  }

  // 根据ID获取商品
  getById(id) {
    return this.products.get(id);
  }

  // 根据类别获取商品
  getByCategory(category) {
    const productIds = this.categoryIndex.get(category);
    if (!productIds) {
      return [];
    }

    return Array.from(productIds).map(id => this.products.get(id));
  }

  // 根据价格范围获取商品
  getByPriceRange(minPrice, maxPrice) {
    const results = [];
    
    for (const product of this.priceIndex) {
      if (product.price >= minPrice && product.price <= maxPrice) {
        results.push(product);
      } else if (product.price > maxPrice) {
        break; // 因为价格索引是排序的，所以可以提前结束
      }
    }

    return results;
  }

  // 获取所有商品
  getAll() {
    return Array.from(this.products.values());
  }

  // 获取商品数量
  getCount() {
    return this.products.size;
  }

  // 清空索引
  clear() {
    this.products.clear();
    this.categoryIndex.clear();
    this.priceIndex = [];
    this.logger.info('Product index cleared');
  }

  // 添加到价格索引（保持排序）
  _addtoPriceIndex(product) {
    if (product.price === undefined) {
      return;
    }

    // 使用二分查找找到插入位置
    let left = 0;
    let right = this.priceIndex.length - 1;
    let insertIndex = this.priceIndex.length;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (this.priceIndex[mid].price > product.price) {
        insertIndex = mid;
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }

    this.priceIndex.splice(insertIndex, 0, product);
  }

  // 从价格索引中删除
  _removeFromPriceIndex(productId) {
    const index = this.priceIndex.findIndex(product => product.id === productId);
    if (index > -1) {
      this.priceIndex.splice(index, 1);
    }
  }
}

const productIndex = new ProductIndex();
export default productIndex;
