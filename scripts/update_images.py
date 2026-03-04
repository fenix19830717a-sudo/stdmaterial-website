import re

# 读取文件
with open("product-catalog.html", "r", encoding="utf-8") as f:
    content = f.read()

# 图片映射
image_mapping = {
    "alumina-ceramic-jar.png": "gj-al-500.jpg",
    "stainless-steel-jar.png": "gj-ss-1000.jpg",
    "zirconia-jar.png": "gj-zr-250.jpg",
    "nylon-jar.png": "gj-ny-500.jpg",
    "tungsten-carbide-jar.png": "gj-wc-100.jpg",
    "pu-jar.png": "gj-pu-2000.jpg",
    "agate-jar.png": "gj-ag-250.jpg",
    "ptfe-jar.png": "gj-pt-100.jpg",
    "titanium-jar.png": "gj-ti-500.jpg",
    "silicon-nitride-jar.png": "gj-sn-250.jpg",
    "hdpe-jar.png": "gj-hd-500.jpg",
    "hastelloy-jar.png": "gj-hs-250.jpg",
    "alumina-media.png": "gm-al-20mm.jpg",
    "zirconia-media.png": "gm-zr-5mm.jpg",
    "stainless-steel-media.png": "gm-ss-10mm.jpg",
    "tungsten-carbide-media.png": "gm-wc-5mm.jpg",
    "planetary-mill-1.png": "eq-pm-4x500.jpg",
    "planetary-mill-2.png": "eq-sm-1.jpg",
    "planetary-mill-3.png": "eq-rm-2l.jpg",
    "accessories.png": "ac-lid-set.jpg",
    "planetary-mill.png": "eq-pm-4x500.jpg",
}

# 替换图片路径
for old_name, new_name in image_mapping.items():
    old_path = f"assets/images/products/{old_name}"
    new_path = f"assets/images/products/{new_name}"
    content = content.replace(old_path, new_path)
    print(f"Replaced: {old_name} -> {new_name}")

# 保存文件
with open("product-catalog.html", "w", encoding="utf-8") as f:
    f.write(content)

print("\n✓ product-catalog.html updated successfully!")
