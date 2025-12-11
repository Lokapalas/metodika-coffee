import React, { useState } from 'react';
import './Checkout.css';

const Checkout = () => {
  // Безопасная загрузка корзины
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('metodikaCart');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        // Убеждаемся что это массив
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (error) {
      console.error('Ошибка загрузки корзины из localStorage:', error);
    }
    return [];
  });
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    comment: '',
    paymentMethod: 'cash'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) {
      alert('Пожалуйста, заполните обязательные поля: имя и телефон');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        customer: formData,
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        timestamp: new Date().toISOString()
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        setOrderSuccess(true);
        setCart([]);
        // Безопасное удаление
        try {
          localStorage.removeItem('metodikaCart');
        } catch (error) {
          console.error('Ошибка очистки корзины:', error);
        }
        
        // Очистка формы
        setFormData({
          name: '',
          phone: '',
          email: '',
          address: '',
          comment: '',
          paymentMethod: 'cash'
        });
      } else {
        throw new Error('Failed to submit order');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Ошибка при оформлении заказа. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="checkout-container">
        <div className="checkout-success">
          <h2>✅ Заказ успешно оформлен!</h2>
          <p>Спасибо за ваш заказ. Мы свяжемся с вами в ближайшее время.</p>
          <button
            onClick={() => window.location.href = '/'}
            className="back-to-menu-btn"
          >
            Вернуться в меню
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="checkout-container">
        <div className="empty-cart-checkout">
          <h2>Корзина пуста</h2>
          <p>Добавьте товары в корзину для оформления заказа</p>
          <button
            onClick={() => window.location.href = '/'}
            className="back-to-menu-btn"
          >
            Вернуться в меню
          </button>
        </div>
      </div>
    );
  }

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="checkout-container">
      <div className="checkout-content">
        <div className="checkout-header">
          <h2>Оформление заказа</h2>
          <button
            onClick={() => window.location.href = '/'}
            className="back-btn"
          >
            ← Назад
          </button>
        </div>

        <div className="checkout-grid">
          {/* Левая колонка - товары */}
          <div className="order-summary">
            <h3>Ваш заказ</h3>
            <div className="order-items">
              {cart.map((item, index) => (
                <div key={index} className="order-item">
                  <div className="order-item-info">
                    <h4>{item.name}</h4>
                    {item.size && <p>Размер: {item.size}</p>}
                    {item.addons && item.addons.length > 0 && (
                      <p>Добавки: {item.addons.map(a => a.name).join(', ')}</p>
                    )}
                  </div>
                  <div className="order-item-price">
                    {item.quantity} × {item.price} ₽ = {item.quantity * item.price} ₽
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

          {/* Правая колонка - форма */}
          <div className="checkout-form-container">
            <form onSubmit={handleSubmit} className="checkout-form">
              <div className="form-group">
                <label htmlFor="name">
                  Имя * <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Введите ваше имя"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">
                  Телефон * <span className="required-star">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="+7 (XXX) XXX-XX-XX"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="email@example.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Адрес доставки</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Улица, дом, квартира"
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
                />
              </div>

              <div className="form-group">
                <label>Способ оплаты</label>
                <div className="payment-methods">
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={formData.paymentMethod === 'cash'}
                      onChange={handleInputChange}
                    />
                    <span>Наличными при получении</span>
                  </label>
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleInputChange}
                    />
                    <span>Картой онлайн</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="submit-order-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Оформляем заказ...' : 'Оформить заказ'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
