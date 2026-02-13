import axios from 'axios';
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

const PaymentButton = ({ totalAmount, orderData, token }) => {

const handlePayment = async () => {
  // Make sure cart has value
  if (cart.totalAmount <= 0) {
    alert('Cart is empty');
    return;
  }

  const loaded = await loadRazorpay();
  if (!loaded) {
    alert('Razorpay SDK failed');
    return;
  }

  // 🔥 STEP 1: Create Razorpay order (backend)
  const { data: razorpayOrder } =
    await orderAPI.createRazorpayOrder(cart.totalAmount);

  // 🔥 STEP 2: Open Razorpay popup
  const options = {
    key: process.env.REACT_APP_RAZORPAY_KEY_ID,
    amount: razorpayOrder.amount,
    currency: 'INR',
    name: 'My E-Commerce',
    order_id: razorpayOrder.id,

    handler: async function (response) {
      // 🔥 STEP 3: Verify payment (backend)
      await orderAPI.verifyPayment({
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        shippingAddress
      });

      alert('Payment successful & order placed');
      navigate('/orders');
    }
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};


  return (
    <button
      onClick={handlePayment}
      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
    >
      Pay ₹{totalAmount}
    </button>
  );
};

export default PaymentButton;
