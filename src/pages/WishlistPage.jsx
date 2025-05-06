import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiTrash2, FiShoppingCart } from "react-icons/fi";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { requireAuth } from "../utils/authUtils";

const DEFAULT_IMAGE =
  "https://www.shutterstock.com/image-vector/missing-picture-page-website-design-600nw-1552421075.jpg";

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  const { removeFromWishlist: removeWishlistItem } = useWishlist();
  const token = localStorage.getItem("authToken");
  const isAuthenticated = !!token;

  const fetchWishlist = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5001/api/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.products) {
        const filtered = data.products.filter(p => p.productId);
        setWishlist(filtered);
      }
    } catch (err) {
      console.error("Error loading wishlist", err);
    }
  };

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      toast.info("Please log in to view your wishlist", { position: "bottom-left" });
      navigate("/login");
      return;
    }

    fetchWishlist();
  }, [isAuthenticated, navigate]);

  const removeFromWishlist = async (productId) => {
    // Use the removeFromWishlist function from WishlistContext
    const success = await removeWishlistItem(productId);

    if (success) {
      // Update local state for immediate UI feedback
      setWishlist(prev => prev.filter(item => item.productId._id !== productId));
      toast.success("Removed from wishlist", { position: "bottom-left" });
    }
  };

  const handleAddToCart = async (productId) => {
    // Get current path for redirect after login
    const currentPath = location.pathname;

    // Use the addToCart function from CartContext
    const success = await addToCart(productId, 1, currentPath);

    if (success) {
      // Remove from wishlist after adding to cart
      await removeFromWishlist(productId);
      toast.success("Added to cart", { position: "bottom-left" });
    }
  };

  return (

      <div className="max-w-5xl mx-auto py-10 px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Wishlist</h2>
        {wishlist.length === 0 ? (
          <p className="text-center text-gray-500">Your wishlist is empty.</p>
        ) : (
          <div className="space-y-6">
            {wishlist.map(({ productId }) => (
              <div
                key={productId._id}
                className="flex justify-between items-center border rounded-lg p-4 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={productId.image ? `http://localhost:5001${productId.image}` : DEFAULT_IMAGE}
                    alt={productId.name}
                    className="h-16 w-16 rounded object-cover"
                  />
                  <div>
                    <Link to={`/product/${productId._id}`}>
                      <h3 className="font-semibold text-lg hover:underline text-pink-700">
                        {productId.name}
                      </h3>
                    </Link>
                    <p className="text-gray-500">${productId.price?.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddToCart(productId._id)}
                    className="text-white bg-pink-600 hover:bg-pink-700 px-3 py-1 rounded"
                  >
                    <FiShoppingCart />
                  </button>
                  <button
                    onClick={() => removeFromWishlist(productId._id)}
                    className="text-white bg-pink-600 hover:bg-pink-700 px-3 py-1 rounded"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

  );
};

export default WishlistPage;
