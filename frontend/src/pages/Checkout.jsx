import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';

const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const { cart } = useCart();
  const { user } = useAuth(); // ✅ GET LOGGED IN USER

  if (!cart || cart.items.length === 0) {
    return <div>Your cart is empty</div>;
  }

  if (!user || !user.address) {
    return <div>Please add address before checkout</div>;
  }

  const handlePayment = async () => {
    try {
      const loaded = await loadRazorpay();
      if (!loaded) {
        alert('Razorpay SDK failed');
        return;
      }

      // 1️⃣ Create Razorpay order
      const { data: razorpayOrder } =
        await orderAPI.createRazorpayOrder(cart.totalAmount);

      // 2️⃣ Razorpay options
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: 'INR',
        name: 'My E-Commerce',
        order_id: razorpayOrder.id,

        handler: async (response) => {
          // 3️⃣ Verify payment + place order
          await orderAPI.verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            shippingAddress: user.address // ✅ REAL USER DATA
          });

          alert('Payment successful & order placed!');
        }
      };

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', (res) => {
        alert(res.error.description);
      });

      rzp.open();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Payment failed');
    }
  };
   console.log(cart.items.name);

  return (
  <div className="checkout-container">
    <h2 className="checkout-title">Checkout</h2>

    <div className="checkout-items">
      {cart.items.map(item => (
        <p key={item.productId} className="checkout-item">
        </p>
      ))}
    </div>

    <h3 className="checkout-total">Total: ₹{cart.totalAmount}</h3>

    <button className="pay-button" onClick={handlePayment}>
      Pay Now
    </button>
  </div>
);

};

export default Checkout;
