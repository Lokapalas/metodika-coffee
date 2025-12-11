from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, validator
from typing import List, Optional, Dict, Any
from datetime import datetime
import json
import os

app = FastAPI(title="Metodika Coffee API", version="2.0")

# CORS настройки
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Модели данных
class SizeOption(BaseModel):
    size: str  # S, M, L
    volume: str  # 250 мл, 350 мл, 450 мл
    price: int

class SprinkleOption(BaseModel):
    name: str
    price: int = 20  # по умолчанию 20₽

class ToppingOption(BaseModel):
    name: str
    price: int = 50  # по умолчанию 50₽

class SyrupOption(BaseModel):
    name: str
    price: int = 40  # по умолчанию 40₽

class Addons(BaseModel):
    # Посыпки
    sprinkles: Optional[Dict[str, Any]] = {
        "available": True,
        "options": [
            {"name": "Сладкий чили", "price": 20},
            {"name": "Черная соль", "price": 20},
            {"name": "Голубая матча", "price": 20},
            {"name": "Мокко", "price": 20},
            {"name": "Вишня сублимированная", "price": 20},
            {"name": "Маршмеллоу", "price": 50}
        ]
    }
    
    # Топпинги
    toppings: Optional[Dict[str, Any]] = {
        "available": True,
        "options": [
            {"name": "Карамельный", "price": 50},
            {"name": "Шоколадный", "price": 50},
            {"name": "Кленовый", "price": 50}
        ]
    }
    
    # Сиропы
    syrups: Optional[Dict[str, Any]] = {
        "available": True,
        "options": [
            {"name": "Ванильный", "price": 40},
            {"name": "Карамельный", "price": 40},
            {"name": "Кокосовый", "price": 40}
        ]
    }
    
    # Сахар/заменители
    sweeteners: Optional[Dict[str, Any]] = {
        "available": True,
        "options": [
            {"name": "Без сахара", "price": 0},
            {"name": "Сахар тростниковый", "price": 0},
            {"name": "Сахарозаменитель", "price": 0}
        ]
    }
    
    # Дополнения
    extras: Optional[Dict[str, Any]] = {
        "available": True,
        "options": [
            {"name": "Корица", "price": 30},
            {"name": "+1 шарик мороженого", "price": 50}
        ]
    }

class Product(BaseModel):
    id: int
    name: str
    description: str
    category: str
    subcategory: str
    image: Optional[str] = None
    has_sizes: bool = True  # по умолчанию есть размеры
    sizes: Optional[List[SizeOption]] = None
    default_price: Optional[int] = None  # если has_sizes=False
    addons: Addons = Addons()

# Кофейня "Winners Style" - пример товара
PRODUCTS = [
    {
        "id": 1,
        "name": "Капучино",
        "description": "Настрой как любишь. Текстуру и вкус подтаявшего плюмера",
        "category": "Кофе",
        "subcategory": "классика",
        "image": "/images/products/1.jpg",
        "has_sizes": True,
        "sizes": [
            {"size": "S", "volume": "250 мл", "price": 250},
            {"size": "M", "volume": "350 мл", "price": 270},
            {"size": "L", "volume": "450 мл", "price": 290}
        ],
        "addons": {
            "sprinkles": {
                "available": True,
                "options": [
                    {"name": "Сладкий чили", "price": 20},
                    {"name": "Черная соль", "price": 20},
                    {"name": "Голубая матча", "price": 20},
                    {"name": "Мокко", "price": 20},
                    {"name": "Вишня сублимированная", "price": 20},
                    {"name": "Маршмеллоу", "price": 50}
                ]
            },
            "toppings": {
                "available": True,
                "options": [
                    {"name": "Карамельный", "price": 50},
                    {"name": "Шоколадный", "price": 50},
                    {"name": "Кленовый", "price": 50}
                ]
            },
            "syrups": {
                "available": True,
                "options": [
                    {"name": "Ванильный", "price": 40},
                    {"name": "Карамельный", "price": 40},
                    {"name": "Кокосовый", "price": 40}
                ]
            },
            "sweeteners": {
                "available": True,
                "options": [
                    {"name": "Без сахара", "price": 0},
                    {"name": "Сахар тростниковый", "price": 0},
                    {"name": "Сахарозаменитель", "price": 0}
                ]
            },
            "extras": {
                "available": True,
                "options": [
                    {"name": "Корица", "price": 30},
                    {"name": "+1 шарик мороженого", "price": 50}
                ]
            }
        }
    }
    # ... остальные товары
]

