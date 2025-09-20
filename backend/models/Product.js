const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
  },
  discountPrice: {
    type: Number,
  },
  imageUrls: {
    type: [String],
  },
  category: {
    type: String,
  },
  subcategory: {
    type: String,
    trim: true,
  },
  stock: {
    type: Number,
    required: [true, 'Please add stock quantity'],
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
  },
  numOfReviews: { // Added numOfReviews field
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Virtual for product's URL
ProductSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

module.exports = mongoose.model('Product', ProductSchema);