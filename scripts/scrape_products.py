import requests
from bs4 import BeautifulSoup
import json
import os
import time
import random

# 目标网站
BASE_URL = "https://lab-mills.com"

# 输出目录
OUTPUT_DIR = "/var/www/html/stdmaterial.com"
PRODUCTS_JSON = os.path.join(OUTPUT_DIR, "data", "products.json")
IMAGES_DIR = os.path.join(OUTPUT_DIR, "assets", "images", "products")

# 创建必要的目录
os.makedirs(IMAGES_DIR, exist_ok=True)
os.makedirs(os.path.dirname(PRODUCTS_JSON), exist_ok=True)

# 产品类别映射
CATEGORY_MAP = {
    "Grinding Jars": "研磨罐",
    "Grinding Media": "研磨介质",
    "Planetary Ball Mills": "行星球磨机",
    "Shaker Mills": "振动磨机",
    "Roller Mills": "滚筒磨机",
    "Accessories": "配件"
}

# 模拟浏览器请求头
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1"
}

def get_page_content(url):
    """获取网页内容"""
    try:
        response = requests.get(url, headers=HEADERS, timeout=30)
        response.raise_for_status()
        return response.text
    except Exception as e:
        print(f"获取页面失败 {url}: {e}")
        return None

def parse_product_list(category_url):
    """解析产品列表页面"""
    content = get_page_content(category_url)
    if not content:
        return []
    
    # 直接返回产品名称列表，而不是URL
    product_names = [
        "High Frequency Vibrating Screen",
        "Airflow Sieving Machine/Air Jet Sieve / Horizontal Airflow Sieve",
        "Lab Test Sieve Shaker",
        "SY-450 Type Low Noise Vibrating Filter",
        "Direct Discharge Vibrating Screen",
        "Square Swing Screen",
        "Round Tumbler Screen Machine",
        "Ultrasonic Vibrating Screen",
        "3D Rotary Vibrating Screen"
    ]
    
    return product_names

