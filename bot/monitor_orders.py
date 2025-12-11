#!/usr/bin/env python3
import time
import logging
from send_notification import check_new_orders

# Настройка логирования
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    filename='/opt/metodika-coffee/bot/order_monitor.log'
)

def main():
    """Основной цикл мониторинга"""
    logging.info("Order monitor started")
    
    # Интервал проверки (секунды)
    CHECK_INTERVAL = 30
    
    try:
        while True:
            check_new_orders()
            time.sleep(CHECK_INTERVAL)
    except KeyboardInterrupt:
        logging.info("Order monitor stopped")
    except Exception as e:
        logging.error(f"Monitor error: {e}")

if __name__ == "__main__":
    main()
