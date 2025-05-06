import React from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Context Provider
import { AppProvider } from "./context/AppProvider";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminRoute } from "./components/AdminRoute";
import AdminLayout from "./components/AdminLayout";

// Pages
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetails from "./pages/ProductDetails";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccess from "./pages/OrderSuccess";
import WishlistPage from "./pages/WishlistPage";
import Profile from "./pages/Profile";
import SearchResults from "./pages/SearchResults";
import NewArrivalsGrid from "./components/NewArrivalsGrid";
import CategoriesPage from "./pages/CategoriesPage";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import ProductManagement from "./pages/admin/ProductManagement";
import OrderManagement from "./pages/admin/OrderManagement";
import UserManagement from "./pages/admin/UserManagement";
import Settings from "./pages/admin/Settings";
import Reports from "./pages/admin/Reports";

function App() {
  return (
    <AppProvider>
      <ToastContainer position="bottom-left" autoClose={3000} />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<><Header /><HomePage /><Footer /></>} />
        <Route path="/login" element={<><Header /><Login /><Footer /></>} />
        <Route path="/register" element={<><Header /><Register /><Footer /></>} />
        <Route path="/product/:id" element={<><Header /><ProductDetails /><Footer /></>} />
        <Route path="/new-arrivals" element={<><Header /><NewArrivalsGrid /><Footer /></>} />
        <Route path="/search" element={<><Header /><SearchResults /><Footer /></>} />
        <Route path="/category" element={<><Header /><CategoriesPage /><Footer /></>} />
        <Route path="/category/:categoryName" element={<><Header /><CategoriesPage /><Footer /></>} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<><Header /><Profile /><Footer /></>} />
          <Route path="/wishlist" element={<><Header /><WishlistPage /><Footer /></>} />
          <Route path="/cart" element={<><Header /><CartPage /><Footer /></>} />
          <Route path="/checkout" element={<><Header /><CheckoutPage /><Footer /></>} />
          <Route path="/order-success" element={<><Header /><OrderSuccess /><Footer /></>} />
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout><Dashboard /></AdminLayout>} />
          <Route path="/admin/products" element={<AdminLayout><ProductManagement /></AdminLayout>} />
          <Route path="/admin/orders" element={<AdminLayout><OrderManagement /></AdminLayout>} />
          <Route path="/admin/users" element={<AdminLayout><UserManagement /></AdminLayout>} />
          <Route path="/admin/settings" element={<AdminLayout><Settings /></AdminLayout>} />
          <Route path="/admin/reports" element={<AdminLayout><Reports /></AdminLayout>} />
        </Route>
      </Routes>
    </AppProvider>
  );
}

export default App;
