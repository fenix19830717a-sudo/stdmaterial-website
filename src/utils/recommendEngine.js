// 推荐引擎模块
import fs from 'fs';
import path from 'path';

// 缓存
let productsCache = null;
let metadataCache = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存

// 材料类型与设备匹配映射
const materialCompatibility = {
  '金属': ['Planetary Ball Mills', 'Crushing Series', 'Vibration Ball Mills'],
  '非金属': ['Planetary Ball Mills', 'Roller Ball Mills', 'Stirring Ball Mills'],
  '陶瓷': ['Planetary Ball Mills', 'Grinding Jars', 'Stirring Ball Mills'],
  '矿石': ['Crushing Series', 'Large Grinding Equipment', 'Roller Ball Mills'],
  '化学品': ['Planetary Ball Mills', 'Stirring Ball Mills', 'Grinding Jars'],
  '食品': ['Stirring Ball Mills', 'Roller Ball Mills', 'Crushing Series'],
  '医药': ['Planetary Ball Mills', 'Grinding Jars', 'Stirring Ball Mills'],
  '电池材料': ['Planetary Ball Mills', 'Stirring Ball Mills'],
  '纳米材料': ['Planetary Ball Mills', 'Stirring Ball Mills']
};

// 加载处理后的产品数据
const loadProcessedProducts = () => {
  const now = Date.now();
  if (productsCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return productsCache;
  }
  
  const productsPath = path.join(new URL('.', import.meta.url).pathname, '../../data/products_processed.json');
  const productsData = fs.readFileSync(productsPath, 'utf8');
  productsCache = JSON.parse(productsData);
  cacheTimestamp = now;
  return productsCache;
};

// 加载产品元数据
const loadProductMetadata = () => {
  const now = Date.now();
  if (metadataCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return metadataCache;
  }
  
  const metadataPath = path.join(new URL('.', import.meta.url).pathname, '../../data/product_metadata.json');
  const metadataData = fs.readFileSync(metadataPath, 'utf8');
  metadataCache = JSON.parse(metadataData);
  cacheTimestamp = now;
  return metadataCache;
};

// 计算余弦相似度
const calculateCosineSimilarity = (vector1, vector2) => {
  // 优化：只遍历较小的向量，减少计算量
  const keys1 = Object.keys(vector1);
  const keys2 = Object.keys(vector2);
  const smallerKeys = keys1.length < keys2.length ? keys1 : keys2;
  const largerVector = keys1.length < keys2.length ? vector2 : vector1;
  
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;
  
  // 计算点积和第一个向量的范数
  for (const key of keys1) {
    const val1 = vector1[key];
    norm1 += val1 * val1;
    if (vector2[key]) {
      dotProduct += val1 * vector2[key];
    }
  }
  
  // 计算第二个向量的范数
  for (const key of keys2) {
    const val2 = vector2[key];
    norm2 += val2 * val2;
  }
  
  if (norm1 === 0 || norm2 === 0) return 0;
  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
};

// 构建产品特征向量
const buildProductVector = (product, metadata) => {
  const vector = {};
  const specs = product.specifications || {};
  
  // 处理能力特征
  if (specs.processingCapacity) {
    if (typeof specs.processingCapacity === 'object') {
      vector.processingCapacity = (specs.processingCapacity.min + specs.processingCapacity.max) / 2;
    } else {
      vector.processingCapacity = specs.processingCapacity;
    }
  } else {
    vector.processingCapacity = 0;
  }
  
  // 进料粒度特征
  if (specs.feedSize) {
    if (typeof specs.feedSize === 'object') {
      vector.feedSize = (specs.feedSize.min + specs.feedSize.max) / 2;
    } else {
      vector.feedSize = specs.feedSize;
    }
  } else {
    vector.feedSize = 0;
  }
  
  // 出料粒度特征
  if (specs.outputSize) {
    if (typeof specs.outputSize === 'object') {
      vector.outputSize = (specs.outputSize.min + specs.outputSize.max) / 2;
    } else {
      vector.outputSize = specs.outputSize;
    }
  } else {
    vector.outputSize = 0;
  }
  
  // 功率特征
  if (specs.power) {
    if (typeof specs.power === 'object') {
      vector.power = (specs.power.min + specs.power.max) / 2;
    } else {
      vector.power = specs.power;
    }
  } else {
    vector.power = 0;
  }
  
  // 转速特征
  if (specs.speed) {
    if (typeof specs.speed === 'object') {
      vector.speed = (specs.speed.min + specs.speed.max) / 2;
    } else {
      vector.speed = specs.speed;
    }
  } else {
    vector.speed = 0;
  }
  
  // 类别特征（独热编码）
  if (product.category) {
    vector[`category_${product.category.replace(/\s+/g, '_')}`] = 1;
  }
  
  // 应用领域特征（独热编码）
  if (product.applications) {
    product.applications.forEach(app => {
      vector[`app_${app.replace(/\s+/g, '_')}`] = 1;
    });
  }
  
  return vector;
};

