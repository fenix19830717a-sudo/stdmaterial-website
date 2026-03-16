#!/usr/bin/env python3
"""
数据库查询示例脚本
- 测试数据库连接
- 执行基本查询
- 验证数据完整性
"""

import sqlite3
import os

# 数据库文件路径
DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'database.db')

def test_connection():
    """测试数据库连接"""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        print("数据库连接成功")
        
        # 测试查询
        cursor.execute('SELECT COUNT(*) FROM products')
        count = cursor.fetchone()[0]
        print(f"产品总数: {count}")
        
        conn.close()
        return True
    except Exception as e:
        print(f"连接错误: {e}")
        return False

def get_all_products():
    """获取所有产品"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('SELECT id, name, category FROM products ORDER BY category, name')
    products = cursor.fetchall()
    
    print("\n所有产品:")
    print("-" * 80)
    for product in products:
        print(f"ID: {product[0]}, 名称: {product[1]}, 类别: {product[2]}")
    print("-" * 80)
    
    conn.close()

def get_product_by_id(product_id):
    """根据ID获取产品详情"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # 获取产品基本信息
    cursor.execute('SELECT * FROM products WHERE id = ?', (product_id,))
    product = cursor.fetchone()
    
    if product:
        print(f"\n产品详情 (ID: {product_id}):")
        print("-" * 80)
        print(f"名称: {product[1]}")
        print(f"类别: {product[2]}")
        print(f"子类别: {product[3]}")
        print(f"材质: {product[4]}")
        print(f"纯度: {product[5]}")
        print(f"描述: {product[17]}")
        print(f"价格: {product[18]}")
        print(f"库存: {product[19]}")
        
        # 获取规格
        cursor.execute('SELECT key, value FROM product_specifications WHERE product_id = ?', (product_id,))
        specs = cursor.fetchall()
        if specs:
            print("\n规格:")
            for spec in specs:
                print(f"  - {spec[0]}: {spec[1]}")
        
        # 获取特性
        cursor.execute('SELECT feature FROM product_features WHERE product_id = ?', (product_id,))
        features = cursor.fetchall()
        if features:
            print("\n特性:")
            for feature in features:
                print(f"  - {feature[0]}")
        
        # 获取应用
        cursor.execute('SELECT application FROM product_applications WHERE product_id = ?', (product_id,))
        applications = cursor.fetchall()
        if applications:
            print("\n应用领域:")
            for app in applications:
                print(f"  - {app[0]}")
        
        # 获取设备
        cursor.execute('SELECT equipment FROM product_equipment WHERE product_id = ?', (product_id,))
        equipment = cursor.fetchall()
        if equipment:
            print("\n适用设备:")
            for eq in equipment:
                print(f"  - {eq[0]}")
        
        # 获取图片
        cursor.execute('SELECT image_path FROM product_images WHERE product_id = ?', (product_id,))
        images = cursor.fetchall()
        if images:
            print("\n图片:")
            for image in images:
                print(f"  - {image[0]}")
        
        print("-" * 80)
    else:
        print(f"未找到产品 ID: {product_id}")
    
    conn.close()

def get_products_by_category():
    """按类别统计产品"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('SELECT category, COUNT(*) FROM products GROUP BY category')
    categories = cursor.fetchall()
    
    print("\n产品类别统计:")
    print("-" * 80)
    for category in categories:
        print(f"{category[0]}: {category[1]} 个产品")
    print("-" * 80)
    
    conn.close()

def search_products(keyword):
    """搜索产品"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
    SELECT id, name, category 
    FROM products 
    WHERE name LIKE ? OR description LIKE ? OR category LIKE ?
    ''', (f'%{keyword}%', f'%{keyword}%', f'%{keyword}%'))
    
    results = cursor.fetchall()
    
    print(f"\n搜索结果 (关键词: {keyword}):")
    print("-" * 80)
    if results:
        for product in results:
            print(f"ID: {product[0]}, 名称: {product[1]}, 类别: {product[2]}")
    else:
        print("未找到匹配的产品")
    print("-" * 80)
    
    conn.close()

def main():
    """主函数"""
    print("数据库查询测试")
    print("=" * 80)
    
    # 测试连接
    if not test_connection():
        return
    
    # 获取所有产品
    get_all_products()
    
    # 按类别统计
    get_products_by_category()
    
    # 测试产品详情
    print("\n测试产品详情查询:")
    test_products = ['PBM-4L', 'GJ-AL-500', 'GM-ZR-10']
    for product_id in test_products:
        get_product_by_id(product_id)
    
    # 测试搜索
    print("\n测试搜索功能:")
    search_products('mill')
    search_products('ceramic')
    
    print("\n测试完成！")

if __name__ == '__main__':
    main()
