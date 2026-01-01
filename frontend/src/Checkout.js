import React, { useState, useContext, useEffect } from 'react';
import { CartContext } from './CartContext';
import './Checkout.css';

const Checkout = () => {
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

    // Инициализация Telegram WebApp
    useEffect(() => {
        if (window.Telegram?.WebApp) {
            const tg = window.Telegram.WebApp;
            
            // Расширяем окно на всю высоту
            tg.expand();
            
            // Показываем основную кнопку
            tg.MainButton.setParams({
                text: `ОФОРМИТЬ ЗАКАЗ ЗА ${getTotalPrice()}₽`,
                color: '#4CAF50',
                textColor: '#ffffff'
            });
            
            // Обработчик нажатия на основную кнопку
            tg.MainButton.onClick(handleTelegramSubmit);
            
            // Показываем кнопку если есть товары в корзине
            if (cartItems.length > 0) {
                tg.MainButton.show();
            } else {
                tg.MainButton.hide();
            }
            
            return () => {
                tg.MainButton.offClick(handleTelegramSubmit);
            };
        }
    }, [cartItems, getTotalPrice]);

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

    // Функция для нормализации цены (исправляем NaN)
    const normalizePrice = (price) => {
        if (isNaN(price) || price === null || price === undefined) {
            return 0;
        }
        return Number(price);
    };

    // Пересчитываем общую сумму с проверкой
    const calculateTotalPrice = () => {
        if (!cartItems || cartItems.length === 0) return 0;
        
        let total = 0;
        cartItems.forEach(item => {
            const itemPrice = normalizePrice(item.finalPrice || item.price || 0);
            const itemQuantity = normalizePrice(item.quantity || 1);
            total += itemPrice * itemQuantity;
        });
        
        return total;
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        
        if (!validateForm()) return;
        
        setIsSubmitting(true);
        setOrderStatus(null);

        // Формируем детали заказа
        const orderDetails = {
            customer: {
                name: formData.name.trim(),
                phone: formData.phone.trim(),
                address: formData.address.trim()
            },
            items: cartItems.map(item => ({
                id: item.id,
                name: item.name,
                price: normalizePrice(item.finalPrice || item.price || 0),
                quantity: normalizePrice(item.quantity || 1),
                size: item.selectedSize || 'M',
                additives: item.selectedAdditives || [],
                additivesDetails: item.additivesDetails || []
            })),
            total: calculateTotalPrice(),
            paymentMethod: formData.paymentMethod,
            comments: formData.comments.trim(),
            source: window.Telegram?.WebApp ? 'telegram' : 'website'
        };

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderDetails)
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
                
                // Если в Telegram, закрываем приложение
                if (window.Telegram?.WebApp) {
                    setTimeout(() => {
                        window.Telegram.WebApp.close();
                    }, 3000);
                }
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

    // Обработчик для Telegram кнопки
    const handleTelegramSubmit = () => {
        if (validateForm()) {
            handleSubmit();
        }
    };

    // Подсчитываем итоговую сумму
    const totalPrice = calculateTotalPrice();

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
                    <p><strong>Итоговая сумма:</strong> {totalPrice}₽</p>
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
                {cartItems.length === 0 ? (
                    <p className="empty-order">Корзина пуста</p>
                ) : (
                    <>
                        {cartItems.map((item, index) => {
                            const itemPrice = normalizePrice(item.finalPrice || item.price || 0);
                            const itemQuantity = normalizePrice(item.quantity || 1);
                            const itemTotal = itemPrice * itemQuantity;
                            
                            return (
                                <div key={index} className="order-item">
                                    <div className="order-item-main">
                                        <span className="order-item-name">{item.name}</span>
                                        {item.selectedSize && item.selectedSize !== 'M' && (
                                            <span className="order-item-size">({item.selectedSize})</span>
                                        )}
                                    </div>
                                    <div className="order-item-details">
                                        <span className="order-item-quantity">x{itemQuantity}</span>
                                        <span className="order-item-total">{itemTotal}₽</span>
                                    </div>
                                    {item.selectedAdditives && item.selectedAdditives.length > 0 && (
                                        <div className="order-item-additives">
                                            <small>Добавки: {item.selectedAdditives.length}</small>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        <div className="order-total">
                            <strong>Итого:</strong>
                            <strong>{totalPrice}₽</strong>
                        </div>
                    </>
                )}
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
                    {isSubmitting ? 'Отправляем заказ...' : `Оформить заказ за ${totalPrice}₽`}
                </button>

                {window.Telegram?.WebApp && (
                    <div className="telegram-note">
                        <small>Или используйте кнопку внизу Telegram приложения</small>
                    </div>
                )}
            </form>
        </div>
    );
};

export default Checkout;
