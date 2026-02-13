const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const orderSchema = new mongoose.Schema(
  {
    // ✅ Each order has its own UUID
    id: {
      type: String,
      default: () => uuidv4(),
      unique: true
    },

    // ✅ User UUID (many orders per user allowed)
    user: {
      type: String,
      required: true
    },
    

    items: [
      {
        product: {
          type: String, // Product UUID
          required: true
        },
        name: {
          type: String,
          required: true
        },
        image: {
          type: String,
          required: true
        },
        quantity: {
          type: Number,
          required: true
        },
        price: {
          type: Number,
          required: true
        }
      }
    ],

    shippingAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
      phone: String
    },

    paymentMethod: {
      type: String,
      default: 'razorpay'
    },

    paymentResult: {
      razorpay_order_id: String,
      razorpay_payment_id: String,
      razorpay_signature: String
    },

    totalAmount: {
      type: Number,
      required: true
    },

    isPaid: {
      type: Boolean,
      default: false
    },

    paidAt: Date,

    orderStatus: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },

    isDelivered: {
      type: Boolean,
      default: false
    },

    deliveredAt: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
