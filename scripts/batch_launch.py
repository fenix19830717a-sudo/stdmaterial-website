#!/usr/bin/env python3
"""
新产品批量上线工具
一键完成：数据准备 → 图片处理 → 产品上架 → 状态报告
"""

import json
import os
import shutil
from pathlib import Path
from datetime import datetime

PROJECT_ROOT = Path(r"D:\DESKTOP\晟通达\独立站设计\独立站代码实现")
STAGING_DIR = PROJECT_ROOT / "product_staging"  # 产品待上线目录

class BatchLauncher:
    """批量上线工具"""
    
    def __init__(self):
        self.products_file = PROJECT_ROOT / "data" / "products.json"
        self.backups_dir = PROJECT_ROOT / "backups"
        self.staging_dir = STAGING_DIR
        
    def setup(self):
        """初始化目录"""
        self.staging_dir.mkdir(exist_ok=True)
        
        # 创建子目录
        (self.staging_dir / "products").mkdir(exist_ok=True)
        (self.staging_dir / "images").mkdir(exist_ok=True)
        
        print("""
╔══════════════════════════════════════════════════════════╗
║       🆕 新产品批量上线工具                              ║
╚══════════════════════════════════════════════════════════╝

📁 上线流程:
   1. 准备产品数据 (products/ 目录)
   2. 准备产品图片 (images/ 目录)  
   3. 运行本脚本自动上架
   4. 查看上线报告

📂 目录结构:
   product_staging/
   ├── products/         ← 放产品JSON文件
   │   └── *.json
   └── images/          ← 放产品图片
       └── *.jpg/*.png
        """)
    
    def load_existing_products(self):
        """加载现有产品"""
        if not self.products_file.exists():
            return {"products": [], "categories": [], "materials": []}
        
        with open(self.products_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    
    def save_products(self, data):
        """保存产品数据"""
        # 备份
        if self.products_file.exists():
            backup_name = f"products_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
            shutil.copy2(self.products_file, self.backups_dir / backup_name)
        
        with open(self.products_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    
    def discover_products(self):
        """发现待上新产品"""
        products_dir = self.staging_dir / "products"
        
        json_files = list(products_dir.glob("*.json"))
        
        print(f"\n🔍 发现 {len(json_files)} 个产品文件:")
        
        new_products = []
        for json_file in json_files:
            try:
                with open(json_file, 'r', encoding='utf-8') as f:
                    product = json.load(f)
                    
                if isinstance(product, list):
                    new_products.extend(product)
                else:
                    new_products.append(product)
                    
                print(f"   ✅ {json_file.name}: {product.get('name', 'Unnamed')}")
                
            except Exception as e:
                print(f"   ❌ {json_file.name}: {e}")
        
        return new_products
    
    def discover_images(self):
        """发现待处理图片"""
        images_dir = self.staging_dir / "images"
        
        if not images_dir.exists():
            return {}
        
        image_files = list(images_dir.iterdir())
        supported = ['.jpg', '.jpeg', '.png', '.webp']
        
        images_map = {}
        for img in image_files:
            if img.suffix.lower() in supported:
                # 使用文件名作为key（去掉扩展名）
                key = img.stem
                if key not in images_map:
                    images_map[key] = []
                images_map[key].append(str(img.relative_to(self.staging_dir)))
        
        print(f"\n🖼️  发现 {len(image_files)} 张图片:")
        for name, paths in images_map.items():
            print(f"   {name}: {len(paths)} 张")
        
        return images_map
    
    def generate_product_id(self, product, index):
        """生成产品ID"""
        prefix_map = {
            "Grinding Jars": "GJ",
            "Grinding Media": "GM",
            "Planetary Ball Mills": "PBM",
            "Shaker Mills": "SM", 
            "Roller Mills": "RM",
            "Accessories": "ACC"
        }
        
        category = product.get('category', 'Accessories')
        prefix = prefix_map.get(category, "PROD")
        
        name = product.get('name', 'Product')
        key = ''.join(c for c in name.upper() if c.isalnum())[:4]
        
        return f"{prefix}-{key}-{datetime.now().strftime('%m%d')}-{index:02d}"
    
    def link_images(self, product, images_map):
        """关联产品图片"""
        name = product.get('name', '')
        product_id = product.get('id', '')
        
        # 尝试多种方式匹配图片
        matched = []
        
        # 1. 按产品ID匹配
        if product_id:
            for key, paths in images_map.items():
                if product_id.lower() in key.lower():
                    matched.extend(paths)
        
        # 2. 按产品名称关键词匹配
        if not matched:
            keywords = [c for c in name.lower().split() if len(c) > 2]
            for keyword in keywords[:3]:  # 最多3个关键词
                for key, paths in images_map.items():
                    if keyword in key.lower():
                        matched.extend(paths)
        
        # 转换为相对路径
        if matched:
            return [f"assets/images/products/{Path(m).name}" for m in matched[:5]]  # 最多5张
        
        return []
    
    def launch(self, dry_run=False):
        """执行上线"""
        print("\n" + "="*60)
        print("🚀 开始批量上线")
        print("="*60)
        
        # 1. 发现待上新产品
        new_products = self.discover_products()
        images_map = self.discover_images()
        
        if not new_products:
            print("\n❌ 没有发现待上新产品")
            print(f"   请在 {self.staging_dir}/products/ 放入产品JSON文件")
            return None
        
        # 2. 处理每个产品
        launched = []
        for i, product in enumerate(new_products, 1):
            print(f"\n[{i}/{len(new_products)}] 处理: {product.get('name', 'Unnamed')}")
            
            # 生成ID
            old_id = product.get('id', '')
            new_id = self.generate_product_id(product, i)
            product['id'] = new_id
            
            # 设置时间
            today = datetime.now().strftime("%Y-%m-%d")
            product['createdAt'] = today
            product['updatedAt'] = today
            
            # 关联图片
            images = self.link_images(product, images_map)
            product['images'] = images
            
            # 如果没有图片，使用占位图
            if not images:
                product['images'] = ['assets/images/products/placeholder.jpg']
            
            # 确保必要字段
            product.setdefault('price', 'Contact for Quote')
            product.setdefault('stock', 'In Stock')
            product.setdefault('description', '')
            product.setdefault('features', [])
            product.setdefault('applications', [])
            product.setdefault('specifications', {})
            
            print(f"   新ID: {new_id}")
            print(f"   图片: {len(product['images'])} 张")
            
            launched.append(product)
        
        if dry_run:
            print("\n⚠️ 演练模式 - 未实际保存")
            return launched
        
        # 3. 保存到主数据文件
        data = self.load_existing_products()
        existing_count = len(data['products'])
        
        data['products'].extend(launched)
        
        self.save_products(data)
        
        # 4. 复制图片（如果staging中有）
        target_images_dir = PROJECT_ROOT / "assets" / "images" / "products"
        
        for product in launched:
            for img_relative in product.get('images', []):
                if 'placeholder' in img_relative:
                    continue
                    
                img_path = self.staging_dir / img_relative
                if img_path.exists():
                    shutil.copy2(img_path, target_images_dir / img_path.name)
        
        # 5. 生成报告
        report = {
            "launch_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "products_launched": len(launched),
            "existing_products": existing_count,
            "total_products": len(data['products']),
            "products": [
                {
                    "id": p['id'],
                    "name": p.get('name'),
                    "category": p.get('category'),
                    "images_count": len(p.get('images', []))
                }
                for p in launched
            ]
        }
        
        # 保存报告
        report_file = self.staging_dir / f"launch_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, ensure_ascii=False, indent=2)
        
        print("\n" + "="*60)
        print("✅ 上线完成!")
        print("="*60)
        print(f"   上线产品: {len(launched)} 个")
        print(f"   历史产品: {existing_count} 个")
        print(f"   当前总计: {len(data['products'])} 个")
        print(f"   报告文件: {report_file.name}")
        
        return report
    
    def show_instructions(self):
        """显示使用说明"""
        print("""
╔══════════════════════════════════════════════════════════╗
║                    📋 使用说明                            ║
╚══════════════════════════════════════════════════════════╝

Step 1: 准备产品数据
   在 product_staging/products/ 目录创建产品JSON文件
   
   示例产品 (product_example.json):
   {
     "name": "新产品名称",
     "category": "Grinding Jars",
     "material": "氧化铝",
     "volume": "500 ml",
     "description": "产品描述...",
     "features": ["特性1", "特性2"],
     "applications": ["应用1", "应用2"],
     "specifications": {
       "容量": "500ml",
       "材质": "氧化铝"
     }
   }

Step 2: 准备产品图片
   在 product_staging/images/ 目录放入产品图片
   文件名建议与产品名称相关

Step 3: 运行上线
   python scripts/batch_launch.py

Step 4: 查看报告
   在 product_staging/ 目录查看上线报告

═══════════════════════════════════════════════════════════
提示: 可以一次放入多个产品JSON文件，会批量处理
═══════════════════════════════════════════════════════════
        """)


def main():
    import sys
    
    launcher = BatchLauncher()
    launcher.setup()
    
    if len(sys.argv) < 2:
        launcher.show_instructions()
        print("\n请按回车开始上线...")
        input()
        launcher.launch()
        return
    
    command = sys.argv[1]
    
    if command == "launch":
        launcher.launch()
    elif command == "dry-run":
        launcher.launch(dry_run=True)
    elif command == "discover":
        launcher.discover_products()
        launcher.discover_images()
    elif command == "help":
        launcher.show_instructions()
    else:
        print(f"未知命令: {command}")


if __name__ == "__main__":
    main()
