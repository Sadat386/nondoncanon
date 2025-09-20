const express = require('express');
const router = express.Router();
const { check } = require('express-validator'); // Import check
const { protect } = require('../middleware/authMiddleware');
const {
  getCartItems,
  addItemToCart,
  removeItemFromCart,
} = require('../controllers/cartController');

router.route('/').get(protect, getCartItems).post(
  protect,
  [
    check('productId', 'Product ID is required').not().isEmpty(),
    check('quantity', 'Quantity is required').not().isEmpty().isInt({ min: 1 }),
  ],
  addItemToCart
);
router.route('/:productId').delete(protect, removeItemFromCart);

module.exports = router;