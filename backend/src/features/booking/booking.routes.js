const express = require('express');
const { createBooking, getAdminBookings } = require('./booking.controller');
const { adminAuth } = require('../../middlewares/auth.middleware');
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

router.get(
  '/admin/bookings',
  adminAuth,
  getAdminBookings
);

module.exports = router;
