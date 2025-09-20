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
        "connect-src": ["'self'"], // you can add your Render URL here
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
// Explicit HTML routes
// ------------------
const htmlDir = path.join(__dirname, '../frontend/html');

const htmlFiles = [
  'index.html', 'products.html', 'product.html', 'cart.html', 'checkout.html',
  'wishlist.html', 'orders.html', 'login.html', 'register.html', 'forgot-password.html',
  'reset-password.html', 'admin-login.html', 'admin.html', 'search.html'
];

htmlFiles.forEach(file => {
  app.get(`/${file}`, (req, res) => {
    res.sendFile(path.join(htmlDir, file));
  });
});

// ------------------
// SPA fallback for unmatched routes (optional for client-side routing)
// ------------------
app.get('*', (req, res) => {
  // Skip API routes
  if (req.path.startsWith('/api/')) return res.status(404).json({ message: 'API route not found' });
  res.sendFile(path.join(htmlDir, 'index.html'));
});

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
