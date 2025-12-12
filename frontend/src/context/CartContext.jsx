import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item._id === product._id);
      
      if (existingItem) {
        return prevCart.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity }];
      }
    });
  };

  const updateQuantity = (productId, quantity) => {
    setCart(prevCart => {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        return prevCart.filter(item => item._id !== productId);
      }
      
      // Check if item exists in cart
      const itemExists = prevCart.some(item => item._id === productId);
      
      if (!itemExists) {
        // Item doesn't exist, don't add it (use addToCart instead)
        return prevCart;
      }
      
      return prevCart.map(item =>
        item._id === productId
          ? { ...item, quantity }
          : item
      );
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item._id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const buyNow = (product, quantity = 1) => {
    // Replace cart with only this item
    setCart([{ ...product, quantity }]);
  };

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getCartValue = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getCartValueWithDiscount = (membershipPlan) => {
    // Calculate discount per item to match product page display
    return cart.reduce((sum, item) => {
      const discountPercent = getMembershipDiscount(membershipPlan);
      const discountedPrice = item.price - (item.price * discountPercent) / 100;
      return sum + (Math.round(discountedPrice) * item.quantity);
    }, 0);
  };

  const getCartDiscount = (membershipPlan) => {
    const originalTotal = getCartValue();
    const discountedTotal = getCartValueWithDiscount(membershipPlan);
    return originalTotal - discountedTotal;
  };

  const value = {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    buyNow,
    getCartTotal,
    getCartValue,
    getCartValueWithDiscount,
    getCartDiscount
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Helper function for discount calculation
const getMembershipDiscount = (membershipPlan) => {
  const plan = membershipPlan?.toLowerCase() || 'free';
  const discounts = { free: 0, pro: 4, elite: 10 };
  return discounts[plan] || 0;
};
