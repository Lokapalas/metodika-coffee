import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

const getInitialCart = () => {
  try {
    const savedCart = localStorage.getItem('metodikaCoffeeCart');
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error('Ошибка при загрузке корзины:', error);
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(getInitialCart);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Сохраняем корзину в localStorage
  useEffect(() => {
    localStorage.setItem('metodikaCoffeeCart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Добавить товар в корзину (с поддержкой кастомизации)
  const addToCart = (product) => {
    setCartItems(prevItems => {
      // Для кастомизированных товаров используем уникальный ID
      if (product.customizations) {
        return [...prevItems, product];
      }
      
      // Для обычных товаров проверяем, есть ли уже в корзине
      const existingItem = prevItems.find(item => 
        item.id === product.id && !item.customizations
      );
      
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id && !item.customizations
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  // Удалить товар из корзины
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  // Изменить количество товара
  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Очистить корзину
  const clearCart = () => {
    setCartItems([]);
  };

  // Рассчитать общую сумму
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      if (item.totalPrice) {
        return total + item.totalPrice;
      }
      return total + (item.price * (item.quantity || 1));
    }, 0);
  };

  // Получить общее количество товаров
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.quantity || 1);
    }, 0);
  };

  // Открыть/закрыть корзину
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
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
    setIsCartOpen,
    toggleCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart должен использоваться внутри CartProvider');
  }
  return context;
};
