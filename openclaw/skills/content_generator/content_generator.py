#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
内容生成技能
用于生成产品描述、营销文案、文章等各种类型的内容
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
        logging.FileHandler('openclaw/logs/content_generator.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger('content_generator')

class ContentGenerator:
    """内容生成器"""
    
    def __init__(self, config: Dict[str, Any] = None):
        """初始化内容生成器"""
        self.config = config or {
            'max_length': 5000,
            'language': 'zh',
            'tone': 'professional',
            'styles': ['professional', 'casual', 'technical', 'marketing'],
            'products_file': './data/products.json',
            'output_dir': './data/content'
        }
        
        # 确保输出目录存在
        os.makedirs(self.config['output_dir'], exist_ok=True)
        
        # 产品描述模板
        self.product_description_templates = {
            'planetary-mill': [
                "{name}是一款高性能的行星式球磨机，专为{application}设计。",
                "采用先进的{technology}技术，{name}能够实现{feature}。",
                "主要技术参数包括：{specs}。",
                "适用于{industry}等行业的{use_case}应用。",
                "{name}具有{advantage1}、{advantage2}和{advantage3}等优点。"
            ],
            'roller-mill': [
                "{name}是一款高效的滚筒式球磨机，适合{application}。",
                "采用{technology}设计，{name}能够提供{feature}。",
                "技术规格：{specs}。",
                "广泛应用于{industry}行业的{use_case}。",
                "{name}的优势包括{advantage1}、{advantage2}和{advantage3}。"
            ],
            'stirred-mill': [
                "{name}是一款先进的搅拌式球磨机，专为{application}开发。",
                "利用{technology}原理，{name}实现了{feature}。",
                "主要参数：{specs}。",
                "特别适合{industry}行业的{use_case}需求。",
                "{name}具有{advantage1}、{advantage2}和{advantage3}等特点。"
            ],
            'grinding-media': [
                "{name}是高品质的研磨介质，专为{application}设计。",
                "采用{material}材料制造，{name}具有{feature}。",
                "规格参数：{specs}。",
                "适用于{industry}行业的{use_case}研磨需求。",
                "{name}的优点包括{advantage1}、{advantage2}和{advantage3}。"
            ]
        }
        
        # 营销文案模板
        self.marketing_templates = {
            'product_promo': [
                "【新品上市】{name} - {tagline}",
                "{introduction}",
                "✨ 核心优势：\n{advantages}",
                "📋 技术规格：\n{specs}",
                "🎯 适用行业：{industries}",
                "💬 立即咨询，获取专属报价！"
            ],
            'email_campaign': [
                "Subject: 【限时优惠】{name} - 提升您的{benefit}",
                "Dear {customer_name},\n\n",
                "我们很高兴向您介绍{name}，一款专为{target_audience}设计的{product_type}。",
                "{description}",
                "限时优惠：{offer}",
                "立即联系我们了解更多详情！\n\n",
                "Best regards,\n{company_name}"
            ],
            'social_media': [
                "📢 {name} - {tagline}",
                "{description}",
                "🔥 {key_feature}",
                "💡 {use_case}",
                "👉 了解更多：{url}"
            ]
        }
        
        # 文章模板
        self.article_templates = {
            'industry_news': [
                "# {title}",
                "{date}",
                "{introduction}",
                "## 行业背景",
                "{background}",
                "## 技术发展",
                "{technology}",
                "## 市场趋势",
                "{trends}",
                "## 结论",
                "{conclusion}"
            ],
            'technical_guide': [
                "# {title}",
                "{date}",
                "{introduction}",
                "## 原理介绍",
                "{principle}",
                "## 使用方法",
                "{usage}",
                "## 维护保养",
                "{maintenance}",
                "## 常见问题",
                "{faq}"
            ]
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
    
    def format_specifications(self, specs: Dict[str, Any]) -> str:
        """格式化规格参数"""
        if not specs:
            return ""
        
        spec_list = []
        for key, value in specs.items():
            spec_list.append(f"{key}: {value}")
        
        return "、".join(spec_list[:3])  # 只取前3个规格
    
    def generate_product_description(self, product: Dict[str, Any]) -> str:
        """生成产品描述"""
        category = product.get('category', 'default')
        templates = self.product_description_templates.get(category, self.product_description_templates.get('planetary-mill'))
        
        # 填充模板数据
        data = {
            'name': product.get('name', '产品'),
            'application': self._get_application(category),
            'technology': self._get_technology(category),
            'feature': self._get_feature(category),
            'specs': self.format_specifications(product.get('specifications', {})),
            'industry': self._get_industry(category),
            'use_case': self._get_use_case(category),
            'advantage1': self._get_advantage(1, category),
            'advantage2': self._get_advantage(2, category),
            'advantage3': self._get_advantage(3, category)
        }
        
        # 生成描述
        description_parts = []
        for template in templates:
            try:
                part = template.format(**data)
                description_parts.append(part)
            except Exception as e:
                logger.error(f"Error formatting template: {e}")
        
        return " ".join(description_parts)
    
    def generate_marketing_content(self, product: Dict[str, Any], content_type: str = 'product_promo') -> str:
        """生成营销内容"""
        templates = self.marketing_templates.get(content_type, self.marketing_templates['product_promo'])
        
        # 填充模板数据
        data = {
            'name': product.get('name', '产品'),
            'tagline': self._get_tagline(product.get('category', 'default')),
            'introduction': f"{product.get('name', '产品')}是一款高品质的{self._get_product_type(product.get('category', 'default'))}，专为{self._get_target_audience(product.get('category', 'default'))}设计。",
            'advantages': "\n".join([f"• {adv}" for adv in [
                self._get_advantage(1, product.get('category', 'default')),
                self._get_advantage(2, product.get('category', 'default')),
                self._get_advantage(3, product.get('category', 'default'))
            ]]),
            'specs': "\n".join([f"• {k}: {v}" for k, v in list(product.get('specifications', {}).items())[:3]]),
            'industries': self._get_industry(product.get('category', 'default')),
            'customer_name': "客户",
            'product_type': self._get_product_type(product.get('category', 'default')),
            'target_audience': self._get_target_audience(product.get('category', 'default')),
            'description': product.get('description', '') or self.generate_product_description(product),
            'offer': "限时8折优惠",
            'company_name': "晟通达精密设备",
            'key_feature': self._get_feature(product.get('category', 'default')),
            'use_case': self._get_use_case(product.get('category', 'default')),
            'url': product.get('url', '') or "https://shengtongda.com"
        }
        
        # 生成营销内容
        content_parts = []
        for template in templates:
            try:
                part = template.format(**data)
                content_parts.append(part)
            except Exception as e:
                logger.error(f"Error formatting marketing template: {e}")
        
        return "\n".join(content_parts)
    
    def generate_article(self, title: str, article_type: str = 'industry_news', **kwargs) -> str:
        """生成文章"""
        templates = self.article_templates.get(article_type, self.article_templates['industry_news'])
        
        # 填充模板数据
        data = {
            'title': title,
            'date': time.strftime('%Y-%m-%d'),
            'introduction': kwargs.get('introduction', "本文介绍了研磨设备行业的最新发展趋势。"),
            'background': kwargs.get('background', "研磨设备是材料加工行业的关键设备，广泛应用于各种材料的粉碎、混合和分散过程。"),
            'technology': kwargs.get('technology', "近年来，随着材料科学的发展，研磨设备技术也在不断创新，从传统的球磨机到先进的行星式、搅拌式球磨机，技术水平不断提高。"),
            'trends': kwargs.get('trends', "当前，研磨设备行业的发展趋势包括：智能化、高效化、节能化和定制化。"),
            'conclusion': kwargs.get('conclusion', "总之，研磨设备行业正朝着更加先进、高效和智能的方向发展，为材料加工行业提供更优质的解决方案。"),
            'principle': kwargs.get('principle', "研磨设备的工作原理是利用介质之间的碰撞、摩擦和剪切力来实现材料的粉碎和混合。"),
            'usage': kwargs.get('usage', "使用研磨设备时，需要根据材料特性选择合适的研磨介质、转速和时间参数。"),
            'maintenance': kwargs.get('maintenance', "定期保养包括：检查设备部件、更换易损件、清洁设备和润滑关键部位。"),
            'faq': kwargs.get('faq', "常见问题包括：设备噪音大、研磨效果不佳、设备发热等，需要根据具体情况进行排查和解决。")
        }
        
        # 生成文章
        article_parts = []
        for template in templates:
            try:
                part = template.format(**data)
                article_parts.append(part)
            except Exception as e:
                logger.error(f"Error formatting article template: {e}")
        
        return "\n\n".join(article_parts)
    
    def _get_application(self, category: str) -> str:
        """获取应用场景"""
        applications = {
            'planetary-mill': "实验室和工业生产",
            'roller-mill': "大规模工业生产",
            'stirred-mill': "精细研磨需求",
            'grinding-media': "各种球磨机"
        }
        return applications.get(category, "各种应用场景")
    
    def _get_technology(self, category: str) -> str:
        """获取技术特点"""
        technologies = {
            'planetary-mill': "行星运动",
            'roller-mill': "滚筒研磨",
            'stirred-mill': "高速搅拌",
            'grinding-media': "精密制造"
        }
        return technologies.get(category, "先进")
    
    def _get_feature(self, category: str) -> str:
        """获取产品特点"""
        features = {
            'planetary-mill': "纳米级材料的高效研磨",
            'roller-mill': "大规模连续生产",
            'stirred-mill': "超细粉体的精确制备",
            'grinding-media': "高硬度和耐磨性"
        }
        return features.get(category, "高性能")
    
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
    
    def _get_advantage(self, number: int, category: str) -> str:
        """获取产品优势"""
        advantages = {
            'planetary-mill': ["研磨效率高", "粒度分布均匀", "操作简便"],
            'roller-mill': ["生产能力大", "能耗低", "维护成本低"],
            'stirred-mill': ["研磨精度高", "污染小", "自动化程度高"],
            'grinding-media': ["使用寿命长", "研磨效果好", "无污染"]
        }
        category_advantages = advantages.get(category, advantages['planetary-mill'])
        return category_advantages[number - 1] if 0 < number <= len(category_advantages) else "性能优异"
    
    def _get_tagline(self, category: str) -> str:
        """获取标语"""
        taglines = {
            'planetary-mill': "纳米级研磨的理想选择",
            'roller-mill': "工业生产的高效解决方案",
            'stirred-mill': "精密研磨的专业设备",
            'grinding-media': "高品质研磨的核心组件"
        }
        return taglines.get(category, "品质卓越，性能可靠")
    
    def _get_product_type(self, category: str) -> str:
        """获取产品类型"""
        product_types = {
            'planetary-mill': "行星式球磨机",
            'roller-mill': "滚筒式球磨机",
            'stirred-mill': "搅拌式球磨机",
            'grinding-media': "研磨介质"
        }
        return product_types.get(category, "研磨设备")
    
    def _get_target_audience(self, category: str) -> str:
        """获取目标受众"""
        audiences = {
            'planetary-mill': "实验室和研发机构",
            'roller-mill': "工业生产企业",
            'stirred-mill': "高端材料制造商",
            'grinding-media': "各种球磨机用户"
        }
        return audiences.get(category, "专业用户")
    
    def generate_all_product_descriptions(self) -> Dict[str, Any]:
        """生成所有产品的描述"""
        products = self.load_products()
        updated_products = []
        
        for product in products:
            try:
                # 生成产品描述
                if not product.get('description') or len(product.get('description', '')) < 100:
                    product['description'] = self.generate_product_description(product)
                    logger.info(f"Generated description for {product.get('name', 'product')}")
                
                # 生成营销内容
                product['marketing_content'] = self.generate_marketing_content(product)
                product['social_media_content'] = self.generate_marketing_content(product, 'social_media')
                
                # 更新时间
                product['updated_at'] = time.strftime('%Y-%m-%d %H:%M:%S')
                
                updated_products.append(product)
            except Exception as e:
                logger.error(f"Error generating content for product: {e}")
                updated_products.append(product)
        
        # 保存更新后的产品数据
        if updated_products:
            try:
                with open(self.config['products_file'], 'w', encoding='utf-8') as f:
                    json.dump(updated_products, f, ensure_ascii=False, indent=2)
                logger.info(f"Updated descriptions for {len(updated_products)} products")
            except Exception as e:
                logger.error(f"Error saving updated products: {e}")
        
        return {
            'success': True,
            'message': f"Generated content for {len(updated_products)} products",
            'count': len(updated_products)
        }
    
    def run(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """运行内容生成任务"""
        try:
            task_type = task.get('type', 'generate_descriptions')
            
            if task_type == 'generate_descriptions':
                return self.generate_all_product_descriptions()
            elif task_type == 'generate_marketing':
                product_id = task.get('product_id')
                products = self.load_products()
                
                for product in products:
                    if product.get('id') == product_id:
                        marketing_content = self.generate_marketing_content(product, task.get('content_type', 'product_promo'))
                        return {
                            'success': True,
                            'message': f"Generated marketing content for {product.get('name', 'product')}",
                            'content': marketing_content
                        }
                
                return {
                    'success': False,
                    'message': f"Product with id {product_id} not found"
                }
            elif task_type == 'generate_article':
                article = self.generate_article(
                    task.get('title', '研磨设备行业发展趋势'),
                    task.get('article_type', 'industry_news'),
                    **task.get('parameters', {})
                )
                
                return {
                    'success': True,
                    'message': f"Generated article: {task.get('title', '研磨设备行业发展趋势')}",
                    'content': article
                }
            else:
                return {
                    'success': False,
                    'message': f"Unknown task type: {task_type}"
                }
        except Exception as e:
            logger.error(f"Error running content generator: {e}")
            return {
                'success': False,
                'message': f"Error running content generator: {str(e)}"
            }

if __name__ == '__main__':
    generator = ContentGenerator()
    result = generator.run({'type': 'generate_descriptions'})
    logger.info(f"Content generation result: {result}")
