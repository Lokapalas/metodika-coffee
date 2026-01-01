import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './CartContext';
import MainPage from './MainPage';
import Checkout from './Checkout';
import './App.css';

function App() {
    // Добавляем класс loaded для скрытия индикатора загрузки
    useEffect(() => {
        document.getElementById('root')?.classList.add('loaded');
    }, []);

    return (
        <CartProvider>
            <Router>
                <div className="App">
                    <header className="App-header">
                        <div className="header-container">
                            <div className="logo-container">
                                <img src="/logo.svg" alt="Методика Кофе" className="logo" />
                                <div className="logo-text">
                                    <h1>Методика Кофе</h1>
                                    <p className="tagline">Искусство в каждой чашке</p>
                                </div>
                            </div>
                            <nav className="nav-links">
                                <a href="https://t.me/Metodika_CoffeeBot" target="_blank" rel="noopener noreferrer">
                                    <span className="nav-icon">🤖</span>
                                    <span>Telegram бот</span>
                                </a>
                                {window.Telegram?.WebApp && (
                                    <button 
                                        className="telegram-close-btn"
                                        onClick={() => window.Telegram.WebApp.close()}
                                    >
                                        <span className="nav-icon">✕</span>
                                        <span>Закрыть</span>
                                    </button>
                                )}
                            </nav>
                        </div>
                    </header>
                    <main>
                        <Routes>
                            <Route path="/" element={<MainPage />} />
                            <Route path="/checkout" element={<Checkout />} />
                        </Routes>
                    </main>
                    <footer className="App-footer">
                        <div className="footer-container">
                            <div className="footer-info">
                                <p className="footer-title">☕ Методика Кофе</p>
                                <p className="footer-subtitle">Кофе, который вдохновляет</p>
                            </div>
                            <div className="footer-links">
                                <a href="https://t.me/Metodika_CoffeeBot" target="_blank" rel="noopener noreferrer">
                                    📲 Заказ через Telegram
                                </a>
                                <a href="https://t.me/Metodika_CoffeeBot?startapp=order" target="_blank" rel="noopener noreferrer">
                                    🚀 Быстрый заказ
                                </a>
                            </div>
                            <div className="footer-copyright">
                                <p>© {new Date().getFullYear()} Методика Кофе. Все права защищены.</p>
                                <p className="footer-hint">Мы заботимся о каждой детали вашего кофе</p>
                            </div>
                        </div>
                    </footer>
                </div>
            </Router>
        </CartProvider>
    );
}

export default App;
