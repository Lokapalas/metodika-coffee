import React, { useState, useEffect } from 'react';
import './ProductModalNew.css';

const ProductModalNew = ({ product, isOpen, onClose, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [activeTab, setActiveTab] = useState('toppings'); // 'toppings', 'temperature', 'extras'
  
  // Цены по размерам (пример)
  const sizePrices = {
    'S': product.basePrice || 240,
    'M': product.basePrice ? product.basePrice + 40 : 280,
    'L': product.basePrice ? product.basePrice + 90 : 330
  };

  // Дополнения
  const toppings = [
    { id: 1, name: 'Сироп ванильный', price: 30 },
    { id: 2, name: 'Сироп карамельный', price: 30 },
    { id: 3, name: 'Сироп шоколадный', price: 30 },
    { id: 4, name: 'Сироп кокосовый', price: 30 },
    { id: 5, name: 'Двойной эспрессо', price: 85 },
    { id: 6, name: 'Безлактозное молоко', price: 50 },
    { id: 7, name: 'Миндальное молоко', price: 50 },
    { id: 8, name: 'Мёд', price: 35 },
    { id: 9, name: 'Сгущёнка', price: 40 },
  ];

  // Посыпки
  const sprinkles = [
    { id: 1, name: 'Корица', price: 0 },
    { id: 2, name: 'Какао', price: 0 },
    { id: 3, name: 'Кокос', price: 10 },
    { id: 4, name: 'Орехи', price: 15 },
  ];

  // Температура и опции
  const temperatureOptions = [
    { id: 1, name: 'Горячий', icon: '🔥' },
    { id: 2, name: 'Тёплый', icon: '☕' },
    { id: 3, name: 'Холодный', icon: '🧊' },
  ];

  const lidOptions = [
    { id: 1, name: 'С крышкой', icon: '🧢' },
    { id: 2, name: 'Без крышки', icon: '☕' },
  ];

  const cupOptions = [
    { id: 1, name: 'Керамика', icon: '🍶' },
    { id: 2, name: 'Бумажный', icon: '📄' },
    { id: 3, name: 'Свой стакан', icon: '♻️' },
  ];

  const handleToppingClick = (topping) => {
    const isSelected = selectedToppings.find(t => t.id === topping.id);
    if (isSelected) {
      setSelectedToppings(selectedToppings.filter(t => t.id !== topping.id));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  const calculateTotal = () => {
    const basePrice = sizePrices[selectedSize] || 280;
    const toppingsPrice = selectedToppings.reduce((sum, topping) => sum + topping.price, 0);
    return (basePrice + toppingsPrice) * quantity;
  };

  const handleAddToCart = () => {
    const item = {
      ...product,
      selectedSize,
      quantity,
      toppings: selectedToppings,
      totalPrice: calculateTotal()
    };
    onAddToCart(item);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Кнопка закрытия */}
        <button className="modal-close" onClick={onClose}>×</button>
        
        {/* Верхняя часть: Фото и название */}
        <div className="modal-header">
          <div className="product-image">
            <img 
              src={product.image || '/images/products/coffee/cappuccino.jpg'} 
              alt={product.name}
            />
          </div>
          <div className="product-title">
            <h2>{product.name || 'Капучино'}</h2>
            <p className="product-description">
              {product.description || 'Кофе с молочной пенкой идеальной текстуры'}
            </p>
          </div>
        </div>

        {/* Средняя часть: Настрой как любишь */}
        <div className="modal-customization">
          <h3>Настрой как любишь</h3>
          
          {/* Табы */}
          <div className="customization-tabs">
            <button 
              className={activeTab === 'sprinkles' ? 'active' : ''}
              onClick={() => setActiveTab('sprinkles')}
            >
              Посыпки
            </button>
            <button 
              className={activeTab === 'toppings' ? 'active' : ''}
              onClick={() => setActiveTab('toppings')}
            >
              Топлинг
            </button>
            <button 
              className={activeTab === 'sugar' ? 'active' : ''}
              onClick={() => setActiveTab('sugar')}
            >
              Сахар
            </button>
            <button 
              className={activeTab === 'extras' ? 'active' : ''}
              onClick={() => setActiveTab('extras')}
            >
              Дополнение
            </button>
          </div>

          {/* Контент табов */}
          <div className="customization-content">
            {activeTab === 'sprinkles' && (
              <div className="options-grid">
                {sprinkles.map(sprinkle => (
                  <button
                    key={sprinkle.id}
                    className={`option-button ${selectedToppings.find(t => t.id === sprinkle.id) ? 'selected' : ''}`}
                    onClick={() => handleToppingClick(sprinkle)}
                  >
                    <span className="option-name">{sprinkle.name}</span>
                    {sprinkle.price > 0 && (
                      <span className="option-price">+{sprinkle.price}₽</span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'toppings' && (
              <div className="options-grid">
                {toppings.slice(0, 6).map(topping => (
                  <button
                    key={topping.id}
                    className={`option-button ${selectedToppings.find(t => t.id === topping.id) ? 'selected' : ''}`}
                    onClick={() => handleToppingClick(topping)}
                  >
                    <span className="option-name">{topping.name}</span>
                    <span className="option-price">+{topping.price}₽</span>
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'sugar' && (
              <div className="options-grid">
                {[0, 1, 2, 3].map(amount => (
                  <button
                    key={amount}
                    className="option-button"
                    onClick={() => {/* Логика выбора сахара */}}
                  >
                    <span className="option-name">
                      {amount === 0 ? 'Без сахара' : `${amount} ложки`}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'extras' && (
              <div className="extras-container">
                {/* Температура */}
                <div className="extras-section">
                  <h4>Температура</h4>
                  <div className="options-row">
                    {temperatureOptions.map(option => (
                      <button key={option.id} className="icon-button">
                        <span className="option-icon">{option.icon}</span>
                        <span>{option.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Крышка */}
                <div className="extras-section">
                  <h4>Крышка</h4>
                  <div className="options-row">
                    {lidOptions.map(option => (
                      <button key={option.id} className="icon-button">
                        <span className="option-icon">{option.icon}</span>
                        <span>{option.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Стакан */}
                <div className="extras-section">
                  <h4>Стакан</h4>
                  <div className="options-row">
                    {cupOptions.map(option => (
                      <button key={option.id} className="icon-button">
                        <span className="option-icon">{option.icon}</span>
                        <span>{option.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Нижняя фиксированная часть: Размер, количество, цена, кнопка */}
        <div className="modal-footer fixed-footer">
          <div className="size-selector">
            <button 
              className={`size-button ${selectedSize === 'S' ? 'selected' : ''}`}
              onClick={() => setSelectedSize('S')}
            >
              <div className="size-label">250 мл</div>
              <div className="size-price">{sizePrices['S']}₽</div>
            </button>
            <button 
              className={`size-button ${selectedSize === 'M' ? 'selected' : ''}`}
              onClick={() => setSelectedSize('M')}
            >
              <div className="size-label">350 мл</div>
              <div className="size-price">{sizePrices['M']}₽</div>
            </button>
            <button 
              className={`size-button ${selectedSize === 'L' ? 'selected' : ''}`}
              onClick={() => setSelectedSize('L')}
            >
              <div className="size-label">450 мл</div>
              <div className="size-price">{sizePrices['L']}₽</div>
            </button>
          </div>

          <div className="order-summary">
            <div className="quantity-selector">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
            
            <div className="total-price">
              <div className="price-label">Итого:</div>
              <div className="price-amount">{calculateTotal()}₽</div>
            </div>

            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              Добавить в корзину за {calculateTotal()}₽
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModalNew;
