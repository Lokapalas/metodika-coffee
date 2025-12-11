from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import httpx
import os
from datetime import datetime
import json

app = FastAPI(title="Metodika Coffee API")

# Включаем CORS
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
async def root():
    return {
        "status": "ok",
        "service": "Metodika Coffee API",
        "version": "1.0.0",
        "telegram_configured": bool(os.getenv("TELEGRAM_BOT_TOKEN"))
    }

@app.get("/api/test")
async def test():
    token = os.getenv("TELEGRAM_BOT_TOKEN", "")
    return {
        "message": "API работает ✅",
        "telegram": "✅ настроен" if token else "❌ не настроен",
        "chat_id": os.getenv("TELEGRAM_CHAT_ID", "не указан"),
        "token_preview": f"{token[:10]}..." if token else "нет"
    }

@app.post("/api/orders")
async def create_order(order: Order):
    try:
        # Генерируем ID заказа
        order_id = f"ORD{datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        print(f"📦 Новый заказ #{order_id}")
        print(f"   Имя: {order.name}")
        print(f"   Телефон: {order.phone}")
        print(f"   Сумма: {order.total}₽")
        
        # Получаем настройки Telegram
        token = os.getenv("TELEGRAM_BOT_TOKEN")
        chat_id = os.getenv("TELEGRAM_CHAT_ID")
        
        # Отправляем уведомление в Telegram если настроено
        if token and chat_id:
            await send_telegram_notification(order, order_id, token, chat_id)
        else:
            print("⚠️ Telegram не настроен, пропускаем уведомление")
        
        # Сохраняем заказ в файл
        save_order_to_file(order, order_id)
        
        return {
            "success": True,
            "order_id": order_id,
            "message": "Заказ принят! Ожидайте звонка для подтверждения.",
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        print(f"❌ Ошибка обработки заказа: {e}")
        raise HTTPException(status_code=500, detail="Внутренняя ошибка сервера")

async def send_telegram_notification(order: Order, order_id: str, token: str, chat_id: str):
    """Отправляет уведомление в Telegram"""
    try:
        # Формируем детали заказа
        items_text = "\n".join([
            f"• {item.name} x{item.quantity} - {item.price * item.quantity:.0f}₽"
            for item in order.items
        ]) if order.items else "Детали не указаны"
        
        # Формируем сообщение
        message = (
            f"🆕 *НОВЫЙ ЗАКАЗ #{order_id}*\n\n"
            f"👤 *Клиент:* {order.name}\n"
            f"📞 *Телефон:* `{order.phone}`\n"
        )
        
        if order.address:
            message += f"📍 *Адрес:* {order.address}\n"
        
        if order.comments:
            message += f"📝 *Комментарий:* {order.comments}\n"
        
        message += (
            f"\n🛒 *Состав заказа:*\n{items_text}\n\n"
            f"💰 *Итого:* {order.total:.0f}₽\n"
            f"⏰ *Время:* {datetime.now().strftime('%d.%m.%Y, %H:%M:%S')}"
        )
        
        # Отправляем в Telegram
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"https://api.telegram.org/bot{token}/sendMessage",
                json={
                    "chat_id": chat_id,
                    "text": message,
                    "parse_mode": "Markdown",
                    "reply_markup": {
                        "inline_keyboard": [[
                            {"text": "📞 Позвонить", "url": f"tel:{order.phone}"}
                        ]]
                    }
                },
                timeout=10.0
            )
            
            if response.status_code == 200:
                result = response.json()
                if result.get("ok"):
                    print(f"✅ Уведомление отправлено в Telegram")
                else:
                    print(f"❌ Ошибка Telegram API: {result}")
            else:
                print(f"❌ HTTP ошибка: {response.status_code}")
                
    except Exception as e:
        print(f"❌ Ошибка отправки в Telegram: {e}")

def save_order_to_file(order: Order, order_id: str):
    """Сохраняет заказ в JSON файл"""
    try:
        order_data = {
            "id": order_id,
            "name": order.name,
            "phone": order.phone,
            "address": order.address,
            "comments": order.comments,
            "items": [item.dict() for item in order.items],
            "total": order.total,
            "timestamp": datetime.now().isoformat()
        }
        
        # Сохраняем в файл
        with open("/app/orders.json", "a", encoding="utf-8") as f:
            f.write(json.dumps(order_data, ensure_ascii=False) + "\n")
            
        print(f"📁 Заказ сохранен в файл")
        
    except Exception as e:
        print(f"⚠️ Не удалось сохранить заказ в файл: {e}")

@app.on_event("startup")
async def startup_event():
    print("=" * 50)
    print("🚀 Metodika Coffee Backend запускается...")
    print(f"📞 Telegram настроен: {'✅' if os.getenv('TELEGRAM_BOT_TOKEN') else '❌'}")
    print(f"👤 Chat ID: {os.getenv('TELEGRAM_CHAT_ID', 'не указан')}")
    print("=" * 50)
    
    # Отправляем тестовое уведомление при запуске
    token = os.getenv("TELEGRAM_BOT_TOKEN")
    chat_id = os.getenv("TELEGRAM_CHAT_ID")
    
    if token and chat_id:
        try:
            async with httpx.AsyncClient() as client:
                await client.post(
                    f"https://api.telegram.org/bot{token}/sendMessage",
                    json={
                        "chat_id": chat_id,
                        "text": "✅ Backend Методика Кофе запущен и готов принимать заказы!",
                        "parse_mode": "HTML"
                    }
                )
            print("📤 Стартовое уведомление отправлено в Telegram")
        except Exception as e:
            print(f"⚠️ Не удалось отправить стартовое уведомление: {e}")
