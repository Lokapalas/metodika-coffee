import React, { useState } from 'react';
import './ProductModal.css';
import { useCart } from '../context/CartContext';

function ProductModal({ product, isOpen, onClose }) {
  const { addToCart } = useCart();
  
  // Состояния для кастомизации
  const [selectedSize, setSelectedSize] = useState('M');
  const [extras, setExtras] = useState({
    сироп: false,
    шоколад: false,
    корица: false,
    карамель: false,
    мята: false
  });
  const [milkType, setMilkType] = useState('обычное');
  const [quantity, setQuantity] = useState(1);
  
  // Цены за размеры
  const sizePrices = {
    'S': product.price - 30,
    'M': product.price,
    'L': product.price + 40
  };
  
  // Цены за дополнения
  const extraPrices = {
    'сироп': 30,
    'шоколад': 40,
    'корица': 20,
    'карамель': 35,
    'мята': 25
  };
  
  // Расчет итоговой цены
  const calculateTotalPrice = () => {
    let total = sizePrices[selectedSize];
    
    // Добавляем стоимость дополнений
    Object.keys(extras).forEach(extra => {
      if (extras[extra]) {
        total += extraPrices[extra];
      }
    });
    
    // Умножаем на количество
    return total * quantity;
  };
  
  // Обработчик изменения дополнений
  const handleExtraChange = (extra) => {
    setExtras(prev => ({
      ...prev,
      [extra]: !prev[extra]
    }));
  };
  
  // Обработчик добавления в корзину
  const handleAddToCart = () => {
    const customProduct = {
      id: product.id + '-' + Date.now(), // Уникальный ID для кастомизированного товара
      baseProduct: product,
      customizations: {
        size: selectedSize,
        extras: Object.keys(extras).filter(extra => extras[extra]),
        milkType: milkType,
        quantity: quantity
      },
      name: `${product.name} (${selectedSize})`,
      price: calculateTotalPrice(),
      totalPrice: calculateTotalPrice() * quantity,
      image: product.image
    };
    
    addToCart(customProduct);
    onClose();
    
    // Уведомление
    alert(`Добавлено в корзину: ${product.name} (${selectedSize})`);
  };
  
  if (!isOpen || !product) return null;
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Заголовок и кнопка закрытия */}
        <div className="modal-header">
          <h2>{product.name}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        {/* Изображение продукта */}
        <div className="modal-image">
          <img src={product.image} alt={product.name} />
        </div>
        
        {/* Основной контент */}
        <div className="modal-content">
          {/* Выбор размера */}
          <div className="size-section">
            <h3>Размер</h3>
            <div className="size-options">
              {['S', 'M', 'L'].map(size => (
                <button
                  key={size}
                  className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  <span className="size-label">{size}</span>
                  <span className="size-price">
                    {size === 'S' ? product.price - 30 : 
                     size === 'M' ? product.price : 
                     product.price + 40} ₽
                  </span>
                  <span className="size-volume">
                    {size === 'S' ? '300 мл' : 
                     size === 'M' ? '450 мл' : 
                     '600 мл'}
                  </span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Выбор типа молока */}
          <div className="milk-section">
            <h3>Молоко</h3>
            <div className="milk-options">
              {['обычное', 'овсяное', 'миндальное', 'кокосовое', 'соевое'].map(milk => (
                <button
                  key={milk}
                  className={`milk-option ${milkType === milk ? 'selected' : ''}`}
                  onClick={() => setMilkType(milk)}
                >
                  {milk.charAt(0).toUpperCase() + milk.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          {/* Дополнения */}
          <div className="extras-section">
            <h3>Дополнения</h3>
            <div className="extras-grid">
              {Object.keys(extras).map(extra => (
                <div key={extra} className="extra-item">
                  <label className="extra-checkbox">
                    <input
                      type="checkbox"
                      checked={extras[extra]}
                      onChange={() => handleExtraChange(extra)}
                    />
                    <span className="checkmark"></span>
                    <span className="extra-name">
                      {extra.charAt(0).toUpperCase() + extra.slice(1)}
                    </span>
                  </label>
                  <span className="extra-price">+{extraPrices[extra]} ₽</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Выбор количества */}
          <div className="quantity-section">
            <h3>Количество</h3>
            <div className="quantity-control">
              <button 
                className="quantity-btn minus"
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                disabled={quantity <= 1}
              >
                −
              </button>
              <span className="quantity-display">{quantity}</span>
              <button 
                className="quantity-btn plus"
                onClick={() => setQuantity(prev => prev + 1)}
              >
                +
              </button>
            </div>
          </div>
          
          {/* Итоговая цена */}
          <div className="price-summary">
            <div className="price-row">
              <span>Размер ({selectedSize})</span>
              <span>{sizePrices[selectedSize]} ₽</span>
            </div>
            
            {Object.keys(extras)
              .filter(extra => extras[extra])
              .map(extra => (
                <div key={extra} className="price-row extra-price-row">
                  <span>{extra.charAt(0).toUpperCase() + extra.slice(extra)}</span>
                  <span>+{extraPrices[extra]} ₽</span>
                </div>
              ))
            }
            
            <div className="price-row total-price-row">
              <span>Итого за {quantity} шт.</span>
              <span className="total-price">{calculateTotalPrice()} ₽</span>
            </div>
          </div>
          
          {/* Кнопка добавления в корзину */}
          <button className="modal-add-to-cart" onClick={handleAddToCart}>
            Добавить в корзину за {calculateTotalPrice()} ₽
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
