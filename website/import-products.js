import fs from 'fs';
import mongoose from 'mongoose';
import Product from './src/models/Product.js';

// 连接数据库
mongoose.connect('mongodb://localhost:27017/stdmaterial', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('数据库连接成功');
  importProducts();
}).catch((error) => {
  console.error('数据库连接失败:', error);
});

// 导入产品数据
const importProducts = async () => {
  try {
    // 读取产品数据
    const productsData = JSON.parse(fs.readFileSync('./data/products.json', 'utf8'));
    
    // 分类映射
    const categoryMap = {
      'Crushing Series': 'broken-series',
      'Grinding Jars': 'grinding-series',
      'Planetary Ball Mills': 'grinding-series'
    };
    
    // 清空现有产品数据
    await Product.deleteMany({});
    console.log('清空现有产品数据');
    
    // 导入新产品数据
    const importPromises = productsData.products.map(async (product) => {
      // 生成SKU
      const categorySlug = categoryMap[product.category] || 'other';
      const prefix = categorySlug.split('-').map(word => word.charAt(0).toUpperCase()).join('');
      const lastProduct = await Product.findOne({ sku: new RegExp(`^STD-${prefix}-`) }, { sku: 1 }).sort({ sku: -1 });
      
      let sequence = 1;
      if (lastProduct) {
        const match = lastProduct.sku.match(/STD-${prefix}-(\d+)/);
        if (match) {
          sequence = parseInt(match[1]) + 1;
        }
      }
      
      const sku = `STD-${prefix}-${sequence.toString().padStart(3, '0')}`;
      
      // 生成slug
      const slug = product.name
        .toLowerCase()
        .replace(/[\s\u4e00-\u9fa5]+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      // 创建产品
      const newProduct = new Product({
        productId: product.id,
        sku,
        name: product.name,
        nameEn: product.nameEn || product.name,
        slug,
        category: categoryMap[product.category] || 'other',
        categoryEn: product.category,
        description: product.description,
        descriptionEn: product.descriptionEn || product.description,
        price: 0, // 价格需要手动设置
        images: product.images,
        specs: product.specifications,
        status: 'active',
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      });
      
      await newProduct.save();
      console.log(`导入产品: ${product.name}`);
    });
    
    await Promise.all(importPromises);
    console.log('产品数据导入完成');
    
    // 关闭数据库连接
    mongoose.disconnect();
  } catch (error) {
    console.error('导入产品数据失败:', error);
    mongoose.disconnect();
  }
};
