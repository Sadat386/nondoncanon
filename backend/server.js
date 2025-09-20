const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errorHandler } = require('./middleware/errorMiddleware');

// Routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');

dotenv.config();
connectDB();

const app = express();

// Security & rate limiting
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "connect-src": ["'self'", "https://nondoncanon-com-ddyw.onrender.com"],
        "img-src": ["'self'", "data:", "https://res.cloudinary.com"],
      },
    },
  })
);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

app.use(express.json());
app.use(cors());

// -------------------
// API routes
// -------------------
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wishlist', wishlistRoutes);

// -------------------
// Serve static files
// -------------------
app.use(express.static(path.join(__dirname, '../frontend')));

// -------------------
// Serve HTML pages explicitly
// -------------------
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/html/index.html'));
});
app.get('/products.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/html/products.html'));
});
app.get('/cart.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/html/cart.html'));
});
app.get('/checkout.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/html/checkout.html'));
});
app.get('/wishlist.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/html/wishlist.html'));
});
app.get('/orders.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/html/orders.html'));
});
app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/html/login.html'));
});
app.get('/register.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/html/register.html'));
});
app.get('/forgot-password.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/html/forgot-password.html'));
});
app.get('/reset-password.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/html/reset-password.html'));
});
app.get('/admin-login.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/html/admin-login.html'));
});
app.get('/admin.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/html/admin.html'));
});
app.get('/search.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/html/search.html'));
});

// -------------------
// SPA fallback (optional)
// -------------------
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/html/index.html'));
});

// -------------------
// Error handling
// -------------------
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(err);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err, origin) => {
  console.error(err);
  server.close(() => process.exit(1));
});
