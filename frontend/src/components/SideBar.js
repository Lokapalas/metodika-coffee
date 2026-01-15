import React from 'react';
import './SideBar.css';

function SideBar({ categories, selectedCategory, onCategorySelect, onSearch }) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filters, setFilters] = React.useState({
    inStock: false,
    popular: false,
    affordable: false
  });

  // РћР±СЂР°Р±РѕС‚С‡РёРє РёР·РјРµРЅРµРЅРёСЏ РїРѕРёСЃРєР°
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  // РћР±СЂР°Р±РѕС‚С‡РёРє РІС‹Р±РѕСЂР° РєР°С‚РµРіРѕСЂРёРё
  const handleCategoryClick = (category) => {
    onCategorySelect(category);
  };

  // РћР±СЂР°Р±РѕС‚С‡РёРє РёР·РјРµРЅРµРЅРёСЏ С„РёР»СЊС‚СЂРѕРІ
  const handleFilterChange = (filterName) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  // РЎР±СЂРѕСЃ РІСЃРµС… С„РёР»СЊС‚СЂРѕРІ
  const handleResetFilters = () => {
    setSearchTerm('');
    setFilters({
      inStock: false,
      popular: false,
      affordable: false
    });
    onSearch('');
    onCategorySelect('Р’СЃРµ');
  };

  return (
    <aside className="sidebar">
      <h2>Р¤РёР»СЊС‚СЂС‹</h2>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="РџРѕРёСЃРє С‚РѕРІР°СЂРѕРІ..."
          className="search-input"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className="categories-section">
        <h3>РљР°С‚РµРіРѕСЂРёРё</h3>
        <ul className="category-list">
          {categories.map(category => (
            <li key={category} className="category-item">
              <button
                onClick={() => handleCategoryClick(category)}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              >
                {category}
                <span className="category-count">
                  {category === 'Р’СЃРµ' ? categories.length - 1 : 'N'}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="filters-section">
        <h3>Р”РѕРїРѕР»РЅРёС‚РµР»СЊРЅС‹Рµ С„РёР»СЊС‚СЂС‹</h3>
        <div className="filter-option">
          <input
            type="checkbox"
            id="inStock"
            className="filter-checkbox"
            checked={filters.inStock}
            onChange={() => handleFilterChange('inStock')}
          />
          <label htmlFor="inStock" className="filter-label">
            РўРѕР»СЊРєРѕ РІ РЅР°Р»РёС‡РёРё
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
            РџРѕРїСѓР»СЏСЂРЅС‹Рµ С‚РѕРІР°СЂС‹
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
            Р”Рѕ 200 СЂСѓР±Р»РµР№
          </label>
        </div>
      </div>

      <button
        className="reset-filters"
        onClick={handleResetFilters}
      >
        РЎР±СЂРѕСЃРёС‚СЊ РІСЃРµ С„РёР»СЊС‚СЂС‹
      </button>
    </aside>
  );
}

export default SideBar;
