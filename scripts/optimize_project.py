#!/usr/bin/env python3
"""
项目优化脚本 - 重组目录结构并修复路径问题
"""

import os
import shutil
import re
from pathlib import Path

# 项目根目录
BASE_DIR = Path(__file__).parent.parent

# 需要移动到根目录的前台页面（排除admin相关页面）
FRONTEND_PAGES = [
    'index.html',
    'about.html',
    'contact.html',
    'product-catalog.html',
    'product-detail.html',
    'product-planetary-mill.html',
    'case-studies.html',
    'news.html',
    'order-tracking.html',
    'login.html'
]

# 需要保留在admin目录的页面
ADMIN_PAGES = [
    'admin-login.html',
    'admin-dashboard.html',
    'admin-ai-services.html',
    'test-llm-gateway.html'
]


def fix_path_references(content: str) -> str:
    """修复文件中的路径引用"""
    # 将 ../assets/ 改为 assets/
    content = re.sub(r'(\.\./)+assets/', 'assets/', content)
    
    # 将 ../ 开头的链接改为 ./ 或直接去掉（假设在根目录）
    # 但要保留 admin/ 目录的引用
    content = re.sub(r'href="\.\./(?!admin)([^"]+)"', r'href="\1"', content)
    content = re.sub(r'href="\.\./admin/([^"]+)"', r'href="admin/\1"', content)
    
    # 同样处理 src 属性
    content = re.sub(r'src="\.\./(?!admin)([^"]+)"', r'src="\1"', content)
    content = re.sub(r'src="\.\./admin/([^"]+)"', r'src="admin/\1"', content)
    
    return content


def move_and_fix_pages():
    """移动前台页面到根目录并修复路径"""
    pages_dir = BASE_DIR / 'pages'
    
    if not pages_dir.exists():
        print(f"Pages目录不存在: {pages_dir}")
        return
    
    print("=== 移动前台页面到根目录 ===")
    
    for filename in FRONTEND_PAGES:
        src_path = pages_dir / filename
        
        if not src_path.exists():
            print(f"跳过不存在的文件: {filename}")
            continue
        
        # 读取文件内容
        with open(src_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 修复路径
        content = fix_path_references(content)
        
        # 写入到根目录
        dest_path = BASE_DIR / filename
        with open(dest_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✓ 已处理: {filename}")
    
    print("\n=== 管理后台页面 ===")
    for filename in ADMIN_PAGES:
        src_path = pages_dir / filename
        if src_path.exists():
            print(f"保留: {filename} (在pages目录)")
    
    print("\n✓ 前台页面移动完成")


def create_backup():
    """创建项目备份"""
    backup_dir = BASE_DIR / 'backups' / 'pre_optimization'
    backup_dir.mkdir(parents=True, exist_ok=True)
    
    print(f"\n创建备份到: {backup_dir}")
    
    # 备份重要目录
    for dir_name in ['pages', 'admin', 'assets', 'data']:
        src = BASE_DIR / dir_name
        if src.exists():
            dest = backup_dir / dir_name
            if src.is_dir():
                shutil.copytree(src, dest, dirs_exist_ok=True)
            else:
                shutil.copy2(src, dest)
    
    print("✓ 备份完成")


def main():
    print("=" * 60)
    print("项目优化脚本")
    print("=" * 60)
    
    # 创建备份
    create_backup()
    
    # 移动和修复页面
    move_and_fix_pages()
    
    print("\n" + "=" * 60)
    print("优化完成！")
    print("=" * 60)
    print("\n下一步:")
    print("1. 检查根目录下的HTML文件")
    print("2. 测试页面是否正常加载")
    print("3. 验证链接是否正确")


if __name__ == '__main__':
    main()
