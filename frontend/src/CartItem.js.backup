import React from 'react';
import './CartItem.css';

const CartItem = ({ item, onRemove, onUpdate }) => {
  const handleIncrease = () => {
    onUpdate(item.quantity + 1);
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      onUpdate(item.quantity - 1);
    } else {
      onRemove();
    }
  };

  return (
    <div className="cart-item">
      <div className="cart-item-info">
        <h4>{item.name}</h4>
        
        {item.size && (
          <p className="cart-item-size">Размер: {item.size}</p>
        )}
        
        {item.addons && item.addons.length > 0 && (
          <div className="cart-item-addons">
            <p className="addons-label">Добавки:</p>
            <ul className="addons-list">
              {item.addons.map((addon, index) => (
                <li key={index} className="addon-item">
                  {addon.name} (+{addon.price} ₽)
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <p className="cart-item-price">
          {item.price} ₽ × {item.quantity} = {item.price * item.quantity} ₽
        </p>
      </div>
      
      <div className="cart-item-controls">
        <div className="quantity-controls">
          <button
            onClick={handleDecrease}
            className="quantity-btn decrease"
            aria-label="Уменьшить количество"
          >
            −
          </button>
          
          <span className="quantity-display">{item.quantity}</span>
          
          <button
            onClick={handleIncrease}
            className="quantity-btn increase"
            aria-label="Увеличить количество"
          >
            +
          </button>
        </div>
        
        <button
          onClick={onRemove}
          className="remove-item-btn"
          aria-label="Удалить товар"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default CartItem;
