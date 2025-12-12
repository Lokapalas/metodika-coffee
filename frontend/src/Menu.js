import React, { useState, useEffect } from 'react';
import './App.css';
import './Menu.css';
import ProductModal from './components/ProductModal';
import { useCart } from './context/CartContext';

function Menu() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { addToCart } = useCart();

  // Категории для навигации
  const categories = [
    'Все', 'Кофе', 'Чай', 'Выпечка', 'Десерты', 'Напитки',
    'Осень', 'На молоке', 'На сливках', 'Айс напитки'
  ];

  // Загружаем данные товаров
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/data/products.json');
        
        if (!response.ok) throw new Error(`Ошибка: ${response.status}`);
        
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      } catch (err) {
        console.error('Ошибка при загрузке товаров:', err);
        setError('Не удалось загрузить товары');
        setLoading(false);
        
        // Fallback данные
        const mockProducts = [
          { 
            id: 1, 
            name: "Эспрессо", 
            price: 180, 
            category: "Кофе", 
            image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&h=200&fit=crop", 
            description: "Классический крепкий кофе, приготовленный под высоким давлением",
            popular: true 
          },
          { 
            id: 2, 
            name: "Капучино", 
            price: 250, 
            category: "Кофе", 
            image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=300&h=200&fit=crop", 
            description: "Кофе с молочной пенкой и нежной текстурой",
            popular: true 
          },
          { 
            id: 3, 
            name: "Латте", 
            price: 280, 
            category: "Кофе", 
            image: "https://images.unsplash.com/photo-1561047029-3000c68339ca?w=300&h=200&fit=crop", 
            description: "Нежный кофе с большим количеством молока",
            popular: false 
          },
          { 
            id: 4, 
            name: "Раф пряный", 
            price: 350, 
            category: "Кофе", 
            image: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=300&h=200&fit=crop", 
            description: "Нежный кофе со сливками и ванильным сиропом",
            popular: true 
          },
        ];
        setProducts(mockProducts);
        setFilteredProducts(mockProducts);
      }
    };

    fetchProducts();
  }, []);

  // Фильтрация товаров
  useEffect(() => {
    let filtered = products;

    if (selectedCategory !== 'Все') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(term) ||
        (product.description && product.description.toLowerCase().includes(term))
      );
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchTerm]);

  // Обработчик поиска
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Обработчик выбора категории
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Открытие модального окна для продукта
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    // Блокируем прокрутку фона
    document.body.style.overflow = 'hidden';
  };

  // Закрытие модального окна
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    // Восстанавливаем прокрутку
    document.body.style.overflow = 'auto';
  };

  // Быстрое добавление в корзину (без кастомизации)
  const handleQuickAdd = (product, e) => {
    e.stopPropagation();
    addToCart({
      ...product,
      customizations: { size: 'M', extras: [], milkType: 'обычное' }
    });
    
    // Визуальная обратная связь
    const button = e.target;
    const originalText = button.innerHTML;
    button.innerHTML = '<span class="cart-icon-btn">✓</span> Добавлено!';
    button.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
    
    setTimeout(() => {
      button.innerHTML = originalText;
      button.style.background = '';
    }, 1500);
  };

  // Показать загрузку
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Загружаем меню...</p>
      </div>
    );
  }

  // Показать ошибку
  if (error) {
    return (
      <div className="error-container">
        <p style={{ color: 'red' }}>{error}</p>
        <button onClick={() => window.location.reload()}>
          Обновить страницу
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="menu-page">
        {/* Верхняя навигация категорий */}
        <div className="category-nav">
          <div className="category-nav-container">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-nav-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => handleCategorySelect(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Основной контент */}
        <div className="menu-main-container">
          {/* Заголовок и поиск */}
          <div className="menu-header">
            <h1>Наше меню</h1>
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Искать в Metodika Coffee..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>

          {/* Информация о фильтрах */}
          <div className="filter-info">
            <p>
              {filteredProducts.length} товаров • 
              {selectedCategory === 'Все' ? ' Все категории' : ` ${selectedCategory}`}
              {searchTerm && ` • Поиск: "${searchTerm}"`}
            </p>
          </div>

          {/* Сетка товаров */}
          {filteredProducts.length === 0 ? (
            <div className="no-products">
              <h3>Товары не найдены</h3>
              <p>Попробуйте изменить критерии поиска</p>
              <button 
                onClick={() => {
                  setSelectedCategory('Все');
                  setSearchTerm('');
                }}
                className="clear-filters-btn"
              >
                Сбросить фильтры
              </button>
            </div>
          ) : (
            <div className="products-grid-new">
              {filteredProducts.map(product => (
                <div 
                  key={product.id} 
                  className="product-card-new"
                  onClick={() => handleProductClick(product)}
                >
                  <div className="product-image-new">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      loading="lazy"
                    />
                    {product.popular && (
                      <span className="badge-popular">Популярный</span>
                    )}
                  </div>
                  
                  <div className="product-info-new">
                    <div className="product-header-new">
                      <h3 className="product-name-new">{product.name}</h3>
                      <p className="product-price-new">{product.price} ₽</p>
                    </div>
                    
                    <p className="product-description-new">
                      {product.description || 'Вкусный напиток'}
                    </p>
                    
                    <div className="product-category-new">
                      <span className="category-tag-new">{product.category}</span>
                    </div>
                    
                    <div className="product-buttons">
                      <button
                        onClick={(e) => handleQuickAdd(product, e)}
                        className="add-to-cart-btn-new quick-add-btn"
                      >
                        <span className="cart-icon-btn">🛒</span>
                        Быстро добавить (M)
                      </button>
                      <button
                        onClick={() => handleProductClick(product)}
                        className="customize-btn"
                      >
                        Настроить как любишь →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Модальное окно для кастомизации */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}

export default Menu;
