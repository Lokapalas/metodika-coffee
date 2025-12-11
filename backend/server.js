const express = require('express');
const app = express();

app.use(express.json());

// Функция отправки уведомления в Telegram
const sendTelegramNotification = async (order) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  
  if (!token || !chatId) {
    console.log('⚠️ Telegram не настроен. Пропускаем уведомление.');
    return;
  }
  
  // Форматируем сообщение
  const itemsText = order.items && order.items.length > 0 
    ? order.items.map(item => 
        `• ${item.name} x${item.quantity} - ${item.price * item.quantity}₽`
      ).join('\n')
    : 'Детали заказа не указаны';
  
  const message = `🆕 *НОВЫЙ ЗАКАЗ #${Date.now()}*\n\n` +
    `👤 *Клиент:* ${order.name}\n` +
    `📞 *Телефон:* \`${order.phone}\`\n` +
    (order.address ? `📍 *Адрес:* ${order.address}\n` : '') +
    (order.comments ? `📝 *Комментарий:* ${order.comments}\n` : '') +
    `\n🛒 *Состав заказа:*\n${itemsText}\n\n` +
    `💰 *Итого:* ${order.total || 0}₽\n` +
    `⏰ *Время:* ${new Date().toLocaleString('ru-RU')}\n` +
    `🌐 *Сайт:* ${process.env.WEB_APP_URL || 'metodika-coffee.ru'}`;
  
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown'
      })
    });
    
    const result = await response.json();
    console.log('📤 Уведомление отправлено в Telegram:', result.ok ? '✅' : '❌');
    
    if (!result.ok) {
      console.error('Ошибка Telegram:', result);
    }
  } catch (error) {
    console.error('❌ Ошибка отправки в Telegram:', error.message);
  }
};

// API для получения заказов
app.post('/api/orders', async (req, res) => {
  try {
    const order = req.body;
    
    // Логируем заказ
    console.log('📦 Получен новый заказ:');
    console.log('   Имя:', order.name);
    console.log('   Телефон:', order.phone);
    console.log('   Сумма:', order.total || 0, '₽');
    console.log('   Время:', new Date().toISOString());
    
    // Отправляем уведомление в Telegram (асинхронно, не ждем завершения)
    sendTelegramNotification(order).catch(err => 
      console.error('Ошибка уведомления:', err.message)
    );
    
    // Сохраняем заказ в файл или БД (опционально)
    const fs = require('fs');
    fs.appendFileSync('orders.log', 
      `${new Date().toISOString()} | ${order.name} | ${order.phone} | ${order.total || 0}₽ | ${order.address || 'Нет'}\n`
    );
    
    // Отвечаем клиенту
    res.json({ 
      success: true, 
      orderId: Date.now(),
      message: 'Заказ принят! Ожидайте звонка для подтверждения.',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Ошибка обработки заказа:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Внутренняя ошибка сервера' 
    });
  }
});

// Простой тестовый endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Методика Кофе API работает',
    telegram: process.env.TELEGRAM_BOT_TOKEN ? '✅ настроен' : '❌ не настроен',
    chatId: process.env.TELEGRAM_CHAT_ID || 'не указан'
  });
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Backend запущен на порту ${PORT}`);
  console.log(`🌐 API доступен: http://0.0.0.0:${PORT}`);
  console.log(`🤖 Telegram бот: ${process.env.TELEGRAM_BOT_TOKEN ? '✅ настроен' : '❌ не настроен'}`);
  console.log(`👤 Chat ID: ${process.env.TELEGRAM_CHAT_ID || 'не указан'}`);
});
