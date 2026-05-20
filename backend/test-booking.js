const axios = require('axios');

async function testBooking() {
  try {
    console.log('--- Đang test thử gửi đăng ký (New Structure)... ---');
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const preferredTime = tomorrow.toISOString().slice(0, 16);

    const response = await axios.post('http://localhost:5000/api/booking/register', {
      packageName: 'Tarot - 1 câu hỏi lẻ',
      fullName: 'Nguyễn Văn Test (Refactored)',
      dob: '1990-01-01',
      contactLink: 'https://facebook.com/test.user',
      preferredTime
    });
    
    console.log('Kết quả:', response.data);
  } catch (error) {
    console.error('Lỗi khi test:', error.response ? error.response.data : error.message);
  }
}

testBooking();
