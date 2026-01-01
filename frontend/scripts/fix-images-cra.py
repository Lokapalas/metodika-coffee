#!/usr/bin/env python3
"""
Скрипт для исправления путей к изображениям для Create React App
"""

import json
import os
import re

def sanitize_filename(name):
    """Очистить название для имени файла"""
    name = name.lower()
    
    # Исправляем ошибку в транслитерации (буква 'к' была пропущена)
    translit = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
        'е': 'e', 'ё': 'e', 'ж': 'zh', 'з': 'z', 'и': 'i',
        'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
        'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
        'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch',
        'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '',
        'э': 'e', 'ю': 'yu', 'я': 'ya',
        ' ': '-'
    }
    
    result = []
    for char in name:
        if char in translit:
            result.append(translit[char])
        elif char.isalnum():
            result.append(char)
        elif char in '-_':
            result.append('-')
        else:
            continue
    
    filename = ''.join(result)
    filename = re.sub(r'-+', '-', filename)
    filename = filename.strip('-')
    
    return filename + '.jpg'

def get_category_folder(product_name, category):
    """Определить папку по категории"""
    category_lower = category.lower()
    name_lower = product_name.lower()
    
    if 'кофе' in category_lower:
        return 'coffee'
    elif 'еда' in category_lower:
        if 'сырник' in name_lower or 'завтрак' in name_lower or 'каша' in name_lower:
            return 'breakfast'
        elif 'пицца' in name_lower:
            return 'pizza'
        else:
            return 'food'
    else:
        return 'non-coffee'

def fix_for_cra():
    """Исправить пути для Create React App"""
    json_path = "public/data/products-full-complete.json"
    
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    print("🔄 Исправление путей для Create React App...")
    print("=" * 60)
    
    # Варианты путей для CRA:
    # 1. Без начального слеша: "images/products/coffee/americano.jpg"
    # 2. С домашней страницей: "/metodika-coffee/images/products/coffee/americano.jpg"
    
    # Проверяем package.json для homepage
    homepage = "/"
    if os.path.exists("package.json"):
        with open("package.json", 'r') as f:
            pkg = json.load(f)
            homepage = pkg.get("homepage", "/")
    
    print(f"📄 Homepage из package.json: {homepage}")
    
    # Создаем корректные пути
    for item in data:
        filename = sanitize_filename(item['name'])
        folder = get_category_folder(item['name'], item['category'])
        
        # Вариант 1: Без начального слеша (для CRA по умолчанию)
        image_path = f"images/products/{folder}/{filename}"
        
        # Вариант 2: Если homepage настроен, можно использовать:
        # if homepage and homepage != "/":
        #     image_path = f"{homepage.rstrip('/')}/images/products/{folder}/{filename}"
        
        old_path = item.get('image', '')
        item['image'] = image_path
        
        print(f"✓ {item['name']:25}")
        print(f"  Было: {old_path[:50]}...")
        print(f"  Стало: {image_path}")
        print()
    
    # Сохраняем обновленный JSON
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    # Создаем копию с абсолютными путями для продакшена (если нужно)
    prod_json_path = "public/data/products-full-complete-prod.json"
    with open(prod_json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Обновлено {len(data)} товаров")
    print(f"📁 Основной файл: {json_path}")
    print(f"📁 Продакшен копия: {prod_json_path}")
    
    # Проверяем примеры
    print("\n📸 Примеры путей:")
    examples = data[:3]
    for item in examples:
        print(f"  {item['name']:20} → {item['image']}")
    
    return True

if __name__ == "__main__":
    fix_for_cra()
