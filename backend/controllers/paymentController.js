// const Order = require('../models/Order');
// const crypto = require('crypto');

// // @desc    Verify Razorpay Payment & create order
// // @route   POST /api/payment/verify
// // @access  Private
// const verifyPayment = async (req, res) => {
//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = req.body;

//     // 1️⃣ Verify signature
//     const body = razorpay_order_id + "|" + razorpay_payment_id;
//     const expectedSignature = crypto
//       .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
//       .update(body)
//       .digest('hex');

//     if (expectedSignature !== razorpay_signature) {
//       return res.status(400).json({ message: 'Payment verification failed' });
//     }

//     // 2️⃣ Create order in DB
//     const order = new Order({
//       userId: req.user.id, // ensure it matches your order model field
//       items: orderData.items,
//       shippingAddress: orderData.shippingAddress,
//       paymentMethod: 'razorpay',
//       paymentResult: {
//         razorpay_order_id,
//         razorpay_payment_id,
//         razorpay_signature
//       },
//       totalAmount: orderData.totalAmount,
//       isPaid: true,
//       paidAt: new Date()
//     });

//     const savedOrder = await order.save();

//     res.status(201).json(savedOrder);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: error.message });
//   }
// };
// exports.verifyPayment = verifyPayment;
