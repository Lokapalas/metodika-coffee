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
        address: 'РЎР°РјРѕРІС‹РІРѕР·',
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
            
            // Р¤РѕСЂРјР°С‚РёСЂРѕРІР°РЅРёРµ РЅРѕРјРµСЂР°
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
            alert('РџРѕР¶Р°Р»СѓР№СЃС‚Р°, РІРІРµРґРёС‚Рµ РєРѕСЂСЂРµРєС‚РЅС‹Р№ РЅРѕРјРµСЂ С‚РµР»РµС„РѕРЅР°');
            return false;
        }
        if (cartItems.length === 0) {
            alert('РљРѕСЂР·РёРЅР° РїСѓСЃС‚Р°');
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
                    message: `Р—Р°РєР°Р· #${result.orderId} СѓСЃРїРµС€РЅРѕ РѕС„РѕСЂРјР»РµРЅ!`,
                    orderId: result.orderId
                });
                
                // РћС‡РёС‰Р°РµРј РєРѕСЂР·РёРЅСѓ РїРѕСЃР»Рµ СѓСЃРїРµС€РЅРѕРіРѕ Р·Р°РєР°Р·Р°
                clearCart();
                
                // РџРѕРєР°Р·С‹РІР°РµРј РєРЅРѕРїРєСѓ РґР»СЏ РЅРѕРІРѕРіРѕ Р·Р°РєР°Р·Р°
                setTimeout(() => {
                    if (window.Telegram?.WebApp) {
                        window.Telegram.WebApp.close();
                    }
                }, 3000);
            } else {
                setOrderStatus({
                    type: 'error',
                    message: result.message || 'РћС€РёР±РєР° РїСЂРё РѕС„РѕСЂРјР»РµРЅРёРё Р·Р°РєР°Р·Р°'
                });
            }
        } catch (error) {
            console.error('РћС€РёР±РєР°:', error);
            setOrderStatus({
                type: 'error',
                message: 'РћС€РёР±РєР° СЃРѕРµРґРёРЅРµРЅРёСЏ СЃ СЃРµСЂРІРµСЂРѕРј'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (orderStatus?.type === 'success') {
        return (
            <div className="checkout-success">
                <div className="success-icon">вњ…</div>
                <h2>Р—Р°РєР°Р· РѕС„РѕСЂРјР»РµРЅ СѓСЃРїРµС€РЅРѕ!</h2>
                <p className="order-id">РќРѕРјРµСЂ Р·Р°РєР°Р·Р°: <strong>{orderStatus.orderId}</strong></p>
                <p>РЎРєРѕСЂРѕ СЃ РІР°РјРё СЃРІСЏР¶СѓС‚СЃСЏ РґР»СЏ РїРѕРґС‚РІРµСЂР¶РґРµРЅРёСЏ</p>
                <div className="success-details">
                    <p><strong>Р