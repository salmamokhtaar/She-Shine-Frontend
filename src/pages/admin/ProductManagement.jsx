import React, { useState, useEffect } from 'react';
import { useProducts } from '../../context/ProductContext';
import { toast } from 'react-toastify';

const ProductManagement = () => {
  const { products, loading, fetchProducts, createProduct, updateProduct, deleteProduct } = useProducts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'women',
    stock: '',
    discount: '0',
    isFeatured: false,
    tags: '',
    image: null
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const loadProducts = async () => {
      try {
        await fetchProducts();
      } catch (error) {
        if (isMounted) {
          console.error('Error loading products:', error);
          toast.error('Failed to load products. Please try again.');
        }
      }
    };
    loadProducts();
    const intervalId = setInterval(loadProducts, 30000);
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []); // Only run once on mount

  const filteredProducts = Array.isArray(products) ? products.filter(product => {
    if (!product) return false;

    // Apply search filter
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = 
      product.name?.toLowerCase().includes(searchTermLower) ||
      product.description?.toLowerCase().includes(searchTermLower) ||
      product.category?.toLowerCase().includes(searchTermLower) ||
      product.tags?.some(tag => tag.toLowerCase().includes(searchTermLower));

    // Apply category filter
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;

    // Apply stock filter
    let matchesStock = true;
    if (stockFilter === 'low') {
      matchesStock = product.stock <= 10;
    } else if (stockFilter === 'out') {
      matchesStock = product.stock === 0;
    }

    return matchesSearch && matchesCategory && matchesStock;
  }) : [];

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'price':
        comparison = a.price - b.price;
        break;
      case 'stock':
        comparison = a.stock - b.stock;
        break;
      case 'category':
        comparison = a.category.localeCompare(b.category);
        break;
      default:
        comparison = 0;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleOpenModal = (product = null) => {
    if (product) {
      setCurrentProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        category: product.category,
        stock: product.stock.toString(),
        discount: product.discount.toString(),
        isFeatured: product.isFeatured,
        tags: product.tags ? product.tags.join(', ') : '',
        image: null
      });
      setImagePreview(`https://ecommercebackend-aa6n.onrender.com${product.image}`);
    } else {
      setCurrentProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'women',
        stock: '',
        discount: '0',
        isFeatured: false,
        tags: '',
        image: null
      });
      setImagePreview(null);
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'women',
      stock: '',
      discount: '0',
      isFeatured: false,
      tags: '',
      image: null
    });
    setImagePreview(null);
    setErrors({});
  };

  const handleOpenDeleteModal = (product) => {
    setCurrentProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCurrentProduct(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === 'file') {
      setFormData({
        ...formData,
        [name]: files[0]
      });

      // Create image preview
      if (files[0]) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(files[0]);
      }
    } else if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }

    if (!formData.stock.trim()) {
      newErrors.stock = 'Stock is required';
    } else if (isNaN(parseInt(formData.stock)) || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Stock must be a non-negative number';
    }

    if (isNaN(parseInt(formData.discount)) || parseInt(formData.discount) < 0 || parseInt(formData.discount) > 100) {
      newErrors.discount = 'Discount must be between 0 and 100';
    }

    if (!currentProduct && !formData.image) {
      newErrors.image = 'Product image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        // Prepare data for API
        const productData = {
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
          stock: parseInt(formData.stock),
          discount: parseInt(formData.discount),
          isFeatured: formData.isFeatured,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        };

        if (formData.image) {
          productData.image = formData.image;
        }

        let success = false;

        if (currentProduct) {
          // Update existing product
          success = await updateProduct(currentProduct._id, productData);
        } else {
          // Create new product
          success = await createProduct(productData);
        }

        if (success) {
          // Refresh product list
          await fetchProducts();
          toast.success(currentProduct ? 'Product updated successfully' : 'Product created successfully');
          handleCloseModal();
        }
      } catch (error) {
        console.error('Error saving product:', error);
        toast.error('Failed to save product: ' + (error.message || 'Unknown error'));
      }
    }
  };

  const handleDelete = async () => {
    if (currentProduct) {
      try {
        const success = await deleteProduct(currentProduct._id);

        if (success) {
          await fetchProducts();
          handleCloseDeleteModal();
          toast.success('Product deleted successfully');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product: ' + (error.message || 'Unknown error'));
      }
    }
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return 'bg-red-100 text-red-800';
    if (stock <= 10) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search Products
          </label>
          <div className="relative rounded-md shadow-sm">
            <input
              type="text"
              id="search"
              placeholder="Search by name, description, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="focus:ring-pink-500 focus:border-pink-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm rounded-md"
          >
            <option value="all">All Categories</option>
            <option value="women">Women</option>
            <option value="men">Men</option>
            <option value="kids">Kids</option>
            <option value="accessories">Accessories</option>
          </select>
        </div>

        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
            Stock Status
          </label>
          <select
            id="stock"
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm rounded-md"
          >
            <option value="all">All Stock</option>
            <option value="low">Low Stock (≤10)</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>

        <div>
          <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
            Sort By
          </label>
          <div className="flex space-x-2">
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm rounded-md"
            >
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="stock">Stock</option>
              <option value="category">Category</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>

      {/* Add Product Button */}
      <div className="mb-6">
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Product
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No products found matching your criteria
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedProducts.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={`https://ecommercebackend-aa6n.onrender.com${product.image}`}
                          alt={product.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.description.substring(0, 50)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 capitalize">{product.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${product.price.toFixed(2)}</div>
                    {product.discount > 0 && (
                      <div className="text-sm text-red-600">-{product.discount}%</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.stock}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStockStatus(product.stock)}`}>
                      {product.stock === 0 ? 'Out of Stock' : product.stock <= 10 ? 'Low Stock' : 'In Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleOpenModal(product)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleOpenDeleteModal(product)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {currentProduct ? 'Edit Product' : 'Add New Product'}
                    </h3>
                    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Product Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                            errors.name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-pink-500 focus:border-pink-500'
                          }`}
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                      </div>

                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          rows="3"
                          value={formData.description}
                          onChange={handleChange}
                          className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                            errors.description ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-pink-500 focus:border-pink-500'
                          }`}
                        />
                        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                            Price
                          </label>
                          <input
                            type="number"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                              errors.price ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-pink-500 focus:border-pink-500'
                            }`}
                          />
                          {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                        </div>

                        <div>
                          <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                            Stock
                          </label>
                          <input
                            type="number"
                            id="stock"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                              errors.stock ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-pink-500 focus:border-pink-500'
                            }`}
                          />
                          {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                            Category
                          </label>
                          <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                          >
                            <option value="women">Women</option>
                            <option value="men">Men</option>
                            <option value="kids">Kids</option>
                            <option value="accessories">Accessories</option>
                          </select>
                        </div>

                        <div>
                          <label htmlFor="discount" className="block text-sm font-medium text-gray-700">
                            Discount (%)
                          </label>
                          <input
                            type="number"
                            id="discount"
                            name="discount"
                            value={formData.discount}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                              errors.discount ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-pink-500 focus:border-pink-500'
                            }`}
                          />
                          {errors.discount && <p className="mt-1 text-sm text-red-600">{errors.discount}</p>}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                          Tags (comma-separated)
                        </label>
                        <input
                          type="text"
                          id="tags"
                          name="tags"
                          value={formData.tags}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                          Product Image
                        </label>
                        <input
                          type="file"
                          id="image"
                          name="image"
                          accept="image/*"
                          onChange={handleChange}
                          className={`mt-1 block w-full ${
                            errors.image ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-pink-500 focus:border-pink-500'
                          }`}
                        />
                        {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
                        {imagePreview && (
                          <div className="mt-2">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="h-32 w-32 object-cover rounded-md"
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="isFeatured"
                          name="isFeatured"
                          checked={formData.isFeatured}
                          onChange={handleChange}
                          className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                        />
                        <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-900">
                          Featured Product
                        </label>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-pink-600 text-base font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {currentProduct ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && currentProduct && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Delete Product
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete "{currentProduct.name}"? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={handleCloseDeleteModal}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
