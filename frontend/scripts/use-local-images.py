#!/usr/bin/env python3
"""
Скрипт для использования локальных изображений вместо Unsplash
"""

import json
import os

def generate_local_image_path(product_name, category):
    """Сгенерировать путь к локальному изображению"""
    # Приводим название к формату имени файла
    filename = (product_name.lower()
                .replace(' ', '-')
                .replace('ё', 'e')
                .replace('(', '')
                .replace(')', '')
                .replace(',', '')
                + '.jpg')
    
    # Определяем папку по категории
    if 'Кофе' in category:
        folder = 'coffee'
    elif 'Еда' in category:
        if 'Завтрак' in product_name or 'каша' in product_name.lower() or 'сырник' in product_name.lower():
            folder = 'breakfast'
        elif 'Пицца' in product_name:
            folder = 'pizza'
        else:
            folder = 'food'
    else:
        folder = 'non-coffee'
    
    return f'/images/products/{folder}/{filename}'

def update_json_to_local():
    """Обновить JSON для использования локальных изображений"""
    json_path = "../public/data/products-full-complete.json"
    
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    updated_count = 0
    image_map = {}
    
    print("🔄 Обновление изображений на локальные...")
    
    for item in data:
        local_path = generate_local_image_path(item['name'], item['category'])
        old_image = item.get('image', '')
        
        item['image'] = local_path
        updated_count += 1
        
        # Запоминаем какие изображения нужны
        image_key = (item['category'], item['name'])
        image_map[image_key] = local_path
        
        print(f"  {item['name']:30} → {local_path}")
    
    # Сохраняем обновленный файл
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    # Сохраняем список необходимых изображений
    with open('../public/images/required-images.txt', 'w', encoding='utf-8') as f:
        f.write("# Список необходимых изображений для Metodika Coffee\n\n")
        for (category, name), path in image_map.items():
            f.write(f"{path}\t# {category}: {name}\n")
    
    print(f"\n✅ Обновлено {updated_count} товаров")
    print(f"📁 JSON файл обновлен: {json_path}")
    print(f"📋 Список изображений: ../public/images/required-images.txt")
    print(f"\n📸 Теперь положите фотографии в папки:")
    print(f"   /public/images/products/coffee/")
    print(f"   /public/images/products/non-coffee/")
    print(f"   /public/images/products/food/")
    print(f"   /public/images/products/breakfast/")
    print(f"   /public/images/products/pizza/")

if __name__ == "__main__":
    update_json_to_local()
