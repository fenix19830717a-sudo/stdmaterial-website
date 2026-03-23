import express from 'express';
import Category from '../models/Category.js';

const router = express.Router();

// 获取分类列表
router.get('/', async (req, res) => {
  try {
    const { level, parentId } = req.query;
    const query = {};
    
    if (level) {
      query.level = parseInt(level);
    }
    
    if (parentId) {
      query.parentId = parentId;
    }
    
    const categories = await Category.find(query).sort({ order: 1 });
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取分类树
router.get('/tree', async (req, res) => {
  try {
    const categoryTree = await Category.getCategoryTree();
    res.json({ success: true, data: categoryTree });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取单个分类
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id) || await Category.findOne({ categoryId: req.params.id });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 创建分类
router.post('/', async (req, res) => {
  try {
    const { name, parentId, order } = req.body;
    
    // 生成slug
    const slug = Category.generateSlug(name);
    // 生成categoryId
    const categoryId = `cat-${crypto.randomUUID()}`;
    // 计算层级
    let level = 1;
    if (parentId) {
      const parent = await Category.findOne({ categoryId: parentId });
      if (parent) {
        level = parent.level + 1;
      }
    }
    
    const category = new Category({
      categoryId,
      name,
      nameEn: name, // 暂时使用中文名称，后续会通过翻译模块更新
      slug,
      parentId,
      level,
      order
    });
    
    await category.save();
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// 更新分类
router.put('/:id', async (req, res) => {
  try {
    const { name, parentId, order, status } = req.body;
    
    const category = await Category.findById(req.params.id) || await Category.findOne({ categoryId: req.params.id });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    
    // 更新字段
    if (name) {
      category.name = name;
      category.slug = Category.generateSlug(name);
    }
    
    if (parentId !== undefined) {
      category.parentId = parentId;
      // 重新计算层级
      if (parentId) {
        const parent = await Category.findOne({ categoryId: parentId });
        if (parent) {
          category.level = parent.level + 1;
        }
      } else {
        category.level = 1;
      }
    }
    
    if (order !== undefined) {
      category.order = order;
    }
    
    if (status) {
      category.status = status;
    }
    
    await category.save();
    res.json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// 删除分类
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id) || await Category.findOne({ categoryId: req.params.id });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    
    // 检查是否有子分类
    const childCount = await Category.countDocuments({ parentId: category.categoryId });
    if (childCount > 0) {
      return res.status(400).json({ success: false, message: 'Cannot delete category with child categories' });
    }
    
    await category.remove();
    res.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;