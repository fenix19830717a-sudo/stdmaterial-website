#!/usr/bin/env python3
"""
独立站新产品上线工具
本地运行，无需部署
"""

import json
import os
import shutil
from datetime import datetime
from pathlib import Path

# 项目根目录
PROJECT_ROOT = Path(r"D:\DESKTOP\晟通达\独立站设计\独立站代码实现")
DATA_DIR = PROJECT_ROOT / "data"
ASSETS_DIR = PROJECT_ROOT / "assets"
IMAGES_DIR = ASSETS_DIR / "images" / "products"
TEMPLATES_DIR = PROJECT_ROOT / "templates"

class ProductLauncher:
    """新产品上线管理器"""
    
    def __init__(self):
        self.products_file = DATA_DIR / "products.json"
        self.new_products_dir = PROJECT_ROOT / "new_products"  # 新产品放置目录
        self.backups_dir = PROJECT_ROOT / "backups"
        
    def setup(self):
        """初始化目录结构"""
        self.new_products_dir.mkdir(exist_ok=True)
        print(f"✅ 目录初始化完成")
        print(f"   新产品目录: {self.new_products_dir}")
        
    def create_product_template(self, product_data=None):
        """创建产品模板或自定义产品"""
        if product_data is None:
            # 默认模板
            template = {
                "id": "",  # 将自动生成
                "name": "产品名称",
                "category": "Grinding Jars",
                "subcategory": "Ceramic",
                "material": "材料",
                "purity": "纯度",
                "volume": "容量",
                "hardness": "硬度",
                "maxTemperature": "最高温度",
                "equipment": ["Planetary Mill"],
                "description": "产品描述",
                "features": ["特性1", "特性2", "特性3"],
                "applications": ["应用领域1", "应用领域2"],
                "price": "Contact for Quote",
                "stock": "In Stock",
                "images": [],
                "specifications": {
                    "参数1": "值1",
                    "参数2": "值2"
                },
                "createdAt": datetime.now().strftime("%Y-%m-%d"),
                "updatedAt": datetime.now().strftime("%Y-%m-%d"),
                "seo": {
                    "title": "",
                    "description": "",
                    "keywords": ""
                }
            }
            return template
        return product_data
    
    def generate_product_id(self, product_name, category):
        """自动生成产品ID"""
        prefix_map = {
            "Grinding Jars": "GJ",
            "Grinding Media": "GM", 
            "Planetary Ball Mills": "PBM",
            "Shaker Mills": "SM",
            "Roller Mills": "RM",
            "Accessories": "ACC"
        }
        prefix = prefix_map.get(category, "PROD")
        # 从名称提取关键字母
        key = ''.join([c for c in product_name.upper() if c.isalnum()])[:6]
        timestamp = datetime.now().strftime("%m%d")
        return f"{prefix}-{key}-{timestamp}"
    
    def load_products(self):
        """加载现有产品数据"""
        if not self.products_file.exists():
            return {"products": []}
        
        with open(self.products_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    
    def save_products(self, data):
        """保存产品数据"""
        # 先备份
        if self.products_file.exists():
            backup_name = f"products_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
            shutil.copy2(self.products_file, self.backups_dir / backup_name)
            print(f"📦 已备份: {backup_name}")
        
        with open(self.products_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"✅ 产品数据已保存")
    
    def add_products(self, new_products_list):
        """批量添加新产品"""
        data = self.load_products()
        existing_ids = {p['id'] for p in data['products']}
        
        added_count = 0
        for product in new_products_list:
            # 生成ID
            if not product.get('id'):
                product['id'] = self.generate_product_id(
                    product.get('name', 'Product'), 
                    product.get('category', 'Accessories')
                )
            
            # 避免ID重复
            if product['id'] in existing_ids:
                product['id'] = f"{product['id']}_{added_count + 1}"
            
            # 设置时间戳
            product['createdAt'] = datetime.now().strftime("%Y-%m-%d")
            product['updatedAt'] = datetime.now().strftime("%Y-%m-%d")
            
            data['products'].append(product)
            existing_ids.add(product['id'])
            added_count += 1
            print(f"   + {product['id']}: {product.get('name', 'Unnamed')}")
        
        self.save_products(data)
        return added_count
    
    def remove_product(self, product_id):
        """删除产品"""
        data = self.load_products()
        original_count = len(data['products'])
        data['products'] = [p for p in data['products'] if p['id'] != product_id]
        
        if len(data['products']) < original_count:
            self.save_products(data)
            print(f"✅ 已删除产品: {product_id}")
            return True
        else:
            print(f"❌ 未找到产品: {product_id}")
            return False
    
    def list_products(self, category=None):
        """列出产品"""
        data = self.load_products()
        products = data['products']
        
        if category:
            products = [p for p in products if p.get('category') == category]
        
        print(f"\n📦 产品列表 (共 {len(products)} 个)")
        print("-" * 80)
        for p in products:
            stock = p.get('stock', 'N/A')
            print(f"  {p['id']} | {p.get('name', 'N/A')[:40]:<40} | {p.get('category', ''):<20} | {stock}")
        print("-" * 80)
        return products
    
    def export_template(self, output_path=None):
        """导出空白产品模板"""
        template = self.create_product_template()
        
        if output_path is None:
            output_path = self.new_products_dir / "product_template.json"
        else:
            output_path = Path(output_path)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(template, f, ensure_ascii=False, indent=2)
        
        print(f"✅ 模板已导出: {output_path}")
        return output_path
    
    def batch_import(self, import_dir):
        """从目录批量导入产品"""
        import_dir = Path(import_dir)
        if not import_dir.exists():
            print(f"❌ 目录不存在: {import_dir}")
            return 0
        
        json_files = list(import_dir.glob("*.json"))
        if not json_files:
            print(f"❌ 目录中没有JSON文件: {import_dir}")
            return 0
        
        all_products = []
        for json_file in json_files:
            try:
                with open(json_file, 'r', encoding='utf-8') as f:
                    product = json.load(f)
                    # 兼容单个产品和数组
                    if isinstance(product, list):
                        all_products.extend(product)
                    else:
                        all_products.append(product)
            except Exception as e:
                print(f"   ⚠️ 读取失败 {json_file.name}: {e}")
        
        if all_products:
            return self.add_products(all_products)
        return 0
    
    def generate_stats(self):
        """生成产品统计"""
        data = self.load_products()
        products = data['products']
        
        # 按类别统计
        categories = {}
        for p in products:
            cat = p.get('category', 'Unknown')
            categories[cat] = categories.get(cat, 0) + 1
        
        # 按库存状态统计
        stock_status = {}
        for p in products:
            stock = p.get('stock', 'Unknown')
            stock_status[stock] = stock_status.get(stock, 0) + 1
        
        print(f"\n📊 产品统计")
        print("=" * 50)
        print(f"总产品数: {len(products)}")
        print(f"\n按类别:")
        for cat, count in sorted(categories.items()):
            print(f"  • {cat}: {count}")
        print(f"\n按库存:")
        for stock, count in sorted(stock_status.items()):
            print(f"  • {stock}: {count}")
        print("=" * 50)
        
        return {
            "total": len(products),
            "categories": categories,
            "stock": stock_status
        }


def main():
    """命令行入口"""
    import sys
    
    launcher = ProductLauncher()
    launcher.setup()
    
    if len(sys.argv) < 2:
        print("""
🔧 独立站新产品上线工具
=========================
用法:
  python product_launcher.py list              - 列出所有产品
  python product_launcher.py list <category>    - 按类别列出产品
  python product_launcher.py template            - 导出产品模板
  python product_launcher.py add <json_file>     - 添加单个产品
  python product_launcher.py batch <dir>         - 批量导入产品
  python product_launcher.py remove <product_id> - 删除产品
  python product_launcher.py stats               - 产品统计
        """)
        return
    
    command = sys.argv[1]
    
    if command == "list":
        category = sys.argv[2] if len(sys.argv) > 2 else None
        launcher.list_products(category)
    
    elif command == "template":
        launcher.export_template()
    
    elif command == "add":
        if len(sys.argv) > 2:
            with open(sys.argv[2], 'r', encoding='utf-8') as f:
                product = json.load(f)
            launcher.add_products([product])
        else:
            print("用法: python product_launcher.py add <json_file>")
    
    elif command == "batch":
        if len(sys.argv) > 2:
            count = launcher.batch_import(sys.argv[2])
            print(f"\n✅ 成功导入 {count} 个产品")
        else:
            print("用法: python product_launcher.py batch <directory>")
    
    elif command == "remove":
        if len(sys.argv) > 2:
            launcher.remove_product(sys.argv[2])
        else:
            print("用法: python product_launcher.py remove <product_id>")
    
    elif command == "stats":
        launcher.generate_stats()
    
    else:
        print(f"未知命令: {command}")


if __name__ == "__main__":
    main()
