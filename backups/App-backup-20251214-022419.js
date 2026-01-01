import React from 'react';
import './App.css';
import './responsive.css'; // Добавляем импорт
import NavBar from './components/NavBar';
import SideBar from './components/SideBar';
import Menu from './Menu';
import Cart from './components/Cart';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <div className="App">
        <NavBar />
        <Menu />
        <Cart />
      </div>
    </CartProvider>
  );
}

export default App;
