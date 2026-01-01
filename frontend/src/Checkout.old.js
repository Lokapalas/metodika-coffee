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
      alert('Пожалуйста, заполните обязательные поля: имя и телефон');
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
          name: item.name || item.title || 'Товар',
          price: item.price || 0,
          quantity: item.quantity || 1
        })),
        deliveryAddress: formData.deliveryAddress || '',
        comment: formData.comment || ''
      };

      console.log('📦 Отправка заказа на сервер:', orderData);

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();
      console.log('📡 Ответ сервера:', result);

      if (response.ok && result.success) {
        setOrderResult(result);
        clearCart();
        
        // Автоматический возврат через 5 секунд
        setTimeout(() => {
          navigate('/');
        }, 5000);
      } else {
        throw new Error(result.message || 'Ошибка отправки заказа');
      }
    } catch (error) {
      console.error('❌ Ошибка оформления заказа:', error);
      alert(`Ошибка при оформлении заказа: ${error.message}\nПопробуйте еще раз.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0 && !orderResult) {
    return (
      <div className="checkout-container">
        <div className="empty-cart-checkout">
          <h2>Корзина пуста</h2>
          <p>Добавьте товары в корзину для оформления заказа</p>
          <button
            onClick={() => navigate('/')}
            className="back-to-menu-btn"
          >
            Вернуться в меню
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
          <h2>Оформление заказа</h2>
          <button
            onClick={() => navigate('/')}
            className="back-btn"
            disabled={isSubmitting}
          >
            ← Назад к меню
          </button>
        </div>

        {orderResult ? (
          <div className="order-success">
            <div className="success-icon">✅</div>
            <h3>Заказ успешно оформлен!</h3>
            <div className="order-details">
              <p><strong>Номер заказа:</strong> {orderResult.orderId}</p>
              <p><strong>Сообщение:</strong> {orderResult.message}</p>
              <p><strong>Telegram уведомление:</strong> 
                {orderResult.telegramSent ? ' ✅ отправлено' : ' ⚠️ не отправлено'}
              </p>
              <p><strong>Итого:</strong> {cartTotal} ₽</p>
              <p><strong>Время:</strong> {new Date(orderResult.timestamp).toLocaleString('ru-RU')}</p>
            </div>
            <p className="success-message">
              Спасибо за ваш заказ! Мы свяжемся с вами в ближайшее время.
              <br />
              <small>Автоматический возврат в меню через 5 секунд...</small>
            </p>
          </div>
        ) : (
          <div className="checkout-grid">
            <div className="order-summary">
              <h3>Ваш заказ</h3>
              <div className="order-items">
                {cartItems.map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="order-item-info">
                      <h4>{item.name || item.title || 'Товар'}</h4>
                      {item.size && <p>Размер: {item.size}</p>}
                      {item.addons && item.addons.length > 0 && (
                        <p>Добавки: {item.addons.map(a => a.name).join(', ')}</p>
                      )}
                    </div>
                    <div className="order-item-price">
                      {item.quantity || 1} × {item.price || 0} ₽ = {(item.price || 0) * (item.quantity || 1)} ₽
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-total">
                <div className="total-row">
                  <span>Итого:</span>
                  <span className="total-amount">{cartTotal} ₽</span>
                </div>
              </div>
            </div>

            <div className="checkout-form-container">
              <form onSubmit={handleSubmit} className="checkout-form">
                <div className="form-group">
                  <label htmlFor="userName">Имя *</label>
                  <input
                    type="text"
                    id="userName"
                    name="userName"
                    value={formData.userName}
                    onChange={handleInputChange}
                    required
                    placeholder="Введите ваше имя"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="userPhone">Телефон *</label>
                  <input
                    type="tel"
                    id="userPhone"
                    name="userPhone"
                    value={formData.userPhone}
                    onChange={handleInputChange}
                    required
                    placeholder="+7 (XXX) XXX-XX-XX"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="userEmail">Email</label>
                  <input
                    type="email"
                    id="userEmail"
                    name="userEmail"
                    value={formData.userEmail}
                    onChange={handleInputChange}
                    placeholder="email@example.com"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="deliveryAddress">Адрес доставки</label>
                  <input
                    type="text"
                    id="deliveryAddress"
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleInputChange}
                    placeholder="Улица, дом, квартира"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="comment">Комментарий к заказу</label>
                  <textarea
                    id="comment"
                    name="comment"
                    value={formData.comment}
                    onChange={handleInputChange}
                    placeholder="Пожелания, особенности доставки и т.д."
                    rows="3"
                    disabled={isSubmitting}
                  />
                </div>

                <button
                  type="submit"
                  className="submit-order-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Отправляем заказ...' : `Оформить заказ за ${cartTotal} ₽`}
                </button>
                
                <p className="form-note">
                  * После оформления заказа, наш менеджер свяжется с вами для подтверждения.
                  Вы получите уведомление в Telegram с деталями заказа.
                </p>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
