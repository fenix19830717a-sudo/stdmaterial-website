const OpenAI = require('openai');
const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

// 初始化 OpenAI (使用 GPT Key)
const openai = new OpenAI({
    apiKey: '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'
});

// 天创研磨设备产品数据 (基于官网信息)
const TENCAN_PRODUCTS = [
    // 行星球磨机系列
    {
        category: '行星球磨机',
        series: 'XQM系列',
        products: [
            {
                name: 'XQM-0.4A 立式行星球磨机',
                model: 'XQM-0.4A',
                capacity: '0.4L',
                description: '实验室小型行星球磨机，适用于小批量样品研磨',
                features: ['立式结构', '4个研磨罐', '转速可调', '定时功能'],
                applications: ['实验室研究', '材料分析', '粉末制备'],
                specs: {
                    volume: '0.4L',
                    speed: '0-900 rpm',
                    power: '0.25kW',
                    voltage: '220V/50Hz'
                }
            },
            {
                name: 'XQM-2 立式行星球磨机',
                model: 'XQM-2',
                capacity: '2L',
                description: '中型实验室行星球磨机，适合中等批量样品处理',
                features: ['4个研磨罐', '变频调速', 'LCD显示', '过载保护'],
                applications: ['材料科学', '化工实验', '地质分析'],
                specs: {
                    volume: '2L',
                    speed: '0-800 rpm',
                    power: '0.75kW',
                    voltage: '220V/50Hz'
                }
            },
            {
                name: 'XQM-4 立式行星球磨机',
                model: 'XQM-4',
                capacity: '4L',
                description: '大容量行星球磨机，适合大批量样品研磨',
                features: ['4个研磨罐', '智能控制', '安全锁', '低噪音'],
                applications: ['工业生产', '科研单位', '质检中心'],
                specs: {
                    volume: '4L',
                    speed: '0-700 rpm',
                    power: '1.5kW',
                    voltage: '380V/50Hz'
                }
            },
            {
                name: 'XQM-8 立式行星球磨机',
                model: 'XQM-8',
                capacity: '8L',
                description: '工业级行星球磨机，满足大规模生产需求',
                features: ['4个研磨罐', 'PLC控制', '触摸屏', '自动停机'],
                applications: ['工业生产', '新材料研发', '粉末冶金'],
                specs: {
                    volume: '8L',
                    speed: '0-600 rpm',
                    power: '3kW',
                    voltage: '380V/50Hz'
                }
            }
        ]
    },
    // 卧式行星球磨机
    {
        category: '卧式行星球磨机',
        series: 'XQM-W系列',
        products: [
            {
                name: 'XQM-20W 卧式行星球磨机',
                model: 'XQM-20W',
                capacity: '20L',
                description: '卧式结构设计，适合长时间连续运转',
                features: ['卧式结构', '水冷系统', '4个研磨罐', '大容量'],
                applications: ['连续生产', '大规模实验', '工业制备'],
                specs: {
                    volume: '20L',
                    speed: '0-500 rpm',
                    power: '5.5kW',
                    voltage: '380V/50Hz'
                }
            }
        ]
    },
    // 研磨罐系列
    {
        category: '研磨罐',
        series: '不锈钢/陶瓷/玛瑙',
        products: [
            {
                name: '不锈钢研磨罐',
                model: 'G-SS-250',
                capacity: '250ml',
                description: '304不锈钢材质，耐腐蚀，适合一般物料研磨',
                features: ['304不锈钢', '密封性好', '易清洗', '耐用'],
                applications: ['食品', '化工', '医药'],
                specs: {
                    material: '304不锈钢',
                    volume: '250ml-5L',
                    hardness: 'HRC 20-25'
                }
            },
            {
                name: '氧化锆陶瓷研磨罐',
                model: 'G-ZrO2-250',
                capacity: '250ml',
                description: '高纯度氧化锆材质，无污染，适合高纯度材料研磨',
                features: ['高纯度ZrO2', '无污染', '高硬度', '耐磨损'],
                applications: ['电子材料', '陶瓷粉末', '纳米材料'],
                specs: {
                    material: '95% ZrO2',
                    volume: '50ml-5L',
                    hardness: 'HRA 85-90'
                }
            },
            {
                name: '玛瑙研磨罐',
                model: 'G-Agate-250',
                capacity: '250ml',
                description: '天然玛瑙材质，适合超细粉碎和混合',
                features: ['天然玛瑙', '超细研磨', '化学稳定', '美观'],
                applications: ['贵金属', '宝石粉末', '高纯材料'],
                specs: {
                    material: '天然玛瑙',
                    volume: '50ml-2L',
                    hardness: 'Mohs 6.5-7'
                }
            },
            {
                name: '碳化钨研磨罐',
                model: 'G-WC-250',
                capacity: '250ml',
                description: '超硬碳化钨材质，适合硬质合金研磨',
                features: ['超硬材质', '极耐磨损', '高密度', '长寿命'],
                applications: ['硬质合金', '金属粉末', '超硬材料'],
                specs: {
                    material: 'WC-Co',
                    volume: '50ml-1L',
                    hardness: 'HRA 89-91'
                }
            }
        ]
    },
    // 研磨珠系列
    {
        category: '研磨珠',
        series: '多种材质',
        products: [
            {
                name: '氧化锆研磨珠',
                model: 'B-ZrO2-5',
                size: 'Φ5mm',
                description: '高纯度氧化锆研磨珠，研磨效率高，磨损低',
                features: ['高纯度', '高密度', '低磨损', '球形度好'],
                applications: ['纳米材料', '涂料', '油墨'],
                specs: {
                    material: '95% ZrO2',
                    size: 'Φ0.1-50mm',
                    density: '5.9-6.0 g/cm³'
                }
            },
            {
                name: '氧化铝研磨珠',
                model: 'B-Al2O3-10',
                size: 'Φ10mm',
                description: '高铝瓷研磨珠，性价比高，适合一般研磨',
                features: ['高铝含量', '经济实惠', '通用性强', '稳定'],
                applications: ['陶瓷', '矿物', '建材'],
                specs: {
                    material: '92-99% Al2O3',
                    size: 'Φ1-50mm',
                    density: '3.6-3.9 g/cm³'
                }
            },
            {
                name: '不锈钢研磨珠',
                model: 'B-SS-8',
                size: 'Φ8mm',
                description: '304不锈钢研磨珠，适合金属粉末研磨',
                features: ['304不锈钢', '磁性可分离', '耐用', '经济'],
                applications: ['金属粉末', '合金材料', '磁性材料'],
                specs: {
                    material: '304/316不锈钢',
                    size: 'Φ1-20mm',
                    density: '7.9 g/cm³'
                }
            }
        ]
    },
    // 搅拌设备
    {
        category: '搅拌设备',
        series: 'JB系列',
        products: [
            {
                name: 'JB-100 实验室搅拌机',
                model: 'JB-100',
                capacity: '100L',
                description: '实验室用搅拌设备，适合液体混合和分散',
                features: ['变频调速', '数显控制', '升降支架', '多种桨叶'],
                applications: ['涂料', '油墨', '化妆品', '食品'],
                specs: {
                    volume: '100L',
                    speed: '0-1500 rpm',
                    power: '1.1kW',
                    voltage: '220V/50Hz'
                }
            },
            {
                name: 'JB-200 工业搅拌机',
                model: 'JB-200',
                capacity: '200L',
                description: '工业级搅拌设备，大容量高效混合',
                features: ['大功率', '稳定运行', '防爆设计', '易维护'],
                applications: ['化工生产', '涂料生产', '胶粘剂'],
                specs: {
                    volume: '200L',
                    speed: '0-1200 rpm',
                    power: '2.2kW',
                    voltage: '380V/50Hz'
                }
            }
        ]
    }
];

