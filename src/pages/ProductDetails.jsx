// ProductDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCart } from "../context/CartContext";
import { requireAuth } from "../utils/authUtils";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://ecommercebackend-aa6n.onrender.com/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
        setSelectedImage(data.image);
      } catch (err) {
        console.error("Failed to load product", err);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    // Get current path for redirect after login
    const currentPath = location.pathname;

    // Use the addToCart function from CartContext
    const success = await addToCart(product._id, quantity, currentPath);

    if (success) {
      toast.success("Added to cart!", { position: "bottom-left" });
    }
  };

  const handleBuyNow = async () => {
    // Get current path for redirect after login
    const currentPath = location.pathname;

    // Check if user is authenticated
    const token = localStorage.getItem("authToken");
    const isAuthenticated = !!token;

    if (!requireAuth(isAuthenticated, navigate, "proceed to checkout", currentPath)) {
      return;
    }

    try {
      // First add to cart
      const success = await addToCart(product._id, quantity);

      if (success) {
        // Then redirect to checkout page
        navigate("/checkout");
      }
    } catch (error) {
      console.error("Buy now error:", error);
      toast.error("Checkout error", { position: "bottom-left" });
    }
  };

  if (!product) return <div className="text-center py-12">Loading...</div>;

  const discountedPrice = product.price * (1 - product.discount / 100);
  const totalDiscounted = (discountedPrice * quantity).toFixed(2);
  const totalOriginal = (product.price * quantity).toFixed(2);
  const monthlyPrice = (discountedPrice * quantity / 6).toFixed(2);

  return (
      <section className="max-w-6xl mx-auto p-4 lg:p-8 flex flex-col lg:flex-row gap-10">
        <div className="w-full lg:w-1/2">
          <div className="border rounded-lg overflow-hidden mb-4">
            <img src={`https://ecommercebackend-aa6n.onrender.com${selectedImage}`} alt={product.name} className="w-full h-[400px] object-contain" />
          </div>
          <div className="flex gap-2">
            {[product.image, ...(product.gallery || [])].map((img, idx) => (
              <img key={idx} src={`https://ecommercebackend-aa6n.onrender.com${img}`} alt="thumb" onClick={() => setSelectedImage(img)} className={`h-20 w-20 object-cover border rounded cursor-pointer ${selectedImage === img ? "border-pink-600" : "border-gray-300"}`} />
            ))}
          </div>
        </div>

        <div className="w-full lg:w-1/2">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>
          <p className="text-sm text-gray-600 mb-4">{product.description}</p>
          <div className="text-yellow-500 mb-2">⭐⭐⭐⭐☆ <span className="text-xs text-gray-500">({product.rating || 200})</span></div>
          <div className="text-xl font-bold text-pink-600 mb-2">
            ${totalDiscounted}
            {product.discount > 0 && (
              <span className="ml-2 text-sm text-gray-400 line-through">${totalOriginal}</span>
            )}
          </div>
          <div className="text-sm text-gray-600 mb-4">or ${monthlyPrice}/month with financing</div>

          <div className="mb-4">
            <p className="font-semibold text-sm mb-2">Choose a Color</p>
            <div className="flex gap-2">
              {["bg-gray-400", "bg-pink-400", "bg-blue-400", "bg-green-400"].map((color, idx) => (
                <span key={idx} className={`w-6 h-6 rounded-full ${color} cursor-pointer border`} />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <button onClick={() => setQuantity((q) => Math.max(q - 1, 1))} className="border rounded px-3 py-1">-</button>
            <span className="font-semibold">{quantity}</span>
            <button onClick={() => setQuantity((q) => q + 1)} className="border rounded px-3 py-1">+</button>
            <span className="text-xs text-orange-500 ml-2">Only {product.stock} items left!</span>
          </div>

          <div className="flex gap-4 mb-6">
            <button onClick={handleBuyNow} className="bg-pink-600 text-white px-6 py-2 rounded-full hover:bg-pink-700">Buy Now</button>
            <button onClick={handleAddToCart} className="border border-gray-600 px-6 py-2 rounded-full">Add to Cart</button>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg text-sm space-y-2">
            <p><strong>🚚 Free Delivery:</strong> Enter your postcode for delivery availability.</p>
            <p><strong>↩️ Return Delivery:</strong> Free 30-day returns.</p>
          </div>
        </div>
      </section>

  );
};

export default ProductDetails;
