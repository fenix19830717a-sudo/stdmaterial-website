import requests
from bs4 import BeautifulSoup
import json
import os
import time
import random
import schedule
import logging

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('scraper.log', encoding='utf-8'),
        logging.StreamHandler()
    ]
)

# 修复控制台输出编码问题
import sys
sys.stdout.reconfigure(encoding='utf-8')

# 目标网站
BASE_URL = "https://www.sbworld.cn"

# 输出目录
OUTPUT_DIR = "D:\DESKTOP\晟通达\独立站设计\独立站代码实现"
PRODUCTS_JSON = os.path.join(OUTPUT_DIR, "data", "products.json")
IMAGES_DIR = os.path.join(OUTPUT_DIR, "assets", "images", "products")

# 创建必要的目录
os.makedirs(IMAGES_DIR, exist_ok=True)
os.makedirs(os.path.dirname(PRODUCTS_JSON), exist_ok=True)

# 产品类别映射
CATEGORY_MAP = {
    "broken-series": "破碎系列",
    "grinding-series": "研磨系列",
    "screening-series": "筛分系列",
    "mixed-series": "混合系列",
    "press-forming": "压制成型",
    "sintering-series": "烧结系列",
    "glovebox": "手套箱系列",
    "research-equipment": "科研设备"
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
        logging.error(f"获取页面失败 {url}: {e}")
        return None

def parse_product_list(category_url, category_name):
    """解析产品列表页面"""
    content = get_page_content(category_url)
    if not content:
        return []
    
    soup = BeautifulSoup(content, 'html.parser')
    product_links = []
    
    # 查找产品链接
    product_items = soup.find_all('div', class_=['item-li', 'product-item', 'product-box'])
    
    for item in product_items:
        link = item.find('a', href=True)
        if link:
            product_url = link['href']
            if not product_url.startswith('http'):
                product_url = BASE_URL + product_url
            product_links.append((product_url, category_name))
    
    # 也尝试从其他结构中查找
    if not product_links:
        links = soup.find_all('a', href=True)
        for link in links:
            href = link['href']
            if ('product' in href.lower() and 'html' in href.lower()) or 'detail' in href.lower():
                if not href.startswith('http'):
                    href = BASE_URL + href
                if href not in [p[0] for p in product_links]:
                    product_links.append((href, category_name))
    
    return product_links

def parse_product_detail(product_url, category_name):
    """解析产品详情页面"""
    content = get_page_content(product_url)
    if not content:
        return None
    
    soup = BeautifulSoup(content, 'html.parser')
    
    # 提取产品信息
    product = {
        "id": "",
        "name": "",
        "category": category_name,
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
        "updatedAt": time.strftime("%Y-%m-%d")
    }
    
    # 提取产品名称
    name_element = soup.find('h1', class_=['product-title', 'title', 'name'])
    if not name_element:
        name_element = soup.find('h2', class_=['product-title', 'title', 'name'])
    if not name_element:
        name_element = soup.find('div', class_=['product-title', 'title', 'name'])
    if name_element:
        product['name'] = name_element.text.strip()
    
    # 提取产品描述
    desc_element = soup.find('div', class_=['product-description', 'description', 'desc'])
    if not desc_element:
        desc_element = soup.find('div', id=['description', 'product-desc'])
    if not desc_element:
        desc_element = soup.find('div', class_=['content', 'article'])
    if desc_element:
        product['description'] = desc_element.text.strip()
    
    # 提取产品图片
    images = []
    img_elements = soup.find_all('img', src=True)
    for img in img_elements:
        src = img['src']
        if any(keyword in src.lower() for keyword in ['product', 'image', 'photo', 'allimg']):
            if not src.startswith('http'):
                if src.startswith('//'):
                    src = 'https:' + src
                else:
                    src = BASE_URL + src
            images.append(src)
    
    # 下载前3张图片
    for i, img_url in enumerate(images[:3]):
        try:
            img_name = f"sbworld_{int(time.time())}_{i}.jpg"
            img_path = os.path.join(IMAGES_DIR, img_name)
            
            # 下载图片
            img_response = requests.get(img_url, headers=HEADERS, timeout=15)
            img_response.raise_for_status()
            
            with open(img_path, 'wb') as f:
                f.write(img_response.content)
            
            # 保存相对路径
            relative_path = f"assets/images/products/{img_name}"
            product['images'].append(relative_path)
            
            logging.info(f"  下载图片: {img_name}")
            time.sleep(random.uniform(0.5, 1.5))
            
        except Exception as e:
            logging.error(f"  下载图片失败 {img_url}: {e}")
    
    # 提取产品特性
    features = []
    features_element = soup.find('div', class_=['features', 'product-features', 'characteristics'])
    if features_element:
        items = features_element.find_all(['li', 'div', 'p'])
        for item in items:
            text = item.text.strip()
            if text and len(text) > 5:
                features.append(text)
    # 如果没有找到特性，尝试从描述中提取
    if not features and product['description']:
        desc_lines = product['description'].split('\n')
        for line in desc_lines:
            line = line.strip()
            if line and len(line) > 10:
                features.append(line)
    product['features'] = features[:6]  # 最多保存6个特性
    
    # 提取应用领域
    applications = []
    app_element = soup.find('div', class_=['applications', 'product-applications', 'usage'])
    if app_element:
        items = app_element.find_all(['li', 'div', 'p'])
        for item in items:
            text = item.text.strip()
            if text and len(text) > 3:
                applications.append(text)
    product['applications'] = applications[:6]  # 最多保存6个应用
    
    # 提取技术参数
    specs = {}
    specs_element = soup.find('div', class_=['specifications', 'product-specs', 'tech-specs', 'parameters'])
    if specs_element:
        rows = specs_element.find_all(['tr', 'div', 'li'])
        for row in rows:
            cols = row.find_all(['td', 'span', 'div'])
            if len(cols) >= 2:
                key = cols[0].text.strip()
                value = cols[1].text.strip()
                if key and value:
                    specs[key] = value
    # 尝试从其他结构提取参数
    if not specs:
        tables = soup.find_all('table')
        for table in tables:
            rows = table.find_all('tr')
            for row in rows:
                cols = row.find_all('td')
                if len(cols) >= 2:
                    key = cols[0].text.strip()
                    value = cols[1].text.strip()
                    if key and value:
                        specs[key] = value
    product['specifications'] = specs
    
    # 生成产品ID
    if product['name']:
        # 使用URL和时间戳生成唯一ID
        url_hash = hash(product_url) % 10000
        timestamp = int(time.time() * 1000) % 10000
        product['id'] = f"SB_{url_hash}_{timestamp}"
    else:
        product['id'] = f"SB_{int(time.time())}"
    
    # 提取子类别
    if 'planetary' in product_url.lower() or 'è¡æ' in product['name']:
        product['subcategory'] = '行星球磨机'
    elif 'crusher' in product_url.lower() or 'ç ´ç¢' in product['name']:
        product['subcategory'] = '破碎机'
    elif 'screen' in product_url.lower() or 'ç­' in product['name']:
        product['subcategory'] = '筛分机'
    elif 'glovebox' in product_url.lower() or 'æå¥ç®±' in product['name']:
        product['subcategory'] = '手套箱'
    
    # 提取材质信息
    if 'stainless' in product_url.lower() or 'ä¸é' in product['name']:
        product['material'] = 'Stainless Steel'
    elif 'ceramic' in product_url.lower() or 'é陶瓷' in product['name']:
        product['material'] = 'Ceramic'
    elif 'zirconia' in product_url.lower() or '氧化锆' in product['name']:
        product['material'] = 'Zirconia'
    
    return product

def load_existing_products():
    """加载现有的产品数据"""
    if os.path.exists(PRODUCTS_JSON):
        try:
            with open(PRODUCTS_JSON, 'r', encoding='utf-8') as f:
                data = json.load(f)
                return data.get('products', [])
        except Exception as e:
            logging.error(f"加载现有产品数据失败: {e}")
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
    
    logging.info(f"保存了 {len(products)} 个产品到 {PRODUCTS_JSON}")

def scrape_products():
    """抓取产品数据"""
    logging.info("开始抓取产品数据...")
    
    # 加载现有产品
    existing_products = load_existing_products()
    existing_ids = {p.get('id') for p in existing_products}
    
    # 抓取新产品
    new_products = []
    
    # 主要产品类别页面
    category_pages = [
        (f"{BASE_URL}/product/broken-series/", "破碎系列"),
        (f"{BASE_URL}/product/grinding-series/", "研磨系列"),
        (f"{BASE_URL}/product/screening-series/", "筛分系列"),
        (f"{BASE_URL}/product/mixed-series/", "混合系列"),
        (f"{BASE_URL}/product/press-forming/", "压制成型"),
        (f"{BASE_URL}/product/sintering-series/", "烧结系列"),
        (f"{BASE_URL}/product/glovebox/", "手套箱系列"),
        (f"{BASE_URL}/product/research-equipment/", "科研设备")
    ]
    
    # 抓取产品链接
    all_product_links = []
    for category_url, category_name in category_pages:
        logging.info(f"抓取类别页面: {category_url} ({category_name})")
        product_links = parse_product_list(category_url, category_name)
        all_product_links.extend(product_links)
        logging.info(f"  找到 {len(product_links)} 个产品链接")
        time.sleep(random.uniform(1, 3))
    
    # 去重
    seen_urls = set()
    unique_product_links = []
    for url, category in all_product_links:
        if url not in seen_urls:
            seen_urls.add(url)
            unique_product_links.append((url, category))
    
    logging.info(f"去重后共有 {len(unique_product_links)} 个产品链接")
    
    # 抓取产品详情
    for i, (product_url, category_name) in enumerate(unique_product_links):
        logging.info(f"\n抓取产品 {i+1}/{len(unique_product_links)}: {product_url}")
        
        try:
            product = parse_product_detail(product_url, category_name)
            if product:
                if product['id'] not in existing_ids:
                    new_products.append(product)
                    existing_ids.add(product['id'])
                    logging.info(f"  成功抓取产品: {product['name']}")
                else:
                    logging.info(f"  跳过产品（ID重复）: {product['id']}")
            else:
                logging.info(f"  抓取失败（无产品数据）")
            
            # 随机延迟
            time.sleep(random.uniform(1.5, 3.5))
            
        except Exception as e:
            logging.error(f"  抓取产品失败: {e}")
            time.sleep(2)
    
    # 合并现有产品和新产品
    all_products = existing_products + new_products
    
    # 保存产品数据
    save_products(all_products)
    
    logging.info("\n产品抓取完成！")
    logging.info(f"总共抓取了 {len(new_products)} 个新产品")
    logging.info(f"总产品数: {len(all_products)}")

def job():
    """定时任务"""
    logging.info("执行定时抓取任务...")
    scrape_products()

def main():
    """主函数"""
    # 立即执行一次抓取
    scrape_products()
    
    # 设置定时任务（每天凌晨2点执行）
    schedule.every().day.at("02:00").do(job)
    
    logging.info("定时任务已设置，每天凌晨2点执行")
    
    # 保持程序运行
    while True:
        schedule.run_pending()
        time.sleep(60)

if __name__ == "__main__":
    main()
