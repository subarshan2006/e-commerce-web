const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const path = require('path');

dotenv.config();

const app = express();

// 🔥 CORS FIRST
app.use(cors({
  origin: [
    'https://e-commerce-web-1-hxlq.onrender.com',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Static files
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB
connectDB();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));

app.get('/api', (req, res) => {
  res.json({ message: 'E-Commerce API is running...' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 8001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
