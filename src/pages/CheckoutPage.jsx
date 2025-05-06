import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CheckoutPage = () => {
  const [phone, setPhone] = useState("");
  const [cartTotal, setCartTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch cart total
    const fetchTotal = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.warn("No auth token found for cart fetch");
          return;
        }

        const res = await fetch("https://ecommercebackend-aa6n.onrender.com/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          console.error("Failed to fetch cart:", res.status, res.statusText);
          return;
        }

        const data = await res.json();

        // Check if data and products exist
        if (!data || !data.products) {
          console.warn("No cart data or products found");
          setCartTotal(0);
          return;
        }

        // Safely calculate total with null checks
        const total = data.products.reduce((acc, item) => {
          // Skip items with null or undefined productId
          if (!item || !item.productId) return acc;

          // Get price and quantity with default values if missing
          const price = item.productId.price || 0;
          const quantity = item.quantity || 1;

          return acc + (price * quantity);
        }, 0);

        setCartTotal(total);
      } catch (error) {
        console.error("Error fetching cart total:", error);
        setCartTotal(0);
      }
    };

    fetchTotal();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");

    if (!token) {
      toast.error("Please log in to place an order");
      navigate("/login");
      return;
    }

    if (!phone) {
      toast.error("Please enter a phone number");
      return;
    }

    try {
      // Show loading toast
      const loadingToast = toast.loading("Processing your order...");

      const res = await fetch("https://ecommercebackend-aa6n.onrender.com/api/orders/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          paymentMethod: "evc-plus",
          paymentPhone: phone,
        }),
      });

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      // Handle response
      if (res.ok) {
        const data = await res.json();
        toast.success("Order placed successfully");
        navigate("/order-success");
      } else {
        let errorMessage = "Payment failed";

        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.error("Error parsing error response:", e);
        }

        toast.error(errorMessage);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Network error. Please try again.");
    }
  };

  return (

    <div className="max-w-xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Phone Number</label>
          <input
            type="tel"
            className="w-full border rounded px-4 py-2"
            placeholder="E.g. +252 61 1 000 000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="flex justify-between font-semibold text-lg">
          <span>Total:</span>
          <span>${cartTotal.toFixed(2)}</span>
        </div>

        <button
          type="submit"
          className="w-full bg-pink-600 text-white py-2 rounded hover:bg-green-700"
        >
          Pay with EVC Plus
        </button>
      </form>
    </div>

  );
};

export default CheckoutPage;
