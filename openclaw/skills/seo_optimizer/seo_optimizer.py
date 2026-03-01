#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SEO优化技能
用于优化网站内容、元标签、关键词等，提高搜索引擎排名
"""

import os
import json
import time
import logging
import re
from typing import Dict, List, Optional, Any

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('openclaw/logs/seo_optimizer.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger('seo_optimizer')

class SeoOptimizer:
    """SEO优化器"""
    
    def __init__(self, config: Dict[str, Any] = None):
        """初始化SEO优化器"""
        self.config = config or {
            'language': 'zh',
            'target_keywords': [],
            'products_file': './data/products.json',
            'output_dir': './data/seo',
            'max_keyword_density': 3.0,
            'min_keyword_density': 0.5,
            'title_length': 60,
            'description_length': 160,
            'heading_structure': True,
            'image_alt_text': True,
            'internal_links': True,
            'external_links': True
        }
        
        # 确保输出目录存在
        os.makedirs(self.config['output_dir'], exist_ok=True)
        
        # 行业关键词库
        self.keyword_library = {
            'planetary-mill': {
                'primary': ['行星式球磨机', '行星球磨机', '实验室球磨机', '纳米研磨设备', '高能球磨机'],
                'secondary': ['材料研磨', '粉体加工', '实验室设备', '科研仪器', '样品制备'],
                'long_tail': ['行星式球磨机价格', '实验室用行星球磨机', '纳米材料研磨设备', '高能行星球磨机厂家', '行星球磨机操作规程']
            },
            'roller-mill': {
                'primary': ['滚筒式球磨机', '滚筒球磨机', '工业球磨机', '大型球磨机', '连续球磨机'],
                'secondary': ['工业研磨', '大规模生产', '建材设备', '矿业设备', '化工设备'],
                'long_tail': ['滚筒式球磨机厂家', '工业用滚筒球磨机', '大型滚筒球磨机价格', '连续式滚筒球磨机', '滚筒球磨机工作原理']
            },
            'stirred-mill': {
                'primary': ['搅拌式球磨机', '搅拌球磨机', '超细球磨机', '湿法球磨机', '高效球磨机'],
                'secondary': ['超细研磨', '湿法研磨', '精细化工', '电子材料', '新能源材料'],
                'long_tail': ['搅拌式球磨机价格', '超细粉体制备设备', '湿法搅拌球磨机', '高效搅拌球磨机厂家', '搅拌球磨机工作原理']
            },
            'grinding-media': {
                'primary': ['研磨介质', '研磨球', '球磨介质', '研磨珠', '球磨珠'],
                'secondary': ['氧化铝球', '氧化锆球', '碳化硅球', '氮化硅球', '刚玉球'],
                'long_tail': ['高铝研磨球', '氧化锆研磨介质', '陶瓷研磨珠', '研磨介质厂家', '球磨介质价格']
            }
        }
        
        # SEO 建议模板
        self.seo_suggestions = {
            'title': {
                'too_short': '标题长度过短，建议在50-60字符之间',
                'too_long': '标题长度过长，建议控制在60字符以内',
                'missing_keyword': '标题缺少核心关键词，建议包含主要产品名称',
                'good': '标题长度适中，包含核心关键词'
            },
            'description': {
                'too_short': '描述长度过短，建议在120-160字符之间',
                'too_long': '描述长度过长，建议控制在160字符以内',
                'missing_keyword': '描述缺少核心关键词，建议包含主要产品名称和优势',
                'good': '描述长度适中，包含核心关键词和产品优势'
            },
            'keywords': {
                'density_too_low': '关键词密度过低，建议在0.5%-3%之间',
                'density_too_high': '关键词密度过高，可能被搜索引擎视为作弊，建议控制在3%以内',
                'missing_keywords': '缺少相关关键词，建议添加更多相关关键词',
                'good': '关键词密度适中，分布自然'
            },
            'content': {
                'too_short': '内容长度过短，建议至少300字',
                'duplicate': '内容可能存在重复，建议原创内容',
                'missing_headings': '缺少标题结构，建议使用H1-H3标题',
                'good': '内容长度适中，结构清晰'
            }
        }
    
    def load_products(self) -> List[Dict[str, Any]]:
        """加载产品数据"""
        if os.path.exists(self.config['products_file']):
            try:
                with open(self.config['products_file'], 'r', encoding='utf-8') as f:
                    return json.load(f)
            except Exception as e:
                logger.error(f"Error loading products: {e}")
                return []
        return []
    
    def analyze_keyword_density(self, text: str, keyword: str) -> float:
        """分析关键词密度"""
        if not text or not keyword:
            return 0.0
        
        # 计算关键词出现次数
        keyword_count = text.count(keyword)
        # 计算总词数
        total_words = len(text.split())
        
        if total_words == 0:
            return 0.0
        
        return (keyword_count / total_words) * 100
    
    def generate_meta_title(self, product: Dict[str, Any]) -> str:
        """生成SEO友好的标题"""
        category = product.get('category', 'default')
        name = product.get('name', '产品')
        
        # 获取相关关键词
        keywords = self.keyword_library.get(category, self.keyword_library.get('planetary-mill'))['primary']
        
        # 构建标题
        title_parts = [name]
        
        # 添加核心关键词
        for keyword in keywords[:2]:  # 只取前2个关键词
            if keyword not in name:
                title_parts.append(keyword)
                break
        
        # 添加品牌
        title_parts.append('- 晟通达精密设备')
        
        # 组合标题
        title = ' '.join(title_parts)
        
        # 控制长度
        if len(title) > self.config['title_length']:
            # 截断过长的标题
            title = title[:self.config['title_length']-3] + '...'
        
        return title
    
    def generate_meta_description(self, product: Dict[str, Any]) -> str:
        """生成SEO友好的描述"""
        category = product.get('category', 'default')
        name = product.get('name', '产品')
        description = product.get('description', '')
        
        # 获取相关关键词
        keywords = self.keyword_library.get(category, self.keyword_library.get('planetary-mill'))
        primary_keywords = keywords['primary'][:2]
        long_tail_keywords = keywords['long_tail'][:1]
        
        # 构建描述
        desc_parts = []
        
        # 开头
        desc_parts.append(f"{name}是一款高品质的{primary_keywords[0]}，")
        
        # 产品特点
        if description:
            # 提取描述中的核心信息
            desc_parts.append(description[:100])
        else:
            desc_parts.append("具有高效研磨、操作简便、质量可靠等特点")
        
        # 添加应用场景
        desc_parts.append(f"适用于{self._get_industry(category)}等行业的{self._get_use_case(category)}。")
        
        # 添加行动号召
        desc_parts.append(f"{long_tail_keywords[0]}，欢迎咨询！")
        
        # 组合描述
        meta_desc = ''.join(desc_parts)
        
        # 控制长度
        if len(meta_desc) > self.config['description_length']:
            meta_desc = meta_desc[:self.config['description_length']-3] + '...'
        
        return meta_desc
    
    def generate_keywords(self, product: Dict[str, Any]) -> List[str]:
        """生成产品关键词列表"""
        category = product.get('category', 'default')
        name = product.get('name', '产品')
        
        # 获取关键词库
        keywords = self.keyword_library.get(category, self.keyword_library.get('planetary-mill'))
        
        # 组合关键词
        all_keywords = []
        
        # 添加主要关键词
        all_keywords.extend(keywords['primary'])
        
        # 添加次要关键词
        all_keywords.extend(keywords['secondary'][:3])
        
        # 添加长尾关键词
        all_keywords.extend(keywords['long_tail'][:2])
        
        # 添加产品名称中的关键词
        if name:
            # 提取产品名称中的可能关键词
            for word in name.split():
                if len(word) > 2:  # 只添加长度大于2的词
                    all_keywords.append(word)
        
        # 去重
        all_keywords = list(set(all_keywords))
        
        # 限制数量
        return all_keywords[:15]  # 最多15个关键词
    
    def analyze_seo(self, product: Dict[str, Any]) -> Dict[str, Any]:
        """分析产品的SEO状况"""
        analysis = {
            'title': {},
            'description': {},
            'keywords': {},
            'content': {}
        }
        
        # 分析标题
        current_title = product.get('meta_title', product.get('name', ''))
        title_length = len(current_title)
        
        if title_length < 30:
            analysis['title']['status'] = 'too_short'
            analysis['title']['suggestion'] = self.seo_suggestions['title']['too_short']
        elif title_length > self.config['title_length']:
            analysis['title']['status'] = 'too_long'
            analysis['title']['suggestion'] = self.seo_suggestions['title']['too_long']
        else:
            # 检查是否包含核心关键词
            category = product.get('category', 'default')
            keywords = self.keyword_library.get(category, self.keyword_library.get('planetary-mill'))['primary']
            has_keyword = any(keyword in current_title for keyword in keywords)
            
            if has_keyword:
                analysis['title']['status'] = 'good'
                analysis['title']['suggestion'] = self.seo_suggestions['title']['good']
            else:
                analysis['title']['status'] = 'missing_keyword'
                analysis['title']['suggestion'] = self.seo_suggestions['title']['missing_keyword']
        
        # 分析描述
        current_description = product.get('meta_description', product.get('description', ''))
        desc_length = len(current_description)
        
        if desc_length < 80:
            analysis['description']['status'] = 'too_short'
            analysis['description']['suggestion'] = self.seo_suggestions['description']['too_short']
        elif desc_length > self.config['description_length']:
            analysis['description']['status'] = 'too_long'
            analysis['description']['suggestion'] = self.seo_suggestions['description']['too_long']
        else:
            # 检查是否包含核心关键词
            has_keyword = any(keyword in current_description for keyword in keywords)
            
            if has_keyword:
                analysis['description']['status'] = 'good'
                analysis['description']['suggestion'] = self.seo_suggestions['description']['good']
            else:
                analysis['description']['status'] = 'missing_keyword'
                analysis['description']['suggestion'] = self.seo_suggestions['description']['missing_keyword']
        
        # 分析关键词密度
        content = product.get('description', '')
        keyword_densities = []
        
        for keyword in keywords[:3]:  # 只分析前3个核心关键词
            density = self.analyze_keyword_density(content, keyword)
            keyword_densities.append({
                'keyword': keyword,
                'density': f"{density:.2f}%"
            })
        
        analysis['keywords']['densities'] = keyword_densities
        
        # 分析内容
        content_length = len(content)
        
        if content_length < 100:
            analysis['content']['status'] = 'too_short'
            analysis['content']['suggestion'] = self.seo_suggestions['content']['too_short']
        else:
            analysis['content']['status'] = 'good'
            analysis['content']['suggestion'] = self.seo_suggestions['content']['good']
        
        return analysis
    
    def optimize_product_seo(self, product: Dict[str, Any]) -> Dict[str, Any]:
        """优化产品的SEO"""
        # 生成元数据
        product['meta_title'] = self.generate_meta_title(product)
        product['meta_description'] = self.generate_meta_description(product)
        product['meta_keywords'] = self.generate_keywords(product)
        
        # 生成SEO分析
        product['seo_analysis'] = self.analyze_seo(product)
        
        # 更新时间
        product['updated_at'] = time.strftime('%Y-%m-%d %H:%M:%S')
        
        return product
    
    def optimize_all_products(self) -> Dict[str, Any]:
        """优化所有产品的SEO"""
        products = self.load_products()
        optimized_products = []
        
        for product in products:
            try:
                optimized_product = self.optimize_product_seo(product)
                optimized_products.append(optimized_product)
                logger.info(f"Optimized SEO for {product.get('name', 'product')}")
            except Exception as e:
                logger.error(f"Error optimizing SEO for product: {e}")
                optimized_products.append(product)
        
        # 保存优化后的产品数据
        if optimized_products:
            try:
                with open(self.config['products_file'], 'w', encoding='utf-8') as f:
                    json.dump(optimized_products, f, ensure_ascii=False, indent=2)
                logger.info(f"Optimized SEO for {len(optimized_products)} products")
            except Exception as e:
                logger.error(f"Error saving optimized products: {e}")
        
        return {
            'success': True,
            'message': f"Optimized SEO for {len(optimized_products)} products",
            'count': len(optimized_products)
        }
    
    def generate_sitemap(self) -> Dict[str, Any]:
        """生成网站地图"""
        products = self.load_products()
        
        # 生成产品页面URL
        product_urls = []
        for product in products:
            product_urls.append({
                'loc': f"https://shengtongda.com/product/{product.get('id', '')}",
                'lastmod': product.get('updated_at', time.strftime('%Y-%m-%d')),
                'changefreq': 'weekly',
                'priority': '0.8'
            })
        
        # 生成其他页面URL
        other_urls = [
            {
                'loc': 'https://shengtongda.com',
                'lastmod': time.strftime('%Y-%m-%d'),
                'changefreq': 'daily',
                'priority': '1.0'
            },
            {
                'loc': 'https://shengtongda.com/product-catalog',
                'lastmod': time.strftime('%Y-%m-%d'),
                'changefreq': 'weekly',
                'priority': '0.9'
            },
            {
                'loc': 'https://shengtongda.com/about',
                'lastmod': time.strftime('%Y-%m-%d'),
                'changefreq': 'monthly',
                'priority': '0.7'
            },
            {
                'loc': 'https://shengtongda.com/contact',
                'lastmod': time.strftime('%Y-%m-%d'),
                'changefreq': 'monthly',
                'priority': '0.7'
            },
            {
                'loc': 'https://shengtongda.com/news',
                'lastmod': time.strftime('%Y-%m-%d'),
                'changefreq': 'weekly',
                'priority': '0.6'
            }
        ]
        
        # 合并所有URL
        sitemap = {
            'urls': other_urls + product_urls,
            'generated_at': time.strftime('%Y-%m-%d %H:%M:%S'),
            'total_urls': len(other_urls) + len(product_urls)
        }
        
        # 保存网站地图
        sitemap_file = os.path.join(self.config['output_dir'], 'sitemap.json')
        try:
            with open(sitemap_file, 'w', encoding='utf-8') as f:
                json.dump(sitemap, f, ensure_ascii=False, indent=2)
            logger.info(f"Generated sitemap with {sitemap['total_urls']} URLs")
        except Exception as e:
            logger.error(f"Error saving sitemap: {e}")
        
        return sitemap
    
    def _get_industry(self, category: str) -> str:
        """获取适用行业"""
        industries = {
            'planetary-mill': "新材料、医药、化工",
            'roller-mill': "建材、矿业、化工",
            'stirred-mill': "电子、医药、新能源",
            'grinding-media': "各种需要研磨的"
        }
        return industries.get(category, "多个")
    
    def _get_use_case(self, category: str) -> str:
        """获取使用场景"""
        use_cases = {
            'planetary-mill': "材料研发和小批量生产",
            'roller-mill': "大规模材料加工",
            'stirred-mill': "高精度材料制备",
            'grinding-media': "各种材料的研磨"
        }
        return use_cases.get(category, "多种")
    
    def run(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """运行SEO优化任务"""
        try:
            task_type = task.get('type', 'optimize_products')
            
            if task_type == 'optimize_products':
                return self.optimize_all_products()
            elif task_type == 'generate_sitemap':
                sitemap = self.generate_sitemap()
                return {
                    'success': True,
                    'message': f"Generated sitemap with {sitemap['total_urls']} URLs",
                    'sitemap': sitemap
                }
            elif task_type == 'analyze_product':
                product_id = task.get('product_id')
                products = self.load_products()
                
                for product in products:
                    if product.get('id') == product_id:
                        analysis = self.analyze_seo(product)
                        return {
                            'success': True,
                            'message': f"Analyzed SEO for {product.get('name', 'product')}",
                            'analysis': analysis
                        }
                
                return {
                    'success': False,
                    'message': f"Product with id {product_id} not found"
                }
            else:
                return {
                    'success': False,
                    'message': f"Unknown task type: {task_type}"
                }
        except Exception as e:
            logger.error(f"Error running SEO optimizer: {e}")
            return {
                'success': False,
                'message': f"Error running SEO optimizer: {str(e)}"
            }

if __name__ == '__main__':
    optimizer = SeoOptimizer()
    result = optimizer.run({'type': 'optimize_products'})
    logger.info(f"SEO optimization result: {result}")
