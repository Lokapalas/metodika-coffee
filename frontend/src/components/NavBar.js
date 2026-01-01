import React, { useState } from 'react';
import './NavBar.css';
import { useCart } from '../context/CartContext';

function NavBar() {
  const { getTotalItems, toggleCart } = useCart();
  const totalItems = getTotalItems();

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Логотип */}
        <div className="nav-logo">
          <h1>☕ Metodika Coffee</h1>
        </div>

        {/* Навигационные ссылки (скрываются на мобильных) */}
        <div className="nav-links">
          <a href="#menu" className="nav-link">Меню</a>
          <a href="#about" className="nav-link">О нас</a>
          <a href="#contacts" className="nav-link">Контакты</a>
          <a href="#delivery" className="nav-link">Доставка</a>
        </div>

        {/* Корзина */}
        <div className="nav-cart" onClick={toggleCart}>
          <svg className="cart-icon" viewBox="0 0 24 24">
            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1.003 1.003 0 0020 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
          {totalItems > 0 && (
            <span className="cart-badge">{totalItems}</span>
          )}
          <span className="cart-text">Корзина</span>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
