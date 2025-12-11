import React, { createContext, useState, useEffect, useContext } from 'react';
import { cartUtils } from './utils';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [notification, setNotification] = useState(null);

  // Загрузка корзины из localStorage при монтировании
  useEffect(() => {
    const savedCart = cartUtils.getCart();
    setCart(savedCart);
  }, []);

  // Сохранение корзины в localStorage при изменении
  useEffect(() => {
    if (cart.length > 0) {
      cartUtils.saveCart(cart);
    } else {
      cartUtils.clearCart();
    }
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => 
        item.id === product.id && 
        item.size === product.size && 
        JSON.stringify(item.addons) === JSON.stringify(product.addons)
      );
      
      let newCart;
      
      if (existingIndex >= 0) {
        newCart = [...prevCart];
        newCart[existingIndex].quantity += quantity;
      } else {
        newCart = [...prevCart, { ...product, quantity }];
      }
      
      // Показываем уведомление
      setNotification({
        message: `${product.name} добавлен в корзину`,
        type: 'success'
      });
      
      // Автоматически скрываем уведомление через 3 секунды
      setTimeout(() => setNotification(null), 3000);
      
      return newCart;
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => {
      const newCart = prevCart.filter(item => item.id !== productId);
      
      setNotification({
        message: 'Товар удален из корзины',
        type: 'info'
      });
      setTimeout(() => setNotification(null), 3000);
      
      return newCart;
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    cartUtils.clearCart();
    
    setNotification({
      message: 'Корзина очищена',
      type: 'info'
    });
    setTimeout(() => setNotification(null), 3000);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    notification
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
