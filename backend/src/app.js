require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();

// 1. Security Headers
app.use(helmet());

// 2. Restricted CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parser
app.use(express.json({ limit: '10kb' })); // Limit body size to prevent DOS

// Routes
app.use('/api/booking', bookingRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('Tarot Booking API is secured and ready.');
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint không tồn tại.' });
});

// Global Error Handler (Must be last)
app.use(require('./middlewares/error.middleware'));

module.exports = app;
