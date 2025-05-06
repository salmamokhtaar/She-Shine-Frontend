import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";

const OrderSuccess = () => {
  return (

      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        <div className="text-green-600 text-6xl mb-4">✅</div>
        <h1 className="text-3xl font-bold text-green-700 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Your order has been placed and payment received successfully. Thank you!
        </p>
        <Link
          to="/"
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
        >
          Continue Shopping
        </Link>
      </div>
    
  );
};

export default OrderSuccess;
