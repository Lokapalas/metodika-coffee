// Исправленная версия функции отправки в Telegram для CommonJS
const fixTelegramSend = async (message) => {
    const TELEGRAM_BOT_TOKEN = '8035891020:AAHi0dl82tdgLW5pAgW6nOAr0glQnIb0_mM';
    const TELEGRAM_CHAT_ID = '472934740';
    
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const payload = {
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML'
    };
    
    try {
        // Используем старый синтаксис для node-fetch@2
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
};

// Тестируем
fixTelegramSend('🔔 ТЕСТ: Система Методика Кофе работает! Проверка уведомлений.')
    .then(result => console.log('Результат:', result))
    .catch(err => console.error('Ошибка:', err));
