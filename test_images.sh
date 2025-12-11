#!/bin/bash
echo "Проверка доступности изображений:"
echo ""

# Проверяем первые 5 изображений
for i in 1 2 3 4 5; do
  echo -n "Изображение $i: "
  status_code=$(curl -s -o /dev/null -w "%{http_code}" "https://metodika-coffee.ru/images/products/$i.jpg")
  
  if [ "$status_code" = "200" ]; then
    echo "✅ Доступно (код: $status_code)"
    # Проверяем тип файла
    content_type=$(curl -s -I "https://metodika-coffee.ru/images/products/$i.jpg" | grep -i "content-type" | head -1)
    echo "   Тип: $content_type"
  elif [ "$status_code" = "404" ]; then
    echo "❌ Не найдено (код: $status_code)"
    
    # Проверяем существование файла
    if [ -f "/opt/metodika-coffee/frontend/public/images/products/$i.jpg" ]; then
      echo "   Файл существует локально"
      echo "   Размер: $(stat -c%s "/opt/metodika-coffee/frontend/public/images/products/$i.jpg") байт"
    elif [ -f "/opt/metodika-coffee/frontend/public/images/products/$i.PNG" ]; then
      echo "   Файл $i.PNG существует локально"
      echo "   Нужно переименовать или обновить API"
    else
      echo "   Файл не существует локально"
    fi
  else
    echo "⚠️  Проблема (код: $status_code)"
  fi
  echo ""
done

echo "Проверка путей в API:"
grep -n 'image.*/images/products/' /opt/metodika-coffee/backend/app/main.py | head -5
