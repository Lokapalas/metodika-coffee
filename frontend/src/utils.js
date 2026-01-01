// Безопасные утилиты для работы с localStorage

/**
 * Безопасное получение данных из localStorage
 * @param {string} key - Ключ
 * @param {any} defaultValue - Значение по умолчанию
 * @returns {any}
 */
export const safeGetLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    
    return JSON.parse(item);
  } catch (error) {
    console.error(`Ошибка чтения из localStorage (${key}):`, error);
    return defaultValue;
  }
};

/**
 * Безопасное сохранение в localStorage
 * @param {string} key - Ключ
 * @param {any} value - Значение
 * @returns {boolean} - Успешно ли сохранено
 */
export const safeSetLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Ошибка сохранения в localStorage (${key}):`, error);
    return false;
  }
};

/**
 * Безопасное удаление из localStorage
 * @param {string} key - Ключ
 */
export const safeRemoveLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Ошибка удаления из localStorage (${key}):`, error);
  }
};

/**
 * Утилита для работы с корзиной
 */
export const cartUtils = {
  getCart: () => safeGetLocalStorage('cart', []),
  
  saveCart: (cart) => safeSetLocalStorage('cart', cart),
  
  addToCart: (product, quantity = 1) => {
    const cart = safeGetLocalStorage('cart', []);
    const existingIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingIndex >= 0) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }
    
    safeSetLocalStorage('cart', cart);
    return cart;
  },
  
  removeFromCart: (productId) => {
    const cart = safeGetLocalStorage('cart', []);
    const filteredCart = cart.filter(item => item.id !== productId);
    safeSetLocalStorage('cart', filteredCart);
    return filteredCart;
  },
  
  updateQuantity: (productId, quantity) => {
    const cart = safeGetLocalStorage('cart', []);
    const updatedCart = cart.map(item => 
      item.id === productId ? { ...item, quantity } : item
    );
    safeSetLocalStorage('cart', updatedCart);
    return updatedCart;
  },
  
  clearCart: () => {
    safeRemoveLocalStorage('cart');
    return [];
  }
};

/**
 * Утилита для уведомлений
 */
export const showNotification = (message, type = 'success') => {
  console.log(`[${type.toUpperCase()}] ${message}`);
  return { message, type, timestamp: new Date().toISOString() };
};
