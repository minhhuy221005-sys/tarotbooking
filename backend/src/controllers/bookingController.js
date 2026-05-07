const { appendBooking } = require('../services/sheetService');
const { sendBookingAlert } = require('../services/mailService');

const createBooking = async (req, res) => {
  try {
    const { packageName, fullName, dob, contactLink, preferredTime } = req.body;

    // 1. Validation (Could be moved to a separate middleware)
    if (!packageName || !fullName || !contactLink) {
      return res.status(400).json({ error: 'Vui lòng điền đầy đủ các thông tin bắt buộc.' });
    }

    const bookingData = {
      timestamp: new Date().toLocaleString('vi-VN'),
      packageName,
      fullName,
      dob,
      contactLink,
      preferredTime,
      status: 'Mới'
    };

    // 2. Write to Sheets & Send Email in parallel
    await Promise.all([
      appendBooking(bookingData),
      sendBookingAlert(bookingData)
    ]);

    res.status(200).json({ 
      message: 'Đăng ký thành công! Reader sẽ sớm liên hệ với bạn qua Facebook/Zalo.' 
    });

  } catch (error) {
    console.error('Booking Controller Error:', error);
    res.status(500).json({ 
      error: 'Hệ thống đang bận. Vui lòng thử lại sau hoặc liên hệ trực tiếp qua Fanpage.' 
    });
  }
};

module.exports = { createBooking };
