import re

# 读取文件
with open("product-detail.html", "r", encoding="utf-8") as f:
    content = f.read()

# 图片映射
image_mapping = {
    "alumina-ceramic-jar.png": "gj-al-500.jpg",
    "planetary-mill.png": "eq-pm-4x500.jpg",
}

# 替换图片路径
for old_name, new_name in image_mapping.items():
    old_path = f"assets/images/products/{old_name}"
    new_path = f"assets/images/products/{new_name}"
    content = content.replace(old_path, new_path)
    print(f"Replaced: {old_name} -> {new_name}")

# 保存文件
with open("product-detail.html", "w", encoding="utf-8") as f:
    f.write(content)

print("\n✓ product-detail.html updated successfully!")
