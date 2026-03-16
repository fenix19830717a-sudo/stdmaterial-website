#!/usr/bin/env python3
"""
数据库初始化脚本
- 创建SQLite数据库
- 设计表结构
- 导入初始产品数据
"""

import sqlite3
import json
import os

# 数据库文件路径
DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'database.db')
# 产品数据文件路径
PRODUCTS_JSON_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'products.json')

def create_tables(conn):
    """创建数据库表结构"""
    cursor = conn.cursor()
    
    # 产品表
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        subcategory TEXT,
        material TEXT,
        purity TEXT,
        volume TEXT,
        hardness TEXT,
        max_temperature TEXT,
        model TEXT,
        max_speed TEXT,
        voltage TEXT,
        power TEXT,
        vacuum TEXT,
        temperature TEXT,
        size TEXT,
        density TEXT,
        description TEXT,
        price TEXT,
        stock TEXT,
        created_at TEXT,
        updated_at TEXT
    )
    ''')
    
    # 产品规格表
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS product_specifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id TEXT NOT NULL,
        key TEXT NOT NULL,
        value TEXT NOT NULL,
        FOREIGN KEY (product_id) REFERENCES products(id)
    )
    ''')
    
    # 产品特性表
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS product_features (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id TEXT NOT NULL,
        feature TEXT NOT NULL,
        FOREIGN KEY (product_id) REFERENCES products(id)
    )
    ''')
    
    # 产品应用表
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS product_applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id TEXT NOT NULL,
        application TEXT NOT NULL,
        FOREIGN KEY (product_id) REFERENCES products(id)
    )
    ''')
    
    # 产品设备表
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS product_equipment (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id TEXT NOT NULL,
        equipment TEXT NOT NULL,
        FOREIGN KEY (product_id) REFERENCES products(id)
    )
    ''')
    
    # 产品图片表
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS product_images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id TEXT NOT NULL,
        image_path TEXT NOT NULL,
        FOREIGN KEY (product_id) REFERENCES products(id)
    )
    ''')
    
    conn.commit()

def import_products(conn):
    """导入初始产品数据"""
    cursor = conn.cursor()
    
    # 读取产品数据
    with open(PRODUCTS_JSON_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    products = data.get('products', [])
    
    for product in products:
        # 插入产品主表
        cursor.execute('''
        INSERT OR REPLACE INTO products (
            id, name, category, subcategory, material, purity, volume, hardness, 
            max_temperature, model, max_speed, voltage, power, vacuum, temperature, 
            size, density, description, price, stock, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            product.get('id'),
            product.get('name'),
            product.get('category'),
            product.get('subcategory'),
            product.get('material'),
            product.get('purity'),
            product.get('volume'),
            product.get('hardness'),
            product.get('maxTemperature'),
            product.get('model'),
            product.get('maxSpeed'),
            product.get('voltage'),
            product.get('power'),
            product.get('vacuum'),
            product.get('temperature'),
            product.get('size'),
            product.get('density'),
            product.get('description'),
            product.get('price'),
            product.get('stock'),
            product.get('createdAt'),
            product.get('updatedAt')
        ))
        
        product_id = product.get('id')
        
        # 插入规格
        if product.get('specifications'):
            for key, value in product['specifications'].items():
                cursor.execute('''
                INSERT INTO product_specifications (product_id, key, value) VALUES (?, ?, ?)
                ''', (product_id, key, value))
        
        # 插入特性
        if product.get('features'):
            for feature in product['features']:
                cursor.execute('''
                INSERT INTO product_features (product_id, feature) VALUES (?, ?)
                ''', (product_id, feature))
        
        # 插入应用
        if product.get('applications'):
            for application in product['applications']:
                cursor.execute('''
                INSERT INTO product_applications (product_id, application) VALUES (?, ?)
                ''', (product_id, application))
        
        # 插入设备
        if product.get('equipment'):
            for equipment in product['equipment']:
                cursor.execute('''
                INSERT INTO product_equipment (product_id, equipment) VALUES (?, ?)
                ''', (product_id, equipment))
        
        # 插入图片
        if product.get('images'):
            for image_path in product['images']:
                cursor.execute('''
                INSERT INTO product_images (product_id, image_path) VALUES (?, ?)
                ''', (product_id, image_path))
    
    conn.commit()

def verify_data(conn):
    """验证数据导入情况"""
    cursor = conn.cursor()
    
    # 验证产品数量
    cursor.execute('SELECT COUNT(*) FROM products')
    product_count = cursor.fetchone()[0]
    print(f"产品数量: {product_count}")
    
    # 验证规格数量
    cursor.execute('SELECT COUNT(*) FROM product_specifications')
    spec_count = cursor.fetchone()[0]
    print(f"规格数量: {spec_count}")
    
    # 验证特性数量
    cursor.execute('SELECT COUNT(*) FROM product_features')
    feature_count = cursor.fetchone()[0]
    print(f"特性数量: {feature_count}")
    
    # 验证应用数量
    cursor.execute('SELECT COUNT(*) FROM product_applications')
    app_count = cursor.fetchone()[0]
    print(f"应用数量: {app_count}")
    
    # 验证设备数量
    cursor.execute('SELECT COUNT(*) FROM product_equipment')
    equipment_count = cursor.fetchone()[0]
    print(f"设备数量: {equipment_count}")
    
    # 验证图片数量
    cursor.execute('SELECT COUNT(*) FROM product_images')
    image_count = cursor.fetchone()[0]
    print(f"图片数量: {image_count}")

def main():
    """主函数"""
    print("开始初始化数据库...")
    
    # 连接数据库
    conn = sqlite3.connect(DB_PATH)
    
    try:
        # 创建表结构
        create_tables(conn)
        print("表结构创建完成")
        
        # 导入产品数据
        import_products(conn)
        print("产品数据导入完成")
        
        # 验证数据
        verify_data(conn)
        print("数据验证完成")
        
    except Exception as e:
        print(f"错误: {e}")
    finally:
        conn.close()
    
    print("数据库初始化完成！")

if __name__ == '__main__':
    main()
