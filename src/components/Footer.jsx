import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-800 py-10 px-4 border-t border-gray-200">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand Description */}
        <div>
          <h3 className="text-xl font-bold text-pink-600">She & Shine</h3>
          <p className="text-sm text-gray-600 mt-2">
            Discover timeless fashion for women and kids. Sparkle with every step you take.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-pink-500 font-semibold mb-3">Quick Links</h4>
          <ul className="text-sm text-gray-600 space-y-2">
            <li><Link to="/" className="hover:text-pink-600">Home</Link></li>
            <li><Link to="/category" className="hover:text-pink-600">Categories</Link></li>
            <li><Link to="/new-arrivals" className="hover:text-pink-600">New Arrivals</Link></li>
            <li><Link to="/wishlist" className="hover:text-pink-600">Wishlist</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-pink-500 font-semibold mb-3">Customer Support</h4>
          <ul className="text-sm text-gray-600 space-y-2">
            <li><Link to="/delivery" className="hover:text-pink-600">Delivery Info</Link></li>
            <li><Link to="/returns" className="hover:text-pink-600">Return Policy</Link></li>
            <li><Link to="/contact" className="hover:text-pink-600">Contact Us</Link></li>
          </ul>
        </div>

        {/* Social + Contact */}
        <div>
          <h4 className="text-pink-500 font-semibold mb-3">Stay Connected</h4>
          <div className="flex gap-4 text-pink-600 mb-4">
            <a href="#"><FaFacebook size={20} /></a>
            <a href="#"><FaInstagram size={20} /></a>
            <a href="#"><FaTwitter size={20} /></a>
          </div>
          <p className="text-sm text-gray-600">Email: support@sheandshine.com</p>
          <p className="text-sm text-gray-600">Phone: +252 61 4431661</p>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="mt-10 border-t border-gray-200 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} She & Shine. All rights reserved. |
        Developed by{" "}
        <a
          href="https://salmadhegacadde.vercel.app/" // Change to your real link
          className="text-pink-600 hover:underline font-medium"
          target="_blank" rel="noopener noreferrer"
        >
          Salma
        </a>
      </div>
    </footer>
  );
};

export default Footer;
