#!/usr/bin/env python3
"""
统一管理后台的品牌和语言
"""

import re
from pathlib import Path

BASE_DIR = Path(__file__).parent.parent
ADMIN_DIR = BASE_DIR / 'admin'

# 品牌统一配置
BRANDING = {
    'old_brand': '晟通达',
    'new_brand': 'PRECISION GRIND',
    'old_tagline': '管理面板',
    'new_tagline': 'Admin Panel',
    'old_email': 'admin@nanomech.com',
    'new_email': 'admin@precisiongrind.com'
}

# 中文到英文的翻译
TRANSLATIONS = {
    '仪表盘': 'Dashboard',
    '产品管理': 'Products',
    '询盘管理': 'Inquiries',
    '订单管理': 'Orders',
    '客户管理': 'Customers',
    '营销管理': 'Marketing',
    '数据统计': 'Statistics',
    'API配置': 'API Settings',
    '系统设置': 'Settings',
    '欢迎回来！以下是今日概览。': 'Welcome back! Here is today\'s overview.',
    '总收入': 'Total Revenue',
    '较上月': 'vs last month',
    '退出登录': 'Logout',
    '管理面板': 'Admin Panel',
    'NanoMech Admin': 'PRECISION GRIND Admin'
}

# 统一颜色配置（与前台一致）
COLORS = {
    'old_primary': '#13c8ec',
    'new_primary': '#06b6d4',
    'old_primary_dark': '#0ea5c0',
    'new_primary_dark': '#0891b2',
    'old_accent': '#22d3ee',
    'new_accent': '#22d3ee',
    'old_bg_900': '#101f22',
    'new_bg_900': '#020617',
    'old_bg_800': '#162326',
    'new_bg_800': '#0f172a',
    'old_bg_700': '#1c2d31',
    'new_bg_700': '#1e293b',
    'old_bg_600': '#24373b',
    'new_bg_600': '#334155',
    'old_bg_500': '#2c4145',
    'new_bg_500': '#475569'
}

def fix_admin_file(filepath: Path):
    """修复单个管理后台文件"""
    
    if not filepath.exists():
        return False
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # 1. 替换品牌名称
    content = content.replace(BRANDING['old_brand'], BRANDING['new_brand'])
    content = content.replace(BRANDING['old_tagline'], BRANDING['new_tagline'])
    content = content.replace(BRANDING['old_email'], BRANDING['new_email'])
    
    # 2. 翻译中文内容到英文
    for zh, en in TRANSLATIONS.items():
        content = content.replace(zh, en)
    
    # 3. 统一颜色
    for old_color, new_color in COLORS.items():
        content = content.replace(old_color, new_color)
    
    # 4. 语言设置改为en
    content = re.sub(r'lang="zh-CN"', 'lang="en"', content)
    
    # 5. 修复路径引用（admin目录下的文件需要../）
    content = re.sub(r'href="(?!\.\.)([^"]+\.html)"', r'href="../\1"', content)
    content = re.sub(r'src="(?!\.\.)(assets/[^"]+)"', r'src="../\1"', content)
    
    # 保存文件
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    
    return False

def process_all_admin_files():
    """处理admin目录下的所有HTML文件"""
    
    if not ADMIN_DIR.exists():
        print(f"Admin目录不存在: {ADMIN_DIR}")
        return
    
    print("=" * 60)
    print("统一管理后台品牌和语言")
    print("=" * 60)
    
    html_files = list(ADMIN_DIR.glob('*.html'))
    modified_count = 0
    
    for filepath in html_files:
        print(f"\n处理: {filepath.name}")
        if fix_admin_file(filepath):
            modified_count += 1
            print(f"  ✓ 已更新")
        else:
            print(f"  - 无需修改")
    
    print(f"\n{'=' * 60}")
    print(f"完成！共修改 {modified_count}/{len(html_files)} 个文件")

if __name__ == '__main__':
    process_all_admin_files()
