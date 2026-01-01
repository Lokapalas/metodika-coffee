import React, { useState, useEffect, useContext } from 'react';
import { CartContext } from './CartContext';
import { getAvailableSizes, getAvailableAdditives, additives } from './menuData';
import './ProductModal.css';

const ProductModal = ({ product, isOpen, onClose, onAddToCart }) => {
    const [selectedSize, setSelectedSize] = useState('M');
    const [selectedAdditives, setSelectedAdditives] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        if (product && isOpen) {
            // Устанавливаем первый доступный размер по умолчанию
            const availableSizes = getAvailableSizes(product);
            if (availableSizes.length > 0) {
                setSelectedSize(availableSizes[0].size);
            }
            setSelectedAdditives([]);
            setQuantity(1);
        }
    }, [product, isOpen]);

    if (!isOpen || !product) return null;

    const availableSizes = getAvailableSizes(product);
    const availableAdditives = getAvailableAdditives(product);
    const selectedSizeData = product.sizes[selectedSize];
    const basePrice = selectedSizeData?.price || 0;

    // Рассчитываем цену с добавками
    const calculateAdditivePrice = (additive) => {
        if (additive.prices && additive.prices[selectedSize]) {
            return additive.prices[selectedSize];
        }
        return additive.price || 0;
    };

    const additivesPrice = selectedAdditives.reduce((total, additiveId) => {
        const additive = additives.find(a => a.id === additiveId);
        return total + (calculateAdditivePrice(additive) || 0);
    }, 0);

    const totalPrice = (basePrice + additivesPrice) * quantity;

    const handleAdditiveToggle = (additiveId) => {
        setSelectedAdditives(prev =>
            prev.includes(additiveId)
                ? prev.filter(id => id !== additiveId)
                : [...prev, additiveId]
        );
    };

    const handleAddToCart = () => {
        const cartItem = {
            ...product,
            selectedSize,
            selectedAdditives,
            quantity,
            finalPrice: totalPrice / quantity,
            additivesDetails: selectedAdditives.map(id => additives.find(a => a.id === id))
        };
        
        addToCart(cartItem);
        onAddToCart && onAddToCart(cartItem);
        onClose();
    };

    const getAdditivePriceText = (additive) => {
        if (additive.prices) {
            return `(${additive.prices.S}/${additive.prices.M}/${additive.prices.L}₽)`;
        }
        return additive.price ? `(${additive.price}₽)` : '';
    };

    // Группируем добавки по категориям
    const groupedAdditives = availableAdditives.reduce((groups, additive) => {
        const category = additive.category || 'other';
        if (!groups[category]) {
            groups[category] = [];
        }
        groups[category].push(additive);
        return groups;
    }, {});

    const categoryNames = {
        'coffee': 'Для кофе',
        'milk': 'Растительное молоко',
        'syrups': 'Сиропы',
        'sweeteners': 'Сладости',
        'toppings': 'Топпинги',
        'breakfast': 'Для завтрака',
        'porridge': 'Для каши',
        'other': 'Другие добавки'
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>×</button>
                
                <div className="modal-header">
                    <h2>{product.name}</h2>
                    <p className="modal-description">{product.description}</p>
                </div>

                <div className="modal-body">
                    {/* Выбор размера */}
                    {availableSizes.length > 1 && (
                        <div className="size-section">
                            <h3>Размер:</h3>
                            <div className="size-options">
                                {availableSizes.map(size => (
                                    <button
                                        key={size.size}
                                        className={`size-option ${selectedSize === size.size ? 'selected' : ''}`}
                                        onClick={() => setSelectedSize(size.size)}
                                    >
                                        <span className="size-label">{size.size}</span>
                                        <span className="size-price">{size.price}₽</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Выбор добавок */}
                    {availableAdditives.length > 0 && (
                        <div className="additives-section">
                            <h3>Добавки:</h3>
                            <div className="additives-list">
                                {Object.entries(groupedAdditives).map(([category, categoryAdditives]) => (
                                    <div key={category} className="additive-category">
                                        <h4>{categoryNames[category] || category}</h4>
                                        <div className="additive-options">
                                            {categoryAdditives.map(additive => (
                                                <label key={additive.id} className="additive-option">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedAdditives.includes(additive.id)}
                                                        onChange={() => handleAdditiveToggle(additive.id)}
                                                    />
                                                    <span className="additive-name">{additive.name}</span>
                                                    <span className="additive-price">
                                                        {getAdditivePriceText(additive)}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Выбор количества */}
                    <div className="quantity-section">
                        <h3>Количество:</h3>
                        <div className="quantity-controls">
                            <button 
                                className="quantity-btn"
                                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                            >
                                −
                            </button>
                            <span className="quantity-value">{quantity}</span>
                            <button 
                                className="quantity-btn"
                                onClick={() => setQuantity(prev => prev + 1)}
                            >
                                +
                            </button>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <div className="price-summary">
                        <div className="price-details">
                            <span>Базовая цена:</span>
                            <span>{basePrice}₽</span>
                        </div>
                        {additivesPrice > 0 && (
                            <div className="price-details">
                                <span>Добавки:</span>
                                <span>+{additivesPrice}₽</span>
                            </div>
                        )}
                        <div className="price-details total">
                            <strong>Итого:</strong>
                            <strong>{totalPrice}₽</strong>
                        </div>
                    </div>
                    
                    <button className="add-to-cart-modal-btn" onClick={handleAddToCart}>
                        Добавить в корзину за {totalPrice}₽
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;
