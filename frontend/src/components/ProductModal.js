import React, { useState } from 'react';
import '../ProductModal.css';
import { useCart } from '../context/CartContext';

function ProductModal({ product, isOpen, onClose }) {
  const { addToCart } = useCart();
  
  // РЎРѕСЃС‚РѕСЏРЅРёСЏ РґР»СЏ РєР°СЃС‚РѕРјРёР·Р°С†РёРё
  const availableSizes = product.sizes || ['M'];
  const [selectedSize, setSelectedSize] = useState(availableSizes.includes('M') ? 'M' : availableSizes[0]);
  const [extras, setExtras] = useState({
    СЃРёСЂРѕРї: false,
    С€РѕРєРѕР»Р°Рґ: false,
    РєРѕСЂРёС†Р°: false,
    РєР°СЂР°РјРµР»СЊ: false,
    РјСЏС‚Р°: false,
    'СЃРіСѓС‰С‘РЅРєР°': false,
    'РїСЋСЂРµ РјР°РЅРіРѕ': false,
    РіСЂСѓС€Р°: false,
    С…Р°Р»РІР°: false,
    СЃРµРјРµРЅР°: false,
    'РєР»СЋРєРІР° СЃСѓС€С‘РЅР°СЏ': false,
    СЏРіРѕРґС‹: false
  });
  const [milkType, setMilkType] = useState('РѕР±С‹С‡РЅРѕРµ');
  const [quantity, setQuantity] = useState(1);
  
  // Р¦РµРЅС‹ Р·Р° СЂР°Р·РјРµСЂС‹
  const sizePrices = product.prices || { [availableSizes[0]]: product.price || 0 };
  
  // Р¦РµРЅС‹ Р·Р° РґРѕРїРѕР»РЅРµРЅРёСЏ
  const extraPrices = {
    'СЃРёСЂРѕРї': 30,
    'С€РѕРєРѕР»Р°Рґ': 40,
    'РєРѕСЂРёС†Р°': 20,
    'РєР°СЂР°РјРµР»СЊ': 35,
    'РјСЏС‚Р°': 25,
    'СЃРіСѓС‰С‘РЅРєР°': 40,
    'РїСЋСЂРµ РјР°РЅРіРѕ': 60,
    'РіСЂСѓС€Р°': 60,
    'С…Р°Р»РІР°': 30,
    'СЃРµРјРµРЅР°': 40,
    'РєР»СЋРєРІР° СЃСѓС€С‘РЅР°СЏ': 50,
    'СЏРіРѕРґС‹': 80
  };
  
  // Р”РѕРїРѕР»РЅРёС‚РµР»СЊРЅР°СЏ РїР»Р°С‚Р° Р·Р° СЂР°СЃС‚РёС‚РµР»СЊРЅРѕРµ РјРѕР»РѕРєРѕ
  const milkTypePrices = {
    'РѕР±С‹С‡РЅРѕРµ': 0,
    'Р±РµР·Р»Р°РєС‚РѕР·РЅРѕРµ': 50,
    'РјРёРЅРґР°Р»СЊРЅРѕРµ': 50,
    'Р±Р°РЅР°РЅРѕРІРѕРµ': 50,
    'РєРѕРєРѕСЃРѕРІРѕРµ': 50,
    'С„РёСЃС‚Р°С€РєРѕРІРѕРµ': 50,
    'С„СѓРЅРґСѓС‡РЅРѕРµ': 50
  };
  
  // Р Р°СЃС‡РµС‚ РёС‚РѕРіРѕРІРѕР№ С†РµРЅС‹
  const calculateTotalPrice = () => {
    let total = sizePrices[selectedSize] || 0;
    
    // Р”РѕР±Р°РІР»СЏРµРј СЃС‚РѕРёРјРѕСЃС‚СЊ РґРѕРїРѕР»РЅРµРЅРёР№
    Object.keys(extras).forEach(extra => {
      if (extras[extra] && extraPrices[extra]) {
        total += extraPrices[extra];
      }
    });
    
    // Р”РѕР±Р°РІР»СЏРµРј СЃС‚РѕРёРјРѕСЃС‚СЊ СЂР°СЃС‚РёС‚РµР»СЊРЅРѕРіРѕ РјРѕР»РѕРєР°
    if (milkTypePrices[milkType]) {
      total += milkTypePrices[milkType];
    }
    
    // РЈРјРЅРѕР¶Р°РµРј РЅР° РєРѕР»РёС‡РµСЃС‚РІРѕ
    return total * quantity;
  };
  
  // РћР±СЂР°Р±РѕС‚С‡РёРє РёР·РјРµРЅРµРЅРёСЏ РґРѕРїРѕР»РЅРµРЅРёР№
  const handleExtraChange = (extra) => {
    setExtras(prev => ({
      ...prev,
      [extra]: !prev[extra]
    }));
  };
  
  // РћР±СЂР°Р±РѕС‚С‡РёРє РґРѕР±Р°РІР»РµРЅРёСЏ РІ РєРѕСЂР·РёРЅСѓ
  const handleAddToCart = () => {
    // РЎРѕР±РёСЂР°РµРј РІС‹Р±СЂР°РЅРЅС‹Рµ РґРѕРїРѕР»РЅРµРЅРёСЏ
    const selectedExtras = Object.keys(extras).filter(extra => extras[extra]);
    
    const customProduct = {
      id: `${product.id}-${selectedSize}-${Date.now()}`,
      baseProduct: product,
      customizations: {
        size: selectedSize,
        extras: selectedExtras,
        milkType: milkType,
        quantity: quantity
      },
      name: `${product.name} (${selectedSize})`,
      price: sizePrices[selectedSize] || 0,
      extraPrice: selectedExtras.reduce((sum, extra) => sum + (extraPrices[extra] || 0), 0),
      milkPrice: milkTypePrices[milkType] || 0,
      totalPrice: calculateTotalPrice(),
      image: product.image,
      quantity: quantity
    };
    
    addToCart(customProduct);
    onClose();
    
    // РЈРІРµРґРѕРјР»РµРЅРёРµ
    alert(`Р”РѕР±Р°РІР»РµРЅРѕ РІ РєРѕСЂР·РёРЅСѓ: ${product.name} (${selectedSize})`);
  };
  
  if (!isOpen || !product) return null;
  
  // РћРїСЂРµРґРµР»СЏРµРј, РЅСѓР¶РЅРѕ Р»Рё РїРѕРєР°Р·С‹РІР°С‚СЊ РІС‹Р±РѕСЂ РјРѕР»РѕРєР°
  const showMilkSelection = product.category === 'Р•РґР°' && 
    (product.subcategory === 'Р—Р°РІС‚СЂР°РєРё' || product.name.includes('РєР°С€Р°'));
  
  // Р¤СѓРЅРєС†РёСЏ РґР»СЏ РїРѕР»СѓС‡РµРЅРёСЏ РѕР±СЉРµРјР° РїРѕ СЂР°Р·РјРµСЂСѓ (РЅРѕРІС‹Рµ СЂР°Р·РјРµСЂС‹)
  const getVolumeForSize = (size) => {
    switch(size) {
      case 'S': return '250 РјР»';
      case 'M': return '350 РјР»';
      case 'L': return '400 РјР»';
      default: return '';
    }
  };
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Р—Р°РіРѕР»РѕРІРѕРє Рё РєРЅРѕРїРєР° Р·Р°РєСЂС‹С‚РёСЏ */}
        <div className="modal-header">
          <h2>{product.name}</h2>
          <button className="modal-close" onClick={onClose}>Г—</button>
        </div>
        
        {/* Р