// 归一化特征向量
const normalizeVector = (vector, metadata) => {
  const normalized = { ...vector };
  
  // 归一化数值特征
  const numericFeatures = ['processingCapacity', 'feedSize', 'outputSize', 'power', 'speed'];
  numericFeatures.forEach(feature => {
    if (normalized[feature] !== undefined && metadata.parameterRanges[feature]) {
      const range = metadata.parameterRanges[feature];
      if (range.max > range.min) {
        normalized[feature] = (normalized[feature] - range.min) / (range.max - range.min);
      } else {
        normalized[feature] = 0;
      }
    }
  });
  
  return normalized;
};

// 构建用户查询向量
const buildQueryVector = (query, metadata) => {
  const vector = {};
  
  // 处理能力
  if (query.processingCapacity) {
    if (query.processingCapacity.min !== undefined && query.processingCapacity.max !== undefined) {
      vector.processingCapacity = (query.processingCapacity.min + query.processingCapacity.max) / 2;
    } else if (query.processingCapacity.min !== undefined) {
      vector.processingCapacity = query.processingCapacity.min;
    } else if (query.processingCapacity.max !== undefined) {
      vector.processingCapacity = query.processingCapacity.max;
    }
  }
  
  // 进料粒度
  if (query.feedSize) {
    if (query.feedSize.max !== undefined) {
      vector.feedSize = query.feedSize.max;
    }
  }
  
  // 出料粒度
  if (query.outputSize) {
    if (query.outputSize.max !== undefined) {
      vector.outputSize = query.outputSize.max;
    }
  }
  
  // 类别
  if (query.category) {
    vector[`category_${query.category.replace(/\s+/g, '_')}`] = 1;
  }
  
  // 应用领域
  if (query.applications) {
    query.applications.forEach(app => {
      vector[`app_${app.replace(/\s+/g, '_')}`] = 1;
    });
  }
  
  return normalizeVector(vector, metadata);
};

// 基于材料类型过滤产品
const filterByMaterial = (products, materialType) => {
  if (!materialType) return products;
  
  const compatibleCategories = materialCompatibility[materialType] || [];
  return products.filter(product => compatibleCategories.includes(product.category));
};

// 过滤产品
const filterProducts = (products, query) => {
  // 先按材料类型过滤
  let filtered = filterByMaterial(products, query.materialType);
  
  return filtered.filter(product => {
    const specs = product.specifications || {};
    
    // 类别过滤
    if (query.category && product.category !== query.category) {
      return false;
    }
    
    // 处理能力过滤
    if (query.processingCapacity) {
      if (specs.processingCapacity) {
        if (typeof specs.processingCapacity === 'object') {
          if (query.processingCapacity.min !== undefined && specs.processingCapacity.max < query.processingCapacity.min) {
            return false;
          }
          if (query.processingCapacity.max !== undefined && specs.processingCapacity.min > query.processingCapacity.max) {
            return false;
          }
        } else {
          if (query.processingCapacity.min !== undefined && specs.processingCapacity < query.processingCapacity.min) {
            return false;
          }
          if (query.processingCapacity.max !== undefined && specs.processingCapacity > query.processingCapacity.max) {
            return false;
          }
        }
      } else {
        return false;
      }
    }
    
    // 进料粒度过滤
    if (query.feedSize) {
      if (query.feedSize.max !== undefined) {
        if (specs.feedSize) {
          if (typeof specs.feedSize === 'object') {
            if (specs.feedSize.max > query.feedSize.max) {
              return false;
            }
          } else {
            if (specs.feedSize > query.feedSize.max) {
              return false;
            }
          }
        } else {
          return false;
        }
      }
    }
    
    // 出料粒度过滤
    if (query.outputSize) {
      if (query.outputSize.max !== undefined) {
        if (specs.outputSize) {
          if (typeof specs.outputSize === 'object') {
            if (specs.outputSize.max > query.outputSize.max) {
              return false;
            }
          } else {
            if (specs.outputSize > query.outputSize.max) {
              return false;
            }
          }
        } else {
          return false;
        }
      }
    }
    
    // 应用领域过滤
    if (query.applications && query.applications.length > 0) {
      if (!product.applications) {
        return false;
      }
      const hasMatchingApp = query.applications.some(app => 
        product.applications.includes(app)
      );
      if (!hasMatchingApp) {
        return false;
      }
    }
    
    return true;
  });
};

