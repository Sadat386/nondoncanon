const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    const { select, sort, page, limit, ...filters } = req.query;

    const queryObj = {};
    for (const key in filters) {
      if (Object.prototype.hasOwnProperty.call(filters, key)) {
        const match = key.match(/(.+)\[(.+)\]/);
        if (match) {
          const field = match[1];
          const operator = match[2];
          if (!queryObj[field]) {
            queryObj[field] = {};
          }
          queryObj[field][`${operator}`] = filters[key];
        } else {
          queryObj[key] = filters[key];
        }
      }
    }

    let result = Product.find(queryObj);

    // Select Fields
    if (select) {
      const fields = select.split(',').join(' ');
      result = result.select(fields);
    }

    // Sort
    if (sort) {
      const sortBy = sort.split(',').join(' ');
      result = result.sort(sortBy);
    } else {
      result = result.sort('-createdAt');
    }

    // Pagination
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 25;
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = pageNum * limitNum;
    const total = await Product.countDocuments(queryObj);

    result = result.skip(startIndex).limit(limitNum);

    // Executing query
    const products = await result;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: pageNum + 1,
        limit: limitNum,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: pageNum - 1,
        limit: limitNum,
      };
    }

    res.status(200).json({ success: true, count: products.length, pagination, data: products });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getTopDiscountedProduct = async (req, res, next) => {
  try {
    const topProduct = await Product.aggregate([
      {
        $match: {
          discountPrice: { $exists: true, $ne: null },
          price: { $gt: 0 },
          $expr: { $lt: ["$discountPrice", "$price"] },
        },
      },
      {
        $addFields: {
          discountPercentage: {
            $multiply: [
              { $divide: [{ $subtract: ["$price", "$discountPrice"] }, "$price"] },
              100,
            ],
          },
        },
      },
      { $sort: { discountPercentage: -1 } },
      { $limit: 1 },
    ]);

    if (!topProduct || topProduct.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No discounted products found" });
    }

    res.status(200).json({ success: true, data: topProduct[0] });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    res.status(200).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(4);
    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (err) {
    next(err);
  }
};


