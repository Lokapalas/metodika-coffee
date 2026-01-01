import React from 'react';
import { useCart } from '../context/CartContext';
import './NavBar.css';

function Cart() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    getTotalItems,
    isCartOpen,
    toggleCart,
    clearCart // Проверяем есть ли функция очистки корзины
  } = useCart();

  // Форматирование цены
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  // Обработчик оформления заказа
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Корзина пуста! Добавьте товары перед оформлением заказа.');
      return;
    }

    // 1. Показываем подтверждение
    const confirmOrder = window.confirm(
      `Оформить заказ на ${formatPrice(getTotalPrice())} ₽?\n\n` +
      `Количество товаров: ${getTotalItems()}\n` +
      'Наш менеджер свяжется с вами для подтверждения.'
    );

    if (confirmOrder) {
      // 2. Собираем информацию о заказе
      const orderDetails = {
        items: cartItems.map(item => ({
          name: item.name,
          quantity: item.quantity || 1,
          price: item.price || item.totalPrice,
          customizations: item.customizations || {}
        })),
        total: getTotalPrice(),
        timestamp: new Date().toISOString(),
        orderId: 'ORDER-' + Date.now()
      };

      // 3. Логируем заказ в консоль (в реальном приложении здесь API запрос)
      console.log('🎯 ЗАКАЗ ОФОРМЛЕН:', orderDetails);
      console.log('📦 Товары:', cartItems);
      console.log('💰 Итого:', getTotalPrice(), '₽');

      // 4. Показываем сообщение об успехе
      alert(
        `Заказ оформлен!\n\n` +
        `Номер заказа: ${orderDetails.orderId}\n` +
        `Сумма: ${formatPrice(getTotalPrice())} ₽\n` +
        `Товаров: ${getTotalItems()}\n\n` +
        'Спасибо за заказ! Наш менеджер свяжется с вами в ближайшее время.'
      );

      // 5. Очищаем корзину (если есть функция clearCart)
      if (clearCart && typeof clearCart === 'function') {
        clearCart();
      } else {
        // Альтернатива: удаляем все товары по одному
        cartItems.forEach(item => {
          removeFromCart(item.id);
        });
      }

      // 6. Закрываем корзину
      toggleCart();

      // 7. Перенаправляем на страницу благодарности (опционально)
      // window.location.href = '/thank-you';
    }
  };

  // Если корзина закрыта, показываем только иконку
  if (!isCartOpen) {
    return null;
  }

  // Функция для отображения деталей кастомизации
  const renderCustomizations = (item) => {
    if (!item.customizations) return null;
    
    const { size, extras, milkType } = item.customizations;
    
    return (
      <div className="cart-item-customizations">
        {size && <span className="customization-badge">Размер: {size}</span>}
        {milkType && milkType !== 'обычное' && (
          <span className="customization-badge">Молоко: {milkType}</span>
        )}
        {extras && extras.length > 0 && (
          <span className="customization-badge">Допов: {extras.length}</span>
        )}
      </div>
    );
  };

  return (
    <div className="cart-overlay" onClick={toggleCart}>
      <div className="cart-container" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2>Корзина</h2>
          <button className="close-cart" onClick={toggleCart}>×</button>
        </div>
        
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <p>Ваша корзина пуста</p>
            <p>Добавьте товары из меню</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-info">
                    <h4>{item.name}</h4>
                    {renderCustomizations(item)}
                    <p className="cart-item-price">
                      {formatPrice(item.price || item.totalPrice)} ₽ 
                      {item.quantity > 1 ? ` × ${item.quantity}` : ''}
                    </p>
                    <p className="cart-item-total">
                      {formatPrice(
                        item.totalPrice || (item.price * (item.quantity || 1))
                      )} ₽
                    </p>
                  </div>
                  
                  <div className="cart-item-controls">
                    <div className="quantity-controls">
                      <button 
                        onClick={() => updateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))}
                        className="quantity-btn"
                      >
                        −
                      </button>
                      <span className="quantity">{item.quantity || 1}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                        className="quantity-btn"
                      >
                        +
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="remove-item-btn"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="cart-summary">
              <div className="summary-row">
                <span>Товаров: {getTotalItems()}</span>
                <span>{formatPrice(getTotalPrice())} ₽</span>
              </div>
              
              <button 
                className="checkout-btn"
                onClick={handleCheckout}
                disabled={cartItems.length === 0}
              >
                Оформить заказ • {formatPrice(getTotalPrice())} ₽
              </button>

              {/* Дополнительные кнопки */}
              <div className="cart-actions">
                <button 
                  className="continue-shopping-btn"
                  onClick={toggleCart}
                >
                  ← Продолжить покупки
                </button>
                
                <button 
                  className="clear-cart-btn"
                  onClick={() => {
                    if (window.confirm('Очистить всю корзину?')) {
                      if (clearCart) {
                        clearCart();
                      } else {
                        cartItems.forEach(item => removeFromCart(item.id));
                      }
                    }
                  }}
                  disabled={cartItems.length === 0}
                >
                  Очистить корзину
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;
