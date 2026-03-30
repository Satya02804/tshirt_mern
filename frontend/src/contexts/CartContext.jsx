import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    // Initialize cart from localStorage immediately to prevent race conditions
    const [cart, setCart] = useState(() => {
        try {
            const storedCart = localStorage.getItem('cart');
            return storedCart ? JSON.parse(storedCart) : [];
        } catch (error) {
            console.error("Failed to load cart from storage", error);
            return [];
        }
    });

    const [isCartOpen, setIsCartOpen] = useState(false);

    // Save to localStorage whenever cart changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product, quantity = 1, size = 'M') => {
        setCart((prevCart) => {
            // Find item with same ID AND same Size
            const existingItem = prevCart.find((item) => item.id === product.id && item.size === size);

            if (existingItem) {
                const newCart = prevCart.map((item) =>
                    (item.id === product.id && item.size === size)
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
                setIsCartOpen(true);
                return newCart;
            } else {
                setIsCartOpen(true);
                return [...prevCart, { ...product, quantity, size }];
            }
        });
    };

    const removeFromCart = (productId, size) => {
        setCart((prevCart) => prevCart.filter((item) => !(item.id === productId && item.size === size)));
    };

    const updateQuantity = (productId, size, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId, size);
            return;
        }
        setCart((prevCart) =>
            prevCart.map((item) =>
                (item.id === productId && item.size === size) ? { ...item, quantity } : item
            )
        );  
    };  

    const clearCart = () => {
        setCart([]);
    };

    const getCartTotal = () => {
        return cart.reduce((total, item) => {
            const price = item.discountedPrice || item.price;
            return total + price * item.quantity;
        }, 0);
    };

    const getDiscount = () => {
        return cart.reduce((total, item) => {
            const price = item.discountedPrice || item.price;
            const discount = item.discount || 0;
            return total + (price * discount / 100) * item.quantity;
        }, 0);
    };

    const getOriginalPriceTotal = () => {
        return cart.reduce((total, item) => {
            const price = item.price;
            return total + price * item.quantity;
        }, 0);
    };

    const getCartCount = () => {
        return cart.reduce((count, item) => count + item.quantity, 0);
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                getCartTotal,
                getDiscount,
                getCartCount,
                getOriginalPriceTotal,
                isCartOpen,
                setIsCartOpen,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
