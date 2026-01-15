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
    toggleCart,
    clearCart // РџСЂРѕРІРµСЂСЏРµРј РµСЃС‚СЊ Р»Рё С„СѓРЅРєС†РёСЏ РѕС‡РёСЃС‚РєРё РєРѕСЂР·РёРЅС‹
  } = useCart();

  // Р¤РѕСЂРјР°С‚РёСЂРѕРІР°РЅРёРµ С†РµРЅС‹
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  // РћР±СЂР°Р±РѕС‚С‡РёРє РѕС„РѕСЂРјР»РµРЅРёСЏ Р·Р°РєР°Р·Р°
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('РљРѕСЂР·РёРЅР° РїСѓСЃС‚Р°! Р”РѕР±Р°РІСЊС‚Рµ С‚РѕРІР°СЂС‹ РїРµСЂРµРґ РѕС„РѕСЂРјР»РµРЅРёРµРј Р·Р°РєР°Р·Р°.');
      return;
    }

    // 1. РџРѕРєР°Р·С‹РІР°РµРј РїРѕРґС‚РІРµСЂР¶РґРµРЅРёРµ
    const confirmOrder = window.confirm(
      `РћС„РѕСЂРјРёС‚СЊ Р·Р°РєР°Р· РЅР° ${formatPrice(getTotalPrice())} в‚Ѕ?\n\n` +
      `РљРѕР»РёС‡РµСЃС‚РІРѕ С‚РѕРІР°СЂРѕРІ: ${getTotalItems()}\n` +
      'РќР°С€ РјРµРЅРµРґР¶РµСЂ СЃРІСЏР¶РµС‚СЃСЏ СЃ РІР°РјРё РґР»СЏ РїРѕРґС‚РІРµСЂР¶РґРµРЅРёСЏ.'
    );

    if (confirmOrder) {
      // 2. РЎРѕР±РёСЂР°РµРј РёРЅС„РѕСЂРјР°С†РёСЋ Рѕ Р·Р°РєР°Р·Рµ
      const orderDetails = {
        items: cartItems.map(item => ({
          name: item.name,
          quantity: item.quantity || 1,
          price: item.price || item.totalPrice,
          customizations: item.customizations || {}
        })),
        total: getTotalPrice(),
        timestamp: new Date().toISOString(),
        orderId: 'ORDER-' + Date.now()
      };

      // 3. Р›РѕРіРёСЂСѓРµРј Р·Р°РєР°Р· РІ РєРѕРЅСЃРѕР»СЊ (РІ СЂРµР°Р»СЊРЅРѕРј РїСЂРёР»РѕР¶РµРЅРёРё Р·РґРµСЃСЊ API Р·Р°РїСЂРѕСЃ)
      console.log('рџЋЇ Р—РђРљРђР— РћР¤РћР РњР›Р•Рќ:', orderDetails);
      console.log('рџ“¦ РўРѕРІР°СЂС‹:', cartItems);
      console.log('рџ’° Р