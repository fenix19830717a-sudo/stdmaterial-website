import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

class ImageProcessor {
  constructor() {
    this.outputDir = path.join(process.cwd(), 'assets', 'images', 'products');
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  async processImage(inputPath, options = {}) {
    try {
      const {
        width = 800,
        height = 600,
        quality = 80,
        format = 'webp'
      } = options;

      const outputPath = inputPath.replace(/\.(jpg|jpeg|png|gif)$/i, `.${format}`);

      await sharp(inputPath)
        .resize(width, height, {
          fit: sharp.fit.cover,
          withoutEnlargement: true
        })
        .toFormat(format)
        .jpeg({ quality })
        .webp({ quality })
        .png({ quality })
        .toFile(outputPath);

      return outputPath;
    } catch (error) {
      console.error('Error processing image:', error);
      return inputPath;
    }
  }

  async processProductImages(product) {
    try {
      const processedImages = [];

      for (const imagePath of product.local_images || product.images) {
        // 处理本地图片
        if (imagePath.startsWith('/assets/images/')) {
          const absolutePath = path.join(process.cwd(), imagePath.substring(1));
          if (fs.existsSync(absolutePath)) {
            const processedPath = await this.processImage(absolutePath);
            const relativePath = processedPath.replace(process.cwd(), '').replace(/\\/g, '/');
            processedImages.push(relativePath);
          } else {
            processedImages.push(imagePath);
          }
        } else {
          // 对于远程图片，先下载再处理
          const localPath = await this.downloadImage(imagePath);
          if (localPath) {
            const processedPath = await this.processImage(localPath);
            const relativePath = processedPath.replace(process.cwd(), '').replace(/\\/g, '/');
            processedImages.push(relativePath);
          } else {
            processedImages.push(imagePath);
          }
        }
      }

      return processedImages;
    } catch (error) {
      console.error('Error processing product images:', error);
      return product.local_images || product.images || [];
    }
  }

  async downloadImage(imageUrl) {
    try {
      const axios = (await import('axios')).default;
      const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

      const imageName = path.basename(new URL(imageUrl).pathname);
      const localPath = path.join(this.outputDir, imageName);

      fs.writeFileSync(localPath, response.data);
      return localPath;
    } catch (error) {
      console.error('Error downloading image:', error);
      return null;
    }
  }

  async optimizeImages() {
    try {
      const images = fs.readdirSync(this.outputDir);
      const optimizedCount = 0;

      for (const image of images) {
        const imagePath = path.join(this.outputDir, image);
        if (fs.statSync(imagePath).isFile()) {
          await this.processImage(imagePath);
          optimizedCount++;
        }
      }

      console.log(`Optimized ${optimizedCount} images`);
      return optimizedCount;
    } catch (error) {
      console.error('Error optimizing images:', error);
      return 0;
    }
  }

  getImageUrl(imagePath) {
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    return `http://localhost:3000${imagePath}`;
  }
}

export default ImageProcessor;