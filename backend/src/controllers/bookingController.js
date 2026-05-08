const { appendBooking } = require('../services/sheetService');
const { sendBookingAlert } = require('../services/mailService');
const asyncHandler = require('../utils/asyncHandler');

const createBooking = asyncHandler(async (req, res) => {
  const { packageName, fullName, dob, contactLink, preferredTime } = req.body;

  const bookingData = {
    timestamp: new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
    packageName,
    fullName,
    dob,
    contactLink,
    preferredTime,
    status: 'Mới'
  };

  // Write to Sheets & Send Email in parallel
  await Promise.all([
    appendBooking(bookingData),
    sendBookingAlert(bookingData)
  ]);

  res.status(200).json({ 
    message: 'Đăng ký thành công! Reader sẽ sớm liên hệ với bạn qua Facebook/Zalo.' 
  });
});

module.exports = { createBooking };
