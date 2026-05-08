const express = require('express');
const router = express.Router();
const { createBooking } = require('../controllers/bookingController');
const { bookingLimiter } = require('../middlewares/rateLimiter');
const validate = require('../middlewares/validate.middleware');
const bookingSchema = require('../schemas/booking.schema');

// Apply security layers in order: 
// 1. Rate Limiting (Prevent Spam)
// 2. Validation (Check data integrity & Sanitization via Joi)
router.post('/register', 
  bookingLimiter, 
  validate(bookingSchema), 
  createBooking
);

module.exports = router;
