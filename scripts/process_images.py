#!/usr/bin/env python3
"""
图片处理工具 - 为新产品批量处理图片
自动优化尺寸、格式、压缩
"""

import os
import shutil
import json
from pathlib import Path
from datetime import datetime

# 项目根目录
PROJECT_ROOT = Path(r"D:\DESKTOP\晟通达\独立站设计\独立站代码实现")
IMAGES_DIR = PROJECT_ROOT / "assets" / "images" / "products"
STAGING_DIR = PROJECT_ROOT / "image_staging"  # 图片待处理目录

class ImageProcessor:
    """图片处理工具"""
    
    def __init__(self):
        self.supported_formats = ['.jpg', '.jpeg', '.png', '.webp']
        self.target_size = (1200, 1200)  # 最大尺寸
        self.thumbnail_size = (400, 400)  # 缩略图尺寸
        
    def setup(self):
        """创建必要的目录"""
        STAGING_DIR.mkdir(exist_ok=True)
        print(f"✅ 图片处理工具初始化完成")
        print(f"   待处理目录: {STAGING_DIR}")
        print(f"   输出目录: {IMAGES_DIR}")
        
    def list_staging_images(self):
        """列出待处理的图片"""
        if not STAGING_DIR.exists():
            return []
        
        images = []
        for f in STAGING_DIR.iterdir():
            if f.suffix.lower() in self.supported_formats:
                images.append(f)
        
        print(f"\n📷 待处理图片 ({len(images)} 个):")
        for img in images:
            size = img.stat().st_size / 1024  # KB
            print(f"   {img.name} ({size:.1f} KB)")
        
        return images
    
    def process_image(self, image_path, product_id):
        """处理单张图片"""
        # 这里需要PIL库，如果没有安装会提示
        try:
            from PIL import Image
        except ImportError:
            print("⚠️ 需要安装PIL库来处理图片")
            print("   运行: pip install pillow")
            return None
        
        img = Image.open(image_path)
        
        # 转换为RGB（处理PNG透明通道）
        if img.mode in ('RGBA', 'P'):
            background = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'P':
                img = img.convert('RGBA')
            background.paste(img, mask=img.split()[3] if img.mode == 'RGBA' else None)
            img = background
        
        # 调整大图
        img.thumbnail(self.target_size, Image.Resampling.LANCZOS)
        
        # 生成输出文件名
        output_name = f"{product_id}_{datetime.now().strftime('%H%M%S')}.jpg"
        output_path = IMAGES_DIR / output_name
        
        # 保存
        img.save(output_path, 'JPEG', quality=85, optimize=True)
        
        return output_path
    
    def generate_thumbnail(self, image_path, product_id):
        """生成缩略图"""
        try:
            from PIL import Image
        except ImportError:
            return None
        
        img = Image.open(image_path)
        
        # 转换为RGB
        if img.mode in ('RGBA', 'P'):
            background = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'P':
                img = img.convert('RGBA')
            background.paste(img, mask=img.split()[3] if img.mode == 'RGBA' else None)
            img = background
        
        # 创建缩略图
        img.thumbnail(self.thumbnail_size, Image.Resampling.LANCZOS)
        
        output_name = f"{product_id}_thumb.jpg"
        output_path = IMAGES_DIR / output_name
        
        img.save(output_path, 'JPEG', quality=75, optimize=True)
        
        return output_path
    
    def process_all(self, product_id):
        """处理目录中所有图片"""
        images = self.list_staging_images()
        if not images:
            print("没有待处理的图片")
            return []
        
        results = []
        for img in images:
            try:
                # 处理主图
                output = self.process_image(img, product_id)
                if output:
                    results.append(str(output.relative_to(PROJECT_ROOT)))
                    print(f"   ✅ {output.name}")
                
                # 生成缩略图
                thumb = self.generate_thumbnail(img, product_id)
                if thumb:
                    results.append(str(thumb.relative_to(PROJECT_ROOT)))
                    print(f"   ✅ {thumb.name} (缩略图)")
                    
            except Exception as e:
                print(f"   ❌ 处理失败 {img.name}: {e}")
        
        return results
    
    def clear_staging(self):
        """清空待处理目录"""
        if STAGING_DIR.exists():
            for f in STAGING_DIR.iterdir():
                if f.is_file():
                    f.unlink()
            print("✅ 已清空待处理目录")
    
    def create_readme(self):
        """创建图片目录说明"""
        readme = """# 图片上传说明

## 上传流程

1. **准备图片**
   - 将新产品图片放入 `image_staging` 目录
   - 支持格式: JPG, JPEG, PNG, WebP
   - 建议分辨率: 1200x1200 以上
   - 文件名建议: 产品名.jpg

2. **运行处理脚本**
   ```bash
   python scripts/process_images.py
   ```

3. **输入产品ID**
   - 脚本会询问产品ID
   - 处理完成后图片会保存到 assets/images/products/

4. **关联产品**
   - 在 products.json 中添加图片路径
   - 路径格式: assets/images/products/产品ID_时间.jpg
"""

        readme_path = PROJECT_ROOT / "image_staging" / "README.md"
        with open(readme_path, 'w', encoding='utf-8') as f:
            f.write(readme)
        
        print(f"✅ 已创建说明文件: {readme_path}")


def main():
    import sys
    
    processor = ImageProcessor()
    processor.setup()
    
    if len(sys.argv) < 2:
        print("""
📷 图片处理工具
================
用法:
  python process_images.py list     - 查看待处理图片
  python process_images.py process   - 处理所有图片
  python process_images.py clear     - 清空待处理目录
  python process_images.py init      - 初始化目录
        """)
        return
    
    command = sys.argv[1]
    
    if command == "list":
        processor.list_staging_images()
    
    elif command == "process":
        product_id = input("请输入产品ID: ").strip()
        if not product_id:
            print("❌ 产品ID不能为空")
            return
        processor.process_all(product_id)
    
    elif command == "clear":
        processor.clear_staging()
    
    elif command == "init":
        processor.setup()
        processor.create_readme()
    
    else:
        print(f"未知命令: {command}")


if __name__ == "__main__":
    main()
