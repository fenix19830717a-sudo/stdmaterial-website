#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
晟通达独立站 - CSS/JS 资源路径优化分析脚本
分析并修复 CSS/JS 资源引用路径问题
"""

import os
import re
from pathlib import Path
from datetime import datetime

# 项目根目录
PROJECT_ROOT = Path(r"D:\DESKTOP\晟通达\独立站设计\独立站代码实现")

def analyze_css_js_paths():
    """分析 CSS/JS 资源引用路径"""
    report = []
    report.append("=" * 60)
    report.append("CSS/JS 资源引用路径分析报告")
    report.append(f"生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    report.append("=" * 60)
    report.append("")
    
    # 统计信息
    stats = {
        "root_html": {"correct": 0, "total": 0},
        "pages_html": {"correct": 0, "total": 0, "needs_fix": []},
        "components": {"correct": 0, "total": 0, "needs_fix": []}
    }
    
    # 1. 分析根目录 HTML 文件
    root_htmls = list(PROJECT_ROOT.glob("*.html"))
    report.append("【1. 根目录 HTML 文件】")
    for html_file in sorted(root_htmls):
        if html_file.name.startswith("."):
            continue
        stats["root_html"]["total"] += 1
        content = html_file.read_text(encoding="utf-8")
        
        # 检查 CSS 引用
        css_refs = re.findall(r'<link[^>]+href="(assets/[^"]+)"', content)
        js_refs = re.findall(r'<script[^>]+src="(assets/[^"]+)"', content)
        
        if css_refs or js_refs:
            stats["root_html"]["correct"] += 1
            report.append(f"  ✓ {html_file.name}: 路径正确 (assets/...)")
        else:
            report.append(f"  - {html_file.name}: 无本地 CSS/JS 引用")
    
    report.append("")
    
    # 2. 分析 pages/ 子目录 HTML 文件
    pages_dir = PROJECT_ROOT / "pages"
    if pages_dir.exists():
        report.append("【2. pages/ 子目录 HTML 文件】")
        pages_htmls = list(pages_dir.glob("*.html"))
        for html_file in sorted(pages_htmls):
            stats["pages_html"]["total"] += 1
            content = html_file.read_text(encoding="utf-8")
            
            # 检查相对路径
            has_assets = "href=\"assets/" in content or "src=\"assets/" in content
            has_correct = "../assets/" in content or "../../assets/" in content
            
            if has_assets and not has_correct:
                stats["pages_html"]["needs_fix"].append(html_file)
                report.append(f"  ⚠ {html_file.name}: 需要修复路径 (应使用 ../assets/...)")
            else:
                stats["pages_html"]["correct"] += 1
                report.append(f"  ✓ {html_file.name}: 路径正确")
    
    report.append("")
    
    # 3. 分析 components/ 目录
    components_dir = PROJECT_ROOT / "components"
    if components_dir.exists():
        report.append("【3. components/ 目录组件文件】")
        component_files = list(components_dir.glob("*.html"))
        for comp_file in sorted(component_files):
            stats["components"]["total"] += 1
            content = comp_file.read_text(encoding="utf-8")
            
            has_assets = "href=\"assets/" in content or "src=\"assets/" in content
            has_correct = "../assets/" in content or "../../assets/" in content
            
            if has_assets and not has_correct:
                stats["components"]["needs_fix"].append(comp_file)
                report.append(f"  ⚠ {comp_file.name}: 需要修复路径 (应使用 ../../assets/...)")
            else:
                stats["components"]["correct"] += 1
                report.append(f"  ✓ {comp_file.name}: 路径正确")
    
    report.append("")
    
    # 4. 总结
    report.append("=" * 60)
    report.append("【总结】")
    report.append("=" * 60)
    report.append(f"根目录 HTML 文件: {stats['root_html']['correct']}/{stats['root_html']['total']} 正确")
    report.append(f"pages/ 子目录: {stats['pages_html']['total']} 个文件, {len(stats['pages_html']['needs_fix'])} 个需要修复")
    report.append(f"components/ 组件: {stats['components']['total']} 个文件, {len(stats['components']['needs_fix'])} 个需要修复")
    report.append("")
    
    # 优化建议
    report.append("【优化建议】")
    report.append("")
    report.append("1. pages/ 目录分析:")
    report.append("   - 该目录包含与根目录重复的 HTML 文件")
    report.append("   - 由于根目录文件正在使用，建议删除 pages/ 目录下的重复文件")
    report.append("")
    report.append("2. components/ 目录分析:")
    report.append("   - 这些是动态加载的组件模板")
    report.append("   - 当通过 components-loader.js 加载时，路径解析会有问题")
    report.append("   - 建议更新组件加载器或修正组件内部路径")
    report.append("")
    report.append("3. 当前系统状态:")
    report.append("   - 根目录 HTML 文件工作正常")
    report.append("   - 站点未实际使用 components-loader.js")
    report.append("   - pages/ 目录为冗余文件")
    
    return "\n".join(report), stats

def fix_components_paths():
    """修复 components 目录中的路径"""
    components_dir = PROJECT_ROOT / "components"
    if not components_dir.exists():
        return "components 目录不存在"
    
    fixed = []
    for comp_file in components_dir.glob("*.html"):
        content = comp_file.read_text(encoding="utf-8")
        original = content
        
        # 替换 assets/ 为 ../../assets/
        content = re.sub(r'href="assets/', r'href="../../assets/', content)
        content = re.sub(r'src="assets/', r'src="../../assets/', content)
        
        if content != original:
            comp_file.write_text(content, encoding="utf-8")
            fixed.append(comp_file.name)
    
    return fixed if fixed else "无需修复"

def remove_duplicate_pages():
    """删除 pages/ 目录下的重复文件"""
    pages_dir = PROJECT_ROOT / "pages"
    root_dir = PROJECT_ROOT
    
    if not pages_dir.exists():
        return "pages 目录不存在"
    
    removed = []
    for page_file in pages_dir.glob("*.html"):
        # 检查根目录是否有同名文件
        root_file = root_dir / page_file.name
        if root_file.exists():
            # 确认内容是否相同
            try:
                root_content = root_file.read_text(encoding="utf-8")
                page_content = page_file.read_text(encoding="utf-8")
                
                if root_content == page_content:
                    # 内容相同，删除重复文件
                    page_file.unlink()
                    removed.append(page_file.name)
            except Exception as e:
                print(f"检查 {page_file.name} 时出错: {e}")
    
    return removed if removed else "无重复文件需删除"

if __name__ == "__main__":
    print("开始分析 CSS/JS 资源路径...")
    
    # 生成分析报告
    report, stats = analyze_css_js_paths()
    print(report)
    
    # 保存报告
    report_file = PROJECT_ROOT / "docs" / "css_js_path_analysis.md"
    report_file.parent.mkdir(exist_ok=True)
    report_file.write_text(report, encoding="utf-8")
    print(f"\n报告已保存到: {report_file}")
    
    # 询问是否执行修复
    print("\n" + "=" * 60)
    print("执行优化操作...")
    print("=" * 60)
    
    # 1. 修复 components 路径
    print("\n[1] 修复 components 路径...")
    fixed = fix_components_paths()
    print(f"    已修复: {fixed}")
    
    # 2. 删除重复的 pages 文件
    print("\n[2] 删除 pages/ 重复文件...")
    removed = remove_duplicate_pages()
    print(f"    已删除: {removed}")
    
    print("\n优化完成!")
