const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  createRazorpayOrder,
  verifyPayment,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/razorpay', protect, createRazorpayOrder);
router.post('/verify', protect, verifyPayment);

router.route('/')
  .post(protect, createOrder)
  .get(protect, getUserOrders);

router.get('/admin/all', protect, admin, getAllOrders);

router.route('/:id')
  .get(protect, getOrderById);

router.put('/:id/status', protect, admin, updateOrderStatus);

// const {
//   createRazorpayOrder,
//   verifyPayment
// } = require('../controllers/orderController');



module.exports = router;
