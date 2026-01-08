import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
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
    clearCart
  } = useContext(CartContext);
  
  const navigate = useNavigate();

  // Форматирование цены
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  // Обработчик оформления заказа - теперь ведет на страницу Checkout
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Корзина пуста! Добавьте товары перед оформлением заказа.');
      return;
    }
    // Переходим на страницу оформления заказа
    navigate('/checkout');
  };

  // Закрытие корзины
  const handleCloseCart = () => {
    toggleCart();
  };

  if (!isCartOpen) {
    return null;
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-sidebar">
        <div className="cart-header">
          <h2>🛒 Корзина</h2>
          <button className="close-cart" onClick={handleCloseCart}>×</button>
        </div>
        <div className="cart-empty">
          <p>Корзина пуста</p>
          <p>Добавьте товары из меню</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-sidebar">
      <div className="cart-header">
        <h2>🛒 Корзина</h2>
        <button className="close-cart" onClick={handleCloseCart}>×</button>
      </div>

      <div className="cart-items">
        {cartItems.map((item, index) => (
          <div key={index} className="cart-item">
            <div className="cart-item-info">
              <h4>{item.name}</h4>
              {item.size && <p>Размер: {item.size}</p>}
              {item.addons && item.addons.length > 0 && (
                <p>Добавки: {item.addons.map(a => a.name).join(', ')}</p>
              )}
              <p className="item-price">{formatPrice(item.price)} ₽</p>
            </div>
            
            <div className="cart-item-controls">
              <div className="quantity-controls">
                <button 
                  onClick={() => updateQuantity(item, (item.quantity || 1) - 1)}
                  disabled={(item.quantity || 1) <= 1}
                >
                  −
                </button>
                <span>{item.quantity || 1}</span>
                <button onClick={() => updateQuantity(item, (item.quantity || 1) + 1)}>
                  +
                </button>
              </div>
              
              <div className="item-total">
                {formatPrice(item.price * (item.quantity || 1))} ₽
              </div>
              
              <button 
                className="remove-item"
                onClick={() => removeFromCart(item)}
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-footer">
        <div className="cart-total">
          <span>Итого:</span>
          <span className="total-price">{formatPrice(getTotalPrice())} ₽</span>
        </div>
        
        <div className="cart-actions">
          <button 
            className="checkout-btn"
            onClick={handleCheckout}
          >
            Оформить заказ • {formatPrice(getTotalPrice())} ₽
          </button>
          
          <button 
            className="clear-cart-btn"
            onClick={clearCart}
          >
            Очистить корзину
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
