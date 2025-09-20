const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const cors = require('cors');

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errorHandler } = require('./middleware/errorMiddleware'); // Import errorHandler
const path = require('path'); // Import path module

dotenv.config();

connectDB();

const app = express();

// Set security headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json()); // Body parser for JSON data


app.use(cors());

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend', 'html', 'index.html'));
});

app.get('/html/admin-login.html', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend', 'html', 'admin-login.html'));
});

app.get('/html/admin.html', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend', 'html', 'admin.html'));
});

app.get('/html/cart.html', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend', 'html', 'cart.html'));
});

app.get('/html/checkout.html', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend', 'html', 'checkout.html'));
});

app.get('/html/forgot-password.html', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend', 'html', 'forgot-password.html'));
});

app.get('/html/login.html', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend', 'html', 'login.html'));
});

app.get('/html/orders.html', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend', 'html', 'orders.html'));
});

app.get('/html/product.html', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend', 'html', 'product.html'));
});

app.get('/html/products.html', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend', 'html', 'products.html'));
});

app.get('/html/register.html', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend', 'html', 'register.html'));
});

app.get('/html/reset-password.html', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend', 'html', 'reset-password.html'));
});

app.get('/html/search.html', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend', 'html', 'search.html'));
});

app.get('/html/wishlist.html', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend', 'html', 'wishlist.html'));
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wishlist', wishlistRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err, origin) => {
  // Close server & exit process
  server.close(() => process.exit(1));
});

const server = app.listen(PORT, () => {

});
