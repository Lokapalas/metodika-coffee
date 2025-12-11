from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
import json
import os
from datetime import datetime

app = FastAPI(title="Metodika Coffee API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Модели данных
class ProductSize(BaseModel):
    size: str  # "S", "M", "L"
    price: float
    volume: str  # "300 мл", "400 мл", "500 мл"

class Addon(BaseModel):
    id: int
    name: str
    price: float
    type: str  # "sugar", "spice", "syrup", "milk"

class Product(BaseModel):
    id: int
    name: str
    category: str
    subcategory: str
    description: str = ""
    has_sizes: bool = False
    sizes: List[ProductSize] = []
    has_addons: bool = False
    addons: List[Addon] = []
    default_price: Optional[float] = None
    image_id: Optional[int] = None

class Category(BaseModel):
    name: str
    subcategories: List[str]

class OrderItemAddon(BaseModel):
    addon_id: int
    name: str
    price: float
    quantity: int = 1

class OrderItem(BaseModel):
    product_id: int
    name: str
    size: Optional[str] = None  # "S", "M", "L"
    price: float
    quantity: int
    category: str
    subcategory: str
    addons: List[OrderItemAddon] = []
    sugar: int = 0  # Количество сахара: 0, 1, 2, 3
    cinnamon: bool = False  # Добавить корицу?

class CustomerInfo(BaseModel):
    name: Optional[str] = None
    phone: str
    comment: Optional[str] = None

class Order(BaseModel):
    items: List[OrderItem]
    customer: CustomerInfo
    total: float
    timestamp: str = None

# Конфигурация кофейни
COFFEE_SHOP_CONFIG = {
    "name": "Metodika Coffee",
    "phone": "+7 (919) 761-03-08",
    "address": "ул. Люблинская, д.76, к.2",
    "location": "Методика кофе ЖК Люблинский парк",
    "hours": "Ежедневно с 8:00 до 22:00"
}

# Общие дополнения для всех напитков
COMMON_ADDONS = [
    {"id": 1, "name": "Сахар", "price": 0, "type": "sugar"},  # Бесплатно
    {"id": 2, "name": "Корица", "price": 0, "type": "spice"}, # Бесплатно
    {"id": 3, "name": "Ванильный сироп", "price": 30, "type": "syrup"},
    {"id": 4, "name": "Карамельный сироп", "price": 30, "type": "syrup"},
    {"id": 5, "name": "Кокосовое молоко", "price": 50, "type": "milk"},
    {"id": 6, "name": "Овсяное молоко", "price": 40, "type": "milk"},
]

# КАТЕГОРИИ И ПОДКАТЕГОРИИ
CATEGORIES = [
    Category(name="Кофе", subcategories=[
        "классика", "оригинальный", "спешал", "холодный", "не слипнется"
    ]),
    Category(name="Не кофе", subcategories=[
        "какао", "лимонад", "матча", "молочный коктейль", "полезно", "бабл-ти", "смузи"
    ]),
    Category(name="Чай", subcategories=[
        "классический чай", "айс чай"
    ]),
    Category(name="Завтраки", subcategories=[
        "каша", "сырники", "вафли"
    ]),
    Category(name="Десерты", subcategories=[
        "торты и пирожные", "выпечка", "макарунс"
    ]),
    Category(name="Еда", subcategories=[
        "обеды", "пицца", "сэндвичи", "роллы"
    ]),
    Category(name="Кофе и чай на развес", subcategories=[
        "кофе", "чай"
    ])
]

# ТОВАРЫ С РАЗМЕРАМИ И ДОПОЛНЕНИЯМИ
# ВНИМАНИЕ: Это тестовые данные. Нужно заменить на реальные цены!
PRODUCTS = [
    # Кофе - классика (с размерами S/M/L и дополнениями)
    {
        "id": 1,
        "name": "Латте",
        "category": "Кофе",
        "subcategory": "классика",
        "description": "Классический латте на основе эспрессо и молока",
        "has_sizes": True,
        "sizes": [
            {"size": "S", "price": 250, "volume": "300 мл"},
            {"size": "M", "price": 300, "volume": "400 мл"},
            {"size": "L", "price": 350, "volume": "500 мл"}
        ],
        "has_addons": True,
        "addons": COMMON_ADDONS,
        "image_id": 1
    },
    {
        "id": 2,
        "name": "Капучино",
        "category": "Кофе",
        "subcategory": "классика",
        "description": "Итальянский капучино с пенкой",
        "has_sizes": True,
        "sizes": [
            {"size": "S", "price": 230, "volume": "300 мл"},
            {"size": "M", "price": 280, "volume": "400 мл"},
            {"size": "L", "price": 330, "volume": "500 мл"}
        ],
        "has_addons": True,
        "addons": COMMON_ADDONS,
        "image_id": 2
    },
    {
        "id": 3,
        "name": "Американо",
        "category": "Кофе",
        "subcategory": "классика",
        "description": "Черный кофе с водой",
        "has_sizes": True,
        "sizes": [
            {"size": "S", "price": 150, "volume": "300 мл"},
            {"size": "M", "price": 200, "volume": "400 мл"},
            {"size": "L", "price": 250, "volume": "500 мл"}
        ],
        "has_addons": True,
        "addons": COMMON_ADDONS,
        "image_id": 3
    },
    {
        "id": 4,
        "name": "Эспрессо",
        "category": "Кофе",
        "subcategory": "классика",
        "description": "Классический эспрессо",
        "has_sizes": False,
        "default_price": 180,
        "has_addons": True,
        "addons": COMMON_ADDONS,
        "image_id": 4
    },
    {
        "id": 5,
        "name": "Раф",
        "category": "Кофе",
        "subcategory": "классика",
        "description": "Кофе с ванильным сиропом и сливками",
        "has_sizes": True,
        "sizes": [
            {"size": "S", "price": 300, "volume": "300 мл"},
            {"size": "M", "price": 350, "volume": "400 мл"},
            {"size": "L", "price": 400, "volume": "500 мл"}
        ],
        "has_addons": True,
        "addons": [a for a in COMMON_ADDONS if a["id"] not in [3]],  # Без ванильного сиропа (уже есть)
        "image_id": 5
    },
    {
        "id": 6,
        "name": "Флэт уайт",
        "category": "Кофе",
        "subcategory": "классика",
        "description": "Кофе с тонкой молочной пенкой",
        "has_sizes": True,
        "sizes": [
            {"size": "S", "price": 270, "volume": "300 мл"},
            {"size": "M", "price": 320, "volume": "400 мл"},
            {"size": "L", "price": 370, "volume": "500 мл"}
        ],
        "has_addons": True,
        "addons": COMMON_ADDONS,
        "image_id": 6
    },
    
    # Кофе - оригинальный
    {
        "id": 7,
        "name": "Кокосовый латте",
        "category": "Кофе",
        "subcategory": "оригинальный",
        "description": "Латте с кокосовым сиропом",
        "has_sizes": True,
        "sizes": [
            {"size": "S", "price": 300, "volume": "300 мл"},
            {"size": "M", "price": 350, "volume": "400 мл"},
            {"size": "L", "price": 400, "volume": "500 мл"}
        ],
        "has_addons": True,
        "addons": [a for a in COMMON_ADDONS if a["id"] not in [5]],  # Без кокосового молока (уже есть)
        "image_id": 7
    },
    {
        "id": 8,
        "name": "Сладкий латте",
        "category": "Кофе",
        "subcategory": "оригинальный",
        "description": "Латте с карамельным сиропом",
        "has_sizes": True,
        "sizes": [
            {"size": "S", "price": 280, "volume": "300 мл"},
            {"size": "M", "price": 330, "volume": "400 мл"},
            {"size": "L", "price": 380, "volume": "500 мл"}
        ],
        "has_addons": True,
        "addons": [a for a in COMMON_ADDONS if a["id"] not in [4]],  # Без карамельного сиропа (уже есть)
        "image_id": 8
    },
    
    # Для теста - несколько товаров без размеров
    {
        "id": 21,
        "name": "Классическое какао",
        "category": "Не кофе",
        "subcategory": "какао",
        "description": "Традиционное какао на молоке",
        "has_sizes": False,
        "default_price": 280,
        "has_addons": True,
        "addons": COMMON_ADDONS,
        "image_id": 21
    },
    {
        "id": 22,
        "name": "Лимонад",
        "category": "Не кофе",
        "subcategory": "лимонад",
        "description": "Домашний лимонад",
        "has_sizes": False,
        "default_price": 250,
        "has_addons": False,
        "addons": [],
        "image_id": 22
    },
    # ... (остальные товары добавятся позже с реальными ценами)
]

# Для совместимости со старым фронтендом - упрощенный список
def get_simple_products():
    simple_list = []
    for product in PRODUCTS:
        if product["has_sizes"]:
            # Берем средний размер как базовую цену
            if product["sizes"]:
                mid_index = len(product["sizes"]) // 2
                base_price = product["sizes"][mid_index]["price"]
            else:
                base_price = 0
        else:
            base_price = product.get("default_price", 0)
        
        simple_list.append({
            "id": product["id"],
            "name": product["name"],
            "price": base_price,
            "category": product["category"],
            "subcategory": product["subcategory"],
            "description": product["description"],
            "has_sizes": product["has_sizes"],
            "has_addons": product.get("has_addons", False),
            "image_id": product.get("image_id", product["id"])
        })
    return simple_list

# Система заказов
ORDERS_FILE = "/app/orders.json"
order_counter = 1000

def load_orders():
    if os.path.exists(ORDERS_FILE):
        with open(ORDERS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"orders": [], "counter": 1000}

def save_orders(data):
    with open(ORDERS_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

# API Endpoints
@app.get("/")
def read_root():
    return {"message": "Metodika Coffee API", "status": "online"}

@app.get("/api/config")
def get_config():
    return COFFEE_SHOP_CONFIG

@app.get("/api/products")
def get_products():
    return get_simple_products()

@app.get("/api/products/{product_id}")
def get_product(product_id: int):
    for product in PRODUCTS:
        if product["id"] == product_id:
            return product
    raise HTTPException(status_code=404, detail="Product not found")

@app.get("/api/products-detailed")
def get_products_detailed():
    return PRODUCTS

@app.get("/api/addons")
def get_addons():
    return COMMON_ADDONS

@app.get("/api/categories")
def get_categories():
    return CATEGORIES

@app.post("/api/orders")
def create_order(order: Order):
    global order_counter
    
    data = load_orders()
    order_counter = data["counter"] + 1
    
    order_dict = order.dict()
    order_dict["id"] = order_counter
    order_dict["timestamp"] = datetime.now().isoformat()
    order_dict["status"] = "pending"
    
    data["orders"].append(order_dict)
    data["counter"] = order_counter
    save_orders(data)
    
    return {"order_id": order_counter, "status": "created"}

@app.get("/api/orders/{order_id}")
def get_order(order_id: int):
    data = load_orders()
    for order in data["orders"]:
        if order["id"] == order_id:
            return order
    raise HTTPException(status_code=404, detail="Order not found")

@app.get("/api/admin/orders")
def get_all_orders(secret_key: str):
    if secret_key != "metodika2024":
        raise HTTPException(status_code=403, detail="Forbidden")
    
    data = load_orders()
    return data["orders"]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
