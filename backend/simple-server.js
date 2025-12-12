const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Данные товаров
const products = [
  {
    "id": 1,
    "name": "Эспрессо",
    "description": "Классический крепкий кофе, приготовленный под высоким давлением",
    "price": 180,
    "category": "Кофе",
    "image": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&h=300&fit=crop",
    "inStock": true,
    "popular": true
  },
  // ... все остальные товары из products.json
];

// API эндпоинты
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Товар не найден' });
  }
});

app.post('/api/order', (req, res) => {
  console.log('Новый заказ:', req.body);
  res.json({ 
    success: true, 
    message: 'Заказ принят в обработку',
    orderId: Date.now()
  });
});

// Обслуживаем React приложение
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
  console.log(`📡 API доступно по http://localhost:${PORT}/api/products`);
});
