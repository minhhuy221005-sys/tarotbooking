/**
 * Global Error Handler for DuAnBqc123
 */
const errorMiddleware = (err, req, res, next) => {
  console.error('Error:', err.message);

  // Handle Joi validation errors
  if (err.isJoi) {
    return res.status(400).json({ 
      error: `Dữ liệu không hợp lệ: ${err.details.map(i => i.message).join(', ')}` 
    });
  }

  // Handle other errors
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Hệ thống đang bận. Vui lòng thử lại sau.';

  res.status(statusCode).json({ error: message });
};

module.exports = errorMiddleware;
