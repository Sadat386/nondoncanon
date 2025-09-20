const express = require('express');
const router = express.Router();
const { check } = require('express-validator'); // Import check
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
} = require('../controllers/orderController');

router.route('/').post(
  protect,
  [
    check('shippingAddress', 'Shipping address is required').not().isEmpty(),
  ],
  addOrderItems
).get(protect, authorize('admin'), getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);

module.exports = router;