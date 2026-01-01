import React, { useState, useEffect } from 'react';
import "./ProductImage.css";
import ProductModal from './ProductModal';
import CartItem from './CartItem';
import ProductImage from './ProductImage';
import './ProductGrid.css';
import NavBar from './components/NavBar';
import SideBar from './components/SideBar';

// Безопасный парсинг JSON
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

  // Загрузка продуктов и категорий
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

        // БЕЗОПАСНАЯ загрузка корзины из localStorage
        const savedCart = safeParseJSON(localStorage.getItem('metodikaCart'), []);
        setCart(Array.isArray(savedCart) ? savedCart : []);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      }
    };
    fetchData();
  }, []);

  // Остальной код компонента...
  // Нужно скопировать из оригинала

  return (
    <div className="menu-container">
      <NavBar />
      <div className="main-content">
        <SideBar />
        <div className="products-section">
          {/* Сюда будет вставлен оригинальный JSX */}
        </div>
      </div>
    </div>
  );
};

export default Menu;
