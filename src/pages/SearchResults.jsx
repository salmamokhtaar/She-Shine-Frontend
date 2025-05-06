import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { searchProducts, loading } = useProducts();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const [results, setResults] = useState([]);
  const [sortBy, setSortBy] = useState('relevance');

  useEffect(() => {
    const fetchResults = async () => {
      if (query) {
        const data = await searchProducts(query);
        setResults(data);
      }
    };

    fetchResults();
  }, [query, searchProducts]);

  const handleAddToCart = async (productId) => {
    await addToCart(productId, 1);
  };

  const handleAddToWishlist = async (productId) => {
    await addToWishlist(productId);
  };

  const sortResults = () => {
    const sortedResults = [...results];

    switch (sortBy) {
      case 'price-asc':
        return sortedResults.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sortedResults.sort((a, b) => b.price - a.price);
      case 'newest':
        return sortedResults.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      default:
        return sortedResults;
    }
  };

  const sortedResults = sortResults();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Search Results for "{query}"
        </h1>
        <p className="text-gray-600 mt-2">
          {results.length} {results.length === 1 ? 'product' : 'products'} found
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium text-gray-900 mb-4">No products found</h2>
          <p className="text-gray-600 mb-6">
            We couldn't find any products matching your search.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="flex justify-end mb-6">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="relevance">Sort by: Relevance</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedResults.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <Link to={`/product/${product._id}`} className="block relative h-48 overflow-hidden">
                  <img
                    src={`https://ecommercebackend-aa6n.onrender.com${product.image}`}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/300x300?text=Image+Not+Found';
                    }}
                  />
                  {product.discount > 0 && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      {product.discount}% OFF
                    </div>
                  )}
                </Link>
                <div className="p-4">
                  <Link to={`/product/${product._id}`} className="block">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description}</p>
                  </Link>
                  <div className="flex justify-between items-center">
                    <div>
                      {product.discount > 0 ? (
                        <div className="flex items-center">
                          <span className="text-lg font-bold text-gray-900">
                            ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                          </span>
                          <span className="ml-2 text-sm text-gray-500 line-through">
                            ${product.price.toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAddToWishlist(product._id)}
                        className="p-2 text-gray-500 hover:text-pink-500 transition-colors"
                        aria-label="Add to wishlist"
                      >
                        <FiHeart />
                      </button>
                      <button
                        onClick={() => handleAddToCart(product._id)}
                        className="p-2 text-gray-500 hover:text-pink-500 transition-colors"
                        aria-label="Add to cart"
                      >
                        <FiShoppingCart />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchResults;
