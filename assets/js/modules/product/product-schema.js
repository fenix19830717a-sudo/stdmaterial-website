import Ajv from 'ajv';

// 商品数据模型的JSON Schema定义
const productSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      pattern: '^prod_[a-zA-Z0-9_-]{8,}$'
    },
    name: {
      type: 'string',
      minLength: 1,
      maxLength: 255
    },
    description: {
      type: 'string',
      maxLength: 1000
    },
    price: {
      type: 'number',
      minimum: 0
    },
    category: {
      type: 'string',
      enum: ['planetary_mill', 'ball_mill', 'grinding_media', 'accessories']
    },
    specifications: {
      type: 'object',
      properties: {
        capacity: {
          type: 'string'
        },
        power: {
          type: 'string'
        },
        speed: {
          type: 'string'
        },
        weight: {
          type: 'string'
        },
        dimensions: {
          type: 'string'
        }
      },
      additionalProperties: true
    },
    images: {
      type: 'array',
      items: {
        type: 'string'
      }
    },
    stock: {
      type: 'integer',
      minimum: 0
    },
    createdAt: {
      type: 'string'
    },
    updatedAt: {
      type: 'string'
    },
    tags: {
      type: 'array',
      items: {
        type: 'string'
      }
    }
  },
  required: ['id', 'name', 'price', 'category']
};

// 创建AJV验证器
const ajv = new Ajv({
  allErrors: true,
  coerceTypes: true
});

// 编译验证函数
const validateProduct = ajv.compile(productSchema);

// 验证商品数据
function validateProductData(productData) {
  const valid = validateProduct(productData);
  if (!valid) {
    return {
      valid: false,
      errors: validateProduct.errors
    };
  }
  return {
    valid: true,
    data: productData
  };
}

// 生成商品ID
function generateProductId() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 8);
  return `prod_${timestamp}_${random}`;
}

// 准备商品数据（添加默认值和ID）
function prepareProductData(productData) {
  const now = new Date().toISOString();
  return {
    id: productData.id || generateProductId(),
    createdAt: productData.createdAt || now,
    updatedAt: now,
    ...productData
  };
}

export {
  productSchema,
  validateProductData,
  generateProductId,
  prepareProductData
};
