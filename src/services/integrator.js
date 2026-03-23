import SBWorldCrawler from './crawler/sbworldCrawler.js';
import Translator from './translator.js';
import ImageProcessor from './imageProcessor.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import fs from 'fs';
import path from 'path';

class Integrator {
  constructor() {
    this.crawler = new SBWorldCrawler();
    this.translator = new Translator('YOUR_API_KEY'); // 替换为实际的API密钥
    this.imageProcessor = new ImageProcessor();
  }

  async integrate() {
    try {
      console.log('开始集成流程...');

      // 1. 抓取商品数据
      console.log('Step 1: 抓取商品数据');
      const products = await this.crawler.crawlAll();
      console.log(`抓取了 ${products.length} 个商品`);

      // 2. 翻译商品数据
      console.log('Step 2: 翻译商品数据');
      const translatedProducts = await this.translator.translateProducts(products);
      console.log('翻译完成');

      // 3. 处理商品图片
      console.log('Step 3: 处理商品图片');
      const processedProducts = [];
      for (const product of translatedProducts) {
        const processedImages = await this.imageProcessor.processProductImages(product);
        processedProducts.push({
          ...product,
          images: processedImages
        });
      }
      console.log('图片处理完成');

      // 4. 保存到数据库
      console.log('Step 4: 保存到数据库');
      await this.saveToDatabase(processedProducts);
      console.log('保存到数据库完成');

      // 5. 生成报告
      console.log('Step 5: 生成报告');
      this.generateReport(processedProducts);
      console.log('报告生成完成');

      console.log('集成流程完成！');
      return processedProducts;
    } catch (error) {
      console.error('集成过程中出错:', error);
      throw error;
    }
  }

  async saveToDatabase(products) {
    try {
      for (const product of products) {
        // 生成SKU
        const sku = await Product.generateSKU(product.category);
        // 生成slug
        const slug = Product.generateSlug(product.name);
        // 生成productId
        const productId = `prod-${crypto.randomUUID()}`;

        // 检查分类是否存在，不存在则创建
        let category = await Category.findOne({ name: product.category });
        if (!category) {
          category = new Category({
            categoryId: `cat-${crypto.randomUUID()}`,
            name: product.category,
            nameEn: product.categoryEn,
            slug: Category.generateSlug(product.category),
            parentId: null,
            level: 1,
            order: 0
          });
          await category.save();
        }

        // 创建或更新商品
        let existingProduct = await Product.findOne({ source_url: product.source_url });
        if (existingProduct) {
          // 更新现有商品
          existingProduct.name = product.name;
          existingProduct.nameEn = product.nameEn;
          existingProduct.description = product.description;
          existingProduct.descriptionEn = product.descriptionEn;
          existingProduct.category = product.category;
          existingProduct.categoryEn = product.categoryEn;
          existingProduct.images = product.images;
          existingProduct.updatedAt = new Date();
          await existingProduct.save();
        } else {
          // 创建新商品
          const newProduct = new Product({
            productId,
            sku,
            name: product.name,
            nameEn: product.nameEn,
            slug,
            category: product.category,
            categoryEn: product.categoryEn,
            description: product.description,
            descriptionEn: product.descriptionEn,
            price: 0, // 默认价格，后续可以手动修改
            images: product.images,
            specs: {},
            status: 'active'
          });
          await newProduct.save();
        }
      }
    } catch (error) {
      console.error('保存到数据库时出错:', error);
      throw error;
    }
  }

  generateReport(products) {
    const report = {
      totalProducts: products.length,
      processedAt: new Date().toISOString(),
      products: products.map(product => ({
        name: product.name,
        nameEn: product.nameEn,
        category: product.category,
        categoryEn: product.categoryEn,
        imageCount: product.images.length,
        sourceUrl: product.source_url
      }))
    };

    const reportPath = path.join(process.cwd(), 'data', 'integration_report.json');
    if (!fs.existsSync(path.dirname(reportPath))) {
      fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    }
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log(`报告已生成: ${reportPath}`);
  }

  async runTest() {
    try {
      console.log('开始测试集成流程...');

      // 测试数据抓取
      console.log('测试数据抓取...');
      await this.crawler.init();
      const testProducts = await this.crawler.crawlProductList();
      console.log(`测试抓取了 ${testProducts.length} 个商品`);
      await this.crawler.close();

      // 测试翻译
      if (testProducts.length > 0) {
        console.log('测试翻译...');
        const testProduct = testProducts[0];
        const translatedProduct = await this.translator.translateProduct(testProduct);
        console.log(`翻译测试: ${testProduct.name} -> ${translatedProduct.nameEn}`);
      }

      // 测试图片处理
      if (testProducts.length > 0 && testProducts[0].images.length > 0) {
        console.log('测试图片处理...');
        const testProduct = testProducts[0];
        const processedImages = await this.imageProcessor.processProductImages(testProduct);
        console.log(`图片处理测试: ${testProduct.images.length} -> ${processedImages.length}`);
      }

      console.log('测试完成！');
    } catch (error) {
      console.error('测试过程中出错:', error);
      throw error;
    }
  }
}

export default Integrator;