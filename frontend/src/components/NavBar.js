import React, { useState } from 'react';

function NavBar({ onSearch, cartCount = 0 }) {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchValue);
  };

  const handleCartClick = () => {
    alert('Корзина будет реализована позже. Товаров: ' + cartCount);
  };

  return (
    <nav className="navbar" style={styles.navbar}>
      <div style={styles.container}>
        {/* Логотип СЛЕВА */}
        <div style={styles.logoSection}>
          <a href="/" style={styles.logo}>
            <span style={styles.logoIcon}>☕</span>
            <span style={styles.logoText}>Metodika Coffee</span>
          </a>
        </div>

        {/* Поиск ПО ЦЕНТРУ */}
        <div style={styles.searchSection}>
          <form onSubmit={handleSearch} style={styles.searchForm}>
            <input
              type="text"
              placeholder="Поиск кофе, чая, десертов..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              style={styles.searchInput}
            />
            <button type="submit" style={styles.searchButton}>
              Найти
            </button>
          </form>
        </div>

        {/* Корзина СПРАВА */}
        <div style={styles.cartSection}>
          <button onClick={handleCartClick} style={styles.cartButton}>
            <span style={styles.cartIcon}>🛒</span>
            <span style={styles.cartText}>
              Корзина <span style={styles.cartCount}>({cartCount})</span>
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    backgroundColor: '#1a1a2e',
    color: 'white',
    padding: '0.8rem 0',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    boxShadow: '0 2px 15px rgba(0,0,0,0.2)',
    borderBottom: '3px solid #8B4513'
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 1.5rem',
    height: '60px'
  },
  logoSection: {
    flex: '0 0 auto'
  },
  logo: {
    color: 'white',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  logoIcon: {
    fontSize: '1.8rem',
    color: '#d4af37'
  },
  logoText: {
    fontSize: '1.4rem',
    fontWeight: 'bold',
    background: 'linear-gradient(45deg, #d4af37, #ffd700)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  searchSection: {
    flex: 1,
    maxWidth: '600px',
    margin: '0 2rem'
  },
  searchForm: {
    display: 'flex',
    width: '100%'
  },
  searchInput: {
    flex: 1,
    padding: '0.8rem 1.2rem',
    border: 'none',
    borderRadius: '25px 0 0 25px',
    fontSize: '1rem',
    backgroundColor: '#2d3047',
    color: 'white',
    border: '1px solid #3a3d5d'
  },
  searchButton: {
    padding: '0.8rem 1.5rem',
    backgroundColor: '#8B4513',
    color: 'white',
    border: 'none',
    borderRadius: '0 25px 25px 0',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'background-color 0.3s',
    whiteSpace: 'nowrap'
  },
  cartSection: {
    flex: '0 0 auto'
  },
  cartButton: {
    backgroundColor: '#2d3047',
    color: 'white',
    border: 'none',
    padding: '0.7rem 1.5rem',
    borderRadius: '25px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'all 0.3s',
    border: '1px solid #3a3d5d'
  },
  cartIcon: {
    fontSize: '1.2rem'
  },
  cartText: {
    whiteSpace: 'nowrap'
  },
  cartCount: {
    backgroundColor: '#8B4513',
    color: 'white',
    padding: '0.1rem 0.5rem',
    borderRadius: '10px',
    fontSize: '0.9rem',
    marginLeft: '0.2rem'
  }
};

// Медиа-запросы для мобильных
const mobileStyles = `
@media (max-width: 768px) {
  .navbar .container {
    padding: 0 1rem;
    height: 50px;
  }
  
  .navbar .logoText {
    font-size: 1.1rem;
  }
  
  .navbar .searchSection {
    margin: 0 1rem;
  }
  
  .navbar .searchInput {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
  }
  
  .navbar .searchButton {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
  }
  
  .navbar .cartButton {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
  
  .navbar .cartText {
    display: none;
  }
  
  .navbar .cartCount {
    margin-left: 0;
  }
}

@media (max-width: 480px) {
  .navbar .logoText {
    display: none;
  }
  
  .navbar .searchInput {
    padding: 0.5rem 0.8rem;
  }
  
  .navbar .searchButton {
    padding: 0.5rem 0.8rem;
  }
}
`;

// Добавляем стили в документ
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = mobileStyles;
  document.head.appendChild(styleSheet);
}

export default NavBar;
