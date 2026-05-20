const express = require('express');
const { createBooking } = require('./booking.controller');
const { bookingLimiter } = require('../../middlewares/rateLimiter');
const validate = require('../../middlewares/validate.middleware');
const bookingSchema = require('./booking.schema');

const router = express.Router();

router.post(
  '/register',
  bookingLimiter,
  validate(bookingSchema),
  createBooking
);

module.exports = router;
