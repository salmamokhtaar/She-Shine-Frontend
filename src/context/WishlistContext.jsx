import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';
import { toast } from 'react-toastify';
import { requireAuth } from '../utils/authUtils';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token, isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Fetch wishlist when component mounts or auth state changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/wishlist', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();

      if (response.ok && data.products) {
        // Filter out any null productId items
        const validProducts = data.products.filter(item => item.productId);
        setWishlist(validProducts);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId, currentPath = '') => {
    // Check if user is authenticated and redirect if not
    if (!requireAuth(isAuthenticated, navigate, "add to wishlist", currentPath)) {
      return false;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/wishlist/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId })
      });

      if (!response.ok) {
        const data = await response.json();
        if (data.message === 'Product already in wishlist') {
          toast.info('Product already in wishlist');
          return true;
        }
        throw new Error('Failed to add item to wishlist');
      }

      await fetchWishlist(); // Refresh wishlist
      toast.success('Added to wishlist');
      return true;
    } catch (error) {
      toast.error(error.message || 'Error adding to wishlist');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!token) return false;

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5001/api/wishlist/remove/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Failed to remove item from wishlist');
      }

      // Update local state immediately for better UX
      setWishlist(prevWishlist => prevWishlist.filter(item => item.productId._id !== productId));
      toast.success('Removed from wishlist');
      return true;
    } catch (error) {
      toast.error(error.message || 'Error removing from wishlist');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const moveToCart = async (productId) => {
    if (!token) return false;

    try {
      setLoading(true);
      // Add to cart first
      const addedToCart = await addToCart(productId, 1);

      if (addedToCart) {
        // Then remove from wishlist
        await removeFromWishlist(productId);
        toast.success('Moved to cart');
        return true;
      } else {
        throw new Error('Failed to add item to cart');
      }
    } catch (error) {
      toast.error(error.message || 'Error moving to cart');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const wishlistCount = wishlist.length;

  const value = {
    wishlist,
    loading,
    wishlistCount,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    moveToCart
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};
