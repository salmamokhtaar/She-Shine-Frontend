import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiHeart,
  FiPhone,
  FiShoppingCart,
  FiMenu,
  FiX,
  FiUser,
  FiLogOut,
  FiSearch
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const { isAuthenticated, user, isAdmin, logout } = useAuth();
  const { wishlistCount } = useWishlist();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleUserMenu = () => setUserMenuOpen(!userMenuOpen);
  const toggleSearch = () => setShowSearch(!showSearch);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setShowSearch(false);
      setSearchTerm("");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setUserMenuOpen(false);
  };

  return (
    <header className="w-full">
      {/* Top Bar */}
      <div className="bg-pink-400 text-white text-sm flex justify-between px-6 py-2 items-center">
        <div className="flex items-center space-x-2">
          <FiPhone />
          <span>+252 61 4431661</span>
        </div>
        <div className="hidden md:block">
          <span>
            Discover style for every generation |{" "}
            <Link to="/" className="underline">
              She & Shine
            </Link>
          </span>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-pink-600">
          <h1 className="text-4xl">She & Shine</h1>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex space-x-6">
          <Link to="/category/women" className="text-gray-700 hover:text-pink-900">Women</Link>
          <Link to="/category/kids" className="text-gray-700 hover:text-pink-900">Kids</Link>
          <Link to="/new-arrivals" className="text-gray-700 hover:text-pink-900">New Arrivals</Link>
          <Link to="/category/sales" className="text-gray-700 hover:text-pink-900">Sale</Link>
        </nav>

        {/* Icons + Login */}
        <div className="hidden md:flex items-center space-x-4">
          <button
            onClick={toggleSearch}
            className="text-gray-700 hover:text-pink-900"
          >
            <FiSearch size={22} />
          </button>

          <Link to="/wishlist" className="relative text-gray-700 hover:text-pink-600 flex items-center space-x-1">
            <FiHeart size={22} />
            <span className="text-sm">Wishlist</span>
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs px-1.5 rounded-full">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link to="/cart" className="relative text-gray-700 hover:text-pink-900">
            <FiShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs px-1.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={toggleUserMenu}
                className="flex items-center space-x-1 text-gray-700 hover:text-pink-900"
              >
                <div className="h-8 w-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      <FiUser className="mr-2" />
                      Profile
                    </div>
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <div className="flex items-center">
                        <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Admin Dashboard
                      </div>
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      <FiLogOut className="mr-2" />
                      Logout
                    </div>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex space-x-2">
              <Link
                to="/login"
                className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-1.5 rounded-full text-sm font-medium transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-white border border-pink-600 text-pink-600 hover:bg-pink-50 px-4 py-1.5 rounded-full text-sm font-medium transition"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={toggleMenu} aria-label="Toggle Menu">
          <FiMenu size={24} className="text-gray-700" />
        </button>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="bg-white shadow-md py-3 px-6">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              placeholder="Search for products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <button
              type="submit"
              className="bg-pink-600 text-white px-4 py-2 rounded-r-md hover:bg-pink-700 transition"
            >
              <FiSearch size={20} />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-white p-6 flex flex-col items-start space-y-4 z-50 md:hidden">
          <button className="absolute top-4 right-6" onClick={toggleMenu}>
            <FiX size={24} className="text-gray-700" />
          </button>

          {isAuthenticated && (
            <div className="w-full border-b pb-4 mb-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
              <Link
                to="/profile"
                className="block py-2 text-gray-700"
                onClick={toggleMenu}
              >
                <div className="flex items-center">
                  <FiUser className="mr-2" />
                  Profile
                </div>
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="block py-2 text-gray-700"
                  onClick={toggleMenu}
                >
                  <div className="flex items-center">
                    <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Admin Dashboard
                  </div>
                </Link>
              )}
            </div>
          )}

          <form onSubmit={handleSearch} className="w-full mb-4">
            <div className="flex">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <button
                type="submit"
                className="bg-pink-600 text-white px-3 py-2 rounded-r-md"
              >
                <FiSearch size={18} />
              </button>
            </div>
          </form>

          <Link to="/category/women" onClick={toggleMenu} className="w-full py-2">Women</Link>
          <Link to="/category/kids" onClick={toggleMenu} className="w-full py-2">Kids</Link>
          <Link to="/new-arrivals" onClick={toggleMenu} className="w-full py-2">New Arrivals</Link>
          <Link to="/category/sales" onClick={toggleMenu} className="w-full py-2">Sale</Link>
          <Link to="/wishlist" onClick={toggleMenu} className="w-full py-2">Wishlist</Link>
          <Link to="/cart" onClick={toggleMenu} className="w-full py-2">Cart</Link>

          {!isAuthenticated ? (
            <div className="w-full flex space-x-2 mt-4">
              <Link
                to="/login"
                onClick={toggleMenu}
                className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-2 rounded text-center"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={toggleMenu}
                className="flex-1 bg-white border border-pink-600 text-pink-600 hover:bg-pink-50 py-2 rounded text-center"
              >
                Register
              </Link>
            </div>
          ) : (
            <button
              onClick={() => {
                handleLogout();
                toggleMenu();
              }}
              className="w-full py-2 text-left text-red-600"
            >
              <div className="flex items-center">
                <FiLogOut className="mr-2" />
                Logout
              </div>
            </button>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;
