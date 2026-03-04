#!/usr/bin/env python3
"""
生成产品图片并替换SVG占位图
使用Trae API生成真实的产品图片
"""

import os
import json
import requests
from pathlib import Path

# 配置
BASE_DIR = Path(__file__).parent.parent
DATA_FILE = BASE_DIR / "data" / "products.json"
IMAGES_DIR = BASE_DIR / "assets" / "images" / "products"

# 确保图片目录存在
IMAGES_DIR.mkdir(parents=True, exist_ok=True)

def generate_image(prompt, filename):
    """使用Trae API生成图片"""
    try:
        # 使用Trae的文本转图片API
        api_url = "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image"
        params = {
            "prompt": prompt,
            "image_size": "square_hd"
        }
        
        response = requests.get(api_url, params=params, timeout=30)
        response.raise_for_status()
        
        # 保存图片
        with open(filename, 'wb') as f:
            f.write(response.content)
        
        print(f"✓ 生成图片: {filename}")
        return True
    except Exception as e:
        print(f"✗ 生成图片失败: {e}")
        return False

def generate_product_prompt(product):
    """根据产品信息生成图片提示词"""
    name = product["name"]
    description = product["description"]
    
    if "Planetary Ball Mill" in name:
        return f"Professional planetary ball mill machine in laboratory setting, industrial equipment, high quality photography, realistic, detailed, clean background, {name}"
    elif "Grinding Jar" in name or "Mill Container" in name:
        material = product.get("material", "")
        return f"{material} grinding jar with lid, laboratory equipment, close-up, high quality photography, realistic, detailed, clean background, {name}"
    elif "Grinding Balls" in name or "Grinding Media" in name:
        material = product.get("material", "")
        size = product.get("size", "")
        return f"{size} {material} grinding balls in container, laboratory equipment, close-up, high quality photography, realistic, detailed, clean background, {name}"
    elif "Stirring Jar Mill" in name:
        return f"Stirring jar mill machine, laboratory equipment, high quality photography, realistic, detailed, clean background, {name}"
    else:
        return f"Industrial grinding equipment, laboratory setting, high quality photography, realistic, detailed, clean background, {name}"

def main():
    """主函数"""
    print("开始生成产品图片...")
    print(f"产品数据文件: {DATA_FILE}")
    print(f"图片保存目录: {IMAGES_DIR}")
    print("=" * 60)
    
    # 读取产品数据
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    products = data.get("products", [])
    total_products = len(products)
    print(f"找到 {total_products} 个产品")
    print("=" * 60)
    
    # 生成图片
    success_count = 0
    for i, product in enumerate(products, 1):
        product_id = product["id"]
        product_name = product["name"]
        print(f"[{i}/{total_products}] 处理: {product_name}")
        
        # 生成图片文件名
        image_filename = IMAGES_DIR / f"{product_id.lower()}.jpg"
        
        # 生成提示词
        prompt = generate_product_prompt(product)
        print(f"  提示词: {prompt[:100]}...")
        
        # 生成图片
        if generate_image(prompt, image_filename):
            success_count += 1
        
        print()
    
    print("=" * 60)
    print(f"生成完成: 成功 {success_count}/{total_products}")
    print("图片已保存到:", IMAGES_DIR)

if __name__ == "__main__":
    main()
