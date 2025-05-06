import React, { useState, useEffect } from "react";
import { FiHeart } from "react-icons/fi";
import { AiFillHeart } from "react-icons/ai";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useWishlist } from "../context/WishlistContext";
import { requireAuth } from "../utils/authUtils";

const DEFAULT_IMAGE =
  "https://www.shutterstock.com/image-vector/missing-picture-page-website-design-600nw-1552421075.jpg";

const AllProductsGrid = () => {
  const [products, setProducts] = useState([]);
  const [wishlistProducts, setWishlistProducts] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const { addToWishlist } = useWishlist();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToWishlist = async (productId, productName, e) => {
    // Prevent navigation when clicking the wishlist button
    e.preventDefault();
    e.stopPropagation();

    // Get current path for redirect after login
    const currentPath = location.pathname;

    // Use the addToWishlist function from WishlistContext
    const success = await addToWishlist(productId, currentPath);

    if (success) {
      setWishlistProducts((prev) => ({ ...prev, [productId]: true }));
      toast.success(`${productName} added to wishlist`, {
        position: "bottom-left",
      });
    }
  };


  return (
    <section className="py-12 bg-pink-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-pink-700 mb-8 text-left">
          Clothes For You!
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            const originalPrice = (
              product.price /
              (1 - product.discount / 100)
            ).toFixed(2);

            return (
              <Link
                to={`/product/${product._id}`}
                key={product._id}
                className="bg-white rounded-xl shadow-md overflow-hidden p-4 relative group hover:shadow-xl transition w-full block"
              >
                {/* Discount Badge */}
                {product.discount > 0 && (
                  <span className="absolute top-2 left-2 bg-pink-600 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                    {product.discount}% OFF
                  </span>
                )}

                {/* Product Image */}
                <div className="relative w-full h-56 mb-4 overflow-hidden rounded-md">
                  <img
                    src={
                      product.image
                        ? `http://localhost:5001${product.image}`
                        : DEFAULT_IMAGE
                    }
                    alt={product.name}
                    onError={(e) => (e.target.src = DEFAULT_IMAGE)}
                    className="w-full h-full object-contain"
                  />
                  <button
                    onClick={(e) => handleAddToWishlist(product._id, product.name, e)}
                    className="absolute top-2 right-2 z-10 text-pink-500 hover:text-pink-700"
                  >
                    {wishlistProducts[product._id] ? (
                      <AiFillHeart size={22} />
                    ) : (
                      <FiHeart size={22} />
                    )}
                  </button>
                </div>

                {/* Product Info */}
                <div className="text-left space-y-1">
                  <h3 className="text-md font-semibold text-gray-800 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    Wireless freedom. Rich sound.
                  </p>

                  <div className="flex items-center gap-2">
                    <span className="text-md font-bold text-pink-700">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.discount > 0 && (
                      <span className="text-sm text-gray-400 line-through">
                        ${originalPrice}
                      </span>
                    )}
                  </div>

                  <div className="text-yellow-500 text-sm">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span key={i}>
                        {i < Math.round(product.rating || 0) ? "★" : "☆"}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AllProductsGrid;
