const express = require('express');
const {
  getProducts,
  getProduct,
  getTopDiscountedProduct,
  getFeaturedProducts,
} = require('../controllers/productController');

const router = express.Router();

router.route('/top-discounted').get(getTopDiscountedProduct);
router.route('/featured').get(getFeaturedProducts);
router.route('/').get(getProducts);

router.route('/:id').get(getProduct);

router.use('/:productId/reviews', require('./reviewRoutes'));

module.exports = router;