const express = require('express');
const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Разрешаем CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Функция отправки в Telegram (исправленная для node-fetch@2)
async function sendTelegramNotification(orderData) {
    const TELEGRAM_BOT_TOKEN = '8035891020:AAHi0dl82tdgLW5pAgW6nOAr0glQnIb0_mM';
    const TELEGRAM_CHAT_ID = '472934740';
    
    const orderId = orderData.orderId || `ORD-${Date.now()}`;
    const userName = orderData.userName || 'Не указано';
    const userPhone = orderData.userPhone || 'Не указано';
    const totalAmount = orderData.totalAmount || 0;
    const items = orderData.items || [];
    
    const itemsText = items.map(item => 
        `• ${item.name} - ${item.price}₽ x${item.quantity}`
    ).join('\n');
    
    const message = `
🚀 <b>НОВЫЙ ЗАКАЗ КОФЕ!</b>

📦 <b>ID заказа:</b> ${orderId}
👤 <b>Клиент:</b> ${userName}
📞 <b>Телефон:</b> ${userPhone}
💰 <b>Сумма:</b> ${totalAmount}₽

📋 <b>Состав заказа:</b>
${itemsText || '• Не указано'}

⏰ <b>Время:</b> ${new Date().toLocaleString('ru-RU')}
    `.trim();
    
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const payload = {
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML'
    };
    
    try {
        // Используем node-fetch версии 2
        const fetch = require('node-fetch');
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });
        
        const data = await response.json();
        
        if (data.ok) {
            console.log('✅ Уведомление отправлено в Telegram');
            return true;
        } else {
            console.log('❌ Ошибка Telegram:', data.description);
            return false;
        }
    } catch (error) {
        console.log('❌ Ошибка отправки в Telegram:', error.message);
        return false;
    }
}

// Проверка подписки (упрощенная)
app.post('/api/telegram/check-subscription', (req, res) => {
    res.json({
        success: true,
        subscribed: true,
        message: 'Проверка пройдена (тестовый режим)'
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'Metodika Coffee Orders API',
        timestamp: new Date().toISOString(),
        port: PORT
    });
});

// Тестовый endpoint
app.get('/api/test', (req, res) => {
    res.json({
        status: 'success',
        service: 'Metodika Coffee Orders API',
        timestamp: new Date().toISOString(),
        port: PORT,
        endpoints: [
            'GET  /api/test',
            'POST /api/orders',
            'GET  /api/health',
            'POST /api/telegram/check-subscription'
        ]
    });
});

// Основной endpoint для заказов
app.post('/api/orders', async (req, res) => {
    try {
        const orderData = req.body;
        console.log('📦 Получен новый заказ:', JSON.stringify(orderData, null, 2));
        
        // Генерируем ID заказа
        const orderId = `ORD-${Date.now()}`;
        
        // Отправляем уведомление в Telegram
        const telegramSent = await sendTelegramNotification({
            ...orderData,
            orderId
        });
        
        // Ответ клиенту
        res.json({
            success: true,
            orderId: orderId,
            message: 'Заказ принят! С вами свяжутся для подтверждения.',
            telegramSent: telegramSent,
            timestamp: new Date().toISOString()
        });
        
        // Логируем в файл (опционально)
        const fs = require('fs');
        const logEntry = {
            timestamp: new Date().toISOString(),
            orderId,
            ...orderData,
            telegramSent
        };
        
        fs.appendFileSync('/opt/metodika-coffee/backend/orders.log', 
            JSON.stringify(logEntry) + '\n');
            
    } catch (error) {
        console.error('❌ Ошибка обработки заказа:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка обработки заказа',
            error: error.message
        });
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`🚀 Сервер заказов запущен на порту ${PORT}`);
    console.log(`📅 ${new Date().toLocaleString('ru-RU')}`);
    console.log(`🔗 Тестовый endpoint: http://localhost:${PORT}/api/test`);
});
