const { Resend } = require('resend');
const { escapeHtml, renderContactHtml } = require('./booking.security');

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Format date from YYYY-MM-DD to DD/MM/YYYY
 */
const formatVN = (dateStr) => {
  if (!dateStr) return 'Chưa cung cấp';
  try {
    // Joi may coerce ISO strings into Date objects
    if (dateStr instanceof Date) {
      return new Intl.DateTimeFormat('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(dateStr);
    }

    const asText = String(dateStr);
    const [y, m, d] = asText.split('-');
    if (y && m && d) return `${d}/${m}/${y}`;
    return asText;
  } catch {
    return String(dateStr);
  }
};

/**
 * Format datetime from ISO to HH:mm DD/MM/YYYY
 */
const formatDateTimeVN = (dateTimeStr) => {
  if (!dateTimeStr) return 'Chưa cung cấp';
  try {
    if (dateTimeStr instanceof Date) {
      return new Intl.DateTimeFormat('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour12: false,
      }).format(dateTimeStr).replace(',', '');
    }

    // Frontend uses <input type="datetime-local"> which sends a timezone-less string:
    // "YYYY-MM-DDTHH:mm". Treat it as Vietnam local time (+07:00) to avoid server TZ drift.
    const asText = String(dateTimeStr);
    const vnLocalNoSeconds = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
    const date = vnLocalNoSeconds.test(asText)
      ? new Date(`${asText}:00+07:00`)
      : new Date(asText);

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
    if (hh && mm && dd && mo && yyyy) return `${hh}:${mm} ngày ${dd}/${mo}/${yyyy}`;
    return new Date(date.getTime()).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
  } catch (e) {
    return dateTimeStr;
  }
};

const sendBookingAlert = async (data) => {
  const sheetUrl = `https://docs.google.com/spreadsheets/d/${process.env.GOOGLE_SHEET_ID}`;

  const subjectName = String(data.fullName ?? '').trim().replace(/[\r\n]+/g, ' ');
  const customerName = escapeHtml(data.fullName);
  const packageName = escapeHtml(data.packageName);
  const vnDob = escapeHtml(formatVN(data.dob));
  const vnPreferredTime = escapeHtml(formatDateTimeVN(data.preferredTime));
  const contactHtml = renderContactHtml(data.contactLink);

  try {
    const { data: resData, error } = await resend.emails.send({
      from: 'WonderLand Booking <onboarding@resend.dev>',
      to: [process.env.ADMIN_EMAIL],
      subject: `Thông báo đặt lịch mới: ${subjectName}`,
      html: `
        <div style="background-color: #f8f1e9; padding: 40px 20px; font-family: 'serif', 'Times New Roman', serif; color: #4a3728; line-height: 1.6;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2d1c3; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(74, 55, 40, 0.05);">

            <!-- Header -->
            <div style="padding: 40px 30px 20px; text-align: center;">
              <h1 style="color: #c49a6c; margin: 0; font-size: 28px; letter-spacing: 3px; text-transform: uppercase; font-weight: normal;">WonderLand</h1>
              <div style="width: 50px; height: 1px; border-bottom: 1px solid #c49a6c; margin: 20px auto;"></div>
              <p style="color: #8c7b6c; margin: 0; font-style: italic; font-size: 16px;">Yêu cầu kết nối mới</p>
            </div>

            <!-- Content -->
            <div style="padding: 0 40px 40px;">
              <p style="font-size: 16px; margin-bottom: 30px;">Chào bạn, hệ thống vừa ghi nhận một thông tin đăng ký dịch vụ mới với các chi tiết sau:</p>

              <div style="border-top: 1px solid #f2ece6; border-bottom: 1px solid #f2ece6; padding: 25px 0; margin-bottom: 30px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #8c7b6c; width: 140px;">Khách hàng</td>
                    <td style="padding: 8px 0; font-weight: bold;">${customerName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #8c7b6c;">Ngày sinh</td>
                    <td style="padding: 8px 0;">${vnDob}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #8c7b6c;">Dịch vụ</td>
                    <td style="padding: 8px 0; color: #c49a6c;">${packageName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #8c7b6c;">Thời gian hẹn</td>
                    <td style="padding: 8px 0;">${vnPreferredTime}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #8c7b6c;">Liên hệ</td>
                    <td style="padding: 8px 0;">${contactHtml}</td>
                  </tr>
                </table>
              </div>

              <!-- Button -->
              <div style="text-align: center;">
                <a href="${escapeHtml(sheetUrl)}" style="display: inline-block; background-color: #c49a6c; color: #ffffff; padding: 14px 28px; border-radius: 4px; text-decoration: none; font-size: 14px; letter-spacing: 1px;">
                  XEM TRÊN GOOGLE SHEETS
                </a>
              </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #fcfaf7; padding: 25px; text-align: center; border-top: 1px solid #f2ece6;">
              <p style="font-size: 12px; color: #b5a494; margin: 0;">Gửi tự động từ hệ thống quản lý WonderLand</p>
            </div>

          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Resend Error:', error);
      throw error;
    }

    return resData;
  } catch (err) {
    console.error('Mail Service Error:', err);
    throw err;
  }
};

module.exports = { sendBookingAlert };
