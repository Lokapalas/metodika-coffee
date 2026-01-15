import React, { useState, useEffect } from 'react';
import './App.css';
import './Menu.css';
import ProductModalNew from './components/ProductModalNew'; // Р—РђРњР•РќРђ РўРЈРў
import { useCart } from './context/CartContext';

function Menu() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Р’СЃРµ');
  const [selectedSubcategory, setSelectedSubcategory] = useState('Р’СЃРµ');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSubcategories, setShowSubcategories] = useState(false);

  const { addToCart } = useCart();

  // РљР°С‚РµРіРѕСЂРёРё РґР»СЏ РЅР°РІРёРіР°С†РёРё
  const categories = [
    'Р’СЃРµ', 'РљРѕС„Рµ', 'РќРµ РєРѕС„Рµ', 'Р•РґР°'
  ];

  // РџРѕРґРєР°С‚РµРіРѕСЂРёРё РґР»СЏ РєР°Р¶РґРѕР№ РєР°С‚РµРіРѕСЂРёРё
  const subcategories = {
    'Р’СЃРµ': [],
    'РљРѕС„Рµ': ['РљР»Р°СЃСЃРёРєР°', 'РЎРїРµС€РµР»', 'РќРµ СЃР»РёРїРЅРµС‚СЃСЏ', 'РћСЂРёРіРёРЅР°Р»СЊРЅС‹Р№', 'РҐРѕР»РѕРґРЅС‹Р№'],
    'РќРµ РєРѕС„Рµ': ['РљР°РєР°Рѕ', 'РњРѕР»РѕС‡РЅС‹Р№', 'РњР°С‚С‡Р°', 'РџРѕР»РµР·РЅРѕ'],
    'Р•РґР°': ['Р—Р°РІС‚СЂР°РєРё', 'РџРёС†С†Р°', 'РџРµСЂРІС‹Рµ Р±Р»СЋРґР°', 'Р’С‚РѕСЂС‹Рµ Р±Р»СЋРґР°']
  };

  // РџРѕР»СѓС‡РёС‚СЊ С‚РµРєСѓС‰РёРµ РїРѕРґРєР°С‚РµРіРѕСЂРёРё
  const getCurrentSubcategories = () => {
    return subcategories[selectedCategory] || [];
  };

  // Р—Р°РіСЂСѓР¶Р°РµРј РґР°РЅРЅС‹Рµ С‚РѕРІР°СЂРѕРІ - РўР•РџР•Р Р¬ РџРћР›РќРћР• РњР•РќР®
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Р