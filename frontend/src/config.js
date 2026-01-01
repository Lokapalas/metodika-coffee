// Конфигурация API для продакшена
const API_CONFIG = {
    API_URL: '/api',  // Относительный путь через nginx прокси
    TIMEOUT: 30000,
    MODE: 'production'
};

export default API_CONFIG;
