#!/usr/bin/env python3
"""
更新管理后台页面中的公司名称
将所有管理后台页面中的 "PRECISION GRIND" 替换为 "Hunan Shengtongda Materials Technology"
"""

import os
import re

# 管理后台页面目录
ADMIN_DIR = 'admin'

# 要替换的内容
OLD_BRAND = 'PRECISION GRIND'
NEW_BRAND = 'Hunan Shengtongda Materials Technology'

# 处理文件的函数
def update_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 替换标题中的品牌
        content = re.sub(r'<title>(.*?)PRECISION GRIND(.*?)</title>', r'<title>\1Hunan Shengtongda Materials Technology\2</title>', content)
        
        # 替换页面中的品牌
        content = re.sub(r'<h1 class="text-lg font-semibold text-white">PRECISION GRIND</h1>', 
                       '<h1 class="text-lg font-semibold text-white">Hunan Shengtongda Materials Technology</h1>', content)
        
        # 写回文件
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        return True
    except Exception as e:
        print(f"处理文件 {file_path} 时出错: {e}")
        return False

# 主函数
def main():
    print("=" * 60)
    print("更新管理后台页面中的公司名称")
    print("=" * 60)
    
    # 检查管理后台目录是否存在
    if not os.path.exists(ADMIN_DIR):
        print(f"错误: 目录 {ADMIN_DIR} 不存在")
        return
    
    # 获取所有HTML文件
    html_files = [f for f in os.listdir(ADMIN_DIR) if f.endswith('.html')]
    
    if not html_files:
        print("错误: 没有找到HTML文件")
        return
    
    # 处理每个文件
    updated_count = 0
    total_count = len(html_files)
    
    for file_name in html_files:
        file_path = os.path.join(ADMIN_DIR, file_name)
        print(f"处理: {file_name}")
        if update_file(file_path):
            updated_count += 1
    
    print("=" * 60)
    print(f"完成！共修改 {updated_count}/{total_count} 个文件")

if __name__ == "__main__":
    main()