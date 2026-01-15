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

  // Р—Р°РіСЂСѓР·РєР° РїСЂРѕРґСѓРєС‚РѕРІ Рё РєР°С‚РµРіРѕСЂРёР№
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

        // Р‘Р•Р—РћРџРђРЎРќРђРЇ Р·Р°РіСЂСѓР·РєР° РєРѕСЂР·РёРЅС‹ РёР· localStorage
        const savedCart = safeParseJSON(localStorage.getItem('metodikaCart'), []);
        setCart(Array.isArray(savedCart) ? savedCart : []);
      } catch (error) {
        console.error('РћС€РёР±РєР° Р·Р°РіСЂСѓР·РєРё РґР°РЅРЅС‹С…:', error);
      }
    };
    fetchData();
  }, []);

  // РћСЃС‚Р°Р»СЊРЅРѕР№ РєРѕРґ РєРѕРјРїРѕРЅРµРЅС‚Р°...
  // РќСѓР¶РЅРѕ СЃРєРѕРїРёСЂРѕРІР°С‚СЊ РёР· РѕСЂРёРіРёРЅР°Р»Р°

  return (
    <div className="menu-container">
      <NavBar />
      <div className="main-content">
        <SideBar />
        <div className="products-section">
          {/* РЎСЋРґР° Р±СѓРґРµС‚ РІСЃС‚Р°РІР»РµРЅ РѕСЂРёРіРёРЅР°Р»СЊРЅС‹Р№ JSX */}
        </div>
      </div>
    </div>
  );
};

export default Menu;
