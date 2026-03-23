// 数据预处理模块
import fs from 'fs';
import path from 'path';

// 加载产品数据
const loadProducts = () => {
  const productsPath = path.join(new URL('.', import.meta.url).pathname, '../../data/products.json');
  const productsData = fs.readFileSync(productsPath, 'utf8');
  return JSON.parse(productsData);
};

// 保存处理后的数据
const saveProcessedData = (data, filename) => {
  const outputPath = path.join(new URL('.', import.meta.url).pathname, '../../data/', filename);
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Processed data saved to ${outputPath}`);
};

// 参数名称映射
const parameterMap = {
  // 处理能力相关参数
  '处理量': 'processingCapacity',
  '产能': 'processingCapacity',
  '生产量': 'processingCapacity',
  '生产能力': 'processingCapacity',
  '处理能力': 'processingCapacity',
  '粉碎能力': 'processingCapacity',
  '处理量：': 'processingCapacity',
  '产能：': 'processingCapacity',
  '生产量：': 'processingCapacity',
  '生产能力：': 'processingCapacity',
  '处理能力：': 'processingCapacity',
  '粉碎能力：': 'processingCapacity',
  
  // 进料粒度相关参数
  '进料粒度': 'feedSize',
  '入料粒度': 'feedSize',
  '给料粒度': 'feedSize',
  '进料粒度：': 'feedSize',
  '入料粒度：': 'feedSize',
  '给料粒度：': 'feedSize',
  
  // 出料粒度相关参数
  '出料粒度': 'outputSize',
  '粉碎粒度': 'outputSize',
  '粉碎细度': 'outputSize',
  '出料粒度：': 'outputSize',
  '粉碎粒度：': 'outputSize',
  '粉碎细度：': 'outputSize',
  
  // 功率相关参数
  '功率': 'power',
  '功率：': 'power',
  
  // 转速相关参数
  '转速': 'speed',
  '动颚转速': 'speed',
  '瓷辊转速': 'speed',
  '搅拌转数': 'speed',
  '筒体转速': 'speed',
  '转速：': 'speed',
  '动颚转速：': 'speed',
  '瓷辊转速：': 'speed',
  '搅拌转数：': 'speed',
  '筒体转速：': 'speed',
  
  // 其他参数
  '研磨容积': 'grindingVolume',
  '磨矿量': 'grindingCapacity',
  '给矿量': 'feedingCapacity',
  '工作温度': 'workingTemperature',
  '使用压力': 'operatingPressure'
};

// 单位转换函数
const convertUnit = (value, parameter) => {
  if (!value) return value;
  
  let processedValue = value.toString().trim();
  
  // 去除特殊字符
  processedValue = processedValue.replace(/[<>≤≥]/g, '').trim();
  
  // 处理范围值
  if (processedValue.includes('~') || processedValue.includes('～')) {
    const range = processedValue.split(/[~～]/);
    return {
      min: parseFloat(range[0].trim()),
      max: parseFloat(range[1].trim())
    };
  }
  
  // 处理粒度单位转换（目数转mm）
  if (parameter === 'outputSize' && processedValue.includes('目')) {
    const meshMatch = processedValue.match(/(\d+)\s*目/);
    if (meshMatch) {
      const mesh = parseFloat(meshMatch[1]);
      // 目数转mm的近似公式：1英寸=25.4mm，目数=每英寸孔数
      const mm = 25.4 / mesh;
      return mm;
    }
  }
  
  // 处理微米单位转换
  if (processedValue.includes('μm') || processedValue.includes('微米')) {
    const umMatch = processedValue.match(/(\d+)\s*(μm|微米)/);
    if (umMatch) {
      const um = parseFloat(umMatch[1]);
      return um / 1000; // 转换为mm
    }
  }
  
  // 提取数字
  const numMatch = processedValue.match(/\d+(\.\d+)?/);
  if (numMatch) {
    return parseFloat(numMatch[0]);
  }
  
  return processedValue;
};

// 数据预处理函数
const preprocessData = () => {
  const { products } = loadProducts();
  
  const processedProducts = products.map(product => {
    const processedProduct = { ...product };
    const standardizedSpecs = {};
    
    // 标准化规格参数
    if (product.specifications) {
      Object.entries(product.specifications).forEach(([key, value]) => {
        const standardKey = parameterMap[key] || key;
        standardizedSpecs[standardKey] = convertUnit(value, standardKey);
      });
    }
    
    processedProduct.specifications = standardizedSpecs;
    return processedProduct;
  });
  
  // 提取产品参数范围
  const parameterRanges = calculateParameterRanges(processedProducts);
  
  // 提取类别和应用领域
  const categories = extractCategories(processedProducts);
  const applications = extractApplications(processedProducts);
  
  return {
    products: processedProducts,
    parameterRanges,
    categories,
    applications
  };
};

// 计算参数范围
const calculateParameterRanges = (products) => {
  const ranges = {
    processingCapacity: { min: Infinity, max: -Infinity },
    feedSize: { min: Infinity, max: -Infinity },
    outputSize: { min: Infinity, max: -Infinity },
    power: { min: Infinity, max: -Infinity },
    speed: { min: Infinity, max: -Infinity }
  };
  
  products.forEach(product => {
    const specs = product.specifications;
    
    Object.entries(ranges).forEach(([param, range]) => {
      if (specs[param]) {
        if (typeof specs[param] === 'object' && specs[param].min !== undefined) {
          range.min = Math.min(range.min, specs[param].min);
          range.max = Math.max(range.max, specs[param].max);
        } else if (typeof specs[param] === 'number') {
          range.min = Math.min(range.min, specs[param]);
          range.max = Math.max(range.max, specs[param]);
        }
      }
    });
  });
  
  // 处理无穷值
  Object.entries(ranges).forEach(([param, range]) => {
    if (range.min === Infinity) range.min = 0;
    if (range.max === -Infinity) range.max = 0;
  });
  
  return ranges;
};

// 提取类别
const extractCategories = (products) => {
  const categories = new Set();
  products.forEach(product => {
    if (product.category) categories.add(product.category);
  });
  return Array.from(categories);
};

// 提取应用领域
const extractApplications = (products) => {
  const applications = new Set();
  products.forEach(product => {
    if (product.applications) {
      product.applications.forEach(app => applications.add(app));
    }
  });
  return Array.from(applications);
};

// 主函数
const main = () => {
  console.log('Starting data preprocessing...');
  const processedData = preprocessData();
  
  // 保存处理后的数据
  saveProcessedData(processedData.products, 'products_processed.json');
  saveProcessedData({
    parameterRanges: processedData.parameterRanges,
    categories: processedData.categories,
    applications: processedData.applications
  }, 'product_metadata.json');
  
  console.log('Data preprocessing completed successfully!');
};

// 导出函数
export {
  preprocessData,
  loadProducts,
  saveProcessedData,
  main
};

// 如果直接运行此文件
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}