const express = require('express');
const https = require('https'); // Используем нативный HTTPS вместо node-fetch
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

// Функция отправки в Telegram через нативный HTTPS
function sendTelegramNotification(orderData) {
    return new Promise((resolve) => {
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
        
        const postData = JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'HTML'
        });
        
        const options = {
            hostname: 'api.telegram.org',
            port: 443,
            path: `/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };
        
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    if (result.ok) {
                        console.log('✅ Уведомление отправлено в Telegram');
                        resolve(true);
                    } else {
                        console.log('❌ Ошибка Telegram:', result.description);
                        resolve(false);
                    }
                } catch (e) {
                    console.log('❌ Ошибка парсинга ответа Telegram');
                    resolve(false);
                }
            });
        });
        
        req.on('error', (error) => {
            console.log('❌ Ошибка запроса к Telegram:', error.message);
            resolve(false);
        });
        
        req.write(postData);
        req.end();
    });
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
        
        // Логируем в файл
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
    console.log(`==================================================`);
    console.log(`🚀 СИСТЕМА МЕТОДИКА КОФЕ ЗАПУЩЕНА!`);
    console.log(`📅 ${new Date().toLocaleString('ru-RU')}`);
    console.log(`🌐 API: http://localhost:${PORT}/api/test`);
    console.log(`🤖 Telegram: @Metodika_CoffeeBot`);
    console.log(`🌍 Frontend: https://metodika-coffee.ru`);
    console.log(`==================================================`);
});
