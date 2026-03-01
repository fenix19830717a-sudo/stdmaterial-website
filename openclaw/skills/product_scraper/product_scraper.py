#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
产品采集技能
用于从供应商网站爬取产品信息并更新到独立站数据库
"""

import os
import json
import time
import logging
import requests
from bs4 import BeautifulSoup
from typing import Dict, List, Optional, Any

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('openclaw/logs/product_scraper.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger('product_scraper')

class ProductScraper:
    """产品采集器"""
    
    def __init__(self, config: Dict[str, Any] = None):
        """初始化采集器"""
        self.config = config or {
            'timeout': 30,
            'max_retries': 3,
            'retry_delay': 2,
            'user_agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'products_file': './data/products.json',
            'target_websites': [
                {
                    'name': 'tencanmills',
                    'url': 'https://tencanmills.com',
                    'categories': ['planetary-mill', 'roller-mill', 'stirred-mill', 'grinding-media']
                }
            ]
        }
        
        self.headers = {
            'User-Agent': self.config['user_agent'],
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
        }
        
        # 确保数据目录存在
        os.makedirs(os.path.dirname(self.config['products_file']), exist_ok=True)
    
    def fetch_page(self, url: str) -> Optional[str]:
        """获取网页内容"""
        retries = 0
        while retries < self.config['max_retries']:
            try:
                response = requests.get(url, headers=self.headers, timeout=self.config['timeout'])
                response.raise_for_status()
                return response.text
            except Exception as e:
                logger.error(f"Error fetching {url}: {e}")
                retries += 1
                if retries < self.config['max_retries']:
                    logger.info(f"Retrying {url} ({retries}/{self.config['max_retries']})...")
                    time.sleep(self.config['retry_delay'])
                else:
                    logger.error(f"Max retries reached for {url}")
                    return None
    
    def parse_product_list(self, html: str, category: str) -> List[Dict[str, Any]]:
        """解析产品列表"""
        products = []
        soup = BeautifulSoup(html, 'html.parser')
        
        # 这里需要根据实际网站结构调整选择器
        product_cards = soup.select('.product-card, .product-item, .product')
        
        for card in product_cards:
            try:
                product = {
                    'id': f"{category}_{int(time.time())}_{len(products)}",
                    'name': card.select_one('h2, h3, .product-name').text.strip() if card.select_one('h2, h3, .product-name') else '',
                    'category': category,
                    'price': card.select_one('.price, .product-price').text.strip() if card.select_one('.price, .product-price') else '',
                    'image': card.select_one('img')['src'] if card.select_one('img') else '',
                    'url': card.select_one('a')['href'] if card.select_one('a') else '',
                    'description': card.select_one('.description, .product-desc').text.strip() if card.select_one('.description, .product-desc') else '',
                    'specifications': {},
                    'features': [],
                    'created_at': time.strftime('%Y-%m-%d %H:%M:%S'),
                    'updated_at': time.strftime('%Y-%m-%d %H:%M:%S')
                }
                products.append(product)
            except Exception as e:
                logger.error(f"Error parsing product card: {e}")
                continue
        
        return products
    
    def parse_product_detail(self, html: str, product: Dict[str, Any]) -> Dict[str, Any]:
        """解析产品详情"""
        soup = BeautifulSoup(html, 'html.parser')
        
        # 解析规格参数
        try:
            spec_table = soup.select_one('.specifications, .specs, .product-specs')
            if spec_table:
                for row in spec_table.select('tr'):
                    cols = row.select('td')
                    if len(cols) >= 2:
                        key = cols[0].text.strip()
                        value = cols[1].text.strip()
                        product['specifications'][key] = value
        except Exception as e:
            logger.error(f"Error parsing specifications: {e}")
        
        # 解析特性
        try:
            features = soup.select('.features, .product-features, .features-list li')
            for feature in features:
                if feature.text.strip():
                    product['features'].append(feature.text.strip())
        except Exception as e:
            logger.error(f"Error parsing features: {e}")
        
        # 解析详细描述
        try:
            description = soup.select_one('.product-description, .description, .long-description')
            if description:
                product['description'] = description.text.strip()
        except Exception as e:
            logger.error(f"Error parsing description: {e}")
        
        product['updated_at'] = time.strftime('%Y-%m-%d %H:%M:%S')
        return product
    
    def scrape_website(self, website: Dict[str, Any]) -> List[Dict[str, Any]]:
        """采集网站产品"""
        all_products = []
        logger.info(f"Starting to scrape {website['name']} ({website['url']})...")
        
        for category in website['categories']:
            category_url = f"{website['url']}/{category}"
            logger.info(f"Scraping category: {category} from {category_url}")
            
            html = self.fetch_page(category_url)
            if not html:
                continue
            
            products = self.parse_product_list(html, category)
            logger.info(f"Found {len(products)} products in {category}")
            
            # 解析每个产品的详情
            for i, product in enumerate(products):
                if product['url']:
                    # 确保URL完整
                    if not product['url'].startswith('http'):
                        product['url'] = f"{website['url']}{product['url']}" if product['url'].startswith('/') else f"{website['url']}/{product['url']}"
                    
                    logger.info(f"Scraping product detail: {product['name']} ({i+1}/{len(products)})")
                    detail_html = self.fetch_page(product['url'])
                    if detail_html:
                        product = self.parse_product_detail(detail_html, product)
                
                all_products.append(product)
            
            # 避免请求过快
            time.sleep(1)
        
        logger.info(f"Scraping completed for {website['name']}. Found {len(all_products)} products.")
        return all_products
    
    def load_existing_products(self) -> List[Dict[str, Any]]:
        """加载现有产品数据"""
        if os.path.exists(self.config['products_file']):
            try:
                with open(self.config['products_file'], 'r', encoding='utf-8') as f:
                    return json.load(f)
            except Exception as e:
                logger.error(f"Error loading existing products: {e}")
                return []
        return []
    
    def save_products(self, products: List[Dict[str, Any]]):
        """保存产品数据"""
        try:
            with open(self.config['products_file'], 'w', encoding='utf-8') as f:
                json.dump(products, f, ensure_ascii=False, indent=2)
            logger.info(f"Saved {len(products)} products to {self.config['products_file']}")
        except Exception as e:
            logger.error(f"Error saving products: {e}")
    
    def merge_products(self, new_products: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """合并新产品和现有产品"""
        existing_products = self.load_existing_products()
        existing_ids = {p['id'] for p in existing_products}
        
        # 合并产品
        merged_products = existing_products.copy()
        
        for product in new_products:
            if product['id'] not in existing_ids:
                merged_products.append(product)
                existing_ids.add(product['id'])
                logger.info(f"Added new product: {product['name']}")
            else:
                # 更新现有产品
                for i, existing_product in enumerate(merged_products):
                    if existing_product['id'] == product['id']:
                        merged_products[i] = product
                        logger.info(f"Updated product: {product['name']}")
                        break
        
        logger.info(f"Merged products: {len(merged_products)} total")
        return merged_products
    
    def run(self) -> Dict[str, Any]:
        """运行采集任务"""
        all_products = []
        start_time = time.time()
        
        try:
            for website in self.config['target_websites']:
                website_products = self.scrape_website(website)
                all_products.extend(website_products)
            
            # 合并并保存产品
            merged_products = self.merge_products(all_products)
            self.save_products(merged_products)
            
            elapsed_time = time.time() - start_time
            
            return {
                'success': True,
                'message': f"Product scraping completed successfully",
                'statistics': {
                    'total_products': len(merged_products),
                    'new_products': len(all_products),
                    'elapsed_time': f"{elapsed_time:.2f} seconds",
                    'websites_scraped': len(self.config['target_websites'])
                }
            }
        except Exception as e:
            logger.error(f"Error running product scraper: {e}")
            return {
                'success': False,
                'message': f"Error running product scraper: {str(e)}"
            }

if __name__ == '__main__':
    scraper = ProductScraper()
    result = scraper.run()
    logger.info(f"Scraping result: {result}")
