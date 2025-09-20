const Wishlist = require('../models/Wishlist');

// @desc    Get wishlist items
// @route   GET /api/wishlist
// @access  Private
exports.getWishlistItems = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id }).populate('products', 'name price imageUrls');
    if (!wishlist) {
      return res.status(200).json({ success: true, data: [] });
    }
    res.status(200).json({ success: true, data: wishlist.products });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to wishlist
// @route   POST /api/wishlist
// @access  Private
exports.addItemToWishlist = async (req, res, next) => {
  const { productId } = req.body;

  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id });

    if (wishlist) {
      // Wishlist exists for user
      if (wishlist.products.includes(productId)) {
        return res.status(400).json({ message: 'Product already in wishlist' });
      }
      wishlist.products.push(productId);
      wishlist = await wishlist.save();
      return res.status(200).json({ success: true, data: wishlist });
    } else {
      // No wishlist for user, create new wishlist
      const newWishlist = await Wishlist.create({
        user: req.user.id,
        products: [productId],
      });

      return res.status(201).json({ success: true, data: newWishlist });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
exports.removeItemFromWishlist = async (req, res, next) => {
  const { productId } = req.params;
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      res.status(404);
      throw new Error('Wishlist not found');
    }

    wishlist.products = wishlist.products.filter((p) => p.toString() !== productId);

    await wishlist.save();
    res.status(200).json({ success: true, data: wishlist });
  } catch (error) {
    next(error);
  }
};
