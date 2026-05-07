const axios = require('axios');

async function testBooking() {
  try {
    console.log('--- Đang test thử gửi đăng ký (New Structure)... ---');
    const response = await axios.post('http://localhost:5000/api/booking/register', {
      packageName: 'Tarot - 1 câu hỏi lẻ',
      fullName: 'Nguyễn Văn Test (Refactored)',
      dob: '01/01/1990',
      contactLink: 'https://facebook.com/test.user',
      preferredTime: 'Tối nay 20:00'
    });
    
    console.log('Kết quả:', response.data);
  } catch (error) {
    console.error('Lỗi khi test:', error.response ? error.response.data : error.message);
  }
}

testBooking();
