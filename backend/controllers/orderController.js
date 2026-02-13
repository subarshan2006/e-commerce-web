const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const razorpay = require('../config/razorpay');
const crypto = require('crypto');
const User = require('../models/User');


// @desc    Create Razorpay Order (before payment)
// @route   POST /api/orders/create-payment
// @access  Private

const createOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const order = await Order.create({
      user: req.user.id,
      items: cart.items,
      shippingAddress: req.body.shippingAddress,
      paymentMethod: 'COD',
      totalAmount: cart.totalAmount
    });

    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



const createRazorpayOrder = async (req, res) => {
  try {
    const { totalAmount } = req.body;

    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const options = {
      amount: totalAmount * 100, // amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.status(201).json(razorpayOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify Razorpay Payment & Create Order
// @route   POST /api/orders/verify-payment
// @access  Private
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      shippingAddress
    } = req.body;

    console.log(req.body);
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const orderItems = await Promise.all(
      cart.items.map(async (item) => {
        const product = await Product.findOne({ id: item.productId });
            if (!product) {
              throw new Error(`Product not found: ${item.productId}`);
            }
            if (product.stock === undefined) product.stock = 0;
        if ( product.stock < item.quantity) {
          throw new Error('Stock issue');
        }
        product.stock -= item.quantity;
        await product.save();

        return {
          product: product.id,
          name: product.name,
          image: product.image,
          quantity: item.quantity,
          price: product.price
        };
      })
    );
    const user = req.user;

    const order = await Order.create({
      user: user.id,
      items: orderItems,
      shippingAddress,
      paymentMethod: 'razorpay',
      paymentResult: {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      },
      totalAmount: cart.totalAmount,
      isPaid: true,
      paidAt: new Date()
    });

    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
  console.error('🔥 VERIFY PAYMENT ERROR 🔥');
  console.error(error);
  console.error(error.stack);

  res.status(500).json({
    message: error.message,
    stack: error.stack
  });
}

};


// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      if (order.user.toString() === req.user.id || req.user.isAdmin) {
        res.json(order);
      } else {
        res.status(403).json({ message: 'Not authorized to view this order' });
      }
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders/admin/all
// @access  Private/Admin

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .lean();

    // Attach user info manually
    for (let order of orders) {
      const user = await User.findOne(
        { id: order.user },   // UUID match
        'name email'
      );
      order.userInfo = user;
    }

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.orderStatus = req.body.status || order.orderStatus;

      if (req.body.status === 'delivered') {
        order.isDelivered = true;
        order.deliveredAt = new Date();
      }

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRazorpayOrder,
  verifyPayment,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  createOrder
};
