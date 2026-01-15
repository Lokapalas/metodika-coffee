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

  // Р¤РѕСЂРјР°С‚РёСЂРѕРІР°РЅРёРµ С†РµРЅС‹
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  // РћР±СЂР°Р±РѕС‚С‡РёРє РѕС„РѕСЂРјР»РµРЅРёСЏ Р·Р°РєР°Р·Р° - С‚РµРїРµСЂСЊ РІРµРґРµС‚ РЅР° СЃС‚СЂР°РЅРёС†Сѓ Checkout
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('РљРѕСЂР·РёРЅР° РїСѓСЃС‚Р°! Р”РѕР±Р°РІСЊС‚Рµ С‚РѕРІР°СЂС‹ РїРµСЂРµРґ РѕС„РѕСЂРјР»РµРЅРёРµРј Р·Р°РєР°Р·Р°.');
      return;
    }
    // РџРµСЂРµС…РѕРґРёРј РЅР° СЃС‚СЂР°РЅРёС†Сѓ РѕС„РѕСЂРјР»РµРЅРёСЏ Р·Р°РєР°Р·Р°
    navigate('/checkout');
  };

  // Р—Р°РєСЂС‹С‚РёРµ РєРѕСЂР·РёРЅС‹
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
          <h2>рџ›’ РљРѕСЂР·РёРЅР°</h2>
          <button className="close-cart" onClick={handleCloseCart}>Г—</button>
        </div>
        <div className="cart-empty">
          <p>РљРѕСЂР·РёРЅР° РїСѓСЃС‚Р°</p>
          <p>Р”РѕР±Р°РІСЊС‚Рµ С‚РѕРІР°СЂС‹ РёР· РјРµРЅСЋ</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-sidebar">
      <div className="cart-header">
        <h2>рџ›’ РљРѕСЂР·РёРЅР°</h2>
        <button className="close-cart" onClick={handleCloseCart}>Г—</button>
      </div>

      <div className="cart-items">
        {cartItems.map((item, index) => (
          <div key={index} className="cart-item">
            <div className="cart-item-info">
              <h4>{item.name}</h4>
              {item.size && <p>Р Р°Р·РјРµСЂ: {item.size}</p>}
              {item.addons && item.addons.length > 0 && (
                <p>Р”РѕР±Р°РІРєРё: {item.addons.map(a => a.name).join(', ')}</p>
              )}
              <p className="item-price">{formatPrice(item.price)} в‚Ѕ</p>
            </div>
            
            <div className="cart-item-controls">
              <div className="quantity-controls">
                <button 
                  onClick={() => updateQuantity(item, (item.quantity || 1) - 1)}
                  disabled={(item.quantity || 1) <= 1}
                >
                  в€’
                </button>
                <span>{item.quantity || 1}</span>
                <button onClick={() => updateQuantity(item, (item.quantity || 1) + 1)}>
                  +
                </button>
              </div>
              
              <div className="item-total">
                {formatPrice(item.price * (item.quantity || 1))} в‚Ѕ
              </div>
              
              <button 
                className="remove-item"
                onClick={() => removeFromCart(item)}
              >
                Г—
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-footer">
        <div className="cart-total">
          <span>Р