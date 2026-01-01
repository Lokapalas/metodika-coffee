#!/bin/bash
echo "📁 СОЗДАНИЕ ВСЕХ НЕОБХОДИМЫХ ФАЙЛОВ"
echo "===================================="

cd /opt/metodika-coffee/frontend

# Читаем список требуемых файлов
if [ -f "public/images/required-exact.txt" ]; then
    echo "📋 Читаю список из required-exact.txt..."
    
    current_folder=""
    while IFS= read -r line; do
        # Пропускаем комментарии и пустые строки
        if [[ "$line" =~ ^# ]] || [[ -z "$line" ]] || [[ "$line" =~ ^\s*$ ]]; then
            continue
        fi
        
        # Обнаруживаем новую папку
        if [[ "$line" =~ ^##\ Папка:\ (.+)/ ]]; then
            current_folder="${BASH_REMATCH[1]}"
            echo ""
            echo "📁 Папка: $current_folder/"
            mkdir -p "public/images/products/$current_folder"
            continue
        fi
        
        # Обрабатываем файлы
        if [[ "$line" =~ ^-\ (.+\.jpg) ]]; then
            filename="${BASH_REMATCH[1]}"
            filepath="public/images/products/$current_folder/$filename"
            
            if [ -f "$filepath" ]; then
                echo "  ✓ Уже есть: $filename"
            else
                touch "$filepath"
                echo "  + Создан: $filename"
            fi
        fi
    done < "public/images/required-exact.txt"
    
    echo ""
    echo "✅ Все файлы созданы"
    
else
    echo "❌ Файл required-exact.txt не найден"
    echo "Сначала запустите: python3 scripts/fix-exact-names.py"
fi

echo ""
echo "📊 ИТОГО файлов в папках:"
for folder in coffee non-coffee food breakfast pizza; do
    if [ -d "public/images/products/$folder" ]; then
        count=$(ls -1 "public/images/products/$folder/"*.jpg 2>/dev/null | wc -l)
        echo "  $folder/: $count файлов"
    fi
done
