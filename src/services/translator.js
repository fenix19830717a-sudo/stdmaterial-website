import axios from 'axios';

class Translator {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://translation.googleapis.com/language/translate/v2';
  }

  async translate(text, targetLanguage = 'en') {
    try {
      const response = await axios.post(
        `${this.baseUrl}?key=${this.apiKey}`,
        {
          q: text,
          target: targetLanguage
        }
      );

      return response.data.data.translations[0].translatedText;
    } catch (error) {
      console.error('Error translating text:', error);
      // 失败时返回原文
      return text;
    }
  }

  async translateProduct(product) {
    try {
      // 翻译产品名称
      const nameEn = await this.translate(product.name);
      // 翻译产品描述
      const descriptionEn = await this.translate(product.description);
      // 翻译产品分类
      const categoryEn = await this.translate(product.category);

      return {
        ...product,
        nameEn,
        descriptionEn,
        categoryEn
      };
    } catch (error) {
      console.error('Error translating product:', error);
      // 失败时返回原产品
      return product;
    }
  }

  async translateProducts(products) {
    const translatedProducts = [];

    for (const product of products) {
      const translatedProduct = await this.translateProduct(product);
      translatedProducts.push(translatedProduct);
    }

    return translatedProducts;
  }

  // 简单的翻译回退方案，使用常见的专业术语词典
  translateWithFallback(text) {
    const dictionary = {
      '行星球磨机': 'Planetary Ball Mill',
      '齿辊破碎机': 'Tooth Roll Crusher',
      '对辊破碎机': 'Double Roll Crusher',
      '锤片式粉碎机': 'Hammer Mill',
      '塑料粉碎机': 'Plastic Crusher',
      '多功能粉碎机': 'Multi-functional Crusher',
      '不锈钢无尘粉碎机': 'Stainless Steel Dust-free Crusher',
      '小型撕碎机': 'Small Shredder',
      '不锈钢振动粉碎机': 'Stainless Steel Vibration Crusher',
      '实验颚式破碎机': 'Laboratory Jaw Crusher',
      '颚式破碎机': 'Jaw Crusher',
      '三次元旋振筛': 'Three-dimensional Rotary Vibrating Screen',
      '不锈钢振筛机': 'Stainless Steel Vibrating Screen',
      '小型实验室筛分机': 'Small Laboratory Screening Machine',
      '实验浮选机': 'Experimental Flotation Machine',
      '便携式组织研磨仪': 'Portable Tissue Grinder',
      '多通道组织研磨仪': 'Multi-channel Tissue Grinder',
      '便携式迷你磁力搅拌机': 'Portable Mini Magnetic Stirrer',
      '多工位磁力搅拌机': 'Multi-station Magnetic Stirrer',
      '迷你离心机': 'Mini Centrifuge',
      '迷你高速离心机': 'Mini High-speed Centrifuge',
      '真空上料机': 'Vacuum Feeder',
      '挂槽浮选机': 'Hanging Tank Flotation Machine',
      '行星氧化锆球磨罐': 'Planetary Zirconia Grinding Jar',
      '行星刚玉球磨罐': 'Planetary Corundum Grinding Jar',
      '行星玛瑙球磨罐': 'Planetary Agate Grinding Jar',
      '行星聚四氟乙烯球磨罐': 'Planetary PTFE Grinding Jar',
      '行星硬质合金球磨罐': 'Planetary Tungsten Carbide Grinding Jar',
      '行星真空球磨罐': 'Planetary Vacuum Grinding Jar',
      '不锈钢研磨球': 'Stainless Steel Grinding Ball',
      '氧化锆研磨球': 'Zirconia Grinding Ball',
      '玛瑙研磨球': 'Agate Grinding Ball',
      '行星不锈钢内衬氧化锆罐': 'Planetary Stainless Steel Lined Zirconia Jar',
      '研磨系列': 'Grinding Series',
      '破碎系列': 'Crushing Series',
      '筛分系列': 'Screening Series',
      '研究设备': 'Research Equipment'
    };

    return dictionary[text] || text;
  }
}

export default Translator;