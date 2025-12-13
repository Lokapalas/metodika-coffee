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
  const [selectedSubcategory, setSelectedSubcategory] = useState('Все');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSubcategories, setShowSubcategories] = useState(false);
  
  const { addToCart } = useCart();

  // Категории для навигации
  const categories = [
    'Все', 'Кофе', 'Не кофе', 'Еда'
  ];

  // Подкатегории для каждой категории
  const subcategories = {
    'Все': [],
    'Кофе': ['Классика', 'Спешел', 'Не слипнется', 'Оригинальный', 'Холодный'],
    'Не кофе': ['Какао', 'Молочный', 'Матча', 'Полезно'],
    'Еда': ['Завтраки', 'Пицца', 'Первые блюда', 'Вторые блюда']
  };

  // Получить текущие подкатегории
  const getCurrentSubcategories = () => {
    return subcategories[selectedCategory] || [];
  };

  // Загружаем данные товаров - ТЕПЕРЬ ПОЛНОЕ МЕНЮ
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Используем полное меню
        const response = await fetch('/data/products-full-complete.json');
        
        if (!response.ok) throw new Error(`Ошибка загрузки: ${response.status}`);
        
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
        
        console.log(`✅ Загружено ${data.length} товаров из полного меню`);
      } catch (err) {
        console.error('Ошибка при загрузке товаров:', err);
        setError('Не удалось загрузить товары. Пробуем загрузить базовое меню...');
        
        // Пробуем загрузить резервный файл
        try {
          const backupResponse = await fetch('/data/products-full.json');
          if (backupResponse.ok) {
            const backupData = await backupResponse.json();
            setProducts(backupData);
            setFilteredProducts(backupData);
            setLoading(false);
            setError(null);
            console.log(`✅ Загружено ${backupData.length} товаров из резервного файла`);
          } else {
            throw new Error('Резервный файл также недоступен');
          }
        } catch (backupErr) {
          console.error('Ошибка при загрузке резервного файла:', backupErr);
          setLoading(false);
          
          // Fallback на минимальные данные
          const mockProducts = [
            { 
              id: 1, 
              name: "Эспрессо", 
              price: 180, 
              category: "Кофе", 
              subcategory: "Классика",
              image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&h=200&fit=crop", 
              description: "Классический крепкий кофе",
              popular: true 
            },
          ];
          setProducts(mockProducts);
          setFilteredProducts(mockProducts);
        }
      }
    };

    fetchProducts();
  }, []);

  // Фильтрация товаров
  useEffect(() => {
    let filtered = products;

    // Фильтр по основной категории
    if (selectedCategory !== 'Все') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Фильтр по подкатегории
    if (selectedSubcategory !== 'Все' && selectedSubcategory !== '') {
      filtered = filtered.filter(product => product.subcategory === selectedSubcategory);
    }

    // Фильтр по поиску
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(term) ||
        (product.description && product.description.toLowerCase().includes(term)) ||
        (product.subcategory && product.subcategory.toLowerCase().includes(term))
      );
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, selectedSubcategory, searchTerm]);

  // Обработчик поиска
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Обработчик выбора категории
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory('Все');
    setShowSubcategories(category !== 'Все' && subcategories[category]?.length > 0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Обработчик выбора подкатегории
  const handleSubcategorySelect = (subcategory) => {
    setSelectedSubcategory(subcategory === selectedSubcategory ? 'Все' : subcategory);
    window.scrollTo({ top: 140, behavior: 'smooth' });
  };

  // Открытие модального окна для продукта
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  // Закрытие модального окна
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    document.body.style.overflow = 'auto';
  };

  // Быстрое добавление в корзину
  const handleQuickAdd = (product, e) => {
    e.stopPropagation();
    
    // ВСЕГДА используем размер M (350 мл) для быстрого добавления
    const defaultSize = "M";
    const price = product.prices?.[defaultSize] || product.price || 0;
    
    addToCart({
      ...product,
      price: price,
      customizations: { 
        size: defaultSize, 
        extras: [], 
        milkType: "обычное" 
      },
      quantity: 1
    });
    
    // Визуальная обратная связь
    const button = e.target;
    const originalText = button.innerHTML;
    button.innerHTML = `<span class="cart-icon-btn">✓</span> Добавлено (M)!`;
    button.style.background = "linear-gradient(135deg, #10b981 0%, #059669 100%)";
    
    setTimeout(() => {
      button.innerHTML = originalText;
      button.style.background = "";
    }, 1500);
  }

  // Форматирование цены для отображения
  const formatPriceRange = (product) => {
    if (!product.prices) return `${product.price || 0} ₽`;
    
    const prices = Object.values(product.prices);
    if (prices.length === 1) return `${prices[0]} ₽`;
    
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return `${min} - ${max} ₽`;
  };

  // Показать загрузку
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Загружаем полное меню...</p>
        <p style={{ fontSize: '14px', color: '#666' }}>Пожалуйста, подождите</p>
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

        {/* Компактная навигация подкатегорий */}
        {showSubcategories && getCurrentSubcategories().length > 0 && (
          <div className="subcategory-nav-compact">
            <div className="subcategory-nav-compact-container">
              <div className="subcategory-scroll-wrapper">
                <button
                  className={`subcategory-compact-btn ${selectedSubcategory === 'Все' ? 'active' : ''}`}
                  onClick={() => handleSubcategorySelect('Все')}
                >
                  Все {selectedCategory.toLowerCase()}
                </button>
                {getCurrentSubcategories().map((subcategory) => (
                  <button
                    key={subcategory}
                    className={`subcategory-compact-btn ${selectedSubcategory === subcategory ? 'active' : ''}`}
                    onClick={() => handleSubcategorySelect(subcategory)}
                  >
                    {subcategory}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Основной контент */}
        <div className="menu-main-container">
          {/* Заголовок и поиск */}
          <div className="menu-header-compact">
            <h1>Наше меню</h1>
            <div className="search-box-compact">
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
          <div className="filter-info-compact">
            <p>
              <span className="product-count">{filteredProducts.length} товаров</span>
              {selectedCategory !== 'Все' && (
                <span className="category-info"> • {selectedCategory}</span>
              )}
              {selectedSubcategory !== 'Все' && selectedSubcategory !== '' && (
                <span className="subcategory-info"> • {selectedSubcategory}</span>
              )}
              {searchTerm && (
                <span className="search-info"> • Поиск: "{searchTerm}"</span>
              )}
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
                  setSelectedSubcategory('Все');
                  setSearchTerm('');
                }}
                className="clear-filters-btn"
              >
                Сбросить все фильтры
              </button>
            </div>
          ) : (
            <>
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
                      {product.sizes && product.sizes.length > 1 && (
                        <span className="sizes-badge">
                          {product.sizes.join('/')}
                        </span>
                      )}
                    </div>
                    
                    <div className="product-info-new">
                      <div className="product-header-new">
                        <h3 className="product-name-new">{product.name}</h3>
                        <p className="product-price-new">
                          {formatPriceRange(product)}
                        </p>
                      </div>
                      
                      <p className="product-description-new">
                        {product.description || 'Вкусный напиток'}
                      </p>
                      
                      <div className="product-tags-compact">
                        <span className="category-tag-compact">{product.category}</span>
                        {product.subcategory && product.subcategory !== 'Все' && (
                          <span className="subcategory-tag-compact">{product.subcategory}</span>
                        )}
                      </div>
                      
                      <div className="product-buttons-compact">
                        <button
                          onClick={(e) => handleQuickAdd(product, e)}
                          className="add-to-cart-btn-compact quick-add-btn"
                        >
                          <span className="cart-icon-btn">🛒</span>
                          Добавить (M)
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProductClick(product);
                          }}
                          className="customize-btn-compact"
                        >
                          Настроить
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Статистика внизу */}
              <div className="menu-stats">
                <p>Всего в меню: {products.length} товаров</p>
              </div>
            </>
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
