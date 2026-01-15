import React, { useState, useEffect } from 'react';
import "./ProductImage.css";
import ProductModal from './ProductModal';
import CartItem from './CartItem';
import ProductImage from './ProductImage';
import './ProductGrid.css';
import NavBar from './components/NavBar';
import SideBar from './components/SideBar';

// Р‘РµР·РѕРїР°СЃРЅС‹Р№ РїР°СЂСЃРёРЅРі JSON
const safeParseJSON = (str, defaultValue) => {
  try {
    return str ? JSON.parse(str) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const Menu = () => {
  const [products, setProducts] = useState([]);
  // ... РІРµСЃСЊ РѕСЃС‚Р°Р»СЊРЅРѕР№ РєРѕРґ РєРѕРјРїРѕРЅРµРЅС‚Р° ...

  return (
    <div className="menu-container">
      <NavBar />
      <div className="main-content">
        <SideBar />
        
        {/* Р’Р•РЎР¬ СЃСѓС‰РµСЃС‚РІСѓСЋС‰РёР№ JSX РєРѕРґ РјРµРЅСЋ РѕСЃС‚Р°РµС‚СЃСЏ Р·РґРµСЃСЊ */}
        
      </div>
    </div>
  );
};

export default Menu;
