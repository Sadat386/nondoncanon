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
const { errorHandler } = require('./middleware/errorMiddleware');
const path = require('path');

dotenv.config();
connectDB();

const app = express();

// ------------------
// Security & Rate Limiter
// ------------------
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

// ------------------
// API routes
// ------------------
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wishlist', wishlistRoutes);

// ------------------
// Serve frontend static files
// ------------------
app.use(express.static(path.join(__dirname, '../frontend')));

// ------------------
// Serve each HTML page explicitly
// ------------------
const htmlDir = path.join(__dirname, '../frontend/html');

app.get('/', (req, res) => res.sendFile(path.join(htmlDir, 'index.html')));
app.get('/index.html', (req, res) => res.sendFile(path.join(htmlDir, 'index.html')));
app.get('/products.html', (req, res) => res.sendFile(path.join(htmlDir, 'products.html')));
app.get('/product.html', (req, res) => res.sendFile(path.join(htmlDir, 'product.html')));
app.get('/cart.html', (req, res) => res.sendFile(path.join(htmlDir, 'cart.html')));
app.get('/checkout.html', (req, res) => res.sendFile(path.join(htmlDir, 'checkout.html')));
app.get('/wishlist.html', (req, res) => res.sendFile(path.join(htmlDir, 'wishlist.html')));
app.get('/orders.html', (req, res) => res.sendFile(path.join(htmlDir, 'orders.html')));
app.get('/login.html', (req, res) => res.sendFile(path.join(htmlDir, 'login.html')));
app.get('/register.html', (req, res) => res.sendFile(path.join(htmlDir, 'register.html')));
app.get('/forgot-password.html', (req, res) => res.sendFile(path.join(htmlDir, 'forgot-password.html')));
app.get('/reset-password.html', (req, res) => res.sendFile(path.join(htmlDir, 'reset-password.html')));
app.get('/admin-login.html', (req, res) => res.sendFile(path.join(htmlDir, 'admin-login.html')));
app.get('/admin.html', (req, res) => res.sendFile(path.join(htmlDir, 'admin.html')));
app.get('/search.html', (req, res) => res.sendFile(path.join(htmlDir, 'search.html')));

// ------------------
// SPA fallback for any unmatched route
// ------------------
app.get('*', (req, res) => res.sendFile(path.join(htmlDir, 'index.html')));

// ------------------
// Error handling
// ------------------
app.use(errorHandler);

// ------------------
// Start server
// ------------------
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// ------------------
// Handle unhandled rejections & exceptions
// ------------------
process.on('unhandledRejection', (err, promise) => {
  console.error(err);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err, origin) => {
  console.error(err);
  server.close(() => process.exit(1));
});
