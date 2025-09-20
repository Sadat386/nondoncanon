const Cart = require('../models/Cart');
const Product = require('../models/Product');

const { validationResult } = require('express-validator');

// @desc    Get cart items
// @route   GET /api/cart
// @access  Private
exports.getCartItems = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('products.product', 'name price imageUrls');
    if (!cart) {
      return res.status(200).json({ success: true, data: [] });
    }
    res.status(200).json({ success: true, data: cart.products });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
exports.addItemToCart = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { productId, quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    if (quantity <= 0) {
      res.status(400);
      throw new Error('Quantity must be a positive number');
    }

    let cart = await Cart.findOne({ user: req.user.id });

    if (cart) {
      // Cart exists for user
      let itemIndex = cart.products.findIndex((p) => p.product == productId);

      if (itemIndex > -1) {
        // Product exists in the cart, update the quantity
        let productItem = cart.products[itemIndex];
        productItem.quantity = quantity;
        cart.products[itemIndex] = productItem;
      } else {
        // Product does not exists in cart, add new item
        cart.products.push({ product: productId, quantity });
      }
      cart = await cart.save();
      return res.status(200).json({ success: true, data: cart });
    } else {
      // No cart for user, create new cart
      const newCart = await Cart.create({
        user: req.user.id,
        products: [{ product: productId, quantity }],
      });

      return res.status(201).json({ success: true, data: newCart });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
exports.removeItemFromCart = async (req, res, next) => {
  const { productId } = req.params;
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      res.status(404);
      throw new Error('Cart not found');
    }

    cart.products = cart.products.filter(({ product }) => product.toString() !== productId);

    await cart.save();
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};