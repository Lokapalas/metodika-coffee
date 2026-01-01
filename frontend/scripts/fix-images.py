#!/usr/bin/env python3
"""
Скрипт для исправления путей к локальным изображениям
"""

import json
import os
import re

def sanitize_filename(name):
    """Очистить название для имени файла"""
    # Приводим к нижнему регистру
    name = name.lower()
    
    # Заменяем русские буквы на английские аналоги
    translit = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
        'е': 'e', 'ё': 'e', 'ж': 'zh', 'з': 'z', 'и': 'i',
        'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
        'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
        'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch',
        'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '',
        'э': 'e', 'ю': 'yu', 'я': 'ya'
    }
    
    result = []
    for char in name:
        if char in translit:
            result.append(translit[char])
        elif char.isalnum():
            result.append(char)
        elif char in ' -_':
            result.append('-')
        else:
            result.append('')
    
    filename = ''.join(result)
    # Убираем двойные дефисы
    filename = re.sub(r'-+', '-', filename)
    filename = filename.strip('-')
    
    return filename + '.jpg'

def get_category_folder(product_name, category):
    """Определить папку по категории и названию товара"""
    category_lower = category.lower()
    name_lower = product_name.lower()
    
    if 'кофе' in category_lower:
        return 'coffee'
    elif 'еда' in category_lower or 'пицца' in name_lower:
        if 'завтрак' in name_lower or 'сырник' in name_lower or 'каша' in name_lower:
            return 'breakfast'
        elif 'пицца' in name_lower:
            return 'pizza'
        else:
            return 'food'
    else:
        return 'non-coffee'

def fix_image_paths():
    """Исправить пути к изображениям"""
    json_path = "public/data/products-full-complete.json"
    
    # Читаем текущий JSON
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    print("🔄 Исправление путей к изображениям...")
    print("=" * 60)
    
    updated_items = []
    image_map = {}
    
    for item in data:
        # Генерируем имя файла
        filename = sanitize_filename(item['name'])
        folder = get_category_folder(item['name'], item['category'])
        
        # Создаем путь, который будет работать на фронтенде
        # Важно: путь должен быть относительным от public
        image_path = f"/images/products/{folder}/{filename}"
        
        # Для React/Vue приложений часто нужен путь относительно public
        # Альтернативный вариант: f"images/products/{folder}/{filename}"
        
        old_path = item.get('image', '')
        item['image'] = image_path
        
        updated_items.append({
            'name': item['name'],
            'old': old_path[:50] + '...' if len(old_path) > 50 else old_path,
            'new': image_path
        })
        
        # Сохраняем для списка требуемых изображений
        image_map[item['name']] = {
            'path': image_path,
            'filename': filename,
            'folder': folder
        }
    
    # Сохраняем исправленный JSON
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    # Сохраняем детальный список требуемых изображений
    with open('public/images/IMAGE_REQUIREMENTS.md', 'w', encoding='utf-8') as f:
        f.write("# Требуемые изображения для Metodika Coffee\n\n")
        f.write("Список изображений, которые необходимо разместить в папках:\n\n")
        
        for folder in ['coffee', 'non-coffee', 'food', 'breakfast', 'pizza']:
            f.write(f"## Папка: `{folder}/`\n\n")
            items_in_folder = [(name, info) for name, info in image_map.items() 
                              if info['folder'] == folder]
            
            if items_in_folder:
                for name, info in items_in_folder:
                    f.write(f"- `{info['filename']}` - **{name}**\n")
                f.write("\n")
            else:
                f.write("(нет товаров в этой категории)\n\n")
    
    # Сохраняем простой список для скриптов
    with open('public/images/required-files.txt', 'w', encoding='utf-8') as f:
        for name, info in image_map.items():
            f.write(f"{info['folder']}/{info['filename']}\t# {name}\n")
    
    # Выводим отчет
    print("\n📋 ОТЧЕТ ОБ ОБНОВЛЕНИИ:")
    print("=" * 60)
    for item in updated_items[:10]:  # Показываем первые 10
        print(f"✓ {item['name']}")
        print(f"  Было: {item['old']}")
        print(f"  Стало: {item['new']}")
        print()
    
    if len(updated_items) > 10:
        print(f"... и еще {len(updated_items) - 10} товаров")
    
    print(f"\n✅ Обновлено: {len(updated_items)} товаров")
    print(f"📁 JSON сохранен: {json_path}")
    print(f"📝 Список изображений: public/images/IMAGE_REQUIREMENTS.md")
    
    # Показываем примеры файлов
    print("\n📸 ПРИМЕРЫ ИМЕН ФАЙЛОВ:")
    examples = [
        ("Американо", "americano.jpg", "coffee"),
        ("Капучино с корицей", "kapuchino-s-koritsey.jpg", "coffee"),
        ("Сырники с вареньем", "syrniki-s-varenyem.jpg", "breakfast"),
        ("Пицца 4 сыра", "pizza-4-syra.jpg", "pizza"),
    ]
    
    for name, filename, folder in examples:
        print(f"  {name:25} → {folder}/{filename}")
    
    return True

if __name__ == "__main__":
    fix_image_paths()
