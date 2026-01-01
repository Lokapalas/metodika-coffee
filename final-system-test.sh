#!/bin/bash
echo "=== ФИНАЛЬНЫЙ ТЕСТ СИСТЕМЫ МЕТОДИКА КОФЕ ==="
echo "Время: $(date)"
echo ""

# 1. Процессы
echo "1. 🖥 ПРОЦЕССЫ:"
echo -n "   • Backend: "
pm2 list | grep -q "metodika-orders-api.*online" && echo "✅ Запущен" || echo "❌ Не запущен"

echo -n "   • Nginx: "
systemctl is-active nginx >/dev/null && echo "✅ Работает" || echo "❌ Не работает"

# 2. Порты
echo -e "\n2. 🔌 ПОРТЫ:"
echo -n "   • 3001 (backend): "
netstat -tulpn 2>/dev/null | grep -q ":3001" && echo "✅ Слушает" || echo "❌ Не слушает"

echo -n "   • 80 (nginx): "
netstat -tulpn 2>/dev/null | grep -q ":80" && echo "✅ Слушает" || echo "❌ Не слушает"

# 3. API напрямую
echo -e "\n3. 📡 API НАПРЯМУЮ:"
API_DIRECT=$(curl -s --max-time 3 http://localhost:3001/api/test 2>/dev/null | grep -o '"status":"success"' || echo "")
[ -n "$API_DIRECT" ] && echo "✅ Работает" || echo "❌ Не отвечает"

# 4. API через nginx
echo -e "\n4. 🌐 API ЧЕРЕЗ NGINX:"
API_NGINX=$(curl -s --max-time 3 http://localhost/api/test 2>/dev/null | grep -o '"status":"success"' || echo "")
[ -n "$API_NGINX" ] && echo "✅ Работает" || echo "❌ Не отвечает"

# 5. Frontend
echo -e "\n5. 🖼 FRONTEND:"
FRONTEND=$(curl -s --max-time 3 -I http://localhost/ 2>/dev/null | head -1 | grep -o "200" || echo "")
[ -n "$FRONTEND" ] && echo "✅ Работает" || echo "❌ Не отвечает"

# 6. Телеграм бот
echo -e "\n6. 🤖 TELEGRAM БОТ:"
TOKEN="8035891020:AAHi0dl82tdgLW5pAgW6nOAr0glQnIb0_mM"
BOT_STATUS=$(curl -s --max-time 5 "https://api.telegram.org/bot${TOKEN}/getMe" 2>/dev/null | grep -o '"ok":true' || echo "")
[ -n "$BOT_STATUS" ] && echo "✅ Активен" || echo "❌ Недоступен"

# 7. Тестовый заказ
echo -e "\n7. 🛒 ТЕСТОВЫЙ ЗАКАЗ:"
ORDER_JSON='{
  "userName": "Тест системы",
  "userPhone": "+79990001122",
  "deliveryAddress": "Тестовый адрес",
  "totalAmount": 100,
  "items": [{"name": "Тестовый заказ", "price": 100, "quantity": 1}],
  "comment": "Тест от $(date)"
}'

ORDER_RESULT=$(curl -s --max-time 5 -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -d "$ORDER_JSON" 2>/dev/null)

if echo "$ORDER_RESULT" | grep -q '"success":true'; then
    ORDER_ID=$(echo "$ORDER_RESULT" | grep -o '"orderId":"[^"]*"' | cut -d'"' -f4)
    echo "✅ Работает (ID: $ORDER_ID)"
else
    echo "❌ Не работает"
fi

# Итог
echo -e "\n" + "=".repeat(50)
echo "🎯 ИТОГ СИСТЕМЫ:"

ALL_TESTS=7
PASSED_TESTS=0

[ -n "$API_DIRECT" ] && ((PASSED_TESTS++))
[ -n "$API_NGINX" ] && ((PASSED_TESTS++))
[ -n "$FRONTEND" ] && ((PASSED_TESTS++))

echo "Пройдено тестов: $PASSED_TESTS/$ALL_TESTS"

if [ $PASSED_TESTS -eq $ALL_TESTS ]; then
    echo "🎉🎉🎉 СИСТЕМА ПОЛНОСТЬЮ ГОТОВА! 🎉🎉🎉"
else
    echo "⚠️  Есть проблемы, требуется диагностика"
fi

echo -e "\n🔗 ССЫЛКИ ДЛЯ ТЕСТИРОВАНИЯ:"
echo "• Telegram бот: https://t.me/Metodika_CoffeeBot"
echo "• Прямая ссылка: https://t.me/Metodika_CoffeeBot?startapp=order"
echo "• Веб-сайт: https://metodika-coffee.ru"
echo "• API: http://localhost:3001/api/test"

echo -e "\n🛠 КОМАНДЫ УПРАВЛЕНИЯ:"
echo "• Логи backend: pm2 logs metodika-orders-api"
echo "• Перезапуск backend: pm2 restart metodika-orders-api"
echo "• Перезагрузка nginx: systemctl reload nginx"
echo "• Статус: pm2 status"
