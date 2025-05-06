import React, { useState, useEffect } from "react";
import { FiHeart, FiShoppingCart } from "react-icons/fi";
import { AiFillHeart } from "react-icons/ai";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { requireAuth } from "../utils/authUtils";

const DEFAULT_IMAGE =
  "https://www.shutterstock.com/image-vector/missing-picture-page-website-design-600nw-1552421075.jpg";

const NewArrivalsGrid = () => {
  const [products, setProducts] = useState([]);
  const [wishlistProducts, setWishlistProducts] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://ecommercebackend-aa6n.onrender.com/api/products/tag/new");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch new arrivals", error);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToWishlist = async (productId, productName, e) => {
    // Prevent event bubbling if event is provided
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

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

  const handleAddToCart = async (productId, e) => {
    // Prevent event bubbling if event is provided
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Get current path for redirect after login
    const currentPath = location.pathname;

    // Use the addToCart function from CartContext
    const success = await addToCart(productId, 1, currentPath);

    if (success) {
      toast.success("Added to cart!", { position: "bottom-left" });
    }
  };

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-pink-700 mb-2">New Arrivals</h2>
        <p className="text-gray-500 mb-8">
          Fresh picks just added. Shop the latest styles now!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            const originalPrice = (
              product.price / (1 - product.discount / 100)
            ).toFixed(2);
            return (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow-md overflow-hidden p-4 relative group hover:shadow-xl transition"
              >
                {product.discount > 0 && (
                  <span className="absolute top-2 left-2 bg-pink-600 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                    {product.discount}% OFF
                  </span>
                )}

                <Link
                  to={`/product/${product._id}`}
                  className="w-full h-56 flex justify-center items-center mb-4"
                >
                  <img
                    src={
                      product.image
                        ? `https://ecommercebackend-aa6n.onrender.com${product.image}`
                        : DEFAULT_IMAGE
                    }
                    alt={product.name}
                    className="object-contain h-full w-full"
                    onError={(e) => (e.target.src = DEFAULT_IMAGE)}
                  />
                </Link>

                <button
                  onClick={(e) => handleAddToWishlist(product._id, product.name, e)}
                  className="absolute top-2 right-2 text-pink-500 hover:text-pink-700 z-10"
                >
                  {wishlistProducts[product._id] ? (
                    <AiFillHeart size={20} />
                  ) : (
                    <FiHeart size={20} />
                  )}
                </button>

                <div className="text-left space-y-1">
                  <Link to={`/product/${product._id}`}>
                    <h3 className="text-md font-semibold text-gray-800 hover:underline line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    New fashion drop.
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

                <button
                  onClick={(e) => handleAddToCart(product._id, e)}
                  className="mt-4 w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-full text-sm font-medium transition"
                >
                  Add to Cart
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default NewArrivalsGrid;
