const { appendBooking, getAdminBookings: getSheetAdminBookings } = require('./booking.sheetService');
const { sendBookingAlert } = require('./booking.mailService');
const asyncHandler = require('../../utils/asyncHandler');

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

  // Source of truth: if Sheets write succeeds, booking is accepted.
  // Email is a notification channel; if it fails, we still keep the booking.
  await appendBooking(bookingData);
  try {
    await sendBookingAlert(bookingData);
  } catch (err) {
    console.error('sendBookingAlert failed (booking still saved):', err?.message || err);
  }

  res.status(200).json({
    message: 'Đăng ký thành công! Reader sẽ sớm liên hệ với bạn qua Facebook/Zalo.'
  });
});

const getAdminBookings = asyncHandler(async (req, res) => {
  const bookings = await getSheetAdminBookings();
  res.status(200).json({
    message: 'Lấy dữ liệu thành công',
    data: bookings
  });
});

module.exports = { createBooking, getAdminBookings };
