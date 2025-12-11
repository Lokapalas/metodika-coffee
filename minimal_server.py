from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import os
import subprocess
from datetime import datetime

# Загружаем переменные из .env
env_vars = {}
with open('.env') as f:
    for line in f:
        if '=' in line and not line.startswith('#'):
            key, value = line.strip().split('=', 1)
            env_vars[key] = value
            os.environ[key] = value

TOKEN = env_vars.get('TELEGRAM_BOT_TOKEN', '')
CHAT_ID = env_vars.get('TELEGRAM_CHAT_ID', '')

print(f"🚀 Запуск сервера Методика Кофе")
print(f"📞 Telegram: {'✅' if TOKEN else '❌'} {TOKEN[:10] if TOKEN else ''}...")
print(f"👤 Chat ID: {CHAT_ID}")
print(f"🌐 Порт: 3001")

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                'status': 'ok',
                'service': 'Metodika Coffee API'
            }).encode())
        elif self.path == '/api/test':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                'message': '✅ API работает!',
                'telegram': 'настроен' if TOKEN and CHAT_ID else 'не настроен'
            }).encode())
        else:
            self.send_error(404)
    
    def do_POST(self):
        if self.path == '/api/orders':
            try:
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                order = json.loads(post_data.decode())
                
                print(f"[{datetime.now().strftime('%H:%M:%S')}] 📦 Заказ: {order.get('name')}, {order.get('phone')}")
                
                # Отправляем в Telegram
                if TOKEN and CHAT_ID:
                    items_text = ""
                    if 'items' in order and order['items']:
                        items_text = "\n".join([
                            f"• {item.get('name', 'Товар')} x{item.get('quantity', 1)}"
                            for item in order['items']
                        ])
                    
                    message = (
                        f"🆕 *НОВЫЙ ЗАКАЗ*\n\n"
                        f"👤 *Клиент:* {order.get('name', 'Не указано')}\n"
                        f"📞 *Телефон:* `{order.get('phone', 'Не указан')}`\n"
                    )
                    
                    if order.get('address'):
                        message += f"📍 *Адрес:* {order.get('address')}\n"
                    
                    if order.get('comments'):
                        message += f"📝 *Комментарий:* {order.get('comments')}\n"
                    
                    if items_text:
                        message += f"\n🛒 *Заказ:*\n{items_text}\n"
                    
                    message += f"\n💰 *Итого:* {order.get('total', 0)}₽\n"
                    message += f"⏰ *Время:* {datetime.now().strftime('%H:%M:%S')}"
                    
                    # Отправляем через curl
                    cmd = f'curl -s -X POST "https://api.telegram.org/bot{TOKEN}/sendMessage" -d "chat_id={CHAT_ID}" -d "text={message}" -d "parse_mode=Markdown"'
                    result = subprocess.run(cmd, shell=True, capture_output=True)
                    
                    if result.returncode == 0:
                        print(f"[{datetime.now().strftime('%H:%M:%S')}] ✅ Уведомление отправлено в Telegram")
                    else:
                        print(f"[{datetime.now().strftime('%H:%M:%S')}] ❌ Ошибка Telegram: {result.stderr}")
                
                # Отвечаем клиенту
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({
                    'success': True,
                    'message': 'Заказ принят! Ожидайте звонка.'
                }).encode())
                
            except Exception as e:
                print(f"[{datetime.now().strftime('%H:%M:%S')}] ❌ Ошибка: {e}")
                self.send_error(500)
        else:
            self.send_error(404)
    
    def log_message(self, format, *args):
        pass  # Отключаем стандартное логирование

# Запускаем сервер
server = HTTPServer(('0.0.0.0', 3001), Handler)
print("✅ Сервер запущен. Ожидаю запросы...")
print("   GET  /          - проверка работы")
print("   GET  /api/test  - тест API")
print("   POST /api/orders - новый заказ")
print("=" * 50)

try:
    server.serve_forever()
except KeyboardInterrupt:
    print("\n⏹️ Сервер остановлен")
