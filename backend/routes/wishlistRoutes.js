const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getWishlistItems,
  addItemToWishlist,
  removeItemFromWishlist,
} = require('../controllers/wishlistController');

router.route('/').get(protect, getWishlistItems).post(protect, addItemToWishlist);
router.route('/:productId').delete(protect, removeItemFromWishlist);

module.exports = router;
