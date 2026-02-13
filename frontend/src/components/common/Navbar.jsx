import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50" data-testid="navbar">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600" data-testid="logo-link">
            ShopHub
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition">
              Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-blue-600 transition">
              Products
            </Link>
            {!isAdmin && (
            <Link to="/my-orders" className="text-gray-700 hover:text-blue-600 transition">
             My Orders
            </Link>
            )
            }
            {isAdmin && (
              <Link to="/admin" className="text-gray-700 hover:text-blue-600 transition">
                Admin
              </Link>
            )}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="p-2 hover:bg-gray-100 rounded-full transition"
                    data-testid="admin-link"
                  >
                    <LayoutDashboard className="w-5 h-5 text-gray-700" />
                  </Link>
                )}
                <Link 
                  to="/cart" 
                  className="relative p-2 hover:bg-gray-100 rounded-full transition"
                  data-testid="cart-link"
                >
                  <ShoppingCart className="w-5 h-5 text-gray-700" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center" data-testid="cart-count">
                      {itemCount}
                    </span>
                  )}
                </Link>
                <Link 
                  to="/profile" 
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                  data-testid="profile-link"
                >
                  <User className="w-5 h-5 text-gray-700" />
                </Link>
                <button 
                  onClick={handleLogout}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                  data-testid="logout-button"
                >
                  <LogOut className="w-5 h-5 text-gray-700" />
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-blue-600 transition"
                  data-testid="login-link"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                  data-testid="register-link"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
