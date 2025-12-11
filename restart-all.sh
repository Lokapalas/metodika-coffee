#!/bin/bash
echo "🚀 Перезапуск всех сервисов Metodika Coffee..."
echo ""

echo "1. Перезапуск Nginx..."
systemctl restart nginx
sleep 2

echo "2. Перезапуск бэкенда..."
docker restart metodika-backend
sleep 3

echo "3. Перезапуск бота..."
cd /opt/metodika-coffee/bot
pkill -f "python main.py" 2>/dev/null
source venv/bin/activate
nohup python main.py > bot.log 2>&1 &
sleep 2

echo "4. Проверка статуса..."
echo ""
echo "Nginx: $(systemctl is-active nginx)"
echo "Бэкенд: $(docker inspect -f '{{.State.Status}}' metodika-backend)"
echo "Бот: $(ps aux | grep "python main.py" | grep -v grep | wc -l) процесс(ов)"
echo ""
echo "✅ Все сервисы перезапущены!"
echo ""
echo "Быстрые проверки:"
echo "  API:     curl https://metodika-coffee.ru/api/products"
echo "  Сайт:    https://metodika-coffee.ru/"
echo "  Бот:     @Metodika_CoffeeBot"
