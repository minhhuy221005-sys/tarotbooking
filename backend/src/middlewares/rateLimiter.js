const rateLimit = require('express-rate-limit');

const bookingLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3, // Limit each IP to 3 requests per windowMs
  message: {
    error: 'Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau 5 phút.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { bookingLimiter };
