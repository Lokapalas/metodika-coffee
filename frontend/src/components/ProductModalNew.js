import React, { useState, useEffect } from 'react';
import './ProductModalNew.css';

const ProductModalNew = ({ product, isOpen, onClose, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [activeTab, setActiveTab] = useState('toppings'); // 'toppings', 'temperature', 'extras'
  
  // Р¦РµРЅС‹ РїРѕ СЂР°Р·РјРµСЂР°Рј (РїСЂРёРјРµСЂ)
  const sizePrices = {
    'S': product.basePrice || 240,
    'M': product.basePrice ? product.basePrice + 40 : 280,
    'L': product.basePrice ? product.basePrice + 90 : 330
  };

  // Р”РѕРїРѕР»РЅРµРЅРёСЏ
  const toppings = [
    { id: 1, name: 'РЎРёСЂРѕРї РІР°РЅРёР»СЊРЅС‹Р№', price: 30 },
    { id: 2, name: 'РЎРёСЂРѕРї РєР°СЂР°РјРµР»СЊРЅС‹Р№', price: 30 },
    { id: 3, name: 'РЎРёСЂРѕРї С€РѕРєРѕР»Р°РґРЅС‹Р№', price: 30 },
    { id: 4, name: 'РЎРёСЂРѕРї РєРѕРєРѕСЃРѕРІС‹Р№', price: 30 },
    { id: 5, name: 'Р”РІРѕР№РЅРѕР№ СЌСЃРїСЂРµСЃСЃРѕ', price: 85 },
    { id: 6, name: 'Р‘РµР·Р»Р°РєС‚РѕР·РЅРѕРµ РјРѕР»РѕРєРѕ', price: 50 },
    { id: 7, name: 'РњРёРЅРґР°Р»СЊРЅРѕРµ РјРѕР»РѕРєРѕ', price: 50 },
    { id: 8, name: 'РњС‘Рґ', price: 35 },
    { id: 9, name: 'РЎРіСѓС‰С‘РЅРєР°', price: 40 },
  ];

  // РџРѕСЃС‹РїРєРё
  const sprinkles = [
    { id: 1, name: 'РљРѕСЂРёС†Р°', price: 0 },
    { id: 2, name: 'РљР°РєР°Рѕ', price: 0 },
    { id: 3, name: 'РљРѕРєРѕСЃ', price: 10 },
    { id: 4, name: 'РћСЂРµС…Рё', price: 15 },
  ];

  // РўРµРјРїРµСЂР°С‚СѓСЂР° Рё РѕРїС†РёРё
  const temperatureOptions = [
    { id: 1, name: 'Р“РѕСЂСЏС‡РёР№', icon: 'рџ”Ґ' },
    { id: 2, name: 'РўС‘РїР»С‹Р№', icon: 'в