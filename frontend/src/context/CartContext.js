import React, { createContext, useState, useEffect, useContext } from 'react';

// РЎРѕР·РґР°РµРј РєРѕРЅС‚РµРєСЃС‚ Рё СЌРєСЃРїРѕСЂС‚РёСЂСѓРµРј РµРіРѕ
export const CartContext = createContext();

// РҐСѓРє РґР»СЏ РёСЃРїРѕР»СЊР·РѕРІР°РЅРёСЏ РєРѕРЅС‚РµРєСЃС‚Р°
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

// РџСЂРѕРІР°Р№РґРµСЂ РєРѕРЅС‚РµРєСЃС‚Р°
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Р—Р°РіСЂСѓР·РєР° РєРѕСЂР·РёРЅС‹ РёР· localStorage РїСЂРё РјРѕРЅС‚РёСЂРѕРІР°РЅРёРё
  useEffect(() => {
    const savedCart = localStorage.getItem('metodikaCart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          setCartItems(parsedCart);
        }
      } catch (error) {
        console.error('РћС€РёР±РєР° Р·Р°РіСЂСѓР·РєРё РєРѕСЂР·РёРЅС‹:', error);
      }
    }
  }, []);

  // РЎРѕС…СЂР°РЅРµРЅРёРµ РєРѕСЂР·РёРЅС‹ РІ localStorage РїСЂРё РёР·РјРµРЅРµРЅРёРё
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem('metodikaCart', JSON.stringify(cartItems));
    } else {
      localStorage.removeItem('metodikaCart');
    }
  }, [cartItems]);

  // Р”РѕР±Р°РІР»РµРЅРёРµ С‚РѕРІР°СЂР° РІ РєРѕСЂР·РёРЅСѓ
  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingIndex = prevItems.findIndex(item =>
        item.id === product.id &&
        item.size === product.size &&
        JSON.stringify(item.addons) === JSON.stringify(product.addons)
      );

      if (existingIndex >= 0) {
        const newItems = [...prevItems];
        newItems[existingIndex].quantity = (newItems[existingIndex].quantity || 1) + quantity;
        return newItems;
      } else {
        return [...prevItems, { ...product, quantity }];
      }
    });
  };

  // РЈРґР°Р»РµРЅРёРµ С‚РѕРІР°СЂР° РёР· РєРѕСЂР·РёРЅС‹
  const removeFromCart = (product) => {
    setCartItems(prevItems =>
      prevItems.filter(item => !(
        item.id === product.id &&
        item.size === product.size &&
        JSON.stringify(item.addons) === JSON.stringify(product.addons)
      ))
    );
  };

  // РћР±РЅРѕРІР»РµРЅРёРµ РєРѕР»РёС‡РµСЃС‚РІР° С‚РѕРІР°СЂР°
  const updateQuantity = (product, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(product);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === product.id &&
        item.size === product.size &&
        JSON.stringify(item.addons) === JSON.stringify(product.addons)
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // РћС‡РёСЃС‚РєР° РєРѕСЂР·РёРЅС‹
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('metodikaCart');
  };

  // РџРµСЂРµРєР»СЋС‡РµРЅРёРµ РІРёРґРёРјРѕСЃС‚Рё РєРѕСЂР·РёРЅС‹
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  // Р Р°СЃС‡РµС‚ РѕР±С‰РµР№ СЃСѓРјРјС‹
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price || 0) * (item.quantity || 1);
    }, 0);
  };

  // Р Р°СЃС‡РµС‚ РѕР±С‰РµРіРѕ РєРѕР»РёС‡РµСЃС‚РІР° С‚РѕРІР°СЂРѕРІ
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    isCartOpen,
    toggleCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
