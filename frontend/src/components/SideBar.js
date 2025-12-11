import React from 'react';

function SideBar({ 
  categories = ['Все', 'Кофе', 'Чай', 'Десерты', 'Напитки'],
  selectedCategory = 'Все',
  onCategorySelect 
}) {
  const handleCategoryClick = (category) => {
    if (onCategorySelect) onCategorySelect(category);
  };

  return (
    <aside className="sidebar" style={styles.sidebar}>
      <div style={styles.header}>
        <h3 style={styles.title}>☕ Категории</h3>
        <p style={styles.subtitle}>Фильтр меню</p>
      </div>

      <ul style={styles.categoryList}>
        {categories.map((category) => (
          <li key={category} style={styles.categoryItem}>
            <button
              onClick={() => handleCategoryClick(category)}
              style={{
                ...styles.categoryButton,
                ...(selectedCategory === category ? styles.categoryButtonActive : {})
              }}
            >
              <span style={styles.categoryIcon}>
                {getCategoryIcon(category)}
              </span>
              <span style={styles.categoryText}>{category}</span>
              {selectedCategory === category && (
                <span style={styles.selectedIndicator}>→</span>
              )}
            </button>
          </li>
        ))}
      </ul>

      <div style={styles.footer}>
        <div style={styles.stats}>
          <p style={styles.statItem}>
            <span style={styles.statNumber}>50+</span>
            <span style={styles.statLabel}>Напитков</span>
          </p>
          <p style={styles.statItem}>
            <span style={styles.statNumber}>20+</span>
            <span style={styles.statLabel}>Десертов</span>
          </p>
        </div>
      </div>
    </aside>
  );
}

function getCategoryIcon(category) {
  switch(category) {
    case 'Все': return '📋';
    case 'Кофе': return '☕';
    case 'Чай': return '🍵';
    case 'Десерты': return '🍰';
    case 'Напитки': return '🥤';
    default: return '📦';
  }
}

const styles = {
  sidebar: {
    width: '250px',
    backgroundColor: '#ffffff',
    padding: '1.5rem',
    position: 'fixed',
    left: 0,
    top: '70px',
    bottom: 0,
    overflowY: 'auto',
    borderRight: '1px solid #eaeaea',
    boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
    zIndex: 900
  },
  header: {
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
    borderBottom: '2px solid #8B4513'
  },
  title: {
    margin: 0,
    color: '#2c3e50',
    fontSize: '1.3rem',
    fontWeight: '600'
  },
  subtitle: {
    margin: '0.3rem 0 0 0',
    color: '#7f8c8d',
    fontSize: '0.85rem'
  },
  categoryList: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  categoryItem: {
    marginBottom: '0.4rem'
  },
  categoryButton: {
    width: '100%',
    textAlign: 'left',
    padding: '0.8rem 1rem',
    backgroundColor: '#f8f9fa',
    border: '1px solid #eaeaea',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    fontSize: '0.95rem',
    color: '#495057',
    transition: 'all 0.2s',
    fontWeight: '500'
  },
  categoryButtonActive: {
    backgroundColor: '#8B4513',
    color: 'white',
    borderColor: '#8B4513',
    fontWeight: '600',
    transform: 'translateX(5px)'
  },
  categoryIcon: {
    fontSize: '1.1rem',
    width: '20px',
    textAlign: 'center'
  },
  categoryText: {
    flex: 1
  },
  selectedIndicator: {
    fontSize: '1rem',
    fontWeight: 'bold'
  },
  footer: {
    marginTop: '2rem',
    paddingTop: '1rem',
    borderTop: '1px solid #eaeaea'
  },
  stats: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '0.5rem'
  },
  statItem: {
    textAlign: 'center',
    flex: 1
  },
  statNumber: {
    display: 'block',
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#8B4513'
  },
  statLabel: {
    display: 'block',
    fontSize: '0.75rem',
    color: '#7f8c8d',
    marginTop: '0.2rem'
  }
};

// Мобильные стили
const mobileStyles = `
@media (max-width: 768px) {
  .sidebar {
    position: relative !important;
    width: 100% !important;
    top: 0 !important;
    margin-bottom: 1rem;
    border-right: none !important;
    border-bottom: 2px solid #eaeaea;
    padding: 1rem !important;
  }
  
  .sidebar .header {
    text-align: center;
    margin-bottom: 1rem !important;
  }
  
  .sidebar .categoryList {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
  }
  
  .sidebar .categoryItem {
    margin-bottom: 0 !important;
    flex: 1;
    min-width: 80px;
  }
  
  .sidebar .categoryButton {
    padding: 0.6rem !important;
    justify-content: center;
    text-align: center;
    flex-direction: column;
    gap: 0.3rem !important;
  }
  
  .sidebar .categoryText {
    font-size: 0.85rem;
  }
  
  .sidebar .categoryIcon {
    font-size: 1.2rem !important;
  }
  
  .sidebar .selectedIndicator {
    display: none;
  }
  
  .sidebar .footer {
    display: none;
  }
}
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = mobileStyles;
  document.head.appendChild(styleSheet);
}

export default SideBar;