/**
 * 生成产品图片 (使用 DALL-E)
 */
async function generateProductImage(product, category) {
    try {
        console.log(`🎨 Generating image: ${product.name}`);
        
        // 根据产品类型构建提示词
        let prompt = '';
        
        if (category.includes('球磨机')) {
            prompt = `Professional industrial product photography of a planetary ball mill machine, 
                ${product.model}, ${product.capacity} capacity, 
                stainless steel construction, digital control panel, 
                laboratory setting, clean white background, 
                studio lighting, high quality, 4k resolution,
                technical equipment, precision instrument`;
        } else if (category.includes('研磨罐')) {
            prompt = `Professional product photography of a ${product.specs.material} grinding jar,
                cylindrical shape, ${product.capacity} capacity,
                polished surface, industrial laboratory equipment,
                clean white background, studio lighting,
                high quality, 4k resolution`;
        } else if (category.includes('研磨珠')) {
            prompt = `Professional product photography of ${product.specs.material} grinding balls,
                spherical shape, ${product.size} diameter,
                pile of metallic/ceramic spheres, shiny surface,
                clean white background, studio lighting,
                high quality, 4k resolution`;
        } else if (category.includes('搅拌')) {
            prompt = `Professional industrial product photography of a laboratory mixer,
                ${product.model}, ${product.capacity} capacity,
                stainless steel construction, mixing paddle,
                digital control panel, clean white background,
                studio lighting, high quality, 4k resolution`;
        }
        
        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: prompt,
            n: 1,
            size: "1024x1024",
            quality: "standard"
        });
        
        const imageUrl = response.data[0].url;
        
        // 下载图片
        const imageResponse = await axios.get(imageUrl, { 
            responseType: 'arraybuffer',
            timeout: 60000
        });
        
        const safeName = product.name.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_');
        const imagePath = path.join(__dirname, '../images/products', `${safeName}.png`);
        
        await fs.ensureDir(path.dirname(imagePath));
        await fs.writeFile(imagePath, imageResponse.data);
        
        console.log(`✅ Image saved: ${imagePath}`);
        return path.basename(imagePath);
        
    } catch (error) {
        console.error(`❌ Failed to generate image for ${product.name}:`, error.message);
        return null;
    }
}

