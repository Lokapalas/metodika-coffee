from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import os
import subprocess
from datetime import datetime
import random

print("🚀 Запуск ПОЛНОГО backend для Методика Кофе")

# Тестовые данные для меню
products_data = [
    {
        "id": 1, 
        "name": "Капучино", 
        "price": 280, 
        "category": "coffee", 
        "subcategory": "hot",
        "description": "Классический кофе с молоком и пенкой",
        "image": "/images/coffee1.jpg",
        "has_sizes": True,
        "sizes": [
            {"name": "S", "price": 250},
            {"name": "M", "price": 280},
            {"name": "L", "price": 320}
        ]
    },
    {
        "id": 2, 
        "name": "Латте", 
        "price": 300, 
        "category": "coffee", 
        "subcategory": "hot",
        "description": "Нежный кофе с большим количеством молока",
        "image": "/images/coffee2.jpg",
        "has_sizes": True,
        "sizes": [
            {"name": "S", "price": 270},
            {"name": "M", "price": 300},
            {"name": "L", "price": 350}
        ]
    },
    {
        "id": 3, 
        "name": "Эспрессо", 
        "price": 200, 
        "category": "coffee", 
        "subcategory": "hot",
        "description": "Крепкий черный кофе 30 мл",
        "image": "/images/coffee3.jpg"
    },
    {
        "id": 4, 
        "name": "Американо", 
        "price": 250, 
        "category": "coffee", 
        "subcategory": "hot",
        "description": "Разбавленный эспрессо 120 мл",
        "image": "/images/coffee4.jpg"
    },
    {
        "id": 5, 
        "name": "Круассан", 
        "price": 150, 
        "category": "bakery", 
        "subcategory": "pastry",
        "description": "Свежая французская выпечка",
        "image": "/images/croissant.jpg"
    },
    {
        "id": 6, 
        "name": "Тирамису", 
        "price": 320, 
        "category": "dessert", 
        "subcategory": "cakes",
        "description": "Итальянский десерт с кофе и маскарпоне",
        "image": "/images/tiramisu.jpg"
    },
    {
        "id": 7, 
        "name": "Чизкейк Нью-Йорк", 
        "price": 280, 
        "category": "dessert", 
        "subcategory": "cakes",
        "description": "Классический чизкейк с ягодным топпингом",
        "image": "/images/cheesecake.jpg"
    },
    {
        "id": 8, 
        "name": "Сэндвич с ветчиной", 
        "price": 220, 
        "category": "sandwich", 
        "subcategory": "sandwiches",
        "description": "Свежий сэндвич с ветчиной, сыром и овощами",
        "image": "/images/sandwich.jpg"
    },
    {
        "id": 9, 
        "name": "Фраппучино", 
        "price": 340, 
        "category": "coffee", 
        "subcategory": "cold",
        "description": "Холодный кофейный напиток со льдом",
        "image": "/images/frappuccino.jpg"
    },
    {
        "id": 10, 
        "name": "Кекс шоколадный", 
        "price": 120, 
        "category": "bakery", 
        "subcategory": "pastry",
        "description": "Шоколадный кекс с глазурью",
        "image": "/images/cupcake.jpg"
    }
]

categories_data = {
    "coffee": ["hot", "cold", "special"],
    "bakery": ["pastry", "bread", "buns"],
    "dessert": ["cakes", "icecream", "other"],
    "sandwich": ["sandwiches", "wraps", "burgers"]
}

class FullHandler(BaseHTTPRequestHandler):
    def _send_json(self, data, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))
    
    def do_GET(self):
        path = self.path
        
        print(f"[{datetime.now().strftime('%H:%M:%S')}] GET {path}")
        
        if path == '/' or path == '/api':
            self._send_json({
                'status': 'ok', 
                'service': 'Metodika Coffee Full API',
                'endpoints': ['/api/products', '/api/categories', '/api/orders (POST)']
            })
        
        elif path == '/api/test':
            self._send_json({
                'message': '✅ API работает!',
                'timestamp': datetime.now().isoformat()
            })
        
        elif path == '/api/products':
            self._send_json(products_data)
        
        elif path == '/api/categories':
            self._send_json(categories_data)
        
        elif path.startswith('/api/products/'):
            try:
                product_id = int(path.split('/')[-1])
                product = next((p for p in products_data if p['id'] == product_id), None)
                if product:
                    self._send_json(product)
                else:
                    self._send_json({'error': 'Product not found'}, 404)
            except:
                self._send_json({'error': 'Invalid product ID'}, 400)
        
        else:
            self._send_json({'error': 'Not found', 'path': path}, 404)
    
    def do_POST(self):
        path = self.path
        
        print(f"[{datetime.now().strftime('%H:%M:%S')}] POST {path}")
        
        if path == '/api/orders':
            try:
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                order = json.loads(post_data.decode('utf-8'))
                
                print(f"📦 Заказ от {order.get('name')}, тел: {order.get('phone')}")
                
                # Отправляем в Telegram
                try:
                    with open('.env') as f:
                        env_vars = {}
                        for line in f:
                            if '=' in line and not line.startswith('#'):
                                key, value = line.strip().split('=', 1)
                                env_vars[key] = value
                    
                    token = env_vars.get('TELEGRAM_BOT_TOKEN', '')
                    chat_id = env_vars.get('TELEGRAM_CHAT_ID', '')
                    
                    if token and chat_id:
                        # Формируем сообщение
                        items_text = ""
                        if 'items' in order and order['items']:
                            items_text = "\n".join([
                                f"• {item.get('name', 'Товар')} x{item.get('quantity', 1)} - {item.get('price', 0) * item.get('quantity', 1)}₽"
                                for item in order['items']
                            ])
                        
                        message = (
                            f"🆕 *НОВЫЙ ЗАКАЗ #ORD{datetime.now().strftime('%Y%m%d%H%M%S')}*\n\n"
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
                        
                        # Отправляем
                        cmd = [
                            'curl', '-s', '-X', 'POST',
                            f'https://api.telegram.org/bot{token}/sendMessage',
                            '-d', f'chat_id={chat_id}',
                            '-d', f'text={message}',
                            '-d', 'parse_mode=Markdown'
                        ]
                        
                        subprocess.run(cmd, capture_output=True)
                        print(f"📤 Уведомление отправлено в Telegram")
                
                except Exception as e:
                    print(f"⚠️ Ошибка Telegram: {e}")
                
                # Всегда возвращаем успех
                self._send_json({
                    'success': True,
                    'message': 'Заказ принят! Ожидайте звонка для подтверждения.',
                    'order_id': f'ORD{datetime.now().strftime("%Y%m%d%H%M%S")}'
                })
                
            except Exception as e:
                print(f"❌ Ошибка обработки заказа: {e}")
                self._send_json({'error': str(e)}, 500)
        
        else:
            self._send_json({'error': 'Not found'}, 404)
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def log_message(self, format, *args):
        pass  # Отключаем стандартное логирование

print("✅ Полный backend готов. Запускаю на порту 3001...")
print("📋 Доступные эндпоинты:")
print("   GET  /api/products     - список товаров")
print("   GET  /api/categories   - категории")
print("   GET  /api/products/:id - детали товара")
print("   POST /api/orders       - новый заказ")

server = HTTPServer(('0.0.0.0', 3001), FullHandler)
server.serve_forever()
