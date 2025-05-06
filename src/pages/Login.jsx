import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getReturnUrl } from "../utils/authUtils";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [returnUrl, setReturnUrl] = useState(null);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  // Check for return URL when component mounts
  useEffect(() => {
    const url = getReturnUrl();
    if (url) {
      setReturnUrl(url);
    }

    // If user is already authenticated, redirect
    if (isAuthenticated) {
      if (returnUrl) {
        navigate(returnUrl);
      } else {
        navigate("/");
      }
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Use the login function from AuthContext
      const success = await login(formData.email, formData.password);

      if (success) {
        // Show success toast
        toast.success("Login successful!");

        // Redirect to return URL if available, otherwise to home
        if (returnUrl) {
          navigate(returnUrl);
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      setError(err.message || "Login failed");
      toast.error(err.message || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
            required
          />
          <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition">
            Login
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Don't have an account? <a href="/register" className="text-blue-600">Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