// 生成推荐理由
const generateRecommendationReason = (product, query) => {
  const reasons = [];
  const specs = product.specifications || {};
  
  // 材料类型匹配
  if (query.materialType) {
    const compatibleCategories = materialCompatibility[query.materialType] || [];
    if (compatibleCategories.includes(product.category)) {
      reasons.push(`适合处理${query.materialType}材料`);
    }
  }
  
  // 处理能力匹配
  if (query.processingCapacity) {
    if (specs.processingCapacity) {
      let capacityText = '';
      if (typeof specs.processingCapacity === 'object') {
        capacityText = `${specs.processingCapacity.min}~${specs.processingCapacity.max}kg/h`;
      } else {
        capacityText = `${specs.processingCapacity}kg/h`;
      }
      reasons.push(`处理能力${capacityText}，满足您的产能需求`);
    }
  }
  
  // 出料粒度匹配
  if (query.outputSize) {
    if (specs.outputSize) {
      let outputText = '';
      if (typeof specs.outputSize === 'object') {
        outputText = `${specs.outputSize.min}~${specs.outputSize.max}μm`;
      } else {
        outputText = `${specs.outputSize}μm`;
      }
      reasons.push(`出料粒度${outputText}，符合您的细度要求`);
    }
  }
  
  // 进料粒度匹配
  if (query.feedSize) {
    if (specs.feedSize) {
      let feedText = '';
      if (typeof specs.feedSize === 'object') {
        feedText = `≤${specs.feedSize.max}mm`;
      } else {
        feedText = `≤${specs.feedSize}mm`;
      }
      reasons.push(`进料粒度${feedText}，适合您的原料尺寸`);
    }
  }
  
  // 应用领域匹配
  if (query.applications && query.applications.length > 0) {
    const matchingApps = product.applications && product.applications.filter(app => 
      query.applications.includes(app)
    );
    if (matchingApps && matchingApps.length > 0) {
      reasons.push(`适用于${matchingApps.join('、')}等领域`);
    }
  }
  
  // 如果没有具体理由，添加通用理由
  if (reasons.length === 0) {
    reasons.push('综合性能优异，适合您的需求');
  }
  
  return reasons;
};

// 计算推荐得分
const calculateScore = (product, queryVector, productVector, priority = []) => {
  // 基础相似度得分
  let score = calculateCosineSimilarity(queryVector, productVector);
  
  // 根据优先级调整得分
  if (priority && priority.length > 0) {
    priority.forEach((param, index) => {
      const weight = 1 + (priority.length - index) * 0.2; // 优先级越高，权重越大
      if (product.specifications[param]) {
        // 增加该参数的权重
        score *= weight;
      }
    });
  }
  
  // 材料类型匹配加分
  if (queryVector.materialType && product.category) {
    const compatibleCategories = materialCompatibility[queryVector.materialType] || [];
    if (compatibleCategories.includes(product.category)) {
      score *= 1.3; // 材料匹配权重
    }
  }
  
  return score;
};

// 推荐函数
const recommend = (query) => {
  const products = loadProcessedProducts();
  const metadata = loadProductMetadata();
  
  // 过滤产品
  const filteredProducts = filterProducts(products, query);
  
  // 构建查询向量
  const queryVector = buildQueryVector(query, metadata);
  
  // 计算每个产品的推荐得分和理由
  const scoredProducts = filteredProducts.map(product => {
    const productVector = normalizeVector(buildProductVector(product, metadata), metadata);
    const score = calculateScore(product, queryVector, productVector, query.priority);
    const reasons = generateRecommendationReason(product, query);
    return {
      ...product,
      score,
      recommendationReasons: reasons
    };
  });
  
  // 按得分排序
  scoredProducts.sort((a, b) => b.score - a.score);
  
  // 提取前10个推荐产品
  const recommendedProducts = scoredProducts.slice(0, 10);
  
  return {
    recommendedProducts,
    total: recommendedProducts.length
  };
};

// 获取产品参数信息
const getProductParams = () => {
  const metadata = loadProductMetadata();
  return {
    categories: metadata.categories,
    parameterRanges: metadata.parameterRanges,
    applications: metadata.applications,
    materialTypes: Object.keys(materialCompatibility)
  };
};

// 导出函数
export {
  recommend,
  getProductParams
};