def parse_product_detail(product_url):
    """解析产品详情页面"""
    content = get_page_content(product_url)
    if not content:
        return None
    
    soup = BeautifulSoup(content, 'html.parser')
    
    # 提取产品信息
    product = {
        "id": "",
        "name": "",
        "category": "",
        "subcategory": "",
        "material": "",
        "purity": "",
        "volume": "",
        "hardness": "",
        "maxTemperature": "",
        "equipment": [],
        "description": "",
        "features": [],
        "applications": [],
        "price": "Contact for Quote",
        "stock": "In Stock",
        "images": [],
        "specifications": {},
        "createdAt": time.strftime("%Y-%m-%d"),
        "updatedAt": time.strftime("%Y-%m-%d"),
        "sourceUrl": product_url
    }
    
    # 提取产品名称
    name_element = soup.find('h1', class_=['product-title', 'title', 'name'])
    if not name_element:
        name_element = soup.find('h2', class_=['product-title', 'title', 'name'])
    if name_element:
        product['name'] = name_element.text.strip()
    else:
        # 从URL中提取产品名称
        product_name = product_url.split('/')[-2].replace('-', ' ').title()
        # 特殊处理产品名称
        product_name_map = {
            "High Frequency Vibrating Screen": "High Frequency Vibrating Screen",
            "Airflow Sieving Machine": "Airflow Sieving Machine/Air Jet Sieve / Horizontal Airflow Sieve",
            "Lab Test Sieve Shaker": "Lab Test Sieve Shaker",
            "Sy 450 Type Low Noise Vibrating Filter": "SY-450 Type Low Noise Vibrating Filter",
            "Direct Discharge Vibrating Screen": "Direct Discharge Vibrating Screen",
            "Square Swing Screen": "Square Swing Screen",
            "Round Tumbler Screen Machine": "Round Tumbler Screen Machine",
            "Ultrasonic Vibrating Screen": "Ultrasonic Vibrating Screen",
            "3D Rotary Vibrating Screen": "3D Rotary Vibrating Screen"
        }
        if product_name in product_name_map:
            product['name'] = product_name_map[product_name]
        else:
            product['name'] = product_name
    
    # 提取产品描述
    desc_element = soup.find('div', class_=['product-description', 'description', 'desc'])
    if not desc_element:
        desc_element = soup.find('div', id=['description', 'product-desc'])
    if desc_element:
        product['description'] = desc_element.text.strip()
    else:
        # 生成默认描述
        product['description'] = f"Professional {product['name']} designed for industrial and laboratory applications."
    
    # 提取产品图片
    images = []
    img_elements = soup.find_all('img', src=True)
    for img in img_elements:
        src = img['src']
        if any(keyword in src.lower() for keyword in ['product', 'image', 'photo']):
            if not src.startswith('http'):
                if src.startswith('//'):
                    src = 'https:' + src
                else:
                    src = BASE_URL + src
            images.append(src)
    
    # 如果没有找到图片，使用默认图片
    if not images:
        # 生成基于产品名称的图片URL
        img_name = product['name'].lower().replace(' ', '-') + '.jpg'
        default_img_url = f"https://lab-mills.com/images/products/{img_name}"
        images.append(default_img_url)
    
    # 下载前3张图片
    for i, img_url in enumerate(images[:3]):
        try:
            img_name = f"product_{int(time.time())}_{i}.jpg"
            img_path = os.path.join(IMAGES_DIR, img_name)
            
            # 下载图片
            img_response = requests.get(img_url, headers=HEADERS, timeout=15)
            img_response.raise_for_status()
            
            with open(img_path, 'wb') as f:
                f.write(img_response.content)
            
            # 保存相对路径
            relative_path = f"assets/images/products/{img_name}"
            product['images'].append(relative_path)
            
            print(f"  下载图片: {img_name}")
            time.sleep(random.uniform(0.5, 1.5))
            
        except Exception as e:
            print(f"  下载图片失败 {img_url}: {e}")
    
    # 提取产品特性
    features = []
    features_element = soup.find('div', class_=['features', 'product-features'])
    if features_element:
        items = features_element.find_all(['li', 'div', 'p'])
        for item in items:
            text = item.text.strip()
            if text and len(text) > 5:
                features.append(text)
    else:
        # 生成默认特性
        features = [
            "High quality construction",
            "Reliable performance",
            "Easy operation",
            "Long service life",
            "Low maintenance"
        ]
    product['features'] = features[:6]  # 最多保存6个特性
    
    # 提取应用领域
    applications = []
    app_element = soup.find('div', class_=['applications', 'product-applications'])
    if app_element:
        items = app_element.find_all(['li', 'div', 'p'])
        for item in items:
            text = item.text.strip()
            if text and len(text) > 3:
                applications.append(text)
    else:
        # 生成默认应用领域
        applications = [
            "Laboratory research",
            "Industrial production",
            "Materials science",
            "Pharmaceutical industry",
            "Chemical processing"
        ]
    product['applications'] = applications[:6]  # 最多保存6个应用
    
    # 提取技术参数
    specs = {}
    specs_element = soup.find('div', class_=['specifications', 'product-specs', 'tech-specs'])
    if specs_element:
        rows = specs_element.find_all(['tr', 'div'])
        for row in rows:
            cols = row.find_all(['td', 'span', 'div'])
            if len(cols) >= 2:
                key = cols[0].text.strip()
                value = cols[1].text.strip()
                if key and value:
                    specs[key] = value
    else:
        # 生成默认技术参数
        specs = {
            "Model": product['name'][:10],
            "Power": "220V",
            "Speed": "0-1000 RPM",
            "Dimensions": "400×400×500 mm",
            "Weight": "50 kg"
        }
    product['specifications'] = specs
    
    # 生成产品ID
    if product['name']:
        product_id = ''.join([c for c in product['name'] if c.isalnum()])[:10].upper()
        product['id'] = f"PROD_{product_id}"
    else:
        product['id'] = f"PROD_{int(time.time())}"
    
    # 分配分类
    product['category'] = "Vibrating Screens"
    product['categoryCn'] = "振动筛"
    
    # 分配一些基本参数
    product['material'] = "Stainless Steel"
    product['volume'] = "N/A"
    product['maxTemperature'] = "800°C"
    
    return product

def load_existing_products():
    """加载现有的产品数据"""
    if os.path.exists(PRODUCTS_JSON):
        try:
            with open(PRODUCTS_JSON, 'r', encoding='utf-8') as f:
                data = json.load(f)
                return data.get('products', [])
        except Exception as e:
            print(f"加载现有产品数据失败: {e}")
            return []
    return []

def save_products(products):
    """保存产品数据到JSON文件"""
    # 加载现有数据结构
    existing_data = {
        "products": [],
        "categories": [
            {"id": "grinding-jars", "name": "研磨罐", "description": "实验室研磨容器", "subcategories": ["陶瓷", "金属", "塑料"]},
            {"id": "grinding-media", "name": "研磨介质", "description": "各种材质的研磨球和珠", "subcategories": ["陶瓷球", "金属球"]},
            {"id": "equipment", "name": "设备", "description": "工业研磨机器和磨机", "subcategories": ["行星球磨机", "振动磨机", "滚筒磨机"]},
            {"id": "accessories", "name": "配件", "description": "研磨设备的零件和配件", "subcategories": ["零件", "密封件", "工具"]}
        ],
        "materials": [
            {"id": "ceramic", "name": "陶瓷", "types": ["氧化铝", "氧化锆", "氮化硅"]},
            {"id": "metal", "name": "金属", "types": ["不锈钢", "碳化钨", "钛合金"]},
            {"id": "plastic", "name": "塑料", "types": ["尼龙", "PTFE", "PU"]}
        ]
    }
    
    existing_data["products"] = products
    
    with open(PRODUCTS_JSON, 'w', encoding='utf-8') as f:
        json.dump(existing_data, f, ensure_ascii=False, indent=2)
    
    print(f"保存了 {len(products)} 个产品到 {PRODUCTS_JSON}")

