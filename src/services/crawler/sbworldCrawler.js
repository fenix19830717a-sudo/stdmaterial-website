import puppeteer from 'puppeteer';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

class SBWorldCrawler {
  constructor() {
    this.baseUrl = 'https://www.sbworld.cn';
    this.products = [];
  }

  async init() {
    this.browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async crawlProductList() {
    try {
      const page = await this.browser.newPage();
      await page.goto(`${this.baseUrl}/product/`, {
        waitUntil: 'networkidle2',
        timeout: 60000
      });

      // 获取所有分类链接
      const categoryLinks = await page.evaluate(() => {
        const links = [];
        document.querySelectorAll('a[href^="/product/"]').forEach(link => {
          links.push(link.href);
        });
        return [...new Set(links)];
      });

      console.log(`Found ${categoryLinks.length} category links`);

      // 遍历每个分类
      for (const categoryLink of categoryLinks) {
        if (categoryLink.includes('product/')) {
          await this.crawlCategory(page, categoryLink);
        }
      }

      await page.close();
      return this.products;
    } catch (error) {
      console.error('Error crawling product list:', error);
      return [];
    }
  }

  async crawlCategory(page, categoryUrl) {
    try {
      await page.goto(categoryUrl, {
        waitUntil: 'networkidle2',
        timeout: 60000
      });

      // 获取分类名称
      const categoryName = await page.evaluate(() => {
        const title = document.querySelector('h1, .title');
        return title ? title.textContent.trim() : 'Unknown Category';
      });

      console.log(`Crawling category: ${categoryName}`);

      // 获取商品列表
      const productLinks = await page.evaluate(() => {
        const links = [];
        document.querySelectorAll('a[href^="/product/"]').forEach(link => {
          links.push(link.href);
        });
        return [...new Set(links)];
      });

      // 遍历每个商品
      for (const productLink of productLinks) {
        if (productLink !== categoryUrl && productLink.includes('/product/')) {
          await this.crawlProduct(page, productLink, categoryName);
        }
      }

    } catch (error) {
      console.error(`Error crawling category ${categoryUrl}:`, error);
    }
  }

  async crawlProduct(page, productUrl, categoryName) {
    try {
      await page.goto(productUrl, {
        waitUntil: 'networkidle2',
        timeout: 60000
      });

      // 提取商品信息
      const productData = await page.evaluate(() => {
        const name = document.querySelector('h1, .product-name')?.textContent?.trim() || '';
        const description = document.querySelector('.product-description, .description')?.textContent?.trim() || '';
        
        // 获取图片
        const images = [];
        document.querySelectorAll('img').forEach(img => {
          if (img.src && !img.src.includes('placeholder')) {
            images.push(img.src);
          }
        });

        return {
          name,
          description,
          images,
          url: window.location.href
        };
      });

      if (productData.name) {
        const product = {
          name: productData.name,
          description: productData.description,
          images: productData.images,
          category: categoryName,
          source_url: productData.url,
          created_at: new Date().toISOString()
        };

        this.products.push(product);
        console.log(`Crawled product: ${product.name}`);
      }

    } catch (error) {
      console.error(`Error crawling product ${productUrl}:`, error);
    }
  }

  async downloadImages(product) {
    const imageDir = path.join(process.cwd(), 'assets', 'images', 'products');
    if (!fs.existsSync(imageDir)) {
      fs.mkdirSync(imageDir, { recursive: true });
    }

    const localImages = [];
    for (let i = 0; i < product.images.length; i++) {
      try {
        const imageUrl = product.images[i];
        const imageName = `${product.name.replace(/[^a-zA-Z0-9]/g, '_')}_${i}.jpg`;
        const imagePath = path.join(imageDir, imageName);

        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        fs.writeFileSync(imagePath, response.data);

        localImages.push(`/assets/images/products/${imageName}`);
        console.log(`Downloaded image for ${product.name}: ${imageName}`);
      } catch (error) {
        console.error(`Error downloading image for ${product.name}:`, error);
      }
    }

    return localImages;
  }

  async crawlAll() {
    try {
      await this.init();
      await this.crawlProductList();
      
      // 下载图片并更新商品数据
      for (const product of this.products) {
        product.local_images = await this.downloadImages(product);
      }

      // 保存抓取的数据
      const outputPath = path.join(process.cwd(), 'data', 'crawled_products.json');
      if (!fs.existsSync(path.dirname(outputPath))) {
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      }
      fs.writeFileSync(outputPath, JSON.stringify(this.products, null, 2));

      console.log(`Crawled ${this.products.length} products and saved to ${outputPath}`);
      return this.products;
    } catch (error) {
      console.error('Error crawling all products:', error);
      return [];
    } finally {
      await this.close();
    }
  }
}

export default SBWorldCrawler;