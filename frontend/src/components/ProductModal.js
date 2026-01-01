import React, { useState } from 'react';
import '../ProductModal.css';
import { useCart } from '../context/CartContext';

function ProductModal({ product, isOpen, onClose }) {
  const { addToCart } = useCart();
  
  // Состояния для кастомизации
  const availableSizes = product.sizes || ['M'];
  const [selectedSize, setSelectedSize] = useState(availableSizes.includes('M') ? 'M' : availableSizes[0]);
  const [extras, setExtras] = useState({
    сироп: false,
    шоколад: false,
    корица: false,
    карамель: false,
    мята: false,
    'сгущёнка': false,
    'пюре манго': false,
    груша: false,
    халва: false,
    семена: false,
    'клюква сушёная': false,
    ягоды: false
  });
  const [milkType, setMilkType] = useState('обычное');
  const [quantity, setQuantity] = useState(1);
  
  // Цены за размеры
  const sizePrices = product.prices || { [availableSizes[0]]: product.price || 0 };
  
  // Цены за дополнения
  const extraPrices = {
    'сироп': 30,
    'шоколад': 40,
    'корица': 20,
    'карамель': 35,
    'мята': 25,
    'сгущёнка': 40,
    'пюре манго': 60,
    'груша': 60,
    'халва': 30,
    'семена': 40,
    'клюква сушёная': 50,
    'ягоды': 80
  };
  
  // Дополнительная плата за растительное молоко
  const milkTypePrices = {
    'обычное': 0,
    'безлактозное': 50,
    'миндальное': 50,
    'банановое': 50,
    'кокосовое': 50,
    'фисташковое': 50,
    'фундучное': 50
  };
  
  // Расчет итоговой цены
  const calculateTotalPrice = () => {
    let total = sizePrices[selectedSize] || 0;
    
    // Добавляем стоимость дополнений
    Object.keys(extras).forEach(extra => {
      if (extras[extra] && extraPrices[extra]) {
        total += extraPrices[extra];
      }
    });
    
    // Добавляем стоимость растительного молока
    if (milkTypePrices[milkType]) {
      total += milkTypePrices[milkType];
    }
    
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
    // Собираем выбранные дополнения
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
    
    // Уведомление
    alert(`Добавлено в корзину: ${product.name} (${selectedSize})`);
  };
  
  if (!isOpen || !product) return null;
  
  // Определяем, нужно ли показывать выбор молока
  const showMilkSelection = product.category === 'Еда' && 
    (product.subcategory === 'Завтраки' || product.name.includes('каша'));
  
  // Функция для получения объема по размеру (новые размеры)
  const getVolumeForSize = (size) => {
    switch(size) {
      case 'S': return '250 мл';
      case 'M': return '350 мл';
      case 'L': return '400 мл';
      default: return '';
    }
  };
  
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
          <div className="modal-category-badge">
            <span className="category-badge">{product.category}</span>
            {product.subcategory && product.subcategory !== 'Все' && (
              <span className="subcategory-badge">{product.subcategory}</span>
            )}
          </div>
        </div>
        
        {/* Основной контент */}
        <div className="modal-content">
          {/* Описание продукта */}
          <div className="modal-description">
            <p>{product.description}</p>
          </div>
          
          {/* Выбор размера (если есть несколько размеров) */}
          {availableSizes.length > 1 && (
            <div className="size-section">
              <h3>Размер</h3>
              <div className="size-options">
                {availableSizes.map(size => (
                  <button
                    key={size}
                    className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    <span className="size-label">{size}</span>
                    <span className="size-price">
                      {sizePrices[size] || 0} ₽
                    </span>
                    <span className="size-volume">
                      {getVolumeForSize(size)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Выбор типа молока (для завтраков) */}
          {showMilkSelection && (
            <div className="milk-section">
              <h3>Молоко</h3>
              <div className="milk-options">
                {Object.keys(milkTypePrices).map(milk => (
                  <button
                    key={milk}
                    className={`milk-option ${milkType === milk ? 'selected' : ''}`}
                    onClick={() => setMilkType(milk)}
                  >
                    {milk.charAt(0).toUpperCase() + milk.slice(1)}
                    {milkTypePrices[milk] > 0 && (
                      <span className="milk-price">+{milkTypePrices[milk]} ₽</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Дополнения */}
          <div className="extras-section">
            <h3>Дополнения</h3>
            <div className="extras-grid">
              {(product.category === 'Еда' && product.subcategory === 'Завтраки') || 
               product.name.includes('Сырники') || 
               product.name.includes('каша') ? (
                // Дополнения для еды
                ['сгущёнка', 'пюре манго', 'груша', 'халва', 'семена', 'клюква сушёная', 'ягоды'].map(extra => (
                  <div key={extra} className="extra-item">
                    <label className="extra-checkbox">
                      <input
                        type="checkbox"
                        checked={extras[extra] || false}
                        onChange={() => handleExtraChange(extra)}
                      />
                      <span className="checkmark"></span>
                      <span className="extra-name">
                        {extra.charAt(0).toUpperCase() + extra.slice(1)}
                      </span>
                    </label>
                    <span className="extra-price">+{extraPrices[extra]} ₽</span>
                  </div>
                ))
              ) : (
                // Дополнения для напитков
                ['сироп', 'шоколад', 'корица', 'карамель', 'мята'].map(extra => (
                  <div key={extra} className="extra-item">
                    <label className="extra-checkbox">
                      <input
                        type="checkbox"
                        checked={extras[extra] || false}
                        onChange={() => handleExtraChange(extra)}
                      />
                      <span className="checkmark"></span>
                      <span className="extra-name">
                        {extra.charAt(0).toUpperCase() + extra.slice(1)}
                      </span>
                    </label>
                    <span className="extra-price">+{extraPrices[extra]} ₽</span>
                  </div>
                ))
              )}
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
              <span>Основной товар ({selectedSize})</span>
              <span>{sizePrices[selectedSize] || 0} ₽</span>
            </div>
            
            {showMilkSelection && milkTypePrices[milkType] > 0 && (
              <div className="price-row extra-price-row">
                <span>Молоко ({milkType})</span>
                <span>+{milkTypePrices[milkType]} ₽</span>
              </div>
            )}
            
            {Object.keys(extras)
              .filter(extra => extras[extra] && extraPrices[extra])
              .map(extra => (
                <div key={extra} className="price-row extra-price-row">
                  <span>{extra.charAt(0).toUpperCase() + extra.slice(1)}</span>
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
