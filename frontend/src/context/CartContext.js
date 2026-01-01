import React, { createContext, useState, useEffect, useContext } from 'react';

// Создаем контекст и экспортируем его
export const CartContext = createContext();

// Хук для использования контекста
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

// Провайдер контекста
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Загрузка корзины из localStorage при монтировании
  useEffect(() => {
    const savedCart = localStorage.getItem('metodikaCart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          setCartItems(parsedCart);
        }
      } catch (error) {
        console.error('Ошибка загрузки корзины:', error);
      }
    }
  }, []);

  // Сохранение корзины в localStorage при изменении
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem('metodikaCart', JSON.stringify(cartItems));
    } else {
      localStorage.removeItem('metodikaCart');
    }
  }, [cartItems]);

  // Добавление товара в корзину
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

  // Удаление товара из корзины
  const removeFromCart = (product) => {
    setCartItems(prevItems =>
      prevItems.filter(item => !(
        item.id === product.id &&
        item.size === product.size &&
        JSON.stringify(item.addons) === JSON.stringify(product.addons)
      ))
    );
  };

  // Обновление количества товара
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

  // Очистка корзины
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('metodikaCart');
  };

  // Переключение видимости корзины
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  // Расчет общей суммы
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price || 0) * (item.quantity || 1);
    }, 0);
  };

  // Расчет общего количества товаров
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
