import mongoose from 'mongoose';

// 分类数据模型
const categorySchema = new mongoose.Schema({
  categoryId: {
    type: String,
    unique: true,
    required: true,
    default: () => `cat-${crypto.randomUUID()}`
  },
  name: {
    type: String,
    required: true
  },
  nameEn: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },
  parentId: {
    type: String,
    default: null
  },
  level: {
    type: Number,
    default: 1
  },
  order: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// 创建索引
categorySchema.index({ categoryId: 1 }, { unique: true });
categorySchema.index({ slug: 1 }, { unique: true });
categorySchema.index({ parentId: 1 });
categorySchema.index({ level: 1 });
categorySchema.index({ order: 1 });

// 自动更新updatedAt字段
categorySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// 生成slug的静态方法
categorySchema.statics.generateSlug = function(name) {
  return name
    .toLowerCase()
    .replace(/[\s\u4e00-\u9fa5]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

// 获取分类树的静态方法
categorySchema.statics.getCategoryTree = async function() {
  const categories = await this.find({ status: 'active' }).sort({ order: 1 });
  const categoryMap = new Map();
  const rootCategories = [];
  
  // 构建分类映射
  categories.forEach(category => {
    categoryMap.set(category.categoryId, {
      ...category.toObject(),
      children: []
    });
  });
  
  // 构建分类树
  categories.forEach(category => {
    const categoryObj = categoryMap.get(category.categoryId);
    if (category.parentId) {
      const parent = categoryMap.get(category.parentId);
      if (parent) {
        parent.children.push(categoryObj);
      }
    } else {
      rootCategories.push(categoryObj);
    }
  });
  
  return rootCategories;
};

const Category = mongoose.model('Category', categorySchema);
export default Category;