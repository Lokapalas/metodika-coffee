import React, { useState, useContext, useRef } from 'react';
import { CartContext } from './CartContext';
import { useNavigate } from 'react-router-dom';
import { categories, getProductsByCategory, getBasePrice, getProductById } from './menuData';
import { getProductImage, getCategoryIcon } from './utils/imageUtils';
import ProductModal from './ProductModal';
import './MainPage.css';

function MainPage() {
    const { cartItems, addToCart, removeFromCart, getTotalPrice, clearCart } = useContext(CartContext);
    const navigate = useNavigate();
    
    const [activeCategory, setActiveCategory] = useState('coffee-classic');
    const [imageErrors, setImageErrors] = useState({});
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const products = getProductsByCategory(activeCategory);
    const currentCategory = categories.find(cat => cat.id === activeCategory);
    const cartSectionRef = useRef(null);

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            alert('Добавьте товары в корзину перед оформлением заказа');
            return;
        }
        navigate('/checkout');
    };

    const handleImageError = (productId) => {
        setImageErrors(prev => ({ ...prev, [productId]: true }));
    };

    const handleProductClick = (product) => {
        setSelectedProduct(getProductById(product.id));
        setIsModalOpen(true);
    };

    const handleAddToCartFromModal = (cartItem) => {
        addToCart(cartItem);
        // Прокручиваем к корзине
        if (cartSectionRef.current) {
            cartSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleRemoveFromCart = (itemId) => {
        removeFromCart(itemId);
    };

    const getCartItemId = (item) => {
        return `${item.id}-${item.selectedSize || 'M'}-${item.selectedAdditives?.join('-') || 'no-additives'}`;
    };

    return (
        <div className="main-page">
            {/* Модальное окно продукта */}
            <ProductModal
                product={selectedProduct}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddToCart={handleAddToCartFromModal}
            />

            {/* Категории */}
            <div className="categories-section">
                <h2>🍽️ Категории меню</h2>
                <div className="categories-list">
                    {categories.map(category => (
                        <button
                            key={category.id}
                            className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                            onClick={() => setActiveCategory(category.id)}
                        >
                            <span className="category-icon">{category.icon}</span>
                            <span className="category-name">{category.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="content-wrapper">
                {/* Меню */}
                <div className="menu-section">
                    <div className="menu-header">
                        <h2>
                            <span className="category-icon-large">{currentCategory?.icon}</span>
                            <span className="category-title">{currentCategory?.name}</span>
                        </h2>
                        <div className="menu-stats">
                            <span className="menu-count">{products.length} позиций</span>
                        </div>
                    </div>
                    
                    <div className="menu-grid">
                        {products.map(product => {
                            const basePrice = getBasePrice(product);
                            const hasSizes = Object.values(product.sizes || {}).filter(s => s.available && s.price).length > 1;
                            const priceDisplay = hasSizes ? `от ${basePrice}₽` : `${basePrice}₽`;
                            const availableSizes = Object.entries(product.sizes || {})
                                .filter(([size, data]) => data.available && data.price)
                                .map(([size]) => size);
                            
                            return (
                                <div 
                                    key={product.id} 
                                    className="menu-item"
                                    onClick={() => handleProductClick(product)}
                                >
                                    <div className="menu-item-image-container">
                                        <div className="menu-item-image">
                                            <img 
                                                src={getProductImage(product.name, product.image)}
                                                alt={product.name}
                                                onError={() => handleImageError(product.id)}
                                                loading="lazy"
                                            />
                                            {imageErrors[product.id] && (
                                                <div className="image-fallback">
                                                    {getCategoryIcon(product.category)}
                                                </div>
                                            )}
                                        </div>
                                        {availableSizes.length > 0 && (
                                            <div className="size-badges">
                                                {availableSizes.map(size => (
                                                    <span key={size} className="size-badge">{size}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="menu-item-content">
                                        <div className="menu-item-header">
                                            <h3>{product.name}</h3>
                                            <div className="menu-item-price">{priceDisplay}</div>
                                        </div>
                                        
                                        <p className="menu-item-description">{product.description}</p>
                                        
                                        {product.availableAdditives && product.availableAdditives.length > 0 && (
                                            <div className="additives-hint">
                                                <span className="hint-icon">⚙️</span>
                                                <span className="hint-text">Доступны добавки</span>
                                            </div>
                                        )}
                                        
                                        <button 
                                            className="add-to-cart-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleProductClick(product);
                                            }}
                                        >
                                            <span className="btn-icon">➕</span>
                                            <span className="btn-text">Выбрать опции</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Корзина */}
                <div className="cart-section" ref={cartSectionRef}>
                    <div className="cart-header">
                        <h2>🛒 Ваша корзина</h2>
                        {cartItems.length > 0 && (
                            <button 
                                className="clear-cart-btn-header"
                                onClick={clearCart}
                                title="Очистить корзину"
                            >
                                🗑️
                            </button>
                        )}
                    </div>
                    
                    {cartItems.length === 0 ? (
                        <div className="empty-cart-state">
                            <div className="empty-cart-icon">🛒</div>
                            <p className="empty-cart-title">Корзина пуста</p>
                            <p className="empty-cart-hint">Добавьте товары из меню</p>
                        </div>
                    ) : (
                        <>
                            <div className="cart-items">
                                {cartItems.map(item => {
                                    const itemId = getCartItemId(item);
                                    return (
                                        <div key={itemId} className="cart-item">
                                            <div className="cart-item-main">
                                                <div className="cart-item-info">
                                                    <span className="cart-item-name">{item.name}</span>
                                                    <div className="cart-item-details">
                                                        {item.selectedSize && item.selectedSize !== 'M' && (
                                                            <span className="cart-item-size">Размер: {item.selectedSize}</span>
                                                        )}
                                                        {item.selectedAdditives && item.selectedAdditives.length > 0 && (
                                                            <span className="cart-item-additives">
                                                                +{item.selectedAdditives.length} добавок
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="cart-item-price-single">{item.finalPrice || item.price}₽</div>
                                            </div>
                                            
                                            <div className="cart-item-footer">
                                                <div className="cart-item-controls">
                                                    <button 
                                                        className="quantity-btn minus"
                                                        onClick={() => handleRemoveFromCart(itemId)}
                                                    >
                                                        −
                                                    </button>
                                                    <span className="cart-item-quantity">{item.quantity}</span>
                                                    <button 
                                                        className="quantity-btn plus"
                                                        onClick={() => {
                                                            const itemToAdd = {
                                                                ...item,
                                                                quantity: 1
                                                            };
                                                            addToCart(itemToAdd);
                                                        }}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <div className="cart-item-total">
                                                    {(item.finalPrice || item.price) * item.quantity}₽
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            
                            <div className="cart-summary">
                                <div className="cart-total">
                                    <span>Итого:</span>
                                    <span className="total-price">{getTotalPrice()}₽</span>
                                </div>
                                
                                <div className="cart-actions">
                                    <button 
                                        className="checkout-btn"
                                        onClick={handleCheckout}
                                    >
                                        <span className="checkout-icon">🚀</span>
                                        <span className="checkout-text">Оформить заказ</span>
                                    </button>
                                </div>
                                
                                <div className="telegram-direct">
                                    <p className="telegram-hint">Или закажите напрямую через Telegram:</p>
                                    <a 
                                        href="https://t.me/Metodika_CoffeeBot?startapp=order" 
                                        className="telegram-btn"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <span className="telegram-icon">📲</span>
                                        <span>Заказать в Telegram</span>
                                    </a>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MainPage;
