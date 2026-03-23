#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
设计系统管理技能
用于管理和应用设计系统、样式检查、组件库等
"""

import os
import re
import json
import logging
from typing import Dict, List, Any, Optional
from pathlib import Path

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('design_system_manager')

class DesignSystemManager:
    """设计系统管理器"""
    
    def __init__(self, config: Dict[str, Any] = None):
        self.config = config or {
            'design_system_path': './assets/css/design-system.css',
            'variables_path': './assets/css/variables.css',
            'project_root': './',
            'allowed_extensions': ['.html', '.css', '.js', '.jsx', '.tsx']
        }
        
        self.design_system = self.load_design_system()
        self.component_library = self.load_component_library()
    
    def load_design_system(self) -> Dict[str, Any]:
        """加载设计系统"""
        design_system = {
            'colors': {
                'primary': '#06b6d4',
                'primary_dark': '#0891b2',
                'primary_light': '#22d3ee',
                'secondary': '#f97316',
                'accent': '#a855f7',
                'success': '#22c55e',
                'warning': '#f59e0b',
                'error': '#ef4444',
                'info': '#3b82f6',
                'background': '#ffffff',
                'background_dark': '#020617',
                'surface': '#f8fafc',
                'surface_dark': '#1e293b',
                'text_primary': '#0f172a',
                'text_primary_dark': '#f8fafc',
                'text_secondary': '#64748b',
                'text_secondary_dark': '#94a3b8'
            },
            'typography': {
                'font_family': "'Space Grotesk', sans-serif",
                'font_sizes': {
                    'xs': '0.75rem',
                    'sm': '0.875rem',
                    'base': '1rem',
                    'lg': '1.125rem',
                    'xl': '1.25rem',
                    '2xl': '1.5rem',
                    '3xl': '1.875rem',
                    '4xl': '2.25rem',
                    '5xl': '3rem'
                }
            },
            'spacing': {
                'xs': '0.25rem',
                'sm': '0.5rem',
                'md': '1rem',
                'lg': '1.5rem',
                'xl': '2rem',
                '2xl': '3rem',
                '3xl': '4rem'
            },
            'border_radius': {
                'sm': '0.375rem',
                'md': '0.5rem',
                'lg': '0.75rem',
                'xl': '1rem',
                '2xl': '1.5rem',
                'full': '9999px'
            },
            'shadows': {
                'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                'glass': '0 8px 32px rgba(0, 0, 0, 0.3)',
                'neon': '0 0 20px rgba(6, 182, 212, 0.3)'
            },
            'transitions': {
                'fast': '0.15s ease',
                'normal': '0.3s ease',
                'slow': '0.6s ease'
            }
        }
        return design_system
    
    def load_component_library(self) -> Dict[str, Any]:
        """加载组件库"""
        return {
            'buttons': {
                'primary': {
                    'class': 'btn-primary',
                    'description': '主要操作按钮，使用主色调',
                    'usage': '用于主要行动号召'
                },
                'secondary': {
                    'class': 'btn-secondary',
                    'description': '次要操作按钮',
                    'usage': '用于次要操作'
                }
            },
            'containers': {
                'glass_panel': {
                    'class': 'glass-panel',
                    'description': '玻璃态容器',
                    'usage': '用于展示内容'
                },
                'card': {
                    'class': 'card',
                    'description': '卡片容器',
                    'usage': '用于分组相关内容'
                },
                'product_image': {
                    'class': 'product-image-container',
                    'description': '产品图片容器',
                    'usage': '必须用于所有产品图片，背景为白色'
                }
            },
            'typography': {
                'headings': ['h1', 'h2', 'h3'],
                'text_classes': ['text-primary', 'text-secondary', 'text-muted']
            }
        }
    
    def validate_css_file(self, file_path: str) -> Dict[str, Any]:
        """验证CSS文件是否符合设计系统"""
        issues = []
        recommendations = []
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # 检查颜色使用
            color_issues = self._check_color_usage(content)
            issues.extend(color_issues)
            
            # 检查硬编码值
            hardcoded_issues = self._check_hardcoded_values(content)
            issues.extend(hardcoded_issues)
            
            # 检查组件使用
            component_issues = self._check_component_usage(content)
            recommendations.extend(component_issues)
            
        except Exception as e:
            logger.error(f"Error validating CSS file {file_path}: {e}")
            issues.append(f"无法读取文件: {str(e)}")
        
        return {
            'file': file_path,
            'is_valid': len(issues) == 0,
            'issues': issues,
            'recommendations': recommendations
        }
    
    def _check_color_usage(self, content: str) -> List[str]:
        """检查颜色使用"""
        issues = []
        
        # 检查是否使用了设计系统变量
        design_colors = self.design_system['colors']
        for color_name, color_value in design_colors.items():
            # 检查是否直接使用了颜色值而不是变量
            if color_value in content and f'--color-{color_name}' not in content:
                issues.append(f"发现硬编码颜色值 {color_value}，建议使用 CSS 变量 --color-{color_name}")
        
        return issues
    
    def _check_hardcoded_values(self, content: str) -> List[str]:
        """检查硬编码值"""
        issues = []
        
        # 检查硬编码的间距
        spacing_patterns = [r'\b(\d+(?:\.\d+)?)(?:px|rem)\s*(?![;}])']
        # 简化检查，实际可以更复杂
        
        return issues
    
    def _check_component_usage(self, content: str) -> List[str]:
        """检查组件使用建议"""
        recommendations = []
        
        # 检查是否可以使用预定义组件
        if 'product-image' in content.lower() and 'product-image-container' not in content:
            recommendations.append("建议使用 .product-image-container 类来包裹产品图片")
        
        return recommendations
    
    def validate_html_file(self, file_path: str) -> Dict[str, Any]:
        """验证HTML文件是否符合设计系统"""
        issues = []
        recommendations = []
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # 检查产品图片容器
            if '<img' in content and 'product-image-container' not in content:
                # 检查是否有产品相关图片
                if any(keyword in content.lower() for keyword in ['product', '产品', '研磨', 'mill']):
                    issues.append("产品图片应使用 .product-image-container 类包裹以确保白色背景")
            
            # 检查按钮使用
            if '<button' in content or 'class="btn' in content:
                if 'btn-primary' not in content and 'btn-secondary' not in content:
                    recommendations.append("建议使用预定义的按钮类 .btn-primary 或 .btn-secondary")
            
            # 检查玻璃态面板使用
            if 'glass-panel' not in content and any(keyword in content.lower() for keyword in ['container', 'card']):
                recommendations.append("考虑使用 .glass-panel 类获得现代玻璃态效果")
            
        except Exception as e:
            logger.error(f"Error validating HTML file {file_path}: {e}")
            issues.append(f"无法读取文件: {str(e)}")
        
        return {
            'file': file_path,
            'is_valid': len(issues) == 0,
            'issues': issues,
            'recommendations': recommendations
        }
    
    def scan_project(self, directory: str = None) -> Dict[str, Any]:
        """扫描整个项目"""
        if directory is None:
            directory = self.config['project_root']
        
        results = {
            'html_files': [],
            'css_files': [],
            'summary': {
                'total_files': 0,
                'valid_files': 0,
                'total_issues': 0,
                'total_recommendations': 0
            }
        }
        
        for root, dirs, files in os.walk(directory):
            # 跳过某些目录
            dirs[:] = [d for d in dirs if d not in ['.git', 'node_modules', 'backups', '.trae']]
            
            for file in files:
                file_path = os.path.join(root, file)
                ext = os.path.splitext(file)[1].lower()
                
                if ext in self.config['allowed_extensions']:
                    results['summary']['total_files'] += 1
                    
                    if ext == '.html':
                        validation = self.validate_html_file(file_path)
                        results['html_files'].append(validation)
                    elif ext == '.css':
                        validation = self.validate_css_file(file_path)
                        results['css_files'].append(validation)
                    
                    # 更新统计
                    if validation['is_valid']:
                        results['summary']['valid_files'] += 1
                    results['summary']['total_issues'] += len(validation['issues'])
                    results['summary']['total_recommendations'] += len(validation['recommendations'])
        
        return results
    
    def generate_component_snippet(self, component_type: str, **kwargs) -> str:
        """生成组件代码片段"""
        snippets = {
            'product_image': '''<div class="product-image-container">
  <img src="{image_url}" alt="{alt_text}" />
</div>''',
            'primary_button': '''<button class="btn-primary">
  {text}
</button>''',
            'secondary_button': '''<button class="btn-secondary">
  {text}
</button>''',
            'glass_panel': '''<div class="glass-panel rounded-2xl overflow-hidden">
  {content}
</div>''',
            'card': '''<div class="card">
  {content}
</div>'''
        }
        
        if component_type in snippets:
            return snippets[component_type].format(**kwargs)
        return f"Component '{component_type}' not found"
    
    def get_design_guidelines(self) -> Dict[str, Any]:
        """获取设计指南"""
        return {
            'colors': self.design_system['colors'],
            'typography': self.design_system['typography'],
            'spacing': self.design_system['spacing'],
            'components': self.component_library,
            'best_practices': [
                '所有产品图片必须使用 .product-image-container 类',
                '使用 CSS 变量而非硬编码颜色值',
                '遵循响应式断点设计',
                '保持一致的间距系统'
            ]
        }
    
    def run(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """运行设计系统管理任务"""
        try:
            task_type = task.get('type', 'scan_project')
            
            if task_type == 'scan_project':
                directory = task.get('directory')
                result = self.scan_project(directory)
                return {
                    'success': True,
                    'message': '项目扫描完成',
                    'result': result
                }
            
            elif task_type == 'validate_file':
                file_path = task.get('file_path')
                if file_path.endswith('.html'):
                    result = self.validate_html_file(file_path)
                elif file_path.endswith('.css'):
                    result = self.validate_css_file(file_path)
                else:
                    return {
                        'success': False,
                        'message': '不支持的文件类型'
                    }
                return {
                    'success': True,
                    'message': '文件验证完成',
                    'result': result
                }
            
            elif task_type == 'generate_snippet':
                component_type = task.get('component_type')
                snippet = self.generate_component_snippet(component_type, **task.get('params', {}))
                return {
                    'success': True,
                    'message': '代码片段生成完成',
                    'snippet': snippet
                }
            
            elif task_type == 'get_guidelines':
                guidelines = self.get_design_guidelines()
                return {
                    'success': True,
                    'message': '设计指南获取完成',
                    'guidelines': guidelines
                }
            
            else:
                return {
                    'success': False,
                    'message': f'未知任务类型: {task_type}'
                }
        
        except Exception as e:
            logger.error(f"Error running design system manager: {e}")
            return {
                'success': False,
                'message': f'运行设计系统管理器时出错: {str(e)}'
            }

if __name__ == '__main__':
    manager = DesignSystemManager()
    result = manager.run({'type': 'scan_project'})
    print(json.dumps(result, ensure_ascii=False, indent=2))
