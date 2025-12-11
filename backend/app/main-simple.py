from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import httpx
import os
from datetime import datetime

app = FastAPI()

class CartItem(BaseModel):
    name: str
    quantity: int
    price: float

class Order(BaseModel):
    name: str
    phone: str
    address: Optional[str] = None
    comments: Optional[str] = None
    items: List[CartItem]
    total: float

@app.get("/")
def root():
    return {"status": "ok", "service": "Metodika Coffee API"}

@app.get("/api/test")
def test():
    return {
        "message": "API работает",
        "telegram": "✅ настроен" if os.getenv("TELEGRAM_BOT_TOKEN") else "❌ не настроен",
        "chat_id": os.getenv("TELEGRAM_CHAT_ID", "не указан")
    }

@app.post("/api/orders")
async def create_order(order: Order):
    token = os.getenv("TELEGRAM_BOT_TOKEN")
    chat_id = os.getenv("TELEGRAM_CHAT_ID")
    
    order_id = f"ORD{datetime.now().strftime('%Y%m%d%H%M%S')}"
    
    # Формируем сообщение
    items_text = "\n".join([
        f"• {item.name} x{item.quantity} - {item.price * item.quantity:.0f}₽"
        for item in order.items
    ])
    
    message = (
        f"🆕 *НОВЫЙ ЗАКАЗ #{order_id}*\n\n"
        f"👤 *Клиент:* {order.name}\n"
        f"📞 *Телефон:* `{order.phone}`\n"
        f"📍 *Адрес:* {order.address or 'Не указан'}\n"
        f"📝 *Комментарий:* {order.comments or 'Нет'}\n\n"
        f"🛒 *Заказ:*\n{items_text}\n\n"
        f"💰 *Итого:* {order.total:.0f}₽\n"
        f"⏰ *Время:* {datetime.now().strftime('%d.%m.%Y %H:%M:%S')}"
    )
    
    # Отправляем в Telegram
    if token and chat_id:
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"https://api.telegram.org/bot{token}/sendMessage",
                    json={
                        "chat_id": chat_id,
                        "text": message,
                        "parse_mode": "Markdown"
                    },
                    timeout=10.0
                )
                
                print(f"Telegram response: {response.status_code}")
        except Exception as e:
            print(f"Telegram error: {e}")
    
    return {
        "success": True,
        "order_id": order_id,
        "message": "Заказ принят!"
    }
