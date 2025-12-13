#!/bin/bash
echo "🔍 ПРОВЕРКА СИСТЕМЫ ИЗОБРАЖЕНИЙ"
echo "================================"

cd /opt/metodika-coffee/frontend

echo "1. Проверка JSON файла..."
if python3 -c "import json; json.load(open('public/data/products-full-complete.json')); print('✅ JSON валиден')"; then
    echo "✅ JSON файл корректен"
else
    echo "❌ Ошибка в JSON файле"
    exit 1
fi

echo ""
echo "2. Проверка путей в первых 10 товарах..."
python3 -c "
import json
with open('public/data/products-full-complete.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
errors = []
for i, item in enumerate(data[:10]):
    img_path = item.get('image', '')
    if not img_path:
        errors.append(f'{item[\"name\"]}: нет пути')
    elif not img_path.startswith('/images/'):
        errors.append(f'{item[\"name\"]}: неправильный путь {img_path}')
    
if errors:
    print('⚠️  Найдены проблемы:')
    for err in errors:
        print(f'   - {err}')
else:
    print('✅ Все пути корректны')
"

echo ""
echo "3. Проверка существования папок..."
for folder in coffee non-coffee food breakfast pizza; do
    if [ -d "public/images/products/$folder" ]; then
        echo "✅ Папка $folder существует"
    else
        echo "⚠️  Папка $folder отсутствует"
    fi
done

echo ""
echo "4. Рекомендации:"
echo "   - Положите реальные JPG файлы в папки public/images/products/"
echo "   - Имена файлов должны совпадать с путями в JSON"
echo "   - Для теста можно скопировать:"
echo "     cp /путь/к/фото.jpg public/images/products/coffee/americano.jpg"
echo ""
echo "5. Быстрая проверка через Python:"
echo "   python3 scripts/fix-images.py"
echo ""
echo "6. После добавления фото:"
echo "   npm run build"
