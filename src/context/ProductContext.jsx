import React, { createContext, useState, useContext } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';
import config from '../config/config';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token, isAdmin } = useAuth();

  const fetchProducts = async (category = null) => {
    try {
      setLoading(true);
      let url = `${config.API_URL}/api/products`;

      if (category) {
        url = `${config.API_URL}/api/products/category/${category}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      setProducts(data);
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${config.API_URL}/api/products/featured`);

      if (!response.ok) {
        throw new Error('Failed to fetch featured products');
      }

      const data = await response.json();
      setFeaturedProducts(data);
      return data;
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchProductById = async (productId) => {
    try {
      setLoading(true);
      const response = await fetch(`${config.API_URL}/api/products/${productId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://ecommercebackend-aa6n.onrender.com/api/products/categories');

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();
      setCategories(Object.keys(data));
      return data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return {};
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async (query) => {
    try {
      setLoading(true);
      // Fetch all products and filter on client side
      // In a real app, you'd have a dedicated search endpoint
      const allProducts = await fetchProducts();

      if (!query) return allProducts;

      const searchTerm = query.toLowerCase();
      return allProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
      );
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Admin functions
  const createProduct = async (productData) => {
    if (!token || !isAdmin) {
      toast.error('Unauthorized');
      return false;
    }

    try {
      setLoading(true);

      // Create FormData for file upload
      const formData = new FormData();
      Object.keys(productData).forEach(key => {
        if (key === 'image') {
          formData.append('image', productData.image);
        } else if (key === 'tags' && Array.isArray(productData.tags)) {
          formData.append('tags', productData.tags.join(','));
        } else {
          formData.append(key, productData[key]);
        }
      });

      const response = await fetch(`${config.API_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create product');
      }

      const data = await response.json();
      toast.success('Product created successfully');
      return data.product;
    } catch (error) {
      toast.error(error.message || 'Error creating product');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (productId, productData) => {
    if (!token || !isAdmin) {
      toast.error('Unauthorized');
      return false;
    }

    try {
      setLoading(true);

      const response = await fetch(`${config.API_URL}/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update product');
      }

      const data = await response.json();
      toast.success('Product updated successfully');
      return data.product;
    } catch (error) {
      toast.error(error.message || 'Error updating product');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    if (!token || !isAdmin) {
      toast.error('Unauthorized');
      return false;
    }

    try {
      setLoading(true);

      const response = await fetch(`${config.API_URL}/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete product');
      }

      toast.success('Product deleted successfully');
      return true;
    } catch (error) {
      toast.error(error.message || 'Error deleting product');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    products,
    featuredProducts,
    categories,
    loading,
    fetchProducts,
    fetchFeaturedProducts,
    fetchProductById,
    fetchCategories,
    searchProducts,
    createProduct,
    updateProduct,
    deleteProduct
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};
