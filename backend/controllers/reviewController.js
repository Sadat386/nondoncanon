const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Get all reviews
// @route   GET /api/reviews
// @route   GET /api/products/:productId/reviews
// @access  Public
exports.getReviews = async (req, res, next) => {
  if (req.params.productId) {
    const reviews = await Review.find({ product: req.params.productId });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  }
};

// @desc    Get single review
// @route   GET /api/reviews/:id
// @access  Public
exports.getReview = async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'product',
    select: 'name description',
  });

  if (!review) {
    return next(
      new Error(`No review found with the id of ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    data: review,
  });
};

// @desc    Add review
// @route   POST /api/products/:productId/reviews
// @access  Private
exports.addReview = async (req, res, next) => {
  req.body.product = req.params.productId;
  req.body.user = req.user.id;

  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.productId);

  if (!product) {
    return next(
      new Error(`No product with the id of ${req.params.productId}`)
    );
  }

  // Check if user has purchased the product
  const orders = await Order.find({ user: req.user.id });
  const hasPurchased = orders.some((order) =>
    order.orderItems.some((item) => item.product.toString() === req.params.productId)
  );

  if (!hasPurchased) {
    return next(
      new Error('You can only review products that you have purchased')
    );
  }

  const review = await Review.create({ rating, comment, product: req.params.productId, user: req.user.id });

  // Update product rating
  const reviews = await Review.find({ product: req.params.productId });
  const numReviews = reviews.length;
  const totalRating = reviews.reduce((acc, item) => item.rating + acc, 0);
  product.rating = totalRating / numReviews;
  product.numOfReviews = numReviews;

  await product.save();

  res.status(201).json({
    success: true,
    data: review,
  });
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new Error(`No review with the id of ${req.params.id}`)
    );
  }

  // Make sure review belongs to user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new Error('Not authorized to update review')
    );
  }

  review = await Review.findByIdAndUpdate(req.params.id, { rating: req.body.rating, comment: req.body.comment }, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: review,
  });
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new Error(`No review with the id of ${req.params.id}`)
    );
  }

  // Make sure review belongs to user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new Error('Not authorized to delete review')
    );
  }

  await Review.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {},
  });
};