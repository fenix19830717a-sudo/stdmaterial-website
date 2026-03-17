#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
知识图谱初始化工具
用于构建和管理项目的知识图谱
"""

import os
import sys
import json
import logging
from typing import Dict, List, Any

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('kg_initializer')

class KnowledgeGraphInitializer:
    """知识图谱初始化器"""
    
    def __init__(self):
        self.data_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
        os.makedirs(self.data_dir, exist_ok=True)
    
    def get_product_entities(self) -> List[Dict[str, Any]]:
        """获取产品实体数据"""
        return [
            {
                'name': '行星式球磨机',
                'entityType': 'Product',
                'observations': [
                    'Category: planetary-mill',
                    'Application: 实验室和工业生产',
                    'Key feature: 纳米级材料的高效研磨',
                    'Advantages: 研磨效率高、粒度分布均匀、操作简便'
                ]
            },
            {
                'name': '滚筒式球磨机',
                'entityType': 'Product',
                'observations': [
                    'Category: roller-mill',
                    'Application: 大规模工业生产',
                    'Key feature: 大规模连续生产',
                    'Advantages: 生产能力大、能耗低、维护成本低'
                ]
            },
            {
                'name': '搅拌式球磨机',
                'entityType': 'Product',
                'observations': [
                    'Category: stirred-mill',
                    'Application: 精细研磨需求',
                    'Key feature: 超细粉体的精确制备',
                    'Advantages: 研磨精度高、污染小、自动化程度高'
                ]
            },
            {
                'name': '研磨介质',
                'entityType': 'Product',
                'observations': [
                    'Category: grinding-media',
                    'Application: 各种球磨机',
                    'Key feature: 高硬度和耐磨性',
                    'Advantages: 使用寿命长、研磨效果好、无污染'
                ]
            },
            {
                'name': '氧化锆研磨球',
                'entityType': 'GrindingMedia',
                'observations': [
                    'Material: 氧化锆',
                    'Hardness: 9.0 Mohs',
                    'Purity: 99.5%',
                    'Application: 电子材料、医药、新能源'
                ]
            },
            {
                'name': '氧化铝研磨球',
                'entityType': 'GrindingMedia',
                'observations': [
                    'Material: 氧化铝',
                    'Hardness: 8.5 Mohs',
                    'Purity: 99.0%',
                    'Application: 建材、化工、矿业'
                ]
            }
        ]
    
    def get_category_entities(self) -> List[Dict[str, Any]]:
        """获取产品分类实体"""
        return [
            {
                'name': 'planetary-mill',
                'entityType': 'ProductCategory',
                'observations': [
                    'Chinese name: 行星式球磨机',
                    'Primary keywords: 行星式球磨机, 行星球磨机, 实验室球磨机',
                    'Target industries: 新材料, 医药, 化工'
                ]
            },
            {
                'name': 'roller-mill',
                'entityType': 'ProductCategory',
                'observations': [
                    'Chinese name: 滚筒式球磨机',
                    'Primary keywords: 滚筒式球磨机, 工业球磨机, 大型球磨机',
                    'Target industries: 建材, 矿业, 化工'
                ]
            },
            {
                'name': 'stirred-mill',
                'entityType': 'ProductCategory',
                'observations': [
                    'Chinese name: 搅拌式球磨机',
                    'Primary keywords: 搅拌式球磨机, 超细球磨机, 湿法球磨机',
                    'Target industries: 电子, 医药, 新能源'
                ]
            },
            {
                'name': 'grinding-media',
                'entityType': 'ProductCategory',
                'observations': [
                    'Chinese name: 研磨介质',
                    'Primary keywords: 研磨介质, 研磨球, 球磨介质',
                    'Target industries: 各种需要研磨的行业'
                ]
            }
        ]
    
    def get_industry_entities(self) -> List[Dict[str, Any]]:
        """获取行业实体"""
        return [
            {
                'name': '电子行业',
                'entityType': 'Industry',
                'observations': [
                    'Key requirements: 高纯度材料, 纳米级精度, 无污染',
                    'Typical products: 搅拌式球磨机, 氧化锆研磨球',
                    'Key applications: 电子材料制备, 锂电池材料'
                ]
            },
            {
                'name': '医药行业',
                'entityType': 'Industry',
                'observations': [
                    'Key requirements: FDA合规, 无菌环境, 可追溯',
                    'Typical products: 行星式球磨机, 不锈钢研磨罐',
                    'Key applications: 药物研发, 制剂生产'
                ]
            },
            {
                'name': '化工行业',
                'entityType': 'Industry',
                'observations': [
                    'Key requirements: 耐腐蚀, 连续生产, 安全可靠',
                    'Typical products: 滚筒式球磨机, 氧化铝研磨球',
                    'Key applications: 化工原料加工, 催化剂制备'
                ]
            },
            {
                'name': '新能源行业',
                'entityType': 'Industry',
                'observations': [
                    'Key requirements: 高能效, 一致性, 规模化',
                    'Typical products: 搅拌式球磨机, 行星式球磨机',
                    'Key applications: 锂电池正负极材料, 光伏材料'
                ]
            },
            {
                'name': '建材行业',
                'entityType': 'Industry',
                'observations': [
                    'Key requirements: 大规模生产, 低成本, 耐用',
                    'Typical products: 滚筒式球磨机, 氧化铝研磨球',
                    'Key applications: 陶瓷原料, 水泥加工'
                ]
            },
            {
                'name': '矿业行业',
                'entityType': 'Industry',
                'observations': [
                    'Key requirements: 耐磨, 高产能, 低维护',
                    'Typical products: 滚筒式球磨机, 钢球',
                    'Key applications: 矿石粉碎, 矿物加工'
                ]
            }
        ]
    
    def get_technology_entities(self) -> List[Dict[str, Any]]:
        """获取技术实体"""
        return [
            {
                'name': '行星运动技术',
                'entityType': 'Technology',
                'observations': [
                    'Application: 行星式球磨机',
                    'Principle: 利用公转和自转的复合运动',
                    'Advantage: 产生高能量碰撞, 高效研磨'
                ]
            },
            {
                'name': '滚筒研磨技术',
                'entityType': 'Technology',
                'observations': [
                    'Application: 滚筒式球磨机',
                    'Principle: 利用介质的滚动和下落',
                    'Advantage: 适合大规模连续生产'
                ]
            },
            {
                'name': '高速搅拌技术',
                'entityType': 'Technology',
                'observations': [
                    'Application: 搅拌式球磨机',
                    'Principle: 利用搅拌桨高速驱动介质',
                    'Advantage: 实现超细研磨, 精度高'
                ]
            },
            {
                'name': '纳米研磨技术',
                'entityType': 'Technology',
                'observations': [
                    'Application: 行星式球磨机, 搅拌式球磨机',
                    'Principle: 高能机械力作用',
                    'Result: 可实现亚100nm粒度'
                ]
            }
        ]
    
    def get_design_color_entities(self) -> List[Dict[str, Any]]:
        """获取设计颜色实体"""
        return [
            {
                'name': 'Primary Cyan',
                'entityType': 'DesignColor',
                'observations': [
                    'Hex: #06b6d4',
                    'Usage: 主品牌色, 主要操作按钮',
                    'Dark variant: #0891b2',
                    'Light variant: #22d3ee'
                ]
            },
            {
                'name': 'Secondary Orange',
                'entityType': 'DesignColor',
                'observations': [
                    'Hex: #f97316',
                    'Usage: 辅助强调色, 警告状态'
                ]
            },
            {
                'name': 'Accent Purple',
                'entityType': 'DesignColor',
                'observations': [
                    'Hex: #a855f7',
                    'Usage: 点缀色, 特殊强调'
                ]
            },
            {
                'name': 'Success Green',
                'entityType': 'DesignColor',
                'observations': [
                    'Hex: #22c55e',
                    'Usage: 成功状态, 积极反馈'
                ]
            },
            {
                'name': 'Warning Amber',
                'entityType': 'DesignColor',
                'observations': [
                    'Hex: #f59e0b',
                    'Usage: 警告状态, 需要注意'
                ]
            },
            {
                'name': 'Error Red',
                'entityType': 'DesignColor',
                'observations': [
                    'Hex: #ef4444',
                    'Usage: 错误状态, 危险操作'
                ]
            },
            {
                'name': 'Info Blue',
                'entityType': 'DesignColor',
                'observations': [
                    'Hex: #3b82f6',
                    'Usage: 信息提示, 中性状态'
                ]
            },
            {
                'name': 'Background Dark',
                'entityType': 'DesignColor',
                'observations': [
                    'Hex: #020617',
                    'Usage: 深色主题背景, 深蓝色'
                ]
            },
            {
                'name': 'Surface Dark',
                'entityType': 'DesignColor',
                'observations': [
                    'Hex: #1e293b',
                    'Usage: 深色主题表面, Slate 800'
                ]
            }
        ]
    
    def get_design_component_entities(self) -> List[Dict[str, Any]]:
        """获取设计组件实体"""
        return [
            {
                'name': 'Primary Button',
                'entityType': 'DesignComponent',
                'observations': [
                    'CSS class: btn-primary',
                    'Usage: 主要操作按钮',
                    'Color: Primary Cyan',
                    'Best practice: 每页不超过1个主要操作'
                ]
            },
            {
                'name': 'Secondary Button',
                'entityType': 'DesignComponent',
                'observations': [
                    'CSS class: btn-secondary',
                    'Usage: 次要操作按钮',
                    'Best practice: 用于辅助操作'
                ]
            },
            {
                'name': 'Glass Panel',
                'entityType': 'DesignComponent',
                'observations': [
                    'CSS class: glass-panel',
                    'Usage: 内容容器',
                    'Effect: 玻璃态效果, 现代风格',
                    'Shadow: shadow-glass'
                ]
            },
            {
                'name': 'Product Image Container',
                'entityType': 'DesignComponent',
                'observations': [
                    'CSS class: product-image-container',
                    'Usage: 产品图片容器',
                    'Requirement: 必须用于所有产品图片',
                    'Background: 白色 (#ffffff)',
                    'Critical: 产品图片背景必须为白色'
                ]
            },
            {
                'name': 'Card',
                'entityType': 'DesignComponent',
                'observations': [
                    'CSS class: card',
                    'Usage: 内容分组',
                    'Best practice: 用于展示相关内容'
                ]
            }
        ]
    
    def get_design_typography_entities(self) -> List[Dict[str, Any]]:
        """获取设计字体实体"""
        return [
            {
                'name': 'Space Grotesk',
                'entityType': 'DesignTypography',
                'observations': [
                    'Font family: Space Grotesk, sans-serif',
                    'Usage: 主要字体, 显示和正文',
                    'Weights: 300-700',
                    'Source: Google Fonts'
                ]
            },
            {
                'name': 'Material Symbols Outlined',
                'entityType': 'DesignTypography',
                'observations': [
                    'Font family: Material Symbols Outlined',
                    'Usage: 图标字体',
                    'Source: Google Fonts'
                ]
            }
        ]
    
    def get_design_system_entities(self) -> List[Dict[str, Any]]:
        """获取设计系统实体"""
        return [
            {
                'name': 'Hunan Shengtongda Design System',
                'entityType': 'DesignSystem',
                'observations': [
                    'Version: 1.0',
                    'Theme: 深色工业风格',
                    'Brand: 湖南晟通达材料科技',
                    'File: assets/css/design-system.css',
                    'Guidelines: .trae/specs/frontend-refactor-2026/DESIGN_SYSTEM.md'
                ]
            }
        ]
    
    def get_relations(self) -> List[Dict[str, str]]:
        """获取关系数据"""
        return [
            # 产品与分类的关系
            {'from': '行星式球磨机', 'to': 'planetary-mill', 'relationType': 'belongs_to'},
            {'from': '滚筒式球磨机', 'to': 'roller-mill', 'relationType': 'belongs_to'},
            {'from': '搅拌式球磨机', 'to': 'stirred-mill', 'relationType': 'belongs_to'},
            {'from': '研磨介质', 'to': 'grinding-media', 'relationType': 'belongs_to'},
            {'from': '氧化锆研磨球', 'to': 'grinding-media', 'relationType': 'belongs_to'},
            {'from': '氧化铝研磨球', 'to': 'grinding-media', 'relationType': 'belongs_to'},
            
            # 产品与技术的关系
            {'from': '行星式球磨机', 'to': '行星运动技术', 'relationType': 'uses_technology'},
            {'from': '行星式球磨机', 'to': '纳米研磨技术', 'relationType': 'uses_technology'},
            {'from': '滚筒式球磨机', 'to': '滚筒研磨技术', 'relationType': 'uses_technology'},
            {'from': '搅拌式球磨机', 'to': '高速搅拌技术', 'relationType': 'uses_technology'},
            {'from': '搅拌式球磨机', 'to': '纳米研磨技术', 'relationType': 'uses_technology'},
            
            # 产品与行业的关系
            {'from': '行星式球磨机', 'to': '医药行业', 'relationType': 'applies_to'},
            {'from': '行星式球磨机', 'to': '化工行业', 'relationType': 'applies_to'},
            {'from': '滚筒式球磨机', 'to': '建材行业', 'relationType': 'applies_to'},
            {'from': '滚筒式球磨机', 'to': '矿业行业', 'relationType': 'applies_to'},
            {'from': '滚筒式球磨机', 'to': '化工行业', 'relationType': 'applies_to'},
            {'from': '搅拌式球磨机', 'to': '电子行业', 'relationType': 'applies_to'},
            {'from': '搅拌式球磨机', 'to': '医药行业', 'relationType': 'applies_to'},
            {'from': '搅拌式球磨机', 'to': '新能源行业', 'relationType': 'applies_to'},
            {'from': '氧化锆研磨球', 'to': '电子行业', 'relationType': 'applies_to'},
            {'from': '氧化锆研磨球', 'to': '医药行业', 'relationType': 'applies_to'},
            {'from': '氧化锆研磨球', 'to': '新能源行业', 'relationType': 'applies_to'},
            {'from': '氧化铝研磨球', 'to': '建材行业', 'relationType': 'applies_to'},
            {'from': '氧化铝研磨球', 'to': '化工行业', 'relationType': 'applies_to'},
            
            # 设计组件与颜色的关系
            {'from': 'Primary Button', 'to': 'Primary Cyan', 'relationType': uses_color'},
            {'from': 'Glass Panel', 'to': 'Surface Dark', 'relationType': uses_color'},
            {'from': 'Product Image Container', 'to': 'Hunan Shengtongda Design System', 'relationType': part_of'},
            {'from': 'Primary Button', 'to': 'Hunan Shengtongda Design System', 'relationType': part_of'},
            {'from': 'Secondary Button', 'to': 'Hunan Shengtongda Design System', 'relationType': part_of'},
            {'from': 'Glass Panel', 'to': 'Hunan Shengtongda Design System', 'relationType': part_of'},
            {'from': 'Card', 'to': 'Hunan Shengtongda Design System', 'relationType': part_of'},
            {'from': 'Space Grotesk', 'to': 'Hunan Shengtongda Design System', 'relationType': uses_font'},
            {'from': 'Material Symbols Outlined', 'to': 'Hunan Shengtongda Design System', 'relationType': uses_font'},
            {'from': 'Primary Cyan', 'to': 'Hunan Shengtongda Design System', 'relationType': has_color'},
            {'from': 'Secondary Orange', 'to': 'Hunan Shengtongda Design System', 'relationType': has_color'},
            {'from': 'Success Green', 'to': 'Hunan Shengtongda Design System', 'relationType': has_color'},
            {'from': 'Warning Amber', 'to': 'Hunan Shengtongda Design System', 'relationType': has_color'},
            {'from': 'Error Red', 'to': 'Hunan Shengtongda Design System', 'relationType': has_color'},
            {'from': 'Info Blue', 'to': 'Hunan Shengtongda Design System', 'relationType': has_color'}
        ]
    
    def initialize_graph(self):
        """初始化知识图谱"""
        logger.info("开始初始化知识图谱...")
        
        # 收集所有实体
        all_entities = []
        all_entities.extend(self.get_product_entities())
        all_entities.extend(self.get_category_entities())
        all_entities.extend(self.get_industry_entities())
        all_entities.extend(self.get_technology_entities())
        all_entities.extend(self.get_design_color_entities())
        all_entities.extend(self.get_design_component_entities())
        all_entities.extend(self.get_design_typography_entities())
        all_entities.extend(self.get_design_system_entities())
        
        # 收集所有关系
        all_relations = self.get_relations()
        
        logger.info(f"准备创建 {len(all_entities)} 个实体")
        logger.info(f"准备创建 {len(all_relations)} 个关系")
        
        # 保存到本地文件（用于备份和参考）
        backup_file = os.path.join(self.data_dir, 'kg_initial_data.json')
        with open(backup_file, 'w', encoding='utf-8') as f:
            json.dump({
                'entities': all_entities,
                'relations': all_relations,
                'created_at': __import__('time').strftime('%Y-%m-%d %H:%M:%S')
            }, f, ensure_ascii=False, indent=2)
        
        logger.info(f"知识图谱数据已保存到 {backup_file}")
        logger.info("知识图谱初始化完成！")
        
        return {
            'entities': all_entities,
            'relations': all_relations
        }

if __name__ == '__main__':
    initializer = KnowledgeGraphInitializer()
    result = initializer.initialize_graph()
    print(f"\n✅ 知识图谱初始化成功！")
    print(f"   - 实体数量: {len(result['entities'])}")
    print(f"   - 关系数量: {len(result['relations'])}")
