import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { cart, loading, updateCartItem, removeFromCart, refreshCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      refreshCart();
    }
  }, [isAuthenticated]);

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    await updateCartItem(productId, newQuantity);
  };

  const handleRemove = async (productId) => {
    if (window.confirm('Remove this item from cart?')) {
      await removeFromCart(productId);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4" data-testid="empty-cart-message">Your cart is empty</h2>
          <Link to="/products" className="text-blue-600 hover:underline">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" data-testid="cart-page">
      <h1 className="text-4xl font-bold mb-8" data-testid="cart-heading">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div key={item.productId} className="bg-white rounded-lg shadow p-6" data-testid="cart-item">
              <div className="flex gap-6">
                {/* Product Image */}
                <img 
                  src={item.product?.image} 
                  alt={item.product?.name}
                  className="w-24 h-24 object-cover rounded"
                  data-testid="cart-item-image"
                />

                {/* Product Details */}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2" data-testid="cart-item-name">
                    {item.product?.name}
                  </h3>
                  <p className="text-blue-600 font-semibold" data-testid="cart-item-price">
                    ${item.price}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-4 mt-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button 
                        onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                        className="p-2 hover:bg-gray-100"
                        data-testid="decrease-quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4" data-testid="cart-item-quantity">{item.quantity}</span>
                      <button 
                        onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                        className="p-2 hover:bg-gray-100"
                        data-testid="increase-quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button 
                      onClick={() => handleRemove(item.productId)}
                      className="text-red-600 hover:text-red-700 flex items-center"
                      data-testid="remove-item-button"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Remove
                    </button>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="text-right">
                  <p className="font-semibold text-lg" data-testid="cart-item-subtotal">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-24">
            <h2 className="text-2xl font-bold mb-6" data-testid="order-summary-heading">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span data-testid="cart-subtotal">${cart.totalAmount?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">FREE</span>
              </div>
              <div className="border-t pt-4 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span data-testid="cart-total">${cart.totalAmount?.toFixed(2)}</span>
              </div>
            </div>

            <Link 
              to="/checkout"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition block text-center"
              data-testid="checkout-button"
            >
              Proceed to Checkout
            </Link>

            <Link 
              to="/products"
              className="w-full mt-4 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition block text-center"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
