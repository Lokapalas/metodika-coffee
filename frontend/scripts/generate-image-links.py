#!/usr/bin/env python3
"""
Скрипт для генерации изображений товаров из Unsplash
"""

import json
import os

# Базовая ссылка Unsplash
BASE_URL = "https://images.unsplash.com/photo-"

# Изображения по категориям (ID с Unsplash)
IMAGE_MAP = {
    # Кофе
    "Американо": "1551030173-122aabc4489e?w=600&h=400&fit=crop",
    "Эспрессо": "1514432324607-a09d9b4aefdd?w=600&h=400&fit=crop",
    "Капучино": "1572442388796-11668a67e53d?w=600&h=400&fit=crop",
    "Латте": "1561047029-3000c68339ca?w=600&h=400&fit=crop",
    "Флэт Уайт": "1587734195670-0c3e7b5c5b5f?w=600&h=400&fit=crop",
    "Раф": "1485808191679-5f86510681a2?w=600&h=400&fit=crop",
    
    # Не кофе
    "Горячий шоколад": "1544787219-7f47ccb76574?w=600&h=400&fit=crop",
    "Молочный коктейль": "1563805042-7684c019e1cb?w=600&h=400&fit=crop",
    "Матча-латте": "1558898434-af897d400a19?w=600&h=400&fit=crop",
    
    # Еда
    "Комбо-завтрак": "1556909114-f6e7ad7d3136?w=600&h=400&fit=crop",
    "Сырники": "1565958011703-44f9829ba187?w=600&h=400&fit=crop",
    "Гранола": "1546069901-ba9599a7e63c?w=600&h=400&fit=crop",
    "Пицца": "1565299624946-b28f40a0ae38?w=600&h=400&fit=crop",
    "Куриный суп": "1547592166-23ac45744acd?w=600&h=400&fit=crop",
    "Куриные котлеты": "1563379926898-05f4575a45d8?w=600&h=400&fit=crop",
    
    # Дефолтные
    "default_coffee": "1514432324607-a09d9b4aefdd?w=600&h=400&fit=crop",
    "default_drink": "1544787219-7f47ccb76574?w=600&h=400&fit=crop",
    "default_food": "1556909114-f6e7ad7d3136?w=600&h=400&fit=crop",
}

def get_image_for_product(product_name, category):
    """Получить изображение для товара"""
    # Пробуем найти точное совпадение
    if product_name in IMAGE_MAP:
        return BASE_URL + IMAGE_MAP[product_name]
    
    # Ищем частичное совпадение
    for key, value in IMAGE_MAP.items():
        if key.lower() in product_name.lower():
            return BASE_URL + value
    
    # Возвращаем дефолтное по категории
    if "Кофе" in category:
        return BASE_URL + IMAGE_MAP["default_coffee"]
    elif "Еда" in category:
        return BASE_URL + IMAGE_MAP["default_food"]
    else:
        return BASE_URL + IMAGE_MAP["default_drink"]

def update_json_with_images():
    """Обновить JSON файл с изображениями"""
    json_path = "../public/data/products-full-complete.json"
    
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    updated_count = 0
    for item in data:
        old_image = item.get('image', '')
        new_image = get_image_for_product(item['name'], item['category'])
        
        if old_image != new_image:
            item['image'] = new_image
            updated_count += 1
            print(f"Обновлено: {item['name']} → {new_image[:50]}...")
    
    # Сохраняем обновленный файл
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ Обновлено {updated_count} товаров из {len(data)}")
    print(f"📁 Файл сохранен: {json_path}")

if __name__ == "__main__":
    update_json_with_images()
