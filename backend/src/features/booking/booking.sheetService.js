const { GoogleSpreadsheet } = require('google-spreadsheet');
const { getAuthToken } = require('../../config/googleSheets');
const { safeSheetCell } = require('./booking.security');

const formatDobForSheet = (value) => {
  if (!value) return '';
  try {
    if (value instanceof Date) {
      return new Intl.DateTimeFormat('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(value);
    }
    const asText = String(value);
    const [y, m, d] = asText.split('-');
    if (y && m && d) return `${d}/${m}/${y}`;
    return asText;
  } catch {
    return String(value);
  }
};

const formatPreferredTimeForSheet = (value) => {
  if (!value) return '';
  try {
    let date;
    if (value instanceof Date) {
      date = value;
    } else {
      // Frontend datetime-local: "YYYY-MM-DDTHH:mm" (no timezone). Treat as VN time.
      const asText = String(value);
      const vnLocalNoSeconds = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
      date = vnLocalNoSeconds.test(asText)
        ? new Date(`${asText}:00+07:00`)
        : new Date(asText);
    }

    const parts = new Intl.DateTimeFormat('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour12: false,
    }).formatToParts(date);

    const get = (type) => parts.find((p) => p.type === type)?.value;
    const hh = get('hour');
    const mm = get('minute');
    const dd = get('day');
    const mo = get('month');
    const yyyy = get('year');
    if (hh && mm && dd && mo && yyyy) return `${hh}:${mm} ${dd}/${mo}/${yyyy}`;
    return new Date(date.getTime()).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
  } catch {
    return String(value);
  }
};

const isPastDue = (timeStr) => {
  if (!timeStr) return false;
  try {
    // timeStr format: "HH:mm DD/MM/YYYY"
    const [time, date] = timeStr.split(' ');
    if (!time || !date) return false;
    const [hh, mm] = time.split(':');
    const [dd, mo, yyyy] = date.split('/');
    // Build ISO string in local time then assume it's VN time
    const bookingDate = new Date(`${yyyy}-${mo}-${dd}T${hh}:${mm}:00+07:00`);
    return bookingDate < new Date();
  } catch {
    return false;
  }
};

const appendBooking = async (data) => {
  const auth = getAuthToken();
  if (!auth) throw new Error('Google Sheets Auth failed');

  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, auth);
  await doc.loadInfo();

  const sheet = doc.sheetsByIndex[0];
  await sheet.addRow({
    'Thời gian gửi': safeSheetCell(data.timestamp),
    'Gói Tarot': safeSheetCell(data.packageName),
    'Họ và tên': safeSheetCell(data.fullName),
    'Ngày sinh': safeSheetCell(formatDobForSheet(data.dob)),
    'Link Facebook': safeSheetCell(data.contactLink),
    'Thời gian muốn xem': safeSheetCell(formatPreferredTimeForSheet(data.preferredTime)),
    'Trạng thái': safeSheetCell(data.status || 'Mới'),
    'Ghi chú': safeSheetCell(data.note || '')
  });
};

const getAdminBookings = async () => {
  const auth = getAuthToken();
  if (!auth) throw new Error('Google Sheets Auth failed');

  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, auth);
  await doc.loadInfo();

  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows();

  return rows.map((row) => {
    let currentStatus = row.get('Trạng thái') || 'Mới';
    const preferredTime = row.get('Thời gian muốn xem');
    
    // Tự động chuyển thành 'Cũ' nếu thời gian đã trôi qua và vẫn đang là 'Mới'
    if (currentStatus === 'Mới' && isPastDue(preferredTime)) {
      currentStatus = 'Cũ';
    }

    return {
      id: row.rowNumber,
      timestamp: row.get('Thời gian gửi'),
      packageName: row.get('Gói Tarot'),
      fullName: row.get('Họ và tên'),
      dob: row.get('Ngày sinh'),
      contactLink: row.get('Link Facebook'),
      preferredTime,
      status: currentStatus,
      note: row.get('Ghi chú') || ''
    };
  }).reverse(); // Reverse to show newest first
};

module.exports = { appendBooking, getAdminBookings };
