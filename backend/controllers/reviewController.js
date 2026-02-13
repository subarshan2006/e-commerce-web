const Review = require('../models/Review');
const Product = require('../models/Product');

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    const product = await Product.findOne({ id: productId });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user already reviewed
    const existingReview = await Review.findOne({
      productId,
      userId: req.user.id
    });

    if (existingReview) {
      return res.status(400).json({ message: 'Product already reviewed' });
    }

    const review = await Review.create({
      productId,
      userId: req.user.id,
      userName: req.user.name,
      rating,
      comment
    });

    // Update product rating
    const reviews = await Review.find({ productId });
    product.numReviews = reviews.length;
    product.rating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
    await product.save();

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get reviews for a product
// @route   GET /api/reviews/:productId
// @access  Public
const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findOne({ id: req.params.id });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns the review or is admin
    if (review.userId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const productId = review.productId;
    await Review.deleteOne({ id: req.params.id });

    // Update product rating
    const reviews = await Review.find({ productId });
    const product = await Product.findOne({ id: productId });
    
    if (product) {
      product.numReviews = reviews.length;
      product.rating = reviews.length > 0 
        ? reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length 
        : 0;
      await product.save();
    }

    res.json({ message: 'Review removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReview,
  getProductReviews,
  deleteReview
};
