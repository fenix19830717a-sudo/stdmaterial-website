#!/usr/bin/env python3
"""
将Google CDN图片替换为CSS渐变和SVG占位图片
"""

import re
from pathlib import Path

BASE_DIR = Path(__file__).parent.parent

# 专业的渐变背景
PROFESSIONAL_GRADIENTS = [
    "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
    "linear-gradient(135deg, #020617 0%, #0f172a 50%, #1e293b 100%)",
    "linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #020617 100%)",
]

# SVG工业设备图标
SVG_INDUSTRIAL_ICON = '''
&lt;svg width="400" height="300" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"&gt;
  &lt;defs&gt;
    &lt;linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"&gt;
      &lt;stop offset="0%" style="stop-color:#0f172a"/&gt;
      &lt;stop offset="100%" style="stop-color:#1e293b"/&gt;
    &lt;/linearGradient&gt;
    &lt;linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%"&gt;
      &lt;stop offset="0%" style="stop-color:#06b6d4"/&gt;
      &lt;stop offset="100%" style="stop-color:#22d3ee"/&gt;
    &lt;/linearGradient&gt;
  &lt;/defs&gt;
  
  &lt;rect width="400" height="300" fill="url(#bgGrad)"/&gt;
  
  &lt;g transform="translate(200, 150)"&gt;
    &lt;circle cx="0" cy="0" r="80" fill="none" stroke="url(#accentGrad)" stroke-width="4" opacity="0.3"/&gt;
    &lt;circle cx="0" cy="0" r="60" fill="none" stroke="url(#accentGrad)" stroke-width="2" opacity="0.5"/&gt;
    &lt;circle cx="0" cy="0" r="40" fill="none" stroke="url(#accentGrad)" stroke-width="1" opacity="0.7"/&gt;
    
    &lt;rect x="-50" y="-30" width="100" height="60" fill="#1e293b" stroke="url(#accentGrad)" stroke-width="2" rx="5"/&gt;
    
    &lt;circle cx="-30" cy="0" r="15" fill="#0f172a" stroke="url(#accentGrad)" stroke-width="2"/&gt;
    &lt;circle cx="30" cy="0" r="15" fill="#0f172a" stroke="url(#accentGrad)" stroke-width="2"/&gt;
    
    &lt;rect x="-10" y="35" width="20" height="30" fill="#1e293b" stroke="url(#accentGrad)" stroke-width="2"/&gt;
  &lt;/g&gt;
  
  &lt;text x="200" y="260" text-anchor="middle" fill="#94a3b8" font-family="Space Grotesk, sans-serif" font-size="14"&gt;
    PRECISION GRIND
  &lt;/text&gt;
&lt;/svg&gt;
'''

# SVG实验室背景
SVG_LAB_BACKGROUND = '''
&lt;svg width="800" height="600" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg"&gt;
  &lt;defs&gt;
    &lt;linearGradient id="labBgGrad" x1="0%" y1="0%" x2="100%" y2="100%"&gt;
      &lt;stop offset="0%" style="stop-color:#020617"/&gt;
      &lt;stop offset="50%" style="stop-color:#0f172a"/&gt;
      &lt;stop offset="100%" style="stop-color:#1e293b"/&gt;
    &lt;/linearGradient&gt;
    &lt;linearGradient id="techLineGrad" x1="0%" y1="0%" x2="100%" y2="0%"&gt;
      &lt;stop offset="0%" style="stop-color:#06b6d4" stop-opacity="0.8"/&gt;
      &lt;stop offset="100%" style="stop-color:#22d3ee" stop-opacity="0.4"/&gt;
    &lt;/linearGradient&gt;
  &lt;/defs&gt;
  
  &lt;rect width="800" height="600" fill="url(#labBgGrad)"/&gt;
  
  &lt;g stroke="url(#techLineGrad)" stroke-width="1" opacity="0.2"&gt;
    &lt;line x1="0" y1="100" x2="800" y2="100"/&gt;
    &lt;line x1="0" y1="200" x2="800" y2="200"/&gt;
    &lt;line x1="0" y1="300" x2="800" y2="300"/&gt;
    &lt;line x1="0" y1="400" x2="800" y2="400"/&gt;
    &lt;line x1="0" y1="500" x2="800" y2="500"/&gt;
    
    &lt;line x1="100" y1="0" x2="100" y2="600"/&gt;
    &lt;line x1="200" y1="0" x2="200" y2="600"/&gt;
    &lt;line x1="300" y1="0" x2="300" y2="600"/&gt;
    &lt;line x1="400" y1="0" x2="400" y2="600"/&gt;
    &lt;line x1="500" y1="0" x2="500" y2="600"/&gt;
    &lt;line x1="600" y1="0" x2="600" y2="600"/&gt;
    &lt;line x1="700" y1="0" x2="700" y2="600"/&gt;
  &lt;/g&gt;
  
  &lt;g transform="translate(400, 300)"&gt;
    &lt;rect x="-150" y="-100" width="300" height="200" fill="#0f172a" stroke="#06b6d4" stroke-width="2" opacity="0.5" rx="10"/&gt;
    &lt;rect x="-120" y="-70" width="240" height="120" fill="#020617" stroke="#06b6d4" stroke-width="1" opacity="0.7"/&gt;
    
    &lt;g fill="#22d3ee" opacity="0.8"&gt;
      &lt;rect x="-100" y="-50" width="30" height="5"/&gt;
      &lt;rect x="-100" y="-40" width="60" height="5"/&gt;
      &lt;rect x="-100" y="-30" width="45" height="5"/&gt;
      &lt;rect x="-100" y="-20" width="70" height="5"/&gt;
      &lt;rect x="-100" y="-10" width="50" height="5"/&gt;
    &lt;/g&gt;
  &lt;/g&gt;
&lt;/svg&gt;
'''

