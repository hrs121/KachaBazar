"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { storage } from "@/lib/utils";
import { cartAPI } from "@/lib/api";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize user from localStorage on mount
  useEffect(() => {
    const storedUser = storage.get('user');
    const storedToken = storage.get('token');
    
    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
      fetchCart();
    }
    setLoading(false);
  }, []);

  // Fetch cart data
  const fetchCart = async () => {
    try {
      const response = await cartAPI.getCart();
      setCart(response.data.items || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart([]);
    }
  };

  // Login function
  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    storage.set('user', userData);
    storage.set('token', authToken);
    fetchCart();
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    setCart([]);
    storage.remove('user');
    storage.remove('token');
  };

  // Update user profile
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    storage.set('user', updatedUser);
  };

  // Add to cart
  const addToCart = async (productId, quantity = 1) => {
    try {
      const response = await cartAPI.addToCart({ productId, quantity });
      setCart(response.data.items || []);
      return { success: true };
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to add to cart' 
      };
    }
  };

  // Update cart item quantity
  const updateCartItem = async (productId, quantity) => {
    try {
      const response = await cartAPI.updateCartItem(productId, quantity);
      setCart(response.data.items || []);
      return { success: true };
    } catch (error) {
      console.error('Error updating cart:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to update cart' 
      };
    }
  };

  // Remove from cart
  const removeFromCart = async (productId) => {
    try {
      const response = await cartAPI.removeFromCart(productId);
      setCart(response.data.items || []);
      return { success: true };
    } catch (error) {
      console.error('Error removing from cart:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to remove from cart' 
      };
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      await cartAPI.clearCart();
      setCart([]);
      return { success: true };
    } catch (error) {
      console.error('Error clearing cart:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to clear cart' 
      };
    }
  };

  // Calculate cart totals
  const cartTotal = cart.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const value = {
    user,
    token,
    cart,
    loading,
    cartTotal,
    cartItemCount,
    login,
    logout,
    updateUser,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    fetchCart
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
