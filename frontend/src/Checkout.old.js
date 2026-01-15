import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from './context/CartContext';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, clearCart, getTotalPrice } = useContext(CartContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    userName: '',
    userPhone: '',
    userEmail: '',
    deliveryAddress: '',
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.userName || !formData.userPhone) {
      alert('РџРѕР¶Р°Р»СѓР№СЃС‚Р°, Р·Р°РїРѕР»РЅРёС‚Рµ РѕР±СЏР·Р°С‚РµР»СЊРЅС‹Рµ РїРѕР»СЏ: РёРјСЏ Рё С‚РµР»РµС„РѕРЅ');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        userName: formData.userName,
        userPhone: formData.userPhone,
        userEmail: formData.userEmail || '',
        totalAmount: getTotalPrice(),
        items: cartItems.map(item => ({
          name: item.name || item.title || 'РўРѕРІР°СЂ',
          price: item.price || 0,
          quantity: item.quantity || 1
        })),
        deliveryAddress: formData.deliveryAddress || '',
        comment: formData.comment || ''
      };

      console.log('рџ“¦ РћС‚РїСЂР°РІРєР° Р·Р°РєР°Р·Р° РЅР° СЃРµСЂРІРµСЂ:', orderData);

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();
      console.log('рџ“Ў РћС‚РІРµС‚ СЃРµСЂРІРµСЂР°:', result);

      if (response.ok && result.success) {
        setOrderResult(result);
        clearCart();
        
        // РђРІС‚РѕРјР°С‚РёС‡РµСЃРєРёР№ РІРѕР·РІСЂР°С‚ С‡РµСЂРµР· 5 СЃРµРєСѓРЅРґ
        setTimeout(() => {
          navigate('/');
        }, 5000);
      } else {
        throw new Error(result.message || 'РћС€РёР±РєР° РѕС‚РїСЂР°РІРєРё Р·Р°РєР°Р·Р°');
      }
    } catch (error) {
      console.error('вќЊ РћС€РёР±РєР° РѕС„РѕСЂРјР»РµРЅРёСЏ Р·Р°РєР°Р·Р°:', error);
      alert(`РћС€РёР±РєР° РїСЂРё РѕС„РѕСЂРјР»РµРЅРёРё Р·Р°РєР°Р·Р°: ${error.message}\nРџРѕРїСЂРѕР±СѓР№С‚Рµ РµС‰Рµ СЂР°Р·.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0 && !orderResult) {
    return (
      <div className="checkout-container">
        <div className="empty-cart-checkout">
          <h2>РљРѕСЂР·РёРЅР° РїСѓСЃС‚Р°</h2>
          <p>Р”РѕР±Р°РІСЊС‚Рµ С‚РѕРІР°СЂС‹ РІ РєРѕСЂР·РёРЅСѓ РґР»СЏ РѕС„РѕСЂРјР»РµРЅРёСЏ Р·Р°РєР°Р·Р°</p>
          <button
            onClick={() => navigate('/')}
            className="back-to-menu-btn"
          >
            Р’РµСЂРЅСѓС‚СЊСЃСЏ РІ РјРµРЅСЋ
          </button>
        </div>
      </div>
    );
  }

  const cartTotal = getTotalPrice();

  return (
    <div className="checkout-container">
      <div className="checkout-content">
        <div className="checkout-header">
          <h2>РћС„РѕСЂРјР»РµРЅРёРµ Р·Р°РєР°Р·Р°</h2>
          <button
            onClick={() => navigate('/')}
            className="back-btn"
            disabled={isSubmitting}
          >
            в†ђ РќР°Р·Р°Рґ Рє РјРµРЅСЋ
          </button>
        </div>

        {orderResult ? (
          <div className="order-success">
            <div className="success-icon">вњ…</div>
            <h3>Р—Р°РєР°Р· СѓСЃРїРµС€РЅРѕ РѕС„РѕСЂРјР»РµРЅ!</h3>
            <div className="order-details">
              <p><strong>РќРѕРјРµСЂ Р·Р°РєР°Р·Р°:</strong> {orderResult.orderId}</p>
              <p><strong>РЎРѕРѕР±С‰РµРЅРёРµ:</strong> {orderResult.message}</p>
              <p><strong>Telegram СѓРІРµРґРѕРјР»РµРЅРёРµ:</strong> 
                {orderResult.telegramSent ? ' вњ… РѕС‚РїСЂР°РІР»РµРЅРѕ' : ' вљ пёЏ РЅРµ РѕС‚РїСЂР°РІР»РµРЅРѕ'}
              </p>
              <p><strong>Р