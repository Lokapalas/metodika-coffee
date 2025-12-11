import React, { useState, useEffect } from 'react';
import './ProductModal.css';

const ProductModal = ({ product, isOpen, onClose, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [sugar, setSugar] = useState(0);
  const [cinnamon, setCinnamon] = useState(false);
  const [selectedSyrups, setSelectedSyrups] = useState([]);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [selectedSprinkles, setSelectedSprinkles] = useState([]);
  const [selectedSweetener, setSelectedSweetener] = useState('none');
  const [iceCream, setIceCream] = useState(0);
  
  // Активная вкладка (как в Winners)
  const [activeTab, setActiveTab] = useState('sizes');
  
  // Инициализация
  useEffect(() => {
    if (product.has_sizes && product.sizes && product.sizes.length > 0) {
      setSelectedSize(product.sizes[1]); // M по умолчанию
    }
  }, [product]);

  if (!isOpen) return null;

  // Иконки для дополнений
  const getIconForAddon = (name) => {
    const icons = {
      // Посыпки
      'Сладкий чили': '🌶️',
      'Черная соль': '⚫',
      'Голубая матча': '🌀',
      'Мокко': '☕',
      'Вишня сублимированная': '🍒',
      'Маршмеллоу': '🍡',
      
      // Топпинги
      'Карамельный': '🍯',
      'Шоколадный': '🍫',
      'Кленовый': '🍁',
      
      // Сиропы
      'Ванильный': '🌿',
      'Карамельный сироп': '🍯',
      'Кокосовый': '🥥',
      
      // Сахар
      'Без сахара': '🚫',
      'Сахар тростниковый': '🍬',
      'Сахарозаменитель': '⚡',
      
      // Дополнения
      'Корица': '🫚',
      '+1 шарик мороженого': '🍨',
    };
    
    return icons[name] || '✨';
  };

  // Расчет цены
  const calculateTotal = () => {
    let total = 0;
    
    // Цена размера
    if (product.has_sizes && selectedSize) {
      total += selectedSize.price;
    } else if (product.default_price) {
      total += product.default_price;
    }
    
    // Посыпки
    total += selectedSprinkles.length * 20;
    
    // Топпинги
    total += selectedToppings.length * 50;
    
    // Сиропы
    if (product.addons?.syrups?.available) {
      selectedSyrups.forEach(syrupName => {
        const syrup = product.addons.syrups.options.find(s => s.name === syrupName);
        if (syrup) total += syrup.price;
      });
    }
    
    // Корица
    if (cinnamon && product.addons?.extras?.available) {
      const cinnamonOption = product.addons.extras.options.find(e => e.name === 'Корица');
      if (cinnamonOption) total += cinnamonOption.price;
    }
    
    // Мороженое
    total += iceCream * 50;
    
    return total * quantity;
  };

  const handleAddToCart = () => {
    const cartItem = {
      product_id: product.id,
      name: product.name,
      size: selectedSize ? selectedSize.size : null,
      volume: selectedSize ? selectedSize.volume : null,
      price: calculateTotal() / quantity,
      quantity: quantity,
      category: product.category,
      subcategory: product.subcategory,
      addons: {
        sprinkles: selectedSprinkles,
        toppings: selectedToppings,
        syrups: selectedSyrups,
        sweetener: selectedSweetener,
        sugar: selectedSweetener === 'sugar' ? sugar : 0,
        cinnamon: cinnamon,
        iceCream: iceCream
      }
    };
    
    onAddToCart(cartItem);
    onClose();
    resetState();
  };

  const resetState = () => {
    setQuantity(1);
    setSugar(0);
    setCinnamon(false);
    setSelectedSyrups([]);
    setSelectedToppings([]);
    setSelectedSprinkles([]);
    setSelectedSweetener('none');
    setIceCream(0);
    setActiveTab('sizes');
  };

  const totalPrice = calculateTotal();

  // Функции для переключения дополнений
  const toggleSprinkle = (name) => {
    setSelectedSprinkles(prev => 
      prev.includes(name) 
        ? prev.filter(s => s !== name)
        : [...prev, name]
    );
  };

  const toggleTopping = (name) => {
    setSelectedToppings(prev => 
      prev.includes(name) 
        ? prev.filter(t => t !== name)
        : [...prev, name]
    );
  };

  const toggleSyrup = (name) => {
    setSelectedSyrups(prev => 
      prev.includes(name) 
        ? prev.filter(s => s !== name)
        : [...prev, name]
    );
  };

  // Проверяем доступность секций
  const hasSprinkles = product.addons?.sprinkles?.available && product.addons.sprinkles.options.length > 0;
  const hasToppings = product.addons?.toppings?.available && product.addons.toppings.options.length > 0;
  const hasSweeteners = product.addons?.sweeteners?.available && product.addons.sweeteners.options.length > 0;
  const hasExtras = product.addons?.extras?.available && product.addons.extras.options.length > 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content winners-style" onClick={(e) => e.stopPropagation()}>
        {/* Шапка с кнопкой закрытия */}
        <div className="modal-header">
          <button className="modal-close" onClick={onClose}>✕</button>
          <h2>{product.name}</h2>
          <p className="modal-subtitle">Настрой как любишь</p>
        </div>

        {/* Основное описание */}
        <div className="product-description-section">
          <p>{product.description}</p>
        </div>

        {/* Навигация по вкладкам (как в Winners) */}
        <div className="tabs-navigation">
          {product.has_sizes && (
            <button 
              className={`tab-btn ${activeTab === 'sizes' ? 'active' : ''}`}
              onClick={() => setActiveTab('sizes')}
            >
              Размеры
            </button>
          )}
          {hasSprinkles && (
            <button 
              className={`tab-btn ${activeTab === 'sprinkles' ? 'active' : ''}`}
              onClick={() => setActiveTab('sprinkles')}
            >
              Посыпки
            </button>
          )}
          {hasToppings && (
            <button 
              className={`tab-btn ${activeTab === 'toppings' ? 'active' : ''}`}
              onClick={() => setActiveTab('toppings')}
            >
              Топпинг
            </button>
          )}
          {hasSweeteners && (
            <button 
              className={`tab-btn ${activeTab === 'sugar' ? 'active' : ''}`}
              onClick={() => setActiveTab('sugar')}
            >
              Сахар
            </button>
          )}
          {hasExtras && (
            <button 
              className={`tab-btn ${activeTab === 'extras' ? 'active' : ''}`}
              onClick={() => setActiveTab('extras')}
            >
              Дополнение
            </button>
          )}
        </div>

        {/* Контент вкладок */}
        <div className="tab-content">
          {/* Вкладка размеров */}
          {activeTab === 'sizes' && product.has_sizes && (
            <div className="sizes-section">
              <div className="sizes-grid">
                {product.sizes.map((size, index) => (
                  <button
                    key={index}
                    className={`size-option ${selectedSize?.size === size.size ? 'selected' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    <div className="size-name">{size.size}</div>
                    <div className="size-volume">{size.volume}</div>
                    <div className="size-price">{size.price} ₽</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Вкладка посыпок */}
          {activeTab === 'sprinkles' && hasSprinkles && (
            <div className="addons-section">
              <div className="addons-grid">
                {product.addons.sprinkles.options.map((sprinkle, index) => (
                  <button
                    key={index}
                    className={`addon-btn ${selectedSprinkles.includes(sprinkle.name) ? 'selected' : ''}`}
                    onClick={() => toggleSprinkle(sprinkle.name)}
                  >
                    <span className="addon-icon">{getIconForAddon(sprinkle.name)}</span>
                    <span className="addon-name">{sprinkle.name}</span>
                    <span className="addon-price">+{sprinkle.price} ₽</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Вкладка топпингов */}
          {activeTab === 'toppings' && hasToppings && (
            <div className="addons-section">
              <div className="addons-grid">
                {product.addons.toppings.options.map((topping, index) => (
                  <button
                    key={index}
                    className={`addon-btn ${selectedToppings.includes(topping.name) ? 'selected' : ''}`}
                    onClick={() => toggleTopping(topping.name)}
                  >
                    <span className="addon-icon">{getIconForAddon(topping.name)}</span>
                    <span className="addon-name">{topping.name}</span>
                    <span className="addon-price">+{topping.price} ₽</span>
                  </button>
                ))}
              </div>
              {/* Сиропы тоже в топпингах как в Winners */}
              {product.addons?.syrups?.available && (
                <>
                  <div className="section-divider">
                    <span>Сиропы</span>
                  </div>
                  <div className="addons-grid">
                    {product.addons.syrups.options.map((syrup, index) => (
                      <button
                        key={index}
                        className={`addon-btn ${selectedSyrups.includes(syrup.name) ? 'selected' : ''}`}
                        onClick={() => toggleSyrup(syrup.name)}
                      >
                        <span className="addon-icon">{getIconForAddon(syrup.name)}</span>
                        <span className="addon-name">{syrup.name}</span>
                        <span className="addon-price">+{syrup.price} ₽</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Вкладка сахара */}
          {activeTab === 'sugar' && hasSweeteners && (
            <div className="sugar-section">
              <div className="sweetener-options">
                {product.addons.sweeteners.options.map((option, index) => (
                  <button
                    key={index}
                    className={`sweetener-btn ${selectedSweetener === option.name.toLowerCase().replace(/ /g, '') ? 'selected' : ''}`}
                    onClick={() => setSelectedSweetener(option.name.toLowerCase().replace(/ /g, ''))}
                  >
                    <span className="sweetener-icon">{getIconForAddon(option.name)}</span>
                    <span className="sweetener-name">{option.name}</span>
                    <span className="sweetener-price">+{option.price} ₽</span>
                  </button>
                ))}
              </div>
              
              {/* Если выбран сахар тростниковый - показываем количество */}
              {selectedSweetener === 'сахартростниковый' && (
                <div className="sugar-quantity">
                  <span>Количество порций:</span>
                  <div className="quantity-control">
                    <button onClick={() => setSugar(Math.max(0, sugar - 1))}>−</button>
                    <span>{sugar}</span>
                    <button onClick={() => setSugar(sugar + 1)}>+</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Вкладка дополнений */}
          {activeTab === 'extras' && hasExtras && (
            <div className="extras-section">
              <div className="extras-grid">
                {product.addons.extras.options.map((extra, index) => {
                  if (extra.name === 'Корица') {
                    return (
                      <button
                        key={index}
                        className={`extra-btn ${cinnamon ? 'selected' : ''}`}
                        onClick={() => setCinnamon(!cinnamon)}
                      >
                        <span className="extra-icon">{getIconForAddon(extra.name)}</span>
                        <span className="extra-name">{extra.name}</span>
                        <span className="extra-price">+{extra.price} ₽</span>
                      </button>
                    );
                  }
                  
                  if (extra.name === '+1 шарик мороженого') {
                    return (
                      <div key={index} className="extra-item-with-counter">
                        <div className="extra-info">
                          <span className="extra-icon">{getIconForAddon(extra.name)}</span>
                          <span className="extra-name">{extra.name}</span>
                          <span className="extra-price">+{extra.price} ₽</span>
                        </div>
                        <div className="extra-counter">
                          <button onClick={() => setIceCream(Math.max(0, iceCream - 1))}>−</button>
                          <span>{iceCream}</span>
                          <button onClick={() => setIceCream(iceCream + 1)}>+</button>
                        </div>
                      </div>
                    );
                  }
                  
                  return null;
                })}
              </div>
            </div>
          )}
        </div>

        {/* Счетчик количества */}
        <div className="quantity-section">
          <span>Количество:</span>
          <div className="quantity-control large">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>
        </div>

        {/* Итоговая цена и кнопка */}
        <div className="total-section">
          <div className="total-info">
            <span className="total-label">Итого:</span>
            <span className="total-price">{totalPrice} ₽</span>
          </div>
          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            Добавить в корзину
          </button>
        </div>

        {/* Предпросмотр выбранных опций */}
        <div className="selected-options-preview">
          {selectedSize && (
            <span className="selected-option">{selectedSize.size} • {selectedSize.volume}</span>
          )}
          {selectedSprinkles.length > 0 && (
            <span className="selected-option">Посыпки: {selectedSprinkles.length}</span>
          )}
          {selectedToppings.length > 0 && (
            <span className="selected-option">Топпинг: {selectedToppings.length}</span>
          )}
          {selectedSyrups.length > 0 && (
            <span className="selected-option">Сиропы: {selectedSyrups.length}</span>
          )}
          {selectedSweetener !== 'none' && (
            <span className="selected-option">Сахар: {selectedSweetener === 'безсахара' ? 'Нет' : 'Есть'}</span>
          )}
          {cinnamon && <span className="selected-option">Корица</span>}
          {iceCream > 0 && <span className="selected-option">Мороженое: {iceCream}</span>}
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
