import React, { createContext, useState, useEffect, useCallback } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    // Загружаем корзину из localStorage при инициализации
    useEffect(() => {
        const savedCart = localStorage.getItem('metodikaCoffeeCart');
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart);
                // Убеждаемся, что у всех элементов есть цена
                const validatedCart = parsedCart.map(item => ({
                    ...item,
                    finalPrice: item.finalPrice ? Number(item.finalPrice) : (item.price ? Number(item.price) : 0),
                    quantity: item.quantity ? Number(item.quantity) : 1
                }));
                setCartItems(validatedCart);
            } catch (error) {
                console.error('Ошибка загрузки корзины:', error);
                localStorage.removeItem('metodikaCoffeeCart');
            }
        }
    }, []);

    // Сохраняем корзину в localStorage при изменении
    useEffect(() => {
        if (cartItems.length > 0) {
            localStorage.setItem('metodikaCoffeeCart', JSON.stringify(cartItems));
        } else {
            localStorage.removeItem('metodikaCoffeeCart');
        }
    }, [cartItems]);

    // Генерация уникального ID для элемента корзины
    const generateCartItemId = (product, selectedSize, selectedAdditives) => {
        const sizePart = selectedSize || 'M';
        const additivesPart = selectedAdditives && selectedAdditives.length > 0 
            ? selectedAdditives.sort().join('-')
            : 'no-additives';
        return `${product.id}-${sizePart}-${additivesPart}`;
    };

    const addToCart = (product) => {
        setCartItems(prevItems => {
            const cartItemId = generateCartItemId(
                product, 
                product.selectedSize, 
                product.selectedAdditives
            );
            
            const existingItem = prevItems.find(item => 
                generateCartItemId(item, item.selectedSize, item.selectedAdditives) === cartItemId
            );
            
            if (existingItem) {
                return prevItems.map(item =>
                    generateCartItemId(item, item.selectedSize, item.selectedAdditives) === cartItemId
                        ? { 
                            ...item, 
                            quantity: (item.quantity || 1) + (product.quantity || 1),
                            finalPrice: product.finalPrice ? Number(product.finalPrice) : (item.finalPrice || 0)
                        }
                        : item
                );
            } else {
                const newItem = {
                    ...product,
                    id: product.id,
                    name: product.name,
                    price: product.price ? Number(product.price) : 0,
                    finalPrice: product.finalPrice ? Number(product.finalPrice) : (product.price ? Number(product.price) : 0),
                    quantity: product.quantity ? Number(product.quantity) : 1,
                    selectedSize: product.selectedSize || 'M',
                    selectedAdditives: product.selectedAdditives || [],
                    additivesDetails: product.additivesDetails || []
                };
                return [...prevItems, newItem];
            }
        });
    };

    const removeFromCart = (itemId) => {
        setCartItems(prevItems => {
            const itemToRemove = prevItems.find(item => 
                generateCartItemId(item, item.selectedSize, item.selectedAdditives) === itemId
            );
            
            if (itemToRemove && itemToRemove.quantity > 1) {
                return prevItems.map(item =>
                    generateCartItemId(item, item.selectedSize, item.selectedAdditives) === itemId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                );
            } else {
                return prevItems.filter(item => 
                    generateCartItemId(item, item.selectedSize, item.selectedAdditives) !== itemId
                );
            }
        });
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('metodikaCoffeeCart');
    };

    // Используем useCallback для мемоизации функции
    const getTotalPrice = useCallback(() => {
        if (!cartItems || cartItems.length === 0) return 0;
        
        let total = 0;
        cartItems.forEach(item => {
            const itemPrice = item.finalPrice ? Number(item.finalPrice) : (item.price ? Number(item.price) : 0);
            const itemQuantity = item.quantity ? Number(item.quantity) : 1;
            
            if (!isNaN(itemPrice) && !isNaN(itemQuantity)) {
                total += itemPrice * itemQuantity;
            }
        });
        
        return total;
    }, [cartItems]);

    const getItemCount = () => {
        return cartItems.reduce((count, item) => count + (item.quantity || 1), 0);
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            clearCart,
            getTotalPrice,
            getItemCount
        }}>
            {children}
        </CartContext.Provider>
    );
};
