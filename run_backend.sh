#!/bin/bash
cd /opt/metodika-coffee

# Загружаем переменные
source .env

echo "=== METODIKA COFFEE BACKEND ==="
echo "Запуск: $(date '+%H:%M:%S')"
echo "Telegram: ${TELEGRAM_BOT_TOKEN:0:10}..."
echo "Chat ID: $TELEGRAM_CHAT_ID"
echo "Порт: 3001"
echo "=============================="

# Функция отправки в Telegram
send_to_telegram() {
    local name="$1"
    local phone="$2"
    local total="$3"
    
    curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
        -d "chat_id=${TELEGRAM_CHAT_ID}" \
        -d "text=🆕 *ЗАКАЗ С САЙТА*

👤 *Клиент:* $name
📞 *Телефон:* \`$phone\`
💰 *Сумма:* ${total}₽
⏰ *Время:* $(date '+%H:%M:%S')
🌐 *Источник:* сайт metodika-coffee.ru" \
        -d "parse_mode=Markdown"
    
    echo "[$(date '+%H:%M:%S')] 📤 Уведомление отправлено: $name, $phone"
}

# Запускаем простой HTTP сервер на Python
python3 -c "
from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import os
import sys

PORT = 3001

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                'status': 'ok',
                'service': 'Metodika Coffee API',
                'telegram': 'configured'
            }).encode())
        elif self.path == '/api/test':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                'message': '✅ API работает!',
                'timestamp': '$(date -Iseconds)'
            }).encode())
        else:
            self.send_error(404)
    
    def do_POST(self):
        if self.path == '/api/orders':
            try:
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                order = json.loads(post_data.decode())
                
                # Отправляем в Telegram через bash
                import subprocess
                cmd = f'''bash -c "source /opt/metodika-coffee/.env && curl -s -X POST \\\"https://api.telegram.org/bot{os.environ.get('TELEGRAM_BOT_TOKEN', '')}/sendMessage\\\" -d \\\"chat_id={os.environ.get('TELEGRAM_CHAT_ID', '')}\\\" -d \\\"text=🆕 ЗАКАЗ\\\\n\\\\n👤 {order.get('name')}\\\\n📞 {order.get('phone')}\\\\n💰 {order.get('total', 0)}₽\\\" -d \\\"parse_mode=Markdown\\\"" '''
                subprocess.run(cmd, shell=True)
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({
                    'success': True,
                    'message': 'Заказ принят! Ожидайте звонка.'
                }).encode())
                
                print(f'[$(date +%H:%M:%S)] 📦 Новый заказ: {order.get(\"name\")}, {order.get(\"phone\")}')
                
            except Exception as e:
                print(f'[$(date +%H:%M:%S)] ❌ Ошибка: {e}')
                self.send_error(500)
        else:
            self.send_error(404)
    
    def log_message(self, format, *args):
        pass  # Отключаем стандартное логирование

print(f'🚀 Запуск сервера на порту {PORT}...')
server = HTTPServer(('0.0.0.0', PORT), Handler)

try:
    server.serve_forever()
except KeyboardInterrupt:
    print('\n⏹️  Сервер остановлен')
    server.server_close()
