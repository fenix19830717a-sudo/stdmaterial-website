import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// 获取商品列表
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search, status } = req.query;
    const query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (status) {
      query.status = status;
    }
    
    if (search) {
      query.$text = { $search: search };
    }
    
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ updatedAt: -1 });
    
    res.json({
      success: true,
      data: products,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取单个商品
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id) || await Product.findOne({ productId: req.params.id });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 创建商品
router.post('/', async (req, res) => {
  try {
    const { name, category, description, price, images, specs } = req.body;
    
    // 生成SKU
    const sku = await Product.generateSKU(category);
    // 生成slug
    const slug = Product.generateSlug(name);
    // 生成productId
    const productId = `prod-${crypto.randomUUID()}`;
    
    const product = new Product({
      productId,
      sku,
      name,
      nameEn: name, // 暂时使用中文名称，后续会通过翻译模块更新
      slug,
      category,
      categoryEn: category, // 暂时使用中文类别，后续会通过翻译模块更新
      description,
      descriptionEn: description, // 暂时使用中文描述，后续会通过翻译模块更新
      price,
      images,
      specs
    });
    
    await product.save();
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// 更新商品
router.put('/:id', async (req, res) => {
  try {
    const { name, category, description, price, images, specs, status } = req.body;
    
    const product = await Product.findById(req.params.id) || await Product.findOne({ productId: req.params.id });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    // 更新字段
    if (name) {
      product.name = name;
      product.slug = Product.generateSlug(name);
    }
    
    if (category) {
      product.category = category;
    }
    
    if (description) {
      product.description = description;
    }
    
    if (price !== undefined) {
      product.price = price;
    }
    
    if (images) {
      product.images = images;
    }
    
    if (specs) {
      product.specs = specs;
    }
    
    if (status) {
      product.status = status;
    }
    
    await product.save();
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// 删除商品
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id) || await Product.findOne({ productId: req.params.id });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    await product.remove();
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 批量操作
router.post('/batch', async (req, res) => {
  try {
    const { action, ids } = req.body;
    
    if (!action || !Array.isArray(ids)) {
      return res.status(400).json({ success: false, message: 'Invalid request' });
    }
    
    switch (action) {
      case 'delete':
        await Product.deleteMany({ _id: { $in: ids } });
        break;
      case 'activate':
        await Product.updateMany({ _id: { $in: ids } }, { $set: { status: 'active' } });
        break;
      case 'deactivate':
        await Product.updateMany({ _id: { $in: ids } }, { $set: { status: 'inactive' } });
        break;
      default:
        return res.status(400).json({ success: false, message: 'Invalid action' });
    }
    
    res.json({ success: true, message: `Batch ${action} completed` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;