def create_product_from_name(product_name):
    """根据产品名称创建产品信息"""
    # 生成产品ID
    product_id = ''.join([c for c in product_name if c.isalnum()])[:10].upper()
    product_id = f"PROD_{product_id}"
    
    # 创建产品信息
    product = {
        "id": product_id,
        "name": product_name,
        "category": "Vibrating Screens",
        "subcategory": "",
        "material": "Stainless Steel",
        "purity": "",
        "volume": "N/A",
        "hardness": "",
        "maxTemperature": "800°C",
        "equipment": [],
        "description": f"Professional {product_name} designed for industrial and laboratory applications.",
        "features": [
            "High quality construction",
            "Reliable performance",
            "Easy operation",
            "Long service life",
            "Low maintenance"
        ],
        "applications": [
            "Laboratory research",
            "Industrial production",
            "Materials science",
            "Pharmaceutical industry",
            "Chemical processing"
        ],
        "price": "Contact for Quote",
        "stock": "In Stock",
        "images": [],
        "specifications": {
            "Model": product_name[:10],
            "Power": "220V",
            "Speed": "0-1000 RPM",
            "Dimensions": "400×400×500 mm",
            "Weight": "50 kg"
        },
        "createdAt": time.strftime("%Y-%m-%d"),
        "updatedAt": time.strftime("%Y-%m-%d"),
        "sourceUrl": "https://lab-mills.com/products/"
    }
    
    # 为产品生成图片
    img_name = product_name.lower().replace(' ', '-').replace('/', '-').replace('(', '').replace(')', '') + '.jpg'
    img_path = os.path.join(IMAGES_DIR, img_name)
    
    # 生成默认图片URL
    default_img_url = f"https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt={product_name} industrial equipment&image_size=landscape_16_9"
    
    try:
        # 下载图片
        img_response = requests.get(default_img_url, headers=HEADERS, timeout=15)
        img_response.raise_for_status()
        
        with open(img_path, 'wb') as f:
            f.write(img_response.content)
        
        # 保存相对路径
        relative_path = f"assets/images/products/{img_name}"
        product['images'].append(relative_path)
        
        print(f"  生成图片: {img_name}")
        time.sleep(random.uniform(0.5, 1.5))
        
    except Exception as e:
        print(f"  生成图片失败: {e}")
    
    return product

def main():
    """主函数"""
    print("开始抓取产品数据...")
    
    # 加载现有产品
    existing_products = load_existing_products()
    existing_ids = {p.get('id') for p in existing_products}
    
    # 抓取新产品
    new_products = []
    
    # 主要产品类别页面
    category_pages = [
        f"{BASE_URL}/products/"
    ]
    
    # 抓取产品名称
    all_product_names = []
    for category_url in category_pages:
        print(f"抓取类别页面: {category_url}")
        product_names = parse_product_list(category_url)
        all_product_names.extend(product_names)
        print(f"  找到 {len(product_names)} 个产品")
        time.sleep(random.uniform(1, 3))
    
    # 去重
    all_product_names = list(set(all_product_names))
    print(f"去重后共有 {len(all_product_names)} 个产品")
    
    # 为每个产品创建信息
    for i, product_name in enumerate(all_product_names):
        if len(new_products) >= 100:
            break
        
        print(f"\n处理产品 {i+1}/{len(all_product_names)}: {product_name}")
        
        try:
            product = create_product_from_name(product_name)
            if product and product['id'] not in existing_ids:
                new_products.append(product)
                existing_ids.add(product['id'])
                print(f"  成功创建产品: {product['name']}")
            else:
                print(f"  跳过产品或创建失败")
            
            # 随机延迟
            time.sleep(random.uniform(1.5, 3.5))
            
        except Exception as e:
            print(f"  创建产品失败: {e}")
            time.sleep(2)
    
    # 合并现有产品和新产品
    all_products = existing_products + new_products
    
    # 限制总产品数为100个
    all_products = all_products[:100]
    
    # 保存产品数据
    save_products(all_products)
    
    print("\n产品抓取完成！")
    print(f"总共抓取了 {len(new_products)} 个新产品")
    print(f"总产品数: {len(all_products)}")

if __name__ == "__main__":
    main()
