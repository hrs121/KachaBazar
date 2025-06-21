"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { cartAPI, wishlistAPI } from "@/lib/api";
import { useUser } from "./UserContext";
import toast from 'react-hot-toast';

const CartWishlistContext = createContext();

export const CartWishlistProvider = ({ children }) => {
  const { user, token } = useUser();
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [wishlist, setWishlist] = useState({ products: [] });
  const [loading, setLoading] = useState(false);

  // Fetch cart when user logs in
  useEffect(() => {
    if (user && token) {
      fetchCart();
      fetchWishlist();
    } else {
      setCart({ items: [], totalAmount: 0 });
      setWishlist({ products: [] });
    }
  }, [user, token]);

  // Fetch cart data
  const fetchCart = async () => {
    try {
      const response = await cartAPI.getCart();
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart({ items: [], totalAmount: 0 });
    }
  };

  // Fetch wishlist data
  const fetchWishlist = async () => {
    try {
      const response = await wishlistAPI.getWishlist();
      setWishlist(response.data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setWishlist({ products: [] });
    }
  };

  // Add to cart
  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return false;
    }

    setLoading(true);
    try {
      const response = await cartAPI.addToCart({ productId, quantity });
      setCart(response.data.cart);
      toast.success('Item added to cart');
      return true;
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to add item to cart';
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update cart item quantity
  const updateCartQuantity = async (productId, quantity) => {
    if (!user) return false;

    setLoading(true);
    try {
      const response = await cartAPI.updateCartItem(productId, quantity);
      setCart(response.data.cart);
      return true;
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to update cart';
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Remove from cart
  const removeFromCart = async (productId) => {
    if (!user) return false;

    setLoading(true);
    try {
      const response = await cartAPI.removeFromCart(productId);
      setCart(response.data.cart);
      toast.success('Item removed from cart');
      return true;
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to remove item from cart';
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (!user) return false;

    setLoading(true);
    try {
      await cartAPI.clearCart();
      setCart({ items: [], totalAmount: 0 });
      toast.success('Cart cleared');
      return true;
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to clear cart';
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Add to wishlist
  const addToWishlist = async (productId) => {
    if (!user) {
      toast.error('Please login to add items to wishlist');
      return false;
    }

    setLoading(true);
    try {
      const response = await wishlistAPI.addToWishlist(productId);
      setWishlist(response.data.wishlist);
      toast.success('Item added to wishlist');
      return true;
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to add item to wishlist';
      if (message !== 'Product already in wishlist') {
        toast.error(message);
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Remove from wishlist
  const removeFromWishlist = async (productId) => {
    if (!user) return false;

    setLoading(true);
    try {
      const response = await wishlistAPI.removeFromWishlist(productId);
      setWishlist(response.data.wishlist);
      toast.success('Item removed from wishlist');
      return true;
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to remove item from wishlist';
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Toggle wishlist
  const toggleWishlist = async (productId) => {
    if (!user) {
      toast.error('Please login to add items to wishlist');
      return false;
    }

    setLoading(true);
    try {
      const response = await wishlistAPI.toggleWishlist(productId);
      setWishlist(response.data.wishlist);
      
      if (response.data.added) {
        toast.success('Item added to wishlist');
      } else {
        toast.success('Item removed from wishlist');
      }
      
      return response.data.added;
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to update wishlist';
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlist.products.some(product => 
      product._id === productId || product === productId
    );
  };

  // Get cart item count
  const getCartItemCount = () => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  // Get wishlist item count
  const getWishlistItemCount = () => {
    return wishlist.products.length;
  };

  const value = {
    cart,
    wishlist,
    loading,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    getCartItemCount,
    getWishlistItemCount,
    fetchCart,
    fetchWishlist,
  };

  return (
    <CartWishlistContext.Provider value={value}>
      {children}
    </CartWishlistContext.Provider>
  );
};

export const useCartWishlist = () => {
  const context = useContext(CartWishlistContext);
  if (!context) {
    throw new Error('useCartWishlist must be used within CartWishlistProvider');
  }
  return context;
};
