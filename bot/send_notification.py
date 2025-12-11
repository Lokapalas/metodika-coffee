#!/usr/bin/env python3
import os
import requests
import json
import logging
from datetime import datetime

# Настройка логирования
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    filename='/opt/metodika-coffee/bot/notifications.log'
)

# Настройки из .env
def load_env():
    env_vars = {}
    try:
        with open('/opt/metodika-coffee/.env', 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    env_vars[key.strip()] = value.strip().strip('"\'')
    except FileNotFoundError:
        pass
    
    # Также пробуем получить из переменных окружения
    env_vars['BOT_TOKEN'] = env_vars.get('BOT_TOKEN') or os.getenv('BOT_TOKEN', '')
    env_vars['TELEGRAM_CHAT_ID'] = env_vars.get('TELEGRAM_CHAT_ID') or os.getenv('TELEGRAM_CHAT_ID', '')
    env_vars['TELEGRAM_GROUP_ID'] = env_vars.get('TELEGRAM_GROUP_ID') or os.getenv('TELEGRAM_GROUP_ID', '')
    
    return env_vars

env = load_env()
BOT_TOKEN = env.get('BOT_TOKEN', '')
ADMIN_CHAT_ID = env.get('TELEGRAM_CHAT_ID', '')
GROUP_CHAT_ID = env.get('TELEGRAM_GROUP_ID', '')

def send_telegram_message(chat_id, message, parse_mode='HTML'):
    """Отправка сообщения в Telegram"""
    if not BOT_TOKEN or not chat_id:
        logging.error(f"Missing BOT_TOKEN or chat_id. Token: {bool(BOT_TOKEN)}, Chat: {chat_id}")
        return False
    
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
    data = {
        'chat_id': chat_id,
        'text': message,
        'parse_mode': parse_mode,
        'disable_web_page_preview': True
    }
    
    try:
        response = requests.post(url, data=data, timeout=10)
        if response.status_code == 200:
            logging.info(f"Message sent to chat {chat_id}")
            return True
        else:
            logging.error(f"Telegram API error: {response.status_code} - {response.text}")
            return False
    except requests.exceptions.RequestException as e:
        logging.error(f"Request error: {e}")
        return False
    except Exception as e:
        logging.error(f"Unexpected error: {e}")
        return False

def format_addons(addons):
    """Форматирование дополнений в читаемый вид"""
    if not addons:
        return ""
    
    parts = []
    
    # Посыпки
    if addons.get('sprinkles') and addons['sprinkles']:
        parts.append(f"✨ {', '.join(addons['sprinkles'])}")
    
    # Топпинги
    if addons.get('toppings') and addons['toppings']:
        parts.append(f"🍯 {', '.join(addons['toppings'])}")
    
    # Сиропы
    if addons.get('syrups') and addons['syrups']:
        parts.append(f"🧃 {', '.join(addons['syrups'])}")
    
    # Сахар
    if addons.get('sweetener'):
        sweetener_map = {
            'none': '🚫 Без сахара',
            'sugar': '🍬 Сахар тростниковый',
            'replace': '⚡ Сахарозаменитель'
        }
        sweetener = sweetener_map.get(addons['sweetener'], addons['sweetener'])
        if addons.get('sugar', 0) > 0 and addons['sweetener'] == 'sugar':
            sweetener += f" ({addons['sugar']} порц.)"
        parts.append(sweetener)
    
    # Корица
    if addons.get('cinnamon'):
        parts.append('🫚 Корица')
    
    # Мороженое
    if addons.get('iceCream', 0) > 0:
        parts.append(f"🍨 Мороженое ×{addons['iceCream']}")
    
    return ", ".join(parts) if parts else "Без дополнений"

def format_order_notification(order):
    """Форматирование уведомления о заказе"""
    try:
        # Парсим дату
        order_time = datetime.fromisoformat(order['created_at'].replace('Z', '+00:00'))
        formatted_time = order_time.strftime("%d.%m.%Y %H:%M")
        
        # Форматируем товары
        items_text = ""
        for item in order['items']:
            addons_text = format_addons(item.get('addons', {}))
            
            item_line = f"• <b>{item['name']}</b>"
            if item.get('size'):
                item_line += f" ({item['size']})"
            if item.get('volume'):
                item_line += f" {item['volume']}"
            
            item_line += f" × {item['quantity']} = <b>{item['price'] * item['quantity']}₽</b>"
            
            if addons_text:
                item_line += f"\n  🎯 {addons_text}"
            
            items_text += item_line + "\n"
        
        # Формируем сообщение
        message = f"""
<b>🆕 НОВЫЙ ЗАКАЗ #{order['id']}</b>

🛒 <b>Состав заказа:</b>
{items_text}
💰 <b>Итого к оплате:</b> <b>{order['total']}₽</b>

👤 <b>Клиент:</b>
├ Имя: <b>{order['customer']['name']}</b>
└ Телефон: <code>{order['customer']['phone']}</code>

⏰ <b>Время заказа:</b> {formatted_time}
📊 <b>Статус:</b> {order['status']}

<b>📋 <a href="https://metodika-coffee.ru/admin">ОТКРЫТЬ АДМИН-ПАНЕЛЬ</a></b>
"""
        return message.strip()
    
    except Exception as e:
        logging.error(f"Error formatting order: {e}")
        return f"Новый заказ #{order.get('id', 'N/A')} от {order.get('customer', {}).get('name', 'Клиент')}"

def notify_new_order(order):
    """Уведомление о новом заказе"""
    message = format_order_notification(order)
    
    # Отправляем админу
    if ADMIN_CHAT_ID:
        logging.info(f"Sending notification to admin: {ADMIN_CHAT_ID}")
        send_telegram_message(ADMIN_CHAT_ID, message)
    
    # Отправляем в группу (если указана)
    if GROUP_CHAT_ID and GROUP_CHAT_ID != ADMIN_CHAT_ID:
        logging.info(f"Sending notification to group: {GROUP_CHAT_ID}")
        send_telegram_message(GROUP_CHAT_ID, message)
    
    # Если не указаны ID, логируем
    if not ADMIN_CHAT_ID and not GROUP_CHAT_ID:
        logging.warning("No Telegram chat IDs configured. Message not sent.")
        print("⚠️  Внимание: TELEGRAM_CHAT_ID не настроен!")
        print("📝 Сообщение которое должно было отправиться:")
        print("-" * 50)
        print(message)
        print("-" * 50)

if __name__ == "__main__":
    # Тестовая функция
    test_order = {
        "id": 1001,
        "created_at": datetime.now().isoformat(),
        "status": "pending",
        "items": [
            {
                "name": "Латте",
                "size": "M",
                "volume": "350 мл",
                "price": 300,
                "quantity": 2,
                "addons": {
                    "sprinkles": ["Мокко"],
                    "syrups": ["Ванильный"],
                    "sweetener": "sugar",
                    "sugar": 2,
                    "cinnamon": True
                }
            }
        ],
        "customer": {
            "name": "Тестовый Клиент",
            "phone": "+79161234567"
        },
        "total": 600
    }
    
    print("🧪 Тестируем отправку уведомлений...")
    notify_new_order(test_order)
