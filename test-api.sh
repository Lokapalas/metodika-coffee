#!/bin/bash
echo "📦 Тестируем API заказов..."
curl -X POST "http://localhost:3001/api/orders" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Иван Петров",
    "phone": "+79991112233",
    "items": [
      {"name": "Капучино", "quantity": 2, "price": 250},
      {"name": "Тирамису", "quantity": 1, "price": 300}
    ],
    "total": 800,
    "address": "ул. Примерная, 10",
    "comments": "Без сахара, пожалуйста"
  }'
echo ""
