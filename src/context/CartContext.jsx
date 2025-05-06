import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';
import { requireAuth } from '../utils/authUtils';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Fetch cart when component mounts or auth state changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/cart', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();

      if (response.ok && data.products) {
        // Filter out any null productId items
        const validProducts = data.products.filter(item => item.productId);
        setCart(validProducts);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1, currentPath = '') => {
    // Check if user is authenticated and redirect if not
    if (!requireAuth(isAuthenticated, navigate, "add to cart", currentPath)) {
      return false;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity })
      });

      if (!response.ok) {
        throw new Error('Failed to add item to cart');
      }

      await fetchCart(); // Refresh cart
      toast.success('Added to cart');
      return true;
    } catch (error) {
      toast.error(error.message || 'Error adding to cart');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    if (!token) return false;

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5001/api/cart/remove/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Failed to remove item from cart');
      }

      // Update local state immediately for better UX
      setCart(prevCart => prevCart.filter(item => item.productId._id !== productId));
      toast.success('Removed from cart');
      return true;
    } catch (error) {
      toast.error(error.message || 'Error removing from cart');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!token) return false;

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity })
      });

      if (!response.ok) {
        throw new Error('Failed to update quantity');
      }

      await fetchCart(); // Refresh cart
      return true;
    } catch (error) {
      toast.error(error.message || 'Error updating quantity');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!token) return false;

    try {
      setLoading(true);
      // Remove each item from cart
      for (const item of cart) {
        await removeFromCart(item.productId._id);
      }
      setCart([]);
      return true;
    } catch (error) {
      toast.error('Error clearing cart');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Calculate cart totals
  const cartTotal = cart.reduce((total, item) => {
    if (!item.productId) return total;
    const price = item.productId.price * (1 - (item.productId.discount || 0) / 100);
    return total + (price * item.quantity);
  }, 0);

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  const value = {
    cart,
    loading,
    cartTotal,
    cartCount,
    fetchCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
