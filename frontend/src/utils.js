// Р‘РµР·РѕРїР°СЃРЅС‹Рµ СѓС‚РёР»РёС‚С‹ РґР»СЏ СЂР°Р±РѕС‚С‹ СЃ localStorage

/**
 * Р‘РµР·РѕРїР°СЃРЅРѕРµ РїРѕР»СѓС‡РµРЅРёРµ РґР°РЅРЅС‹С… РёР· localStorage
 * @param {string} key - РљР»СЋС‡
 * @param {any} defaultValue - Р—РЅР°С‡РµРЅРёРµ РїРѕ СѓРјРѕР»С‡Р°РЅРёСЋ
 * @returns {any}
 */
export const safeGetLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    
    return JSON.parse(item);
  } catch (error) {
    console.error(`РћС€РёР±РєР° С‡С‚РµРЅРёСЏ РёР· localStorage (${key}):`, error);
    return defaultValue;
  }
};

/**
 * Р‘РµР·РѕРїР°СЃРЅРѕРµ СЃРѕС…СЂР°РЅРµРЅРёРµ РІ localStorage
 * @param {string} key - РљР»СЋС‡
 * @param {any} value - Р—РЅР°С‡РµРЅРёРµ
 * @returns {boolean} - РЈСЃРїРµС€РЅРѕ Р»Рё СЃРѕС…СЂР°РЅРµРЅРѕ
 */
export const safeSetLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`РћС€РёР±РєР° СЃРѕС…СЂР°РЅРµРЅРёСЏ РІ localStorage (${key}):`, error);
    return false;
  }
};

/**
 * Р‘РµР·РѕРїР°СЃРЅРѕРµ СѓРґР°Р»РµРЅРёРµ РёР· localStorage
 * @param {string} key - РљР»СЋС‡
 */
export const safeRemoveLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`РћС€РёР±РєР° СѓРґР°Р»РµРЅРёСЏ РёР· localStorage (${key}):`, error);
  }
};

/**
 * РЈС‚РёР»РёС‚Р° РґР»СЏ СЂР°Р±РѕС‚С‹ СЃ РєРѕСЂР·РёРЅРѕР№
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
 * РЈС‚РёР»РёС‚Р° РґР»СЏ СѓРІРµРґРѕРјР»РµРЅРёР№
 */
export const showNotification = (message, type = 'success') => {
  console.log(`[${type.toUpperCase()}] ${message}`);
  return { message, type, timestamp: new Date().toISOString() };
};
