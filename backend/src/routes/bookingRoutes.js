const express = require('express');
const router = express.Router();
const { createBooking } = require('../controllers/bookingController');
const { bookingLimiter } = require('../middlewares/rateLimiter');
const { sanitizeInput, validateBooking } = require('../middlewares/validator');

// Apply security layers in order: 
// 1. Rate Limiting (Prevent Spam)
// 2. Sanitization (Strip HTML/XSS)
// 3. Validation (Check data integrity)
router.post('/register', 
  bookingLimiter, 
  sanitizeInput, 
  validateBooking, 
  createBooking
);

module.exports = router;
