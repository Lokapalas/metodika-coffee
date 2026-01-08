const express = require('express');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Telegram конфигурация
const TELEGRAM_BOT_TOKEN = '8035891020:AAHi0dl82tdgLW5pAgW6nOAr0glQnIb0_mM';
const TELEGRAM_CHAT_ID = '472934740';
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

// Константы
const ORDERS_LOG = path.join(__dirname, 'orders.log');

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Функция отправки уведомления в Telegram
async function sendTelegramNotification(orderDetails) {
    const formatPrice = (price) => {
        const numPrice = Number(price);
        return isNaN(numPrice) ? '0' : numPrice.toString();
    };

    const formatAdditives = (additives) => {
        if (!additives || additives.length === 0) return 'Нет';
        return additives.join(', ');
    };

    const itemsText = orderDetails.items.map(item => {
        let itemText = `  • ${item.name}`;
        if (item.size && item.size !== 'M') {
            itemText += ` (${item.size})`;
        }
        const itemPrice = formatPrice(item.price);
        const itemTotal = formatPrice(item.total);
        itemText += ` x${item.quantity} - ${itemPrice}₽ (${itemTotal}₽)`;
        
        if (item.additives && item.additives.length > 0) {
            itemText += `\n    Добавки: ${formatAdditives(item.additives)}`;
        }
        
        return itemText;
    }).join('\n');

    const totalAmount = formatPrice(orderDetails.total);
    
    const message = `
🔥 *НОВЫЙ ЗАКАЗ #${orderDetails.orderId}*

*Источник:* ${orderDetails.source === 'telegram' ? 'Telegram Bot 📱' : 'Веб-сайт 🌐'}

👤 *Клиент:* ${orderDetails.customer.name || 'Не указано'}
📞 *Телефон:* \`${orderDetails.customer.phone}\`
📍 *Адрес:* ${orderDetails.customer.address}
💰 *Способ оплаты:* ${orderDetails.paymentMethod === 'card' ? 'Карта 💳' : 'Наличные 💵'}
📝 *Комментарий:* ${orderDetails.comments || 'Нет'}

🛒 *Заказ:*
${itemsText}

💎 *Итого:* ${totalAmount}₽

⏰ *Время:* ${orderDetails.timestamp}
    `.trim();

    const payload = {
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
        disable_web_page_preview: true
    };

    return new Promise((resolve, reject) => {
        const req = https.request(TELEGRAM_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    console.log('Telegram response:', parsed.ok ? '✅ Success' : '❌ Error');
                    resolve(parsed);
                } catch (error) {
                    console.error('Error parsing Telegram response:', error);
                    resolve({ ok: false, error: error.message });
                }
            });
        });

        req.on('error', (error) => {
            console.error('Telegram request error:', error);
            reject(error);
        });
        
        req.setTimeout(10000, () => {
            req.destroy();
            reject(new Error('Telegram request timeout'));
        });

        req.write(JSON.stringify(payload));
        req.end();
    });
}

// Тестовый endpoint
app.get('/api/test', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Методика Кофе API работает',
        timestamp: new Date().toISOString(),
        version: '2.0.0'
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy',
        service: 'metodika-coffee-api',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// Основной endpoint для приема заказов
app.post('/api/orders', async (req, res) => {
    try {
        const orderData = req.body;
        
        console.log('Получен заказ от:', orderData.source || 'unknown');
        
        // Валидация обязательных полей
        if (!orderData.customer || !orderData.customer.phone) {
            return res.status(400).json({ 
                success: false, 
                message: 'Не указан телефон клиента' 
            });
        }

        // Валидация корзины
        if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Корзина пуста' 
            });
        }

        const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        
        // Форматируем итоговую сумму
        const totalAmount = Number(orderData.total) || 0;
        
        // Формируем детали заказа с правильными ценами
        const orderDetails = {
            orderId,
            timestamp: new Date().toLocaleString('ru-RU', { 
                timeZone: 'Europe/Moscow',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }),
            source: orderData.source || 'website',
            customer: {
                name: orderData.customer.name?.trim() || 'Не указано',
                phone: orderData.customer.phone.trim(),
                address: orderData.customer.address?.trim() || 'Самовывоз'
            },
            items: orderData.items.map(item => {
                const price = Number(item.price) || 0;
                const quantity = Number(item.quantity) || 1;
                const total = price * quantity;
                
                return {
                    name: item.name || 'Без названия',
                    price: price,
                    quantity: quantity,
                    size: item.size || 'M',
                    additives: item.additives || [],
                    total: total
                };
            }),
            total: totalAmount,
            paymentMethod: orderData.paymentMethod || 'cash',
            comments: orderData.comments?.trim() || ''
        };

        // Логируем заказ
        const logEntry = `
=== НОВЫЙ ЗАКАЗ ${orderId} ===
Время: ${orderDetails.timestamp}
Источник: ${orderDetails.source === 'telegram' ? 'Telegram Bot' : 'Веб-сайт'}
Клиент: ${orderDetails.customer.name}
Телефон: ${orderDetails.customer.phone}
Адрес: ${orderDetails.customer.address}
Способ оплаты: ${orderDetails.paymentMethod === 'card' ? 'Карта' : 'Наличные'}
Комментарий: ${orderDetails.comments}

Товары:
${orderDetails.items.map(item => {
    let itemText = `  • ${item.name}`;
    if (item.size && item.size !== 'M') itemText += ` (${item.size})`;
    itemText += ` x${item.quantity} - ${item.price}₽ (${item.total}₽)`;
    if (item.additives.length > 0) {
        itemText += `\n    Добавки: ${item.additives.join(', ')}`;
    }
    return itemText;
}).join('\n')}

ИТОГО: ${orderDetails.total}₽
========================================
`;

        fs.appendFileSync(ORDERS_LOG, logEntry, 'utf8');
        console.log(`📝 Заказ ${orderId} записан в лог`);

        // Отправляем в Telegram
        try {
            await sendTelegramNotification(orderDetails);
            console.log(`✅ Заказ ${orderId} успешно отправлен в Telegram`);
        } catch (telegramError) {
            console.error('❌ Ошибка отправки в Telegram:', telegramError.message);
            // Не прерываем выполнение если ошибка Telegram
        }

        res.json({ 
            success: true, 
            orderId,
            message: 'Заказ успешно оформлен!',
            total: orderDetails.total
        });
        
    } catch (error) {
        console.error('❌ Ошибка обработки заказа:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Ошибка сервера при обработке заказа',
            error: error.message 
        });
    }
});

// Старт сервера
app.listen(PORT, () => {
    console.log(`🚀 Методика Кофе API запущен на порту ${PORT}`);
    console.log(`📝 Логи заказов: ${ORDERS_LOG}`);
    console.log(`🤖 Telegram бот: @Metodika_CoffeeBot`);
    console.log(`👤 Chat ID администратора: ${TELEGRAM_CHAT_ID}`);
    console.log(`🌐 API доступен по: http://localhost:${PORT}/api/test`);
});

process.on('uncaughtException', (err) => {
    console.error('❌ Необработанная ошибка:', err);
});
