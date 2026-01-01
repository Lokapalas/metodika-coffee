import React, { useState, useEffect } from 'react';
import "./ProductImage.css";
import ProductModal from './ProductModal';
import CartItem from './CartItem';
import ProductImage from './ProductImage';
import './ProductGrid.css';

// Безопасный парсинг JSON
const safeParseJSON = (str, defaultValue) => {
  try {
    return str ? JSON.parse(str) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);

  // Загрузка продуктов и категорий
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories')
        ]);

        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();

        setProducts(productsData);
        setFilteredProducts(productsData);
        setCategories(categoriesData);

        // БЕЗОПАСНАЯ загрузка корзины из localStorage
        const savedCart = safeParseJSON(localStorage.getItem('metodikaCart'), []);
        setCart(Array.isArray(savedCart) ? savedCart : []);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      }
    };

    fetchData();
  }, []);

  // Сохранение корзины в localStorage
  useEffect(() => {
    // БЕЗОПАСНОЕ сохранение
    try {
      localStorage.setItem('metodikaCart', JSON.stringify(cart));
    } catch (error) {
      console.error('Ошибка сохранения корзины:', error);
    }

    // Расчет общей суммы
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setCartTotal(total);
  }, [cart]);

  // Фильтрация продуктов
  useEffect(() => {
    let filtered = products;

    if (selectedCategory && selectedSubcategory) {
      filtered = filtered.filter(p =>
        p.category === selectedCategory && p.subcategory === selectedSubcategory
      );
    } else if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query)
      );
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, selectedSubcategory, searchQuery, products]);

  // Обработчики корзины
  const handleAddToCart = (item) => {
    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(cartItem =>
        cartItem.product_id === item.product_id &&
        cartItem.size === item.size &&
        JSON.stringify(cartItem.addons) === JSON.stringify(item.addons)
      );

      if (existingIndex >= 0) {
        const updatedCart = [...prevCart];
        updatedCart[existingIndex].quantity += item.quantity;
        return updatedCart;
      } else {
        return [...prevCart, item];
      }
    });
  };

  const handleRemoveFromCart = (itemToRemove) => {
    setCart(prevCart => prevCart.filter(item =>
      !(item.product_id === itemToRemove.product_id &&
        item.size === itemToRemove.size &&
        JSON.stringify(item.addons) === JSON.stringify(itemToRemove.addons))
    ));
  };

  const handleUpdateQuantity = (itemToUpdate, newQuantity) => {
    setCart(prevCart =>
      prevCart.map(item =>
        (item.product_id === itemToUpdate.product_id &&
         item.size === itemToUpdate.size &&
         JSON.stringify(item.addons) === JSON.stringify(itemToUpdate.addons))
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Обработчики модальных окон
  const handleProductClick = async (productId) => {
    try {
      const response = await fetch(`/api/products/${productId}`);
      const productData = await response.json();
      setSelectedProduct(productData);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Ошибка загрузки деталей товара:', error);
    }
  };

  // Очистка фильтров
  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSearchQuery('');
  };

  // Очистка корзины
  const clearCart = () => {
    if (window.confirm('Очистить корзину?')) {
      setCart([]);
    }
  };

  // Получаем все подкатегории для выбранной категории
  const getSubcategoriesForCategory = (category) => {
    return categories[category] || [];
  };

  // Все категории включая "Все товары"
  const allCategories = ['Все товары', ...Object.keys(categories)];

  return (
    <div className="menu-container">
      {/* Шапка с поиском и корзиной */}
      <div className="menu-header">
        <div className="search-container">
          <input
            type="text"
            placeholder="Поиск товаров..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="clear-search-btn"
            >
              ✕
            </button>
          )}
        </div>

        <button
          onClick={() => setIsCartOpen(!isCartOpen)}
          className="cart-toggle-btn"
        >
          🛒 Корзина ({cart.reduce((sum, item) => sum + item.quantity, 0)})
          {cartTotal > 0 && (
            <span className="cart-total"> {cartTotal} ₽</span>
          )}
        </button>
      </div>

      {/* ГОРИЗОНТАЛЬНАЯ НАВИГАЦИЯ */}
      <div className="horizontal-nav">
        <div className="horizontal-nav-content">
          {/* Основные категории */}
          <div className="categories-row">
            {allCategories.map(category => {
              const isAll = category === 'Все товары';
              const isActive = isAll ? !selectedCategory : selectedCategory === category;

              return (
                <button
                  key={category}
                  onClick={() => {
                    if (isAll) {
                      clearFilters();
                    } else {
                      setSelectedCategory(category);
                      setSelectedSubcategory(null);
                    }
                  }}
                  className={`category-tab ${isActive ? 'active' : ''}`}
                >
                  {isAll ? 'Все' : category}
                </button>
              );
            })}
          </div>

          {/* Подкатегории (если выбрана категория) */}
          {selectedCategory && getSubcategoriesForCategory(selectedCategory).length > 0 && (
            <div className="subcategories-row">
              <button
                onClick={() => setSelectedSubcategory(null)}
                className={`subcategory-tab ${!selectedSubcategory ? 'active' : ''}`}
              >
                Все
              </button>

              {getSubcategoriesForCategory(selectedCategory).map(sub => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubcategory(sub)}
                  className={`subcategory-tab ${selectedSubcategory === sub ? 'active' : ''}`}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Основное содержимое */}
      <div className="menu-content">
        {/* Фильтры (активные) */}
        {(selectedCategory || searchQuery) && (
          <div className="active-filters">
            <span className="filter-label">Активные фильтры:</span>
            {selectedCategory && selectedCategory !== 'Все товары' && (
              <span className="filter-tag">
                {selectedCategory}
                {selectedSubcategory && ` • ${selectedSubcategory}`}
                <button
                  onClick={clearFilters}
                  className="filter-remove"
                >
                  ✕
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="filter-tag">
                Поиск: "{searchQuery}"
                <button
                  onClick={() => setSearchQuery('')}
                  className="filter-remove"
                >
                  ✕
                </button>
              </span>
            )}
          </div>
        )}

        {/* Сетка товаров */}
        <div className="products-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <div key={product.id} className="product-card" onClick={() => handleProductClick(product.id)}>
                <ProductImage
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />
                <div className="product-info">
                  <h4>{product.name}</h4>
                  <p className="product-description">
                    {product.description || 'Вкусный напиток от Методика Кофе'}
                  </p>
                  <div className="product-footer">
                    <span className="product-price">{product.price} ₽</span>
                    <button className="product-select-btn">Выбрать</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-products">
              <p>Товары не найдены</p>
              <button onClick={clearFilters}>Показать все товары</button>
            </div>
          )}
        </div>
      </div>

      {/* Модальное окно товара */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Панель корзины */}
      <div className={`cart-panel ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-panel-header">
          <h3>Ваш заказ</h3>
          <button
            onClick={() => setIsCartOpen(false)}
            className="close-cart-btn"
          >
            ✕
          </button>
        </div>

        <div className="cart-items-list">
          {cart.length > 0 ? (
            <>
              {cart.map((item, index) => (
                <CartItem
                  key={index}
                  item={item}
                  onRemove={handleRemoveFromCart}
                  onUpdate={handleUpdateQuantity}
                />
              ))}

              <div className="cart-summary">
                <div className="summary-row">
                  <span>Итого:</span>
                  <span className="summary-total">{cartTotal} ₽</span>
                </div>

                <button
                  onClick={() => {
                    if (cart.length > 0) {
                      window.location.href = '/checkout';
                    }
                  }}
                  className="checkout-btn"
                  disabled={cart.length === 0}
                >
                  Перейти к оформлению
                </button>

                <button
                  onClick={clearCart}
                  className="clear-cart-btn"
                >
                  Очистить корзину
                </button>
              </div>
            </>
          ) : (
            <div className="empty-cart">
              <p>Корзина пуста</p>
              <p>Добавьте товары из меню</p>
            </div>
          )}
        </div>
      </div>

      {/* Затемнение при открытой корзине */}
      {isCartOpen && (
        <div
          className="cart-overlay"
          onClick={() => setIsCartOpen(false)}
        />
      )}
    </div>
  );
};

export default Menu;
