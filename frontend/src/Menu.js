import React, { useState, useEffect } from 'react';
import "./ProductImage.css";
import './ProductGrid.css';
import NavBar from './components/NavBar';
import SideBar from './components/SideBar';

const Menu = () => {
  // Состояния
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(3); // временно 3 товара в корзине

  // Мок-данные (временные)
  const mockProducts = [
    { id: 1, name: "Кофе с молоком", price: 250, category: "Кофе", description: "Ароматный кофе с молоком" },
    { id: 2, name: "Капучино", price: 240, category: "Кофе", description: "Идеальный баланс кофе и молока" },
    { id: 3, name: "Американо", price: 180, category: "Кофе", description: "Классический чёрный кофе" },
    { id: 4, name: "Эспрессо", price: 150, category: "Кофе", description: "Крепкий и ароматный" },
    { id: 5, name: "Чай зелёный", price: 120, category: "Чай", description: "Свежий зелёный чай" },
    { id: 6, name: "Чай чёрный", price: 110, category: "Чай", description: "Классический чёрный чай" },
    { id: 7, name: "Тирамису", price: 280, category: "Десерты", description: "Итальянский десерт" },
    { id: 8, name: "Чизкейк", price: 260, category: "Десерты", description: "Нежный чизкейк" },
    { id: 9, name: "Латте", price: 260, category: "Кофе", description: "Кофе с молоком и пенкой" },
    { id: 10, name: "Раф кофе", price: 270, category: "Кофе", description: "Кофе со сливками" },
    { id: 11, name: "Лимонад", price: 180, category: "Напитки", description: "Освежающий лимонад" },
    { id: 12, name: "Морс", price: 160, category: "Напитки", description: "Ягодный морс" }
  ];

  // Инициализация
  useEffect(() => {
    // Пробуем загрузить с бэкенда
    fetch('/api/products')
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Бэкенд не отвечает');
      })
      .then(data => {
        setProducts(data);
        setFilteredProducts(data);
      })
      .catch(err => {
        console.log('Используем мок-данные:', err.message);
        setProducts(mockProducts);
        setFilteredProducts(mockProducts);
      });
  }, []);

  // Фильтрация по категории
  useEffect(() => {
    let filtered = [...products];
    
    // Фильтр по категории
    if (selectedCategory !== 'Все') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    // Фильтр по поиску
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) || 
        (p.description && p.description.toLowerCase().includes(query))
      );
    }
    
    setFilteredProducts(filtered);
  }, [selectedCategory, searchQuery, products]);

  // Обработчики
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleAddToCart = (product) => {
    setCartCount(prev => prev + 1);
    alert(`Добавлено в корзину: ${product.name}`);
    // Позже добавим логику в CartContext
  };

  const categories = ['Все', 'Кофе', 'Чай', 'Десерты', 'Напитки'];

  return (
    <div className="menu-container">
      <NavBar 
        onSearch={handleSearch}
        cartCount={cartCount}
      />
      
      <div className="main-content">
        <SideBar 
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
        />
        
        <div className="products-section">
          <div className="container">
            <header className="products-header">
              <h1>Наше меню</h1>
              <div className="products-stats">
                <span className="category-badge">
                  {selectedCategory === 'Все' ? 'Все категории' : selectedCategory}
                </span>
                <span className="products-count">
                  {filteredProducts.length} товаров
                </span>
                {searchQuery && (
                  <span className="search-query">
                    Поиск: "{searchQuery}"
                  </span>
                )}
              </div>
            </header>
            
            {filteredProducts.length === 0 ? (
              <div className="no-products">
                <p>😔 Товары не найдены</p>
                <p>Попробуйте другую категорию или поисковый запрос</p>
                <button 
                  className="reset-filters"
                  onClick={() => {
                    setSelectedCategory('Все');
                    setSearchQuery('');
                  }}
                >
                  Сбросить фильтры
                </button>
              </div>
            ) : (
              <>
                <div className="product-grid">
                  {filteredProducts.map(product => (
                    <div key={product.id} className="product-card">
                      <div className="product-header">
                        <span className="product-category-badge">
                          {product.category}
                        </span>
                      </div>
                      
                      <div className="product-body">
                        <h3 className="product-name">{product.name}</h3>
                        <p className="product-description">
                          {product.description}
                        </p>
                        
                        <div className="product-footer">
                          <div className="product-price">
                            {product.price} ₽
                          </div>
                          <button 
                            className="add-to-cart-btn"
                            onClick={() => handleAddToCart(product)}
                          >
                            🛒 Добавить
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="pagination-info">
                  <p>Показано {filteredProducts.length} из {products.length} товаров</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
