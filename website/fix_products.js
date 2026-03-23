const fs = require('fs');
const path = require('path');

// Translation mapping from Chinese to English
const translationMap = {
  // Crushers
  '小型撕碎机': 'Small Shredder',
  '锤片式粉碎机': 'Paddle Mill',
  '颚式破碎机': 'Jaw Crusher',
  '齿辊破碎机': 'Teeth Roll Crusher',
  
  // Grinding Jars - Roller
  '滚筒不锈钢球磨罐': 'Roller Stainless Steel Mill Jar',
  '滚筒刚玉球磨罐': 'Roller Corundum Mill Jar',
  '滚筒尼龙球磨罐': 'Roller Nylon Mill Jar',
  '滚筒聚四氟乙烯球磨罐': 'Roller PTFE Mill Jar',
  '滚筒聚氨酯球磨罐': 'Roller Polyurethane Mill Jar',
  '滚筒陶瓷球磨罐': 'Roller Ceramic Mill Jar',
  
  // Grinding Jars - Planetary
  '特级刚玉行星球磨罐': 'Premium Corundum Planetary Mill Jar',
  '行星不锈钢内衬氧化锆罐': 'Planetary Stainless Steel Lined with Zirconia Mill Jar',
  '行星不锈钢球磨罐': 'Planetary Stainless Steel Mill Jar',
  '行星刚玉球磨罐': 'Planetary Corundum Mill Jar',
  '行星尼龙球磨罐': 'Planetary Nylon Mill Jar',
  '行星氧化锆球磨罐': 'Planetary Zirconia Mill Jar',
  '行星玛瑙球磨罐': 'Planetary Agate Mill Jar',
  '行星真空球磨罐': 'Planetary Vacuum Mill Jar',
  '行星硬质合金球磨罐': 'Planetary Tungsten Carbide Mill Jar',
  '行星聚四氟乙烯球磨罐': 'Planetary PTFE Mill Jar',
  '行星聚氨酯球磨罐': 'Planetary Polyurethane Mill Jar',
  '行星钢化尼龙球磨罐': 'Planetary Tempered Nylon Mill Jar',
  
  // Planetary Ball Mills
  '360°旋转全方位实验行星球磨机': '360° Full-Directional Laboratory Planetary Ball Mill',
  '三头玛瑙研磨机': 'Three-Station Agate Grinder',
  '三辊研磨机': 'Three Roll Mill',
  '全方位生产型行星球磨机': 'Full-Directional Production Planetary Ball Mill',
  '刚玉研磨球': 'Corundum Grinding Ball',
  '制样机': 'Laboratory Sample Grinder',
  '卧式轻型球磨机': 'Horizontal Light-Duty Ball Mill',
  '双行星球磨机': 'Dual Planetary Ball Mill'
};

// Get list of available image files
function getAvailableImages() {
  const imagesDir = path.join(__dirname, 'assets', 'images', 'products');
  const files = fs.readdirSync(imagesDir);
  return new Set(files);
}

const availableImages = getAvailableImages();
console.log(`Found ${availableImages.size} available images`);

// Function to fix image path
function fixImagePath(imagePath) {
  if (!imagePath) return null;
  
  // Extract just the filename from the path
  let filename = path.basename(imagePath);
  
  // Check if file exists with the same extension
  if (availableImages.has(filename)) {
    return 'assets/images/products/' + filename;
  }
  
  // Try different extensions (webp first, then jpg, then png
  const basenameWithoutExt = path.basename(filename, path.extname(filename));
  
  const extensionsToTry = ['.webp', '.jpg', '.jpeg', '.png'];
  for (const ext of extensionsToTry) {
    const testFilename = basenameWithoutExt + ext;
    if (availableImages.has(testFilename)) {
      return 'assets/images/products/' + testFilename;
    }
  }
  
  // Check originalImage if available
  return null;
}

// Function to fix a product
function fixProduct(product) {
  // Fix nameEn
  if (product.nameEn) {
    // Remove "(EN)" suffix
    if (product.nameEn.includes(' (EN)')) {
      product.nameEn = product.nameEn.replace(' (EN)', '');
    }
    
    // If nameEn still contains Chinese or still has the original pattern, use translation
    const chineseRegex = /[\u4e00-\u9fa5]/;
    if (chineseRegex.test(product.nameEn) || product.nameEn === product.name) {
      if (translationMap[product.name]) {
        product.nameEn = translationMap[product.name];
      }
    }
  } else if (translationMap[product.name]) {
    product.nameEn = translationMap[product.name];
  }
  
  // Fix descriptionEn
  if (product.descriptionEn) {
    // Remove "(EN)" from description
    product.descriptionEn = product.descriptionEn.replace(/ \(EN\)/g, '');
    
    // Replace Chinese product name in description with English
    if (product.nameEn && product.name) {
      product.descriptionEn = product.descriptionEn.replace(new RegExp(product.name, 'g'), product.nameEn);
    }
  }
  
  // Fix image paths
  let fixedImage = null;
  
  // Try original images array first
  if (product.images && product.images.length > 0) {
    fixedImage = fixImagePath(product.images[0]);
  }
  
  // Try originalImage if available
  if (!fixedImage && product.originalImage) {
    fixedImage = fixImagePath(product.originalImage);
  }
  
  // Try to derive from sourceUrl or id if still no image
  if (!fixedImage && product.id) {
    const idBasedName = product.id + '.jpg';
    if (availableImages.has(idBasedName)) {
      fixedImage = 'assets/images/products/' + idBasedName;
    } else {
      const idBasedWebp = product.id + '.webp';
      if (availableImages.has(idBasedWebp)) {
        fixedImage = 'assets/images/products/' + idBasedWebp;
      }
    }
  }
  
  // If still no image, use default
  if (!fixedImage) {
    fixedImage = 'assets/images/products/default.webp';
  }
  
  product.images = [fixedImage];
  
  return product;
}

// Process the products file
const productsPath = path.join(__dirname, 'data', 'products.json');
const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

console.log(`Processing ${productsData.products.length} products...`);

// Fix all products
productsData.products = productsData.products.map(fixProduct);

// Write the fixed data back
fs.writeFileSync(productsPath, JSON.stringify(productsData, null, 2), 'utf8');
console.log('Successfully fixed products.json');

// Also check assets/data/products.json if it exists
const altProductsPath = path.join(__dirname, 'assets', 'data', 'products.json');
if (fs.existsSync(altProductsPath)) {
  console.log('\nAlso checking assets/data/products.json...');
  try {
    const altData = JSON.parse(fs.readFileSync(altProductsPath, 'utf8'));
    // This file has a different structure, just log it for now
    console.log(`Found ${altData.length} products in alt format`);
  } catch (e) {
    console.error('Error reading alt products:', e);
  }
}

console.log('\nDone!');
