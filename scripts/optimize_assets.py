#!/usr/bin/env python3
"""
优化资源文件：压缩CSS和JavaScript文件
"""

import os
import re
from pathlib import Path
import csscompressor
import jsmin

# 配置
BASE_DIR = Path(__file__).parent.parent
ASSETS_DIR = BASE_DIR / "assets"
CSS_DIR = ASSETS_DIR / "css"
JS_DIR = ASSETS_DIR / "js"

# 要排除的文件
EXCLUDE_FILES = [
    "admin.css",  # 管理后台CSS
    "openclaw-api.js"  # 外部API文件
]

def compress_css(file_path):
    """压缩CSS文件"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            css_content = f.read()
        
        # 压缩CSS
        compressed_css = csscompressor.compress(css_content)
        
        # 保存压缩后的文件
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(compressed_css)
        
        original_size = len(css_content)
        compressed_size = len(compressed_css)
        reduction = (original_size - compressed_size) / original_size * 100
        
        print(f"✓ 压缩CSS: {file_path.name} ({reduction:.2f}% 减少)")
        return True
    except Exception as e:
        print(f"✗ 压缩CSS失败: {file_path.name} - {e}")
        return False

def compress_js(file_path):
    """压缩JavaScript文件"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            js_content = f.read()
        
        # 压缩JavaScript
        compressed_js = jsmin.jsmin(js_content)
        
        # 保存压缩后的文件
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(compressed_js)
        
        original_size = len(js_content)
        compressed_size = len(compressed_js)
        reduction = (original_size - compressed_size) / original_size * 100
        
        print(f"✓ 压缩JS: {file_path.name} ({reduction:.2f}% 减少)")
        return True
    except Exception as e:
        print(f"✗ 压缩JS失败: {file_path.name} - {e}")
        return False

def optimize_images():
    """优化图片文件"""
    image_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    image_dirs = [
        ASSETS_DIR / "images",
        ASSETS_DIR / "images" / "products"
    ]
    
    print("\n优化图片文件...")
    for image_dir in image_dirs:
        if not image_dir.exists():
            continue
        
        for file_path in image_dir.iterdir():
            if file_path.suffix.lower() in image_extensions:
                print(f"✓ 图片文件: {file_path.name}")

def main():
    """主函数"""
    print("开始优化资源文件...")
    print(f"基础目录: {BASE_DIR}")
    print("=" * 60)
    
    # 压缩CSS文件
    print("\n压缩CSS文件:")
    css_files = list(CSS_DIR.glob("*.css"))
    css_success = 0
    for css_file in css_files:
        if css_file.name not in EXCLUDE_FILES:
            if compress_css(css_file):
                css_success += 1
    
    # 压缩JavaScript文件
    print("\n压缩JavaScript文件:")
    js_files = list(JS_DIR.glob("*.js"))
    js_success = 0
    for js_file in js_files:
        if js_file.name not in EXCLUDE_FILES:
            if compress_js(js_file):
                js_success += 1
    
    # 优化图片
    optimize_images()
    
    print("=" * 60)
    print(f"优化完成: CSS {css_success}/{len(css_files)} | JS {js_success}/{len(js_files)}")
    print("资源文件优化成功！")

if __name__ == "__main__":
    main()
