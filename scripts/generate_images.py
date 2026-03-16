import requests
import json
import os

# 产品列表
products = [
    {"id": "GJ-AL-500", "name": "Alumina Ceramic Grinding Jar", "prompt": "Professional product photography of white alumina ceramic grinding jar for laboratory use, 500ml capacity, cylindrical shape with lid, high purity 99.7%, clean white background, studio lighting, industrial equipment, photorealistic, 8k quality"},
    {"id": "GJ-SS-1000", "name": "Stainless Steel Grinding Jar", "prompt": "Professional product photography of stainless steel grinding jar for laboratory use, 1000ml capacity, cylindrical shape with lid, mirror finish, clean white background, studio lighting, industrial equipment, photorealistic, 8k quality"},
    {"id": "GJ-ZR-250", "name": "Zirconia Grinding Jar", "prompt": "Professional product photography of white zirconia ceramic grinding jar for laboratory use, 250ml capacity, cylindrical shape with lid, high density, clean white background, studio lighting, industrial equipment, photorealistic, 8k quality"},
    {"id": "GJ-NY-500", "name": "Nylon Grinding Jar", "prompt": "Professional product photography of white nylon plastic grinding jar for laboratory use, 500ml capacity, cylindrical shape with lid, lightweight, clean white background, studio lighting, industrial equipment, photorealistic, 8k quality"},
    {"id": "GJ-WC-100", "name": "Tungsten Carbide Grinding Jar", "prompt": "Professional product photography of dark gray tungsten carbide grinding jar for laboratory use, 100ml capacity, cylindrical shape with lid, heavy duty, clean white background, studio lighting, industrial equipment, photorealistic, 8k quality"},
    {"id": "GJ-PU-2000", "name": "PU Roller Mill Container", "prompt": "Professional product photography of polyurethane roller mill grinding container for laboratory use, 2000ml capacity, cylindrical shape, industrial grade, clean white background, studio lighting, industrial equipment, photorealistic, 8k quality"},
    {"id": "GJ-AG-250", "name": "Agate Grinding Jar", "prompt": "Professional product photography of natural agate stone grinding jar for laboratory use, 250ml capacity, cylindrical shape with lid, natural stone texture, clean white background, studio lighting, industrial equipment, photorealistic, 8k quality"},
    {"id": "GJ-PT-100", "name": "PTFE Grinding Jar", "prompt": "Professional product photography of white PTFE Teflon grinding jar for laboratory use, 100ml capacity, cylindrical shape with lid, chemical resistant, clean white background, studio lighting, industrial equipment, photorealistic, 8k quality"},
    {"id": "GJ-TI-500", "name": "Titanium Grinding Jar", "prompt": "Professional product photography of titanium alloy grinding jar for laboratory use, 500ml capacity, cylindrical shape with lid, lightweight metallic gray, clean white background, studio lighting, industrial equipment, photorealistic, 8k quality"},
    {"id": "GJ-SN-250", "name": "Silicon Nitride Grinding Jar", "prompt": "Professional product photography of gray silicon nitride ceramic grinding jar for laboratory use, 250ml capacity, cylindrical shape with lid, high temperature resistant, clean white background, studio lighting, industrial equipment, photorealistic, 8k quality"},
    {"id": "GJ-HD-500", "name": "HDPE Grinding Jar", "prompt": "Professional product photography of white HDPE plastic grinding jar for laboratory use, 500ml capacity, cylindrical shape with lid, high density polyethylene, clean white background, studio lighting, industrial equipment, photorealistic, 8k quality"},
    {"id": "GJ-HS-250", "name": "Hastelloy Grinding Jar", "prompt": "Professional product photography of Hastelloy alloy grinding jar for laboratory use, 250ml capacity, cylindrical shape with lid, corrosion resistant metal, clean white background, studio lighting, industrial equipment, photorealistic, 8k quality"},
    {"id": "GM-AL-20MM", "name": "Alumina Grinding Media", "prompt": "Professional product photography of white alumina ceramic grinding media balls, 20mm diameter, multiple spheres, high purity 99.7%, clean white background, studio lighting, industrial equipment, photorealistic, 8k quality"},
    {"id": "GM-ZR-5MM", "name": "Zirconia Grinding Media", "prompt": "Professional product photography of white zirconia ceramic grinding media beads, 5mm diameter, multiple spheres, high density, clean white background, studio lighting, industrial equipment, photorealistic, 8k quality"},
    {"id": "GM-SS-10MM", "name": "Stainless Steel Grinding Media", "prompt": "Professional product photography of stainless steel grinding media balls, 10mm diameter, multiple spheres, shiny metallic finish, clean white background, studio lighting, industrial equipment, photorealistic, 8k quality"},
    {"id": "GM-WC-5MM", "name": "Tungsten Carbide Grinding Media", "prompt": "Professional product photography of dark gray tungsten carbide grinding media balls, 5mm diameter, multiple spheres, heavy duty, clean white background, studio lighting, industrial equipment, photorealistic, 8k quality"},
    {"id": "EQ-PM-4X500", "name": "Planetary Ball Mill", "prompt": "Professional product photography of planetary ball mill machine, 4 stations, digital display, stainless steel construction, laboratory equipment, clean white background, studio lighting, industrial equipment, photorealistic, 8k quality"},
    {"id": "EQ-SM-1", "name": "High-Energy Shaker Mill", "prompt": "Professional product photography of high-energy shaker ball mill machine, single station, digital control, compact design, laboratory equipment, clean white background, studio lighting, industrial equipment, photorealistic, 8k quality"},
    {"id": "EQ-RM-2L", "name": "Roller Mill", "prompt": "Professional product photography of laboratory roller mill machine, 2 liter capacity, multiple rollers, horizontal design, laboratory equipment, clean white background, studio lighting, industrial equipment, photorealistic, 8k quality"},
    {"id": "AC-LID-SET", "name": "Grinding Jar Accessories", "prompt": "Professional product photography of grinding jar accessory set, including lids, gaskets, and clamps, various sizes, stainless steel and rubber components, clean white background, studio lighting, industrial equipment, photorealistic, 8k quality"},
]

output_dir = "D:\\DESKTOP\\晟通达\\独立站设计\\独立站代码实现\\assets\\images\\products"
os.makedirs(output_dir, exist_ok=True)

api_url = "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image"

for i, product in enumerate(products):
    try:
        print(f"Generating image {i+1}/{len(products)}: {product['name']}")
        
        payload = {
            "prompt": product["prompt"],
            "image_size": "landscape_4_3"
        }
        
        response = requests.post(api_url, json=payload, timeout=120)
        
        if response.status_code == 200:
            # Save the image
            filename = f"{product['id'].lower()}.jpg"
            filepath = os.path.join(output_dir, filename)
            
            with open(filepath, "wb") as f:
                f.write(response.content)
            
            print(f"  ✓ Saved: {filename}")
        else:
            print(f"  ✗ Failed: HTTP {response.status_code}")
            
    except Exception as e:
        print(f"  ✗ Error: {str(e)}")

print("\nDone!")