# Заказы (оставляем как есть)
ORDERS_FILE = "/app/orders.json"

class OrderItem(BaseModel):
    product_id: int
    name: str
    size: Optional[str] = None
    volume: Optional[str] = None
    price: int
    quantity: int
    category: str
    subcategory: str
    addons: Dict[str, Any]

class CustomerInfo(BaseModel):
    name: str
    phone: str

class OrderCreate(BaseModel):
    items: List[OrderItem]
    customer: CustomerInfo
    total: int

# Эндпоинты (оставляем без изменений)
@app.get("/")
async def root():
    return {"message": "Metodika Coffee API"}

@app.get("/api/config")
async def get_config():
    return {
        "name": "Metodika Coffee",
        "phone": "+7 (919) 761-03-08",
        "address": "ул. Люблинская, д.76, к.2",
        "location": "Методика кофе ЖК Люблинский парк",
        "hours": "Ежедневно с 8:00 до 22:00"
    }

@app.get("/api/categories")
async def get_categories():
    categories = {}
    for product in PRODUCTS:
        if product["category"] not in categories:
            categories[product["category"]] = []
        if product["subcategory"] not in categories[product["category"]]:
            categories[product["category"]].append(product["subcategory"])
    return categories

@app.get("/api/products")
async def get_products(
    category: Optional[str] = None,
    subcategory: Optional[str] = None
):
    filtered = PRODUCTS
    if category:
        filtered = [p for p in filtered if p["category"] == category]
    if subcategory:
        filtered = [p for p in filtered if p["subcategory"] == subcategory]
    
    # Упрощенный вид для списка
    simplified = []
    for product in filtered:
        item = {
            "id": product["id"],
            "name": product["name"],
            "category": product["category"],
            "subcategory": product["subcategory"],
            "image": product["image"]
        }
        
        # Определяем минимальную цену
        if product["has_sizes"] and product["sizes"]:
            min_price = min([s["price"] for s in product["sizes"]])
            item["price"] = min_price
        elif product["default_price"]:
            item["price"] = product["default_price"]
        else:
            item["price"] = 0
            
        simplified.append(item)
    
    return simplified

@app.get("/api/products/{product_id}")
async def get_product(product_id: int):
    for product in PRODUCTS:
        if product["id"] == product_id:
            return product
    raise HTTPException(status_code=404, detail="Product not found")

@app.post("/api/orders")
async def create_order(order: OrderCreate):
    # Загружаем существующие заказы
    if os.path.exists(ORDERS_FILE):
        with open(ORDERS_FILE, "r", encoding="utf-8") as f:
            orders = json.load(f)
    else:
        orders = []
    
    # Создаем новый заказ
    new_order = {
        "id": len(orders) + 1001,
        "created_at": datetime.now().isoformat(),
        "status": "pending",
        "items": [item.dict() for item in order.items],
        "customer": order.customer.dict(),
        "total": order.total
    }
    
    orders.append(new_order)
    
    # Сохраняем
    with open(ORDERS_FILE, "w", encoding="utf-8") as f:
        json.dump(orders, f, ensure_ascii=False, indent=2)
    
    return new_order

@app.get("/api/orders/{order_id}")
async def get_order(order_id: int):
    if os.path.exists(ORDERS_FILE):
        with open(ORDERS_FILE, "r", encoding="utf-8") as f:
            orders = json.load(f)
        
        for order in orders:
            if order["id"] == order_id:
                return order
    
    raise HTTPException(status_code=404, detail="Order not found")

@app.get("/api/admin/orders")
async def get_all_orders(
    secret_key: str = Query(..., description="Секретный ключ для доступа")
):
    if secret_key != "metodika2024":
        raise HTTPException(status_code=403, detail="Forbidden")
    
    if os.path.exists(ORDERS_FILE):
        with open(ORDERS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    
    return []

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
