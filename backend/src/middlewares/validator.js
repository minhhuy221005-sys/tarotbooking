/**
 * Middleware to sanitize input data by stripping HTML tags
 */
const sanitizeInput = (req, res, next) => {
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].replace(/<[^>]*>?/gm, '').trim();
      }
    }
  }
  next();
};

/**
 * Robust validation for booking data
 */
const validateBooking = (req, res, next) => {
  const { fullName, dob, contactLink, packageName, preferredTime } = req.body;
  const errors = [];

  // 1. Check required fields
  if (!fullName || fullName.length < 2) errors.push("Họ tên không hợp lệ.");
  if (!contactLink || contactLink.length < 5) errors.push("Thông tin liên hệ không hợp lệ.");
  if (!packageName) errors.push("Vui lòng chọn gói dịch vụ.");

  // 2. Validate DOB (basic date check)
  if (dob) {
    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime()) || birthDate > new Date()) {
      errors.push("Ngày sinh không hợp lệ.");
    }
  }

  // 3. Validate Preferred Time
  if (preferredTime) {
    const meetTime = new Date(preferredTime);
    if (isNaN(meetTime.getTime())) {
      errors.push("Thời gian hẹn không hợp lệ.");
    }
  }

  // 4. Sanitize and structure contactLink (prevent weird object injection)
  if (typeof contactLink !== 'string') {
    errors.push("Định dạng liên hệ không đúng.");
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: errors[0] }); // Return the first error
  }

  next();
};

module.exports = { sanitizeInput, validateBooking };