def convert_image_to_data_uri(svg_content):
    """将SVG转换为data URI"""
    import base64
    svg_encoded = base64.b64encode(svg_content.encode('utf-8')).decode('utf-8')
    return f"data:image/svg+xml;base64,{svg_encoded}"

def replace_google_images():
    """替换HTML文件中的Google CDN图片"""
    
    index_file = BASE_DIR / 'index.html'
    
    if not index_file.exists():
        print(f"文件不存在: {index_file}")
        return
    
    with open(index_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 准备占位图片
    industrial_icon_uri = convert_image_to_data_uri(SVG_INDUSTRIAL_ICON)
    lab_bg_uri = convert_image_to_data_uri(SVG_LAB_BACKGROUND)
    
    # 统计替换次数
    count = 0
    
    # 替换第一个产品图片（hero区域）
    pattern1 = r'https://lh3\.googleusercontent\.com/aida-public/AB6AXuDk-drzsS_rhtYaiIP0kUiKECsukgoC_tlMrH8puiRAJ-2cXWF6fDsIvBaRxhGXz16JFjYy6ad-9c-Kw5juSKXRNj0b_Cg_U1f1i27OA4wcV-vUF9ccLXitArVE9UYQ_6VO9Fvao5JEcm-L0J-C01iw6-4cQDfLbeSk8LLkrH_QDk9HdfgGNogUhPukS_NT8oHF94B9L6tim59cIWOYIv3x8nWGVl9phH03qEPPofdITLD-oC41zpr-MDQo5P-tiGO6BT86B1lOUWs'
    if re.search(pattern1, content):
        content = re.sub(pattern1, industrial_icon_uri, content)
        count += 1
        print("✓ 已替换产品展示图片")
    
    # 替换第二个实验室背景图片
    pattern2 = r'https://lh3\.googleusercontent\.com/aida-public/AB6AXuC5FsyaCBQncEm-IXAD63h3gsaiKmtXPESVMV3sg_L89ro39qL91YRFtsnaNpEIE3-K4xRMMkMyb687A5QZgBLsC7IitJnGm7xaqkS-1kqqFkp_dhTREXGezAkXwb3PqeVA5EtFx2TqhPUmD8Zabp5n-5hiupUEh89B638TN_CnI7ZeCOHTrqzQ89aHOEmmNjeiOCUFiH_pRO4EWAb32Bmj1z1uQU4HZFGEO_lUmzRyAu_KZtVGVVxWfYAqxb7CrUU2lXR2MHL93-Q'
    if re.search(pattern2, content):
        content = re.sub(pattern2, lab_bg_uri, content)
        count += 1
        print("✓ 已替换实验室背景图片")
    
    # 保存更新后的文件
    with open(index_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"\n总共替换了 {count} 张图片")
    print(f"文件已保存: {index_file}")

if __name__ == '__main__':
    print("=" * 60)
    print("Google CDN图片替换为SVG占位图片")
    print("=" * 60)
    replace_google_images()
