import React, { createContext, useState, useContext } from 'react';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';
import { toast } from 'react-toastify';

const OrderContext = createContext();

export const useOrders = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token, isAdmin } = useAuth();
  const { clearCart } = useCart();

  const fetchUserOrders = async () => {
    if (!token) return [];

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data);
      return data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchAllOrders = async () => {
    if (!token || !isAdmin) {
      toast.error('Unauthorized');
      return [];
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/orders/all', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch all orders');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching all orders:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const placeOrder = async (paymentMethod) => {
    if (!token) {
      toast.error('Please log in to place an order');
      return false;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/orders/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ paymentMethod })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to place order');
      }

      const data = await response.json();

      // Clear cart after successful order
      await clearCart();

      toast.success('Order placed successfully');
      return data;
    } catch (error) {
      toast.error(error.message || 'Error placing order');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    if (!token || !isAdmin) {
      toast.error('Unauthorized');
      return false;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5001/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update order status');
      }

      toast.success('Order status updated');
      return true;
    } catch (error) {
      toast.error(error.message || 'Error updating order status');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    orders,
    loading,
    fetchUserOrders,
    fetchAllOrders,
    placeOrder,
    updateOrderStatus
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};
