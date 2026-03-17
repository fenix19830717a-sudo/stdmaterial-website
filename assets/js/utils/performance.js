class PerformanceOptimizer {
  constructor() {
    this.cache = new Map();
    this.cacheExpiry = new Map();
  }

  /**
   * 设置缓存
   * @param {string} key - 缓存键
   * @param {any} value - 缓存值
   * @param {number} ttl - 过期时间（毫秒）
   */
  setCache(key, value, ttl = 3600000) {
    this.cache.set(key, value);
    this.cacheExpiry.set(key, Date.now() + ttl);
  }

  /**
   * 获取缓存
   * @param {string} key - 缓存键
   * @returns {any} 缓存值，如果不存在或已过期则返回null
   */
  getCache(key) {
    if (!this.cache.has(key)) return null;
    
    const expiry = this.cacheExpiry.get(key);
    if (Date.now() > expiry) {
      this.cache.delete(key);
      this.cacheExpiry.delete(key);
      return null;
    }
    
    return this.cache.get(key);
  }

  /**
   * 清除缓存
   * @param {string} key - 缓存键
   */
  clearCache(key) {
    if (key) {
      this.cache.delete(key);
      this.cacheExpiry.delete(key);
    } else {
      this.cache.clear();
      this.cacheExpiry.clear();
    }
  }

  /**
   * 动态加载脚本
   * @param {string} src - 脚本路径
   * @returns {Promise} 加载结果
   */
  loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(script);
    });
  }

  /**
   * 预加载资源
   * @param {Array} resources - 资源列表
   */
  preloadResources(resources) {
    resources.forEach(resource => {
      if (resource.type === 'image') {
        const img = new Image();
        img.src = resource.url;
      } else if (resource.type === 'script') {
        this.loadScript(resource.url).catch(err => console.warn('Preload failed:', err));
      }
    });
  }
}

const performanceOptimizer = new PerformanceOptimizer();
export default performanceOptimizer;