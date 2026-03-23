import mongoose from 'mongoose';

// 产品数据模型
const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    unique: true,
    required: true,
    default: () => `prod-${crypto.randomUUID()}`
  },
  sku: {
    type: String,
    unique: true,
    required: true,
    uppercase: true
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
  category: {
    type: String,
    required: true
  },
  categoryEn: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  descriptionEn: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    default: 0
  },
  images: {
    type: [String],
    default: []
  },
  specs: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft'],
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
productSchema.index({ productId: 1 }, { unique: true });
productSchema.index({ sku: 1 }, { unique: true });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ name: 'text', nameEn: 'text', description: 'text', descriptionEn: 'text' });

// 自动更新updatedAt字段
productSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// 生成SKU的静态方法
productSchema.statics.generateSKU = async function(category) {
  const prefix = category.split('-').map(word => word.charAt(0).toUpperCase()).join('');
  const lastProduct = await this.findOne({ sku: new RegExp(`^STD-${prefix}-`) }, { sku: 1 }).sort({ sku: -1 });
  
  let sequence = 1;
  if (lastProduct) {
    const match = lastProduct.sku.match(/STD-${prefix}-(\d+)/);
    if (match) {
      sequence = parseInt(match[1]) + 1;
    }
  }
  
  return `STD-${prefix}-${sequence.toString().padStart(3, '0')}`;
};

// 生成slug的静态方法
productSchema.statics.generateSlug = function(name) {
  return name
    .toLowerCase()
    .replace(/[\s\u4e00-\u9fa5]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

const Product = mongoose.model('Product', productSchema);
export default Product;