const { GoogleSpreadsheet } = require('google-spreadsheet');
const { getAuthToken } = require('../config/googleSheets');

const appendBooking = async (data) => {
  const auth = getAuthToken();
  if (!auth) throw new Error('Google Sheets Auth failed');

  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, auth);
  await doc.loadInfo();
  
  const sheet = doc.sheetsByIndex[0];
  await sheet.addRow({
    'Thời gian gửi': data.timestamp,
    'Gói Tarot': data.packageName,
    'Họ và tên': data.fullName,
    'Ngày sinh': data.dob,
    'Link Facebook': data.contactLink,
    'Thời gian muốn xem': data.preferredTime,
    'Trạng thái': data.status || 'Mới',
    'Ghi chú': data.note || ''
  });
};

module.exports = { appendBooking };
