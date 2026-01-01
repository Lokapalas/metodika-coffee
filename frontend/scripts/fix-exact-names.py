#!/usr/bin/env python3
"""
Скрипт для точного сопоставления имен товаров и файлов
"""

import json
import os

# ТОЧНОЕ СООТВЕТСТВИЕ НАЗВАНИЙ ТОВАРОВ И ФАЙЛОВ
EXACT_MAPPING = {
    # Кофе
    "Американо": "americano.jpg",
    "Эспрессо": "espresso.jpg", 
    "Капучино": "cappuccino.jpg",
    "Латте": "latte.jpg",
    "Флэт Уайт": "flat-white.jpg",
    "Раф": "raf.jpg",
    "Фильтр": "filter.jpg",
    "Аэрофильтр": "filter.jpg",  # Используем тот же файл
    "Аэрокано": "americano.jpg",  # Используем тот же файл
    "Френч-пресс": "french-press.jpg",
    "Пуровер": "pour-over.jpg",
    "Кемекс": "chemex.jpg",
    "Аэропресс": "aeropress.jpg",
    
    # Кофе с добавками
    "Капучино с корицей": "cappuccino.jpg",
    "Латте с сиропом": "latte.jpg",
    "Раф апельсиновый": "raf.jpg",
    "Раф клубничный": "raf.jpg",
    "Раф шоколадный": "raf.jpg",
    
    # Не кофе
    "Горячий шоколад": "hot-chocolate.jpg",
    "Молочный коктейль": "milkshake.jpg",
    "Матча-латте": "matcha-latte.jpg",
    "Чай черный": "black-tea.jpg",
    "Чай зеленый": "green-tea.jpg",
    "Чай фруктовый": "fruit-tea.jpg",
    "Лимонад": "lemonade.jpg",
    "Смузи": "smoothie.jpg",
    
    # Еда
    "Сырники": "cheesecakes.jpg",
    "Сырники с вареньем": "cheesecakes.jpg",
    "Сырники со сметаной": "cheesecakes.jpg",
    "Овсяная каша": "oatmeal.jpg",
    "Гранола": "granola.jpg",
    "Комбо-завтрак": "breakfast-combo.jpg",
    "Пицца Маргарита": "pizza-margherita.jpg",
    "Пицца 4 сыра": "pizza-4-cheese.jpg",
    "Пицца Пепперони": "pizza-pepperoni.jpg",
    "Куриный суп": "chicken-soup.jpg",
    "Куриные котлеты": "chicken-cutlets.jpg",
    "Салат Цезарь": "caesar-salad.jpg",
    "Салат Греческий": "greek-salad.jpg",
}

def get_exact_filename(product_name):
    """Получить точное имя файла для товара"""
    # Пробуем точное совпадение
    if product_name in EXACT_MAPPING:
        return EXACT_MAPPING[product_name]
    
    # Ищем частичное совпадение
    for key, filename in EXACT_MAPPING.items():
        if key in product_name:
            return filename
    
    # Дефолтные имена по ключевым словам
    name_lower = product_name.lower()
    
    if "американо" in name_lower:
        return "americano.jpg"
    elif "эспрессо" in name_lower:
        return "espresso.jpg"
    elif "капучино" in name_lower:
        return "cappuccino.jpg"
    elif "латте" in name_lower:
        return "latte.jpg"
    elif "флэт" in name_lower or "флет" in name_lower:
        return "flat-white.jpg"
    elif "раф" in name_lower:
        return "raf.jpg"
    elif "фильтр" in name_lower:
        return "filter.jpg"
    elif "сырник" in name_lower:
        return "cheesecakes.jpg"
    elif "пицца" in name_lower:
        return "pizza-margherita.jpg"
    elif "салат" in name_lower:
        return "caesar-salad.jpg"
    elif "чай" in name_lower:
        return "black-tea.jpg"
    else:
        return "default.jpg"

def get_category_folder(product_name, category):
    """Определить папку по категории"""
    category_lower = category.lower()
    name_lower = product_name.lower()
    
    if "кофе" in category_lower:
        return "coffee"
    elif "еда" in category_lower:
        if "сырник" in name_lower or "завтрак" in name_lower or "каша" in name_lower:
            return "breakfast"
        elif "пицца" in name_lower:
            return "pizza"
        elif "салат" in name_lower:
            return "food"
        else:
            return "food"
    else:
        return "non-coffee"

def fix_all_names():
    """Исправить все имена файлов в JSON"""
    json_path = "public/data/products-full-complete.json"
    
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    print("🔄 Исправление всех имен файлов...")
    print("=" * 60)
    
    fixed_count = 0
    created_files = []
    
    for item in data:
        old_path = item.get('image', '')
        
        # Получаем точное имя файла
        filename = get_exact_filename(item['name'])
        folder = get_category_folder(item['name'], item['category'])
        
        # Новый путь
        new_path = f"images/products/{folder}/{filename}"
        
        # Если путь изменился
        if old_path != new_path:
            item['image'] = new_path
            fixed_count += 1
            
            print(f"✓ {item['name']:30}")
            print(f"  Было: {old_path}")
            print(f"  Стало: {new_path}")
            
            # Проверяем, существует ли файл
            full_path = f"public/images/products/{folder}/{filename}"
            if not os.path.exists(full_path):
                print(f"  ⚠️  Файл не существует: {filename}")
                created_files.append(full_path)
    
    # Сохраняем исправленный JSON
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ Исправлено {fixed_count} товаров")
    
    # Создаем недостающие файлы
    if created_files:
        print(f"\n📁 Создаю недостающие файлы ({len(created_files)} шт.):")
        for filepath in created_files:
            # Создаем папку если нужно
            os.makedirs(os.path.dirname(filepath), exist_ok=True)
            # Создаем пустой файл
            open(filepath, 'a').close()
            print(f"  ✓ Создан: {filepath}")
    
    # Показываем примеры
    print("\n📋 ПЕРВЫЕ 10 ТОВАРОВ:")
    print("=" * 60)
    for i, item in enumerate(data[:10]):
        print(f"{i+1:2}. {item['name']:25} → {item['image']}")
    
    # Создаем список требуемых файлов
    print(f"\n📝 Список требуемых файлов сохранен в: public/images/required-exact.txt")
    with open('public/images/required-exact.txt', 'w', encoding='utf-8') as f:
        f.write("# Точные имена файлов для Metodika Coffee\n\n")
        
        # Группируем по папкам
        folders = {}
        for item in data:
            folder = get_category_folder(item['name'], item['category'])
            filename = get_exact_filename(item['name'])
            
            if folder not in folders:
                folders[folder] = set()
            folders[folder].add(filename)
        
        for folder, filenames in folders.items():
            f.write(f"\n## Папка: {folder}/\n")
            for filename in sorted(filenames):
                # Находим товары с этим файлом
                products = [item['name'] for item in data 
                           if get_category_folder(item['name'], item['category']) == folder 
                           and get_exact_filename(item['name']) == filename]
                f.write(f"- {filename:25} # {', '.join(products[:2])}")
                if len(products) > 2:
                    f.write(f" и еще {len(products)-2}")
                f.write("\n")
    
    return True

if __name__ == "__main__":
    fix_all_names()
