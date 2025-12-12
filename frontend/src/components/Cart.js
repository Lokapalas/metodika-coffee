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
    toggleCart
  } = useCart();

  // Форматирование цены
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price);
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
                        onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
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
              
              <button className="checkout-btn">
                Оформить заказ • {formatPrice(getTotalPrice())} ₽
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;
