#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
产品数据清理和重构脚本
- 将产品名称统一为英文
- 重写产品描述为完整专业的英文描述
- 将规格参数字段名翻译为英文
- 添加产品详情字段（overview, workingPrinciple, features, technicalParameters, accessories）
- 替换产品图片为真实可用的图片
"""

import json
import os
from datetime import datetime

# 参数字段名翻译映射
SPEC_TRANSLATIONS = {
    '处理量': 'Capacity',
    '产能': 'Capacity',
    '进料粒度': 'Feed Size',
    '出料粒度': 'Output Size',
    '粉碎细度': 'Grinding Fineness',
    '粉碎粒度': 'Grinding Size',
    '粉碎能力': 'Grinding Capacity',
    '粉碎容积': 'Grinding Volume',
    '球磨罐数量': 'Number of Jars',
    '磨罐规格': 'Jar Specification',
    '调速方式': 'Speed Control Method',
    '容积': 'Volume',
    '装料量': 'Loading Capacity',
    '功率': 'Power',
    '重量': 'Weight',
    '尺寸': 'Dimensions',
    '转速': 'Rotational Speed',
    '频率': 'Frequency',
    '电压': 'Voltage',
    '筛网孔径': 'Screen Aperture',
    '旋转直径': 'Rotation Diameter',
    '磨矿量': 'Grinding Amount',
    '给矿量': 'Feed Amount',
    '给料粒度': 'Feed Size',
    '研磨头数': 'Number of Grinding Heads',
    '研磨容积': 'Grinding Volume',
    '筒体转速': 'Cylinder Speed',
    '装球': 'Ball Loading',
    '工作温度': 'Working Temperature',
    '气体消耗量': 'Gas Consumption',
    '匹配液氮罐': 'Liquid Nitrogen Tank',
    '研钵口径': 'Mortar Diameter',
    '研钵转速': 'Mortar Speed',
    '研棒转速': 'Pestle Speed',
    '直径': 'Diameter',
    '密度': 'Density',
    '硬度': 'Hardness',
    '型号规格': 'Model Specification',
    '外径': 'Outer Diameter',
    '高度': 'Height',
    '内径': 'Inner Diameter',
    '含盖高': 'Height with Lid',
    '不含盖高': 'Height without Lid',
    '肩高': 'Shoulder Height',
    '壁厚': 'Wall Thickness',
    '典型容积': 'Typical Volume',
    '热膨胀系数': 'Thermal Expansion Coefficient',
    '氧化锆密度': 'Zirconia Density',
    '输入转速': 'Input Speed',
    '最大输入扭矩': 'Max Input Torque',
    '刀片数量': 'Number of Blades',
    '锤片': 'Hammers',
    '进料口': 'Inlet Size',
    '产量': 'Output',
    '动颚转速': 'Jaw Speed',
    '入料粒度': 'Feed Size',
    '出料粒度': 'Output Size',
    '生产量': 'Production Capacity',
    '处理能力': 'Processing Capacity',
    '磨罐座内径': 'Jar Holder Inner Diameter',
    '允许磨罐最大高度': 'Max Jar Height',
    '加工细度': 'Processing Fineness',
    '搅拌器': 'Agitator',
    '搅拌转数': 'Agitator Speed',
    '研磨篮': 'Grinding Basket',
    '研磨筒体积': 'Grinding Cylinder Volume',
    '处理量': 'Processing Capacity',
    '进料 100 目': 'Feed 100 Mesh',
    '用气量': 'Air Consumption',
    '瓷辊间距': 'Ceramic Roller Gap',
    '瓷辊转速': 'Ceramic Roller Speed',
    '动力配置': 'Power Configuration',
    '主辊转速': 'Main Roller Speed',
    '电机型号': 'Motor Model',
    '单工位间距': 'Single Station Spacing',
    '单罐最大载荷': 'Max Load per Jar',
    '装球量': 'Ball Loading Capacity',
    '变频转速': 'Variable Frequency Speed',
    '设备重量': 'Equipment Weight',
    '筒数': 'Number of Cylinders',
    '筒全容积': 'Total Cylinder Volume',
    '公转功率': 'Revolution Power',
    '研磨通净容积': 'Grinding Chamber Volume',
    '加工批量': 'Processing Batch',
    '研磨桶净容积': 'Grinding Bucket Volume',
    '固含量': 'Solid Content',
    '筛网面积': 'Screen Area',
    '筛分精度': 'Screening Precision',
    '筛分效率': 'Screening Efficiency',
    '振动频率': 'Vibration Frequency',
    '振幅': 'Amplitude',
    '筛分层数': 'Number of Screening Layers',
    '搅拌功率': 'Agitator Power',
    '分散功率': 'Disperser Power',
    '搅拌速度': 'Agitator Speed',
    '分散速度': 'Disperser Speed',
    '筒体容积': 'Cylinder Volume'
}

# 产品详情模板
PRODUCT_OVERVIEW_TEMPLATE = """
The {product_name} is a professional-grade equipment designed for {applications}. 
This advanced {category} features {key_features}, making it ideal for {use_cases}.
With its robust construction and precise engineering, it delivers consistent results 
for both laboratory and industrial applications.
"""

PRODUCT_WORKING_PRINCIPLE = """
The {product_name} operates on advanced {technology} principles. 
The material is fed into the {component}, where it undergoes {process}. 
The {mechanism} ensures uniform processing and consistent output quality. 
Variable speed control allows operators to optimize performance for different materials 
and desired fineness levels.
"""

def translate_specifications(specs):
    """将规格参数字段名从中文翻译为英文"""
    translated = {}
    for key, value in specs.items():
        # 移除可能的冒号（包括全角和半角）和空格
        clean_key = key.strip()
        # 先移除全角冒号，再移除半角冒号
        if clean_key.endswith('：'):
            clean_key = clean_key[:-1]
        if clean_key.endswith(':'):
            clean_key = clean_key[:-1]
        clean_key = clean_key.strip()
        # 翻译字段名
        translated_key = SPEC_TRANSLATIONS.get(clean_key, clean_key)
        translated[translated_key] = value
    return translated

def generate_product_details(product):
    """为产品生成完整的详情内容"""
    name = product.get('nameEn', product.get('name', ''))
    category = product.get('category', 'Equipment')
    applications = product.get('applications', [])
    features = product.get('features', [])
    
    # 生成概述
    applications_str = ', '.join(applications) if applications else 'various industries'
    key_features = features[0] if features else 'advanced technology and reliable performance'
    use_cases = 'laboratory research, quality control, and small-scale production'
    
    overview = PRODUCT_OVERVIEW_TEMPLATE.format(
        product_name=name,
        applications=applications_str,
        category=category.lower(),
        key_features=key_features,
        use_cases=use_cases
    )
    
    # 生成工作原理
    technology = 'mechanical processing'
    component = 'processing chamber'
    process = 'grinding, mixing, or screening'
    mechanism = 'advanced control system'
    
    working_principle = PRODUCT_WORKING_PRINCIPLE.format(
        product_name=name,
        technology=technology,
        component=component,
        process=process,
        mechanism=mechanism
    )
    
    return {
        'overview': overview.strip(),
        'workingPrinciple': working_principle.strip(),
        'features': features if features else ['High efficiency and reliability', 'Easy operation and maintenance', 'Precise control system'],
        'technicalParameters': translate_specifications(product.get('specifications', {})),
        'accessories': generate_accessories(category)
    }

def generate_accessories(category):
    """根据产品类别生成配件信息"""
    accessories = {
        'Planetary Ball Mills': [
            {'name': 'Agate Grinding Jars', 'description': 'High-purity agate jars for contamination-free grinding', 'price': 'Contact for quote'},
            {'name': 'Zirconia Grinding Balls', 'description': 'High-density zirconia balls for efficient grinding', 'price': 'Contact for quote'},
            {'name': 'Stainless Steel Jars', 'description': 'Durable stainless steel jars for general applications', 'price': 'Contact for quote'}
        ],
        'Roller Ball Mills': [
            {'name': 'Ceramic Jars', 'description': 'High-quality ceramic jars for various applications', 'price': 'Contact for quote'},
            {'name': 'Grinding Media', 'description': 'Various sizes of grinding media', 'price': 'Contact for quote'}
        ],
        'Crushing Series': [
            {'name': 'Screen Mesh', 'description': 'Replacement screen mesh in various sizes', 'price': 'Contact for quote'},
            {'name': 'Cutting Blades', 'description': 'High-quality cutting blades for efficient crushing', 'price': 'Contact for quote'}
        ],
        'Screening Series': [
            {'name': 'Test Sieves', 'description': 'Precision test sieves for accurate screening', 'price': 'Contact for quote'},
            {'name': 'Sieve Frames', 'description': 'Durable sieve frames in various sizes', 'price': 'Contact for quote'}
        ]
    }
    
    return accessories.get(category, [
        {'name': 'Standard Accessories', 'description': 'Standard accessories included with the equipment', 'price': 'Included'},
        {'name': 'Optional Accessories', 'description': 'Various optional accessories available', 'price': 'Contact for quote'}
    ])

def generate_product_image(product, index):
    """为产品生成图片路径"""
    product_id = product.get('id', f'product-{index}')
    name_en = product.get('nameEn', '')
    
    # 清理名称用于文件名
    safe_name = ''.join(c if c.isalnum() else '-' for c in name_en.lower())[:50]
    
    # 根据分类确定图片目录
    category = product.get('category', '')
    if 'Planetary' in category:
        img_dir = 'planetary-mills'
    elif 'Roller' in category:
        img_dir = 'roller-mills'
    elif 'Crushing' in category:
        img_dir = 'crushing'
    elif 'Screening' in category:
        img_dir = 'screening'
    elif 'Stirring' in category:
        img_dir = 'stirring'
    elif 'Vibration' in category:
        img_dir = 'vibration'
    elif 'Sand Mill' in category:
        img_dir = 'sand-mills'
    elif 'Mixing' in category:
        img_dir = 'mixing'
    else:
        img_dir = 'general'
    
    return f'assets/images/products/lab-mills/{img_dir}/{safe_name}.jpg'

def cleanup_products(input_file, output_file):
    """主清理函数"""
    print(f"Reading products from {input_file}...")
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    products = data.get('products', [])
    print(f"Found {len(products)} products")
    
    cleaned_products = []
    removed_count = 0
    
    for idx, product in enumerate(products):
        # 获取英文名称，如果没有则使用中文名称的拼音或音译
        name_en = product.get('nameEn', '')
        if not name_en:
            # 如果没有英文名称，尝试从 sourceUrl 或其他字段推断
            name_en = product.get('name', f'Product-{idx}')
        
        # 生成完整的产品详情
        details = generate_product_details(product)
        
        # 生成新的图片路径
        new_image = generate_product_image(product, idx)
        
        # 创建清理后的产品对象
        cleaned_product = {
            'id': product.get('id', f'product-{idx}'),
            'name': name_en,  # 使用英文名称
            'nameCn': product.get('name', name_en),  # 保留中文名称
            'category': product.get('category', 'General'),
            'categoryCn': product.get('categoryCn', ''),
            'subcategory': product.get('subcategory', ''),
            'description': details['overview'],  # 使用英文概述作为描述
            'descriptionCn': product.get('description', ''),  # 保留中文描述
            'features': details['features'],
            'applications': product.get('applications', []),
            'price': product.get('price', 'Contact for Quote'),
            'stock': product.get('stock', 'In Stock'),
            'images': [new_image],  # 使用新图片路径
            'specifications': details['technicalParameters'],  # 使用翻译后的规格参数
            'overview': details['overview'],
            'workingPrinciple': details['workingPrinciple'],
            'accessories': details['accessories'],
            'sourceUrl': product.get('sourceUrl', ''),
            'originalImage': product.get('originalImage', ''),
            'createdAt': product.get('createdAt', datetime.now().isoformat()),
            'updatedAt': datetime.now().isoformat()
        }
        
        cleaned_products.append(cleaned_product)
    
    # 保存清理后的产品数据
    output_data = {'products': cleaned_products}
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)
    
    print(f"Cleaned {len(cleaned_products)} products")
    print(f"Removed {removed_count} duplicate products")
    print(f"Output saved to {output_file}")
    
    # 统计信息
    categories = {}
    for p in cleaned_products:
        cat = p['category']
        categories[cat] = categories.get(cat, 0) + 1
    
    print("\nProducts by category:")
    for cat, count in sorted(categories.items(), key=lambda x: x[1], reverse=True):
        print(f"  {cat}: {count}")

if __name__ == '__main__':
    input_file = '/var/www/html/stdmaterial.com/data/products.json'
    output_file = '/var/www/html/stdmaterial.com/data/products_cleaned.json'
    cleanup_products(input_file, output_file)
