const express = require('express');
const router = express.Router();
const { adminLogin, getProducts, createProduct, updateProduct, deleteProduct, getUsers, getOrders } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');


router.post('/login', adminLogin);
router.route('/products').get(protect, authorize('admin'), getProducts).post(protect, authorize('admin'), createProduct);
router.route('/products/:id').put(protect, authorize('admin'), updateProduct).delete(protect, authorize('admin'), deleteProduct);
router.route('/users').get(protect, authorize('admin'), getUsers);
router.route('/orders').get(protect, authorize('admin'), getOrders);

module.exports = router;

