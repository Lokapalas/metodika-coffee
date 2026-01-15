import React, { useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from './CartContext';
import {
  categories,
  getProductsByCategory,
  getBasePrice,
  getProductById,
} from './menuData';
import { getProductImage } from './utils/imageUtils';
import ProductModal from './ProductModal';
import './MainPage.css';

function MainPage() {
  const {
    cartItems,
    addToCart,
    removeFromCart,
    getTotalPrice,
    clearCart,
  } = useContext(CartContext);

  const navigate = useNavigate();
  const cartRef = useRef(null);

  const [activeCategory, setActiveCategory] = useState('coffee-classic');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [imageErrors, setImageErrors] = useState({});

  const products = getProductsByCategory(activeCategory);
  const currentCategory = categories.find(c => c.id === activeCategory);

  const openProduct = (product) => {
    setSelectedProduct(getProductById(product.id));
    setModalOpen(true);
  };

  const addFromModal = (item) => {
    addToCart(item);
    cartRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const checkout = () => {
    if (cartItems.length === 0) {
      alert('Cart is empty');
      return;
    }
    navigate('/checkout');
  };

  const cartItemKey = (item) =>
    `${item.id}-${item.selectedSize || 'M'}-${item.selectedAdditives?.join('-') || 'none'}`;

  return (
    <div className="main-page">
      <ProductModal
        product={selectedProduct}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAddToCart={addFromModal}
      />

      <section className="categories-section">
        <h2>Menu categories</h2>
        <div className="categories-list">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`category-btn ${cat.id === activeCategory ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <span className="category-name">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      <div className="content-wrapper">
        <section className="menu-section">
          <div className="menu-header">
            <h2>{currentCategory?.name}</h2>
            <span>{products.length} items</span>
          </div>

          <div className="menu-grid">
            {products.map(product => (
              <div
                key={product.id}
                className="menu-item"
                onClick={() => openProduct(product)}
              >
                <div className="menu-item-image">
                  <img
                    src={getProductImage(product.name, product.image)}
                    alt={product.name}
                    onError={() =>
                      setImageErrors(prev => ({ ...prev, [product.id]: true }))
                    }
                  />
                  {imageErrors[product.id] && (
                    <div className="image-fallback">No image</div>
                  )}
                </div>

                <div className="menu-item-content">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <div className="menu-item-price">
                    {getBasePrice(product)} ?
                  </div>
                  <button className="add-to-cart-btn">
                    Select options
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="cart-section" ref={cartRef}>
          <h2>Cart</h2>

          {cartItems.length === 0 ? (
            <p>Cart is empty</p>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map(item => (
                  <div key={cartItemKey(item)} className="cart-item">
                    <span>{item.name}</span>
                    <span>x{item.quantity}</span>
                    <button onClick={() => removeFromCart(cartItemKey(item))}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="cart-total">
                Total: {getTotalPrice()} ?
              </div>

              <button onClick={checkout}>
                Checkout
              </button>

              <button onClick={clearCart}>
                Clear cart
              </button>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}

export default MainPage;
