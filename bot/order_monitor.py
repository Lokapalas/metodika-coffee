#!/usr/bin/env python3
import os
import json
import time
import logging
import requests
from datetime import datetime
from send_notification import notify_new_order

# Настройка логирования
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    filename='/opt/metodika-coffee/bot/order_monitor.log'
)

ORDERS_FILE = '/app/orders.json'
LAST_ORDER_FILE = '/tmp/last_processed_order.txt'

def get_orders_from_api():
    """Получение заказов через API"""
    try:
        # Используем localhost для доступа к контейнеру
        response = requests.get('http://localhost:8000/api/admin/orders?secret_key=metodika2024', timeout=10)
        if response.status_code == 200:
            return response.json()
        else:
            logging.error(f"API error: {response.status_code}")
            return []
    except requests.exceptions.RequestException as e:
        logging.error(f"Request error: {e}")
        return []
    except Exception as e:
        logging.error(f"Unexpected error: {e}")
        return []

def get_orders_from_file():
    """Получение заказов из файла (резервный метод)"""
    try:
        if os.path.exists(ORDERS_FILE):
            with open(ORDERS_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        return []
    except Exception as e:
        logging.error(f"File read error: {e}")
        return []

def get_last_processed_id():
    """Получение ID последнего обработанного заказа"""
    try:
        if os.path.exists(LAST_ORDER_FILE):
            with open(LAST_ORDER_FILE, 'r') as f:
                content = f.read().strip()
                if content.isdigit():
                    return int(content)
        return 0
    except Exception:
        return 0

def save_last_processed_id(order_id):
    """Сохранение ID последнего обработанного заказа"""
    try:
        with open(LAST_ORDER_FILE, 'w') as f:
            f.write(str(order_id))
    except Exception as e:
        logging.error(f"Error saving last order ID: {e}")

def check_new_orders():
    """Проверка новых заказов"""
    try:
        # Пробуем получить через API
        orders = get_orders_from_api()
        if not orders:
            # Если API не работает, пробуем файл
            orders = get_orders_from_file()
        
        if not orders:
            logging.warning("No orders found")
            return
        
        # Сортируем по ID (новые в конце)
        orders.sort(key=lambda x: x['id'])
        
        # Получаем последний обработанный ID
        last_id = get_last_processed_id()
        logging.info(f"Last processed order ID: {last_id}")
        
        # Находим новые заказы
        new_orders = [o for o in orders if o['id'] > last_id and o['status'] == 'pending']
        
        if new_orders:
            logging.info(f"Found {len(new_orders)} new orders")
            
            for order in new_orders:
                logging.info(f"Processing order #{order['id']}")
                notify_new_order(order)
                
                # Обновляем последний ID
                save_last_processed_id(order['id'])
                time.sleep(1)  # Небольшая задержка между уведомлениями
        else:
            logging.debug("No new orders found")
        
        # Обновляем последний ID на максимальный из всех заказов
        if orders:
            max_id = max(o['id'] for o in orders)
            if max_id > last_id:
                save_last_processed_id(max_id)
                
    except Exception as e:
        logging.error(f"Error in check_new_orders: {e}")

def main():
    """Основной цикл мониторинга"""
    logging.info("🚀 Order monitor started")
    
    check_interval = 30  # секунды
    
    try:
        while True:
            check_new_orders()
            time.sleep(check_interval)
    except KeyboardInterrupt:
        logging.info("🛑 Order monitor stopped by user")
    except Exception as e:
        logging.error(f"❌ Monitor error: {e}")
        raise

if __name__ == "__main__":
    main()
