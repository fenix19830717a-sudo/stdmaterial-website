const OpenAI = require('openai');
const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

// 初始化 OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'
});

// 产品类别定义
const PRODUCT_CATEGORIES = [
    {
        category: '工业材料',
        products: [
            { name: '高强度合金钢', description: '用于航空航天和汽车制造的高强度合金钢材' },
            { name: '碳纤维复合材料', description: '轻量化、高强度的碳纤维复合材料' },
            { name: '耐高温陶瓷', description: '可承受2000°C高温的工业陶瓷材料' }
        ]
    },
    {
        category: '建筑材料',
        products: [
            { name: '环保隔音板', description: '采用再生材料制成的环保隔音板材' },
            { name: '智能调光玻璃', description: '可根据光线自动调节透明度的智能玻璃' },
            { name: '自修复混凝土', description: '具有微裂缝自修复功能的先进混凝土' }
        ]
    },
    {
        category: '电子材料',
        products: [
            { name: '柔性电路板基材', description: '可弯曲折叠的柔性电路板基础材料' },
            { name: '导热硅脂', description: '高导热系数的CPU散热硅脂' },
            { name: '电磁屏蔽膜', description: '5G设备专用的电磁干扰屏蔽膜' }
        ]
    }
];

/**
 * 生成产品图片
 */
async function generateProductImage(product) {
    try {
        console.log(`Generating image for: ${product.name}`);
        
        const prompt = `Professional product photography of ${product.name}, 
            ${product.description}, 
            clean white background, 
            studio lighting, 
            high quality, 
            commercial product shot,
            4k resolution`;
        
        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: prompt,
            n: 1,
            size: "1024x1024",
            quality: "standard"
        });
        
        const imageUrl = response.data[0].url;
        
        // 下载图片
        const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const imagePath = path.join(__dirname, '../images/products', `${product.name.replace(/\s+/g, '_')}.png`);
        
        await fs.ensureDir(path.dirname(imagePath));
        await fs.writeFile(imagePath, imageResponse.data);
        
        console.log(`✅ Image saved: ${imagePath}`);
        return imagePath;
        
    } catch (error) {
        console.error(`❌ Failed to generate image for ${product.name}:`, error.message);
        return null;
    }
}

/**
 * 生成产品详细描述
 */
async function generateProductDescription(product) {
    try {
        console.log(`Generating description for: ${product.name}`);
        
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "你是一个专业的产品文案撰写专家，擅长为工业材料产品撰写吸引人的产品描述。"
                },
                {
                    role: "user",
                    content: `请为以下产品撰写详细的产品描述（300字左右），包括产品特点、应用场景、技术优势：
                    
产品名称：${product.name}
产品简介：${product.description}

请用中文撰写，格式如下：
- 产品概述（1段）
- 核心特点（3-5点）
- 应用场景（2-3个）
- 技术参数（简要）`
                }
            ],
            temperature: 0.7
        });
        
        const description = response.choices[0].message.content;
        console.log(`✅ Description generated for ${product.name}`);
        return description;
        
    } catch (error) {
        console.error(`❌ Failed to generate description for ${product.name}:`, error.message);
        return product.description;
    }
}

/**
 * 生成产品数据文件
 */
async function generateProductData() {
    const products = [];
    
    for (const category of PRODUCT_CATEGORIES) {
        console.log(`\n📦 Processing category: ${category.category}`);
        
        for (const product of category.products) {
            // 生成图片
            const imagePath = await generateProductImage(product);
            
            // 生成描述
            const description = await generateProductDescription(product);
            
            products.push({
                id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                name: product.name,
                category: category.category,
                shortDescription: product.description,
                fullDescription: description,
                image: imagePath ? path.basename(imagePath) : 'placeholder.jpg',
                price: Math.floor(Math.random() * 5000 + 1000), // 随机价格 1000-6000
                stock: Math.floor(Math.random() * 100 + 50),
                createdAt: new Date().toISOString()
            });
            
            // 延迟避免 API 限制
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
    
    // 保存产品数据
    const dataPath = path.join(__dirname, '../data/products.json');
    await fs.ensureDir(path.dirname(dataPath));
    await fs.writeFile(dataPath, JSON.stringify(products, null, 2));
    
    console.log(`\n✅ Generated ${products.length} products`);
    console.log(`📁 Data saved to: ${dataPath}`);
    
    return products;
}

/**
 * 生成产品展示 HTML
 */
async function generateProductHTML(products) {
    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>产品中心 - stdmaterial.com</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 40px 0; }
        .header h1 { font-size: 2.5em; color: #333; margin-bottom: 10px; }
        .header p { color: #666; font-size: 1.1em; }
        .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 30px; margin-top: 40px; }
        .product-card { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); transition: transform 0.3s; }
        .product-card:hover { transform: translateY(-5px); box-shadow: 0 5px 20px rgba(0,0,0,0.15); }
        .product-image { width: 100%; height: 250px; object-fit: cover; background: #f0f0f0; }
        .product-info { padding: 20px; }
        .product-category { color: #0066cc; font-size: 0.85em; text-transform: uppercase; letter-spacing: 1px; }
        .product-name { font-size: 1.3em; color: #333; margin: 10px 0; }
        .product-desc { color: #666; font-size: 0.9em; line-height: 1.6; margin-bottom: 15px; }
        .product-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 15px; border-top: 1px solid #eee; }
        .product-price { font-size: 1.4em; color: #e74c3c; font-weight: bold; }
        .product-stock { color: #27ae60; font-size: 0.85em; }
        .btn { background: #0066cc; color: white; padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-size: 0.9em; }
        .btn:hover { background: #0052a3; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>产品中心</h1>
            <p>高品质工业材料，助力您的创新项目</p>
        </div>
        
        <div class="products-grid">
            ${products.map(p => `
            <div class="product-card">
                <img src="images/products/${p.image}" alt="${p.name}" class="product-image" onerror="this.src='https://via.placeholder.com/400x300?text=${encodeURIComponent(p.name)}'">
                <div class="product-info">
                    <div class="product-category">${p.category}</div>
                    <h3 class="product-name">${p.name}</h3>
                    <p class="product-desc">${p.shortDescription}</p>
                    <div class="product-footer">
                        <span class="product-price">¥${p.price}</span>
                        <span class="product-stock">库存: ${p.stock}</span>
                    </div>
                    <button class="btn" style="width: 100%; margin-top: 15px;">查看详情</button>
                </div>
            </div>
            `).join('')}
        </div>
    </div>
</body>
</html>`;

    const htmlPath = path.join(__dirname, '../products.html');
    await fs.writeFile(htmlPath, html);
    console.log(`✅ Product HTML saved to: ${htmlPath}`);
}

// 主函数
async function main() {
    console.log('🚀 Starting Product Generation...\n');
    
    if (!process.env.OPENAI_API_KEY) {
        console.error('❌ Error: OPENAI_API_KEY environment variable is required');
        console.log('Please set it with: export OPENAI_API_KEY=your_key_here');
        process.exit(1);
    }
    
    try {
        const products = await generateProductData();
        await generateProductHTML(products);
        console.log('\n✨ Product generation completed!');
    } catch (error) {
        console.error('❌ Generation failed:', error);
        process.exit(1);
    }
}

main();
