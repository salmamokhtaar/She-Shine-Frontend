import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DEFAULT_IMAGE =
  "https://www.shutterstock.com/image-vector/missing-picture-page-website-design-600nw-1552421075.jpg";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("https://ecommercebackend-aa6n.onrender.com/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.products) {
        const filtered = data.products.filter((item) => item.productId); // filter out null productId
        setCart(filtered);
      }
    } catch (err) {
      console.error("Error fetching cart", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.warning("Please log in to view your cart", {
        position: "bottom-left",
      });
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const updateQuantity = async (productId, amount) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Please log in to update your cart", { position: "bottom-left" });
      return;
    }

    // Find the product in cart
    const product = cart.find((p) => p.productId && p.productId._id === productId);
    if (!product) {
      console.error("Product not found in cart");
      return;
    }

    const newQty = product.quantity + amount;
    if (newQty < 1) return;

    try {
      const response = await fetch("https://ecommercebackend-aa6n.onrender.com/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity: amount }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update cart: ${response.status} ${response.statusText}`);
      }

      fetchCart();
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Error updating quantity", { position: "bottom-left" });
    }
  };

  const removeItem = async (productId) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Please log in to remove items", { position: "bottom-left" });
      return;
    }

    try {
      const response = await fetch(`https://ecommercebackend-aa6n.onrender.com/api/cart/remove/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Failed to remove item: ${response.status} ${response.statusText}`);
      }

      setCart((prev) =>
        prev.filter((item) => item.productId && item.productId._id !== productId)
      );

      toast.success("Item removed from cart", { position: "bottom-left" });
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item", { position: "bottom-left" });
    }
  };

  const subtotal = cart.reduce((sum, item) => {
    // Skip if productId is null or undefined
    if (!item || !item.productId) return sum;

    // Get price and quantity with default values if missing
    const price = typeof item.productId.price === 'number' ? item.productId.price : 0;
    const quantity = typeof item.quantity === 'number' ? item.quantity : 0;

    return sum + (price * quantity);
  }, 0);

  const shipping = 5;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-600">Loading cart...</div>
    );
  }

  if (!loading && cart.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 font-semibold">
        Your cart is empty.
      </div>
    );
  }

  return (

      <div className="max-w-6xl mx-auto py-12 px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
          {cart.map((item) => {
            // Skip rendering if productId is null or undefined
            if (!item || !item.productId) return null;

            const { productId, quantity } = item;

            return (
              <div
                key={productId._id}
                className="flex items-center justify-between border-b py-4"
              >
                <div className="flex items-center">
                  <img
                    src={
                      productId.image
                        ? `https://ecommercebackend-aa6n.onrender.com${productId.image}`
                        : DEFAULT_IMAGE
                    }
                    alt={productId.name || "Product"}
                    onError={(e) => (e.target.src = DEFAULT_IMAGE)}
                    className="w-16 h-16 rounded object-cover"
                  />
                  <div className="ml-4">
                    <h3 className="font-semibold">{productId.name || "Unknown Product"}</h3>
                    <p className="text-gray-500">
                      ${typeof productId.price === 'number' ? productId.price.toFixed(2) : '0.00'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded">
                    <button
                      onClick={() => updateQuantity(productId._id, -1)}
                      className="px-2"
                    >
                      −
                    </button>
                    <span className="px-3">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(productId._id, 1)}
                      className="px-2"
                    >
                      +
                    </button>
                  </div>
                  <span className="w-20 text-right font-bold">
                    ${typeof productId.price === 'number' ? (productId.price * quantity).toFixed(2) : '0.00'}
                  </span>
                  <button
                    onClick={() => removeItem(productId._id)}
                    className="text-red-500"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="bg-gray-50 p-6 rounded shadow-md h-fit">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Shipping</span>
            <span>${shipping.toFixed(2)}</span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button
            onClick={() => navigate("/checkout")}
            className="mt-6 w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700"
          >
            Checkout
          </button>
        </div>
      </div>

  );
};

export default CartPage;
