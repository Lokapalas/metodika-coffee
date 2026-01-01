import React from 'react';
import './SideBar.css';

function SideBar({ categories, selectedCategory, onCategorySelect, onSearch }) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filters, setFilters] = React.useState({
    inStock: false,
    popular: false,
    affordable: false
  });

  // Обработчик изменения поиска
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  // Обработчик выбора категории
  const handleCategoryClick = (category) => {
    onCategorySelect(category);
  };

  // Обработчик изменения фильтров
  const handleFilterChange = (filterName) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  // Сброс всех фильтров
  const handleResetFilters = () => {
    setSearchTerm('');
    setFilters({
      inStock: false,
      popular: false,
      affordable: false
    });
    onSearch('');
    onCategorySelect('Все');
  };

  return (
    <aside className="sidebar">
      <h2>Фильтры</h2>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Поиск товаров..."
          className="search-input"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className="categories-section">
        <h3>Категории</h3>
        <ul className="category-list">
          {categories.map(category => (
            <li key={category} className="category-item">
              <button
                onClick={() => handleCategoryClick(category)}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              >
                {category}
                <span className="category-count">
                  {category === 'Все' ? categories.length - 1 : 'N'}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="filters-section">
        <h3>Дополнительные фильтры</h3>
        <div className="filter-option">
          <input
            type="checkbox"
            id="inStock"
            className="filter-checkbox"
            checked={filters.inStock}
            onChange={() => handleFilterChange('inStock')}
          />
          <label htmlFor="inStock" className="filter-label">
            Только в наличии
          </label>
        </div>
        <div className="filter-option">
          <input
            type="checkbox"
            id="popular"
            className="filter-checkbox"
            checked={filters.popular}
            onChange={() => handleFilterChange('popular')}
          />
          <label htmlFor="popular" className="filter-label">
            Популярные товары
          </label>
        </div>
        <div className="filter-option">
          <input
            type="checkbox"
            id="affordable"
            className="filter-checkbox"
            checked={filters.affordable}
            onChange={() => handleFilterChange('affordable')}
          />
          <label htmlFor="affordable" className="filter-label">
            До 200 рублей
          </label>
        </div>
      </div>

      <button
        className="reset-filters"
        onClick={handleResetFilters}
      >
        Сбросить все фильтры
      </button>
    </aside>
  );
}

export default SideBar;