/**
 * 生成产品详细描述
 */
async function generateProductDescription(product, category) {
    try {
        console.log(`📝 Generating description: ${product.name}`);
        
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: "你是天创粉末技术有限公司的产品专家，擅长撰写专业的研磨设备产品描述。请用中文撰写。"
                },
                {
                    role: "user",
                    content: `请为以下研磨设备撰写详细的产品描述（400-500字）：

产品名称：${product.name}
型号：${product.model}
类别：${category}
容量/规格：${product.capacity || product.size}
特点：${product.features.join('、')}
应用：${product.applications.join('、')}
技术参数：${JSON.stringify(product.specs, null, 2)}

请包含以下内容：
1. 产品概述（突出核心优势）
2. 主要特点（详细说明）
3. 技术参数表
4. 应用领域
5. 为什么选择这款产品`
                }
            ],
            temperature: 0.7,
            max_tokens: 1500
        });
        
        const description = response.choices[0].message.content;
        console.log(`✅ Description generated: ${product.name}`);
        return description;
        
    } catch (error) {
        console.error(`❌ Failed to generate description:`, error.message);
        return product.description;
    }
}

/**
 * 生成所有产品
 */
async function generateAllProducts() {
    const allProducts = [];
    
    for (const categoryData of TENCAN_PRODUCTS) {
        console.log(`\n📦 Processing category: ${categoryData.category}`);
        
        for (const product of categoryData.products) {
            // 生成图片
            const imageName = await generateProductImage(product, categoryData.category);
            
            // 延迟避免 API 限制
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // 生成描述
            const description = await generateProductDescription(product, categoryData.category);
            
            allProducts.push({
                id: `tencan_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
                name: product.name,
                model: product.model,
                category: categoryData.category,
                series: categoryData.series,
                capacity: product.capacity || product.size,
                shortDescription: product.description,
                fullDescription: description,
                features: product.features,
                applications: product.applications,
                specs: product.specs,
                image: imageName || 'placeholder.jpg',
                price: generatePrice(categoryData.category, product.capacity),
                stock: Math.floor(Math.random() * 50 + 10),
                brand: '天创粉末',
                origin: '中国',
                warranty: '1年',
                createdAt: new Date().toISOString()
            });
            
            // 保存进度
            await saveProgress(allProducts);
            
            // 延迟
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
    
    return allProducts;
}

/**
 * 生成价格
 */
function generatePrice(category, capacity) {
    const basePrices = {
        '行星球磨机': 15000,
        '卧式行星球磨机': 50000,
        '研磨罐': 800,
        '研磨珠': 200,
        '搅拌设备': 8000
    };
    
    let base = basePrices[category] || 5000;
    
    // 根据容量调整
    if (capacity) {
        const vol = parseFloat(capacity);
        if (!isNaN(vol) && vol > 1) {
            base = base * (1 + vol * 0.1);
        }
    }
    
    // 添加随机波动
    return Math.floor(base * (0.9 + Math.random() * 0.2));
}

/**
 * 保存进度
 */
async function saveProgress(products) {
    const dataPath = path.join(__dirname, '../data/products_progress.json');
    await fs.ensureDir(path.dirname(dataPath));
    await fs.writeFile(dataPath, JSON.stringify(products, null, 2));
}

/**
 * 生成产品展示页面
 */
async function generateProductPage(products) {
    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>产品中心 - 天创粉末技术有限公司</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: #f5f7fa;
            color: #333;
        }
        .header {
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            color: white;
            padding: 60px 20px;
            text-align: center;
        }
        .header h1 { font-size: 2.5em; margin-bottom: 15px; }
        .header p { font-size: 1.2em; opacity: 0.9; }
        .container { max-width: 1400px; margin: 0 auto; padding: 40px 20px; }
        .category-section { margin-bottom: 60px; }
        .category-title {
            font-size: 1.8em;
            color: #1e3c72;
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 3px solid #2a5298;
        }
        .category-desc { color: #666; margin-bottom: 30px; }
        .products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 30px;
        }
        .product-card {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
        }
        .product-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 24px rgba(0,0,0,0.15);
        }
        .product-image {
            width: 100%;
            height: 280px;
            object-fit: cover;
            background: #f0f0f0;
        }
        .product-info { padding: 25px; }
        .product-model {
            color: #2a5298;
            font-size: 0.85em;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .product-name {
            font-size: 1.3em;
            color: #1e3c72;
            margin: 10px 0;
            font-weight: 600;
        }
        .product-desc {
            color: #666;
            font-size: 0.95em;
            line-height: 1.6;
            margin-bottom: 15px;
        }
        .product-features {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 15px;
        }
        .feature-tag {
            background: #e8f0fe;
            color: #1e3c72;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.8em;
        }
        .product-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 15px;
            border-top: 1px solid #eee;
        }
        .product-price {
            font-size: 1.4em;
            color: #e74c3c;
            font-weight: bold;
        }
        .product-price span {
            font-size: 0.6em;
            color: #999;
            font-weight: normal;
        }
        .btn {
            background: #2a5298;
            color: white;
            padding: 10px 24px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.9em;
            transition: background 0.3s;
        }
        .btn:hover { background: #1e3c72; }
        .footer {
            background: #1e3c72;
            color: white;
            text-align: center;
            padding: 40px 20px;
            margin-top: 60px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>天创粉末技术有限公司</h1>
        <p>专业研磨设备制造商 - 行星球磨机 | 研磨罐 | 研磨珠 | 搅拌设备</p>
    </div>
    
    <div class="container">
        ${groupByCategory(products).map(cat => `
        <div class="category-section">
            <h2 class="category-title">${cat.category}</h2>
            <p class="category-desc">${getCategoryDesc(cat.category)}</p>
            <div class="products-grid">
                ${cat.products.map(p => `
                <div class="product-card">
                    <img src="images/products/${p.image}" alt="${p.name}" class="product-image" onerror="this.src='https://via.placeholder.com/400x300?text=${encodeURIComponent(p.name)}'">
                    <div class="product-info">
                        <div class="product-model">${p.model}</div>
                        <h3 class="product-name">${p.name}</h3>
                        <p class="product-desc">${p.shortDescription}</p>
                        <div class="product-features">
                            ${p.features.map(f => `<span class="feature-tag">${f}</span>`).join('')}
                        </div>
                        <div class="product-footer">
                            <div class="product-price">¥${p.price.toLocaleString()}<span>起</span></div>
                            <button class="btn">查看详情</button>
                        </div>
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
        `).join('')}
    </div>
    
    <div class="footer">
        <p>© 2024 天创粉末技术有限公司 | 专业研磨设备解决方案</p>
        <p>电话: 0731-12345678 | 邮箱: sales@tencanmills.com</p>
    </div>
</body>
</html>`;

    const htmlPath = path.join(__dirname, '../products.html');
    await fs.writeFile(htmlPath, html);
    console.log(`✅ Product page saved: ${htmlPath}`);
}

function groupByCategory(products) {
    const groups = {};
    products.forEach(p => {
        if (!groups[p.category]) {
            groups[p.category] = { category: p.category, products: [] };
        }
        groups[p.category].products.push(p);
    });
    return Object.values(groups);
}

function getCategoryDesc(category) {
    const descs = {
        '行星球磨机': '实验室和工业级行星球磨机，满足各种研磨需求',
        '卧式行星球磨机': '大容量卧式设计，适合连续生产',
        '研磨罐': '多种材质可选：不锈钢、氧化锆、玛瑙、碳化钨',
        '研磨珠': '高纯度研磨介质，提高研磨效率',
        '搅拌设备': '实验室和工业级搅拌设备，高效混合分散'
    };
    return descs[category] || '';
}

// 主函数
async function main() {
    console.log('🚀 天创粉末 - 产品生成系统\n');
    console.log('正在生成研磨设备产品数据和图片...\n');
    
    try {
        const products = await generateAllProducts();
        
        // 保存完整数据
        const dataPath = path.join(__dirname, '../data/tencan_products.json');
        await fs.ensureDir(path.dirname(dataPath));
        await fs.writeFile(dataPath, JSON.stringify(products, null, 2));
        
        // 生成产品页面
        await generateProductPage(products);
        
        console.log(`\n✅ 生成完成！`);
        console.log(`📊 共生成 ${products.length} 个产品`);
        console.log(`📁 数据文件: ${dataPath}`);
        console.log(`🌐 产品页面: /products.html`);
        
    } catch (error) {
        console.error('❌ 生成失败:', error);
        process.exit(1);
    }
}

main();
