import React, { useState, useContext } from 'react';
import { CartContext } from './CartContext';
import './CheckoutForm.css';

const CheckoutForm = () => {
    const { cartItems, clearCart, getTotalPrice } = useContext(CartContext);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderStatus, setOrderStatus] = useState(null);
    
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: 'Самовывоз',
        paymentMethod: 'cash',
        comments: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePhoneInput = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) {
            if (value.length <= 1) value = '+7' + value;
            if (value.length > 1) value = '+7' + value.substring(1);
            if (value.length > 12) value = value.substring(0, 12);
            
            // Форматирование номера
            if (value.length > 2) {
                value = value.replace(/^(\+7)(\d{3})(\d)/, '$1 ($2) $3');
                if (value.length > 9) {
                    value = value.replace(/^(\+7\s\(\d{3}\)\s\d{3})(\d)/, '$1-$2');
                }
                if (value.length > 12) {
                    value = value.replace(/^(\+7\s\(\d{3}\)\s\d{3}-\d{2})(\d)/, '$1-$2');
                }
            }
        }
        setFormData(prev => ({ ...prev, phone: value }));
    };

    const validateForm = () => {
        if (!formData.phone || formData.phone.replace(/\D/g, '').length < 11) {
            alert('Пожалуйста, введите корректный номер телефона');
            return false;
        }
        if (cartItems.length === 0) {
            alert('Корзина пуста');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setIsSubmitting(true);
        setOrderStatus(null);

        const orderPayload = {
            customer: {
                name: formData.name.trim(),
                phone: formData.phone.trim(),
                address: formData.address.trim()
            },
            items: cartItems.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity
            })),
            total: getTotalPrice(),
            paymentMethod: formData.paymentMethod,
            comments: formData.comments.trim()
        };

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderPayload)
            });

            const result = await response.json();
            
            if (result.success) {
                setOrderStatus({
                    type: 'success',
                    message: `Заказ #${result.orderId} успешно оформлен!`,
                    orderId: result.orderId
                });
                
                // Очищаем корзину после успешного заказа
                clearCart();
                
                // Показываем кнопку для нового заказа
                setTimeout(() => {
                    if (window.Telegram?.WebApp) {
                        window.Telegram.WebApp.close();
                    }
                }, 3000);
            } else {
                setOrderStatus({
                    type: 'error',
                    message: result.message || 'Ошибка при оформлении заказа'
                });
            }
        } catch (error) {
            console.error('Ошибка:', error);
            setOrderStatus({
                type: 'error',
                message: 'Ошибка соединения с сервером'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (orderStatus?.type === 'success') {
        return (
            <div className="checkout-success">
                <div className="success-icon">✅</div>
                <h2>Заказ оформлен успешно!</h2>
                <p className="order-id">Номер заказа: <strong>{orderStatus.orderId}</strong></p>
                <p>Скоро с вами свяжутся для подтверждения</p>
                <div className="success-details">
                    <p><strong>Имя:</strong> {formData.name || 'Не указано'}</p>
                    <p><strong>Телефон:</strong> {formData.phone}</p>
                    <p><strong>Адрес:</strong> {formData.address}</p>
                    <p><strong>Способ оплаты:</strong> {formData.paymentMethod === 'card' ? 'Карта' : 'Наличные'}</p>
                </div>
                <button 
                    className="new-order-btn"
                    onClick={() => window.location.href = '/'}
                >
                    Сделать новый заказ
                </button>
            </div>
        );
    }

    return (
        <div className="checkout-container">
            <h2>Оформление заказа</h2>
            
            <div className="order-summary">
                <h3>Ваш заказ:</h3>
                {cartItems.map(item => (
                    <div key={item.id} className="order-item">
                        <span>{item.name} x{item.quantity}</span>
                        <span>{item.price * item.quantity}₽</span>
                    </div>
                ))}
                <div className="order-total">
                    <strong>Итого:</strong>
                    <strong>{getTotalPrice()}₽</strong>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="checkout-form">
                <div className="form-group">
                    <label htmlFor="name">Имя (необязательно):</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Ваше имя"
                    />
                </div>

                <div className="form-group required">
                    <label htmlFor="phone">Телефон *:</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handlePhoneInput}
                        placeholder="+7 (___) ___-__-__"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="address">Адрес доставки:</label>
                    <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Укажите адрес доставки или оставьте 'Самовывоз'"
                        rows="2"
                    />
                </div>

                <div className="form-group">
                    <label>Способ оплаты:</label>
                    <div className="payment-options">
                        <label className="payment-option">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="cash"
                                checked={formData.paymentMethod === 'cash'}
                                onChange={handleInputChange}
                            />
                            <span>💵 Наличные</span>
                        </label>
                        <label className="payment-option">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="card"
                                checked={formData.paymentMethod === 'card'}
                                onChange={handleInputChange}
                            />
                            <span>💳 Карта</span>
                        </label>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="comments">Комментарий к заказу:</label>
                    <textarea
                        id="comments"
                        name="comments"
                        value={formData.comments}
                        onChange={handleInputChange}
                        placeholder="Дополнительные пожелания..."
                        rows="2"
                    />
                </div>

                {orderStatus?.type === 'error' && (
                    <div className="error-message">
                        ❌ {orderStatus.message}
                    </div>
                )}

                <button 
                    type="submit" 
                    className="submit-order-btn"
                    disabled={isSubmitting || cartItems.length === 0}
                >
                    {isSubmitting ? 'Отправляем заказ...' : `Оформить заказ за ${getTotalPrice()}₽`}
                </button>
            </form>
        </div>
    );
};

export default CheckoutForm;
