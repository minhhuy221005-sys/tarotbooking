const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Format date from YYYY-MM-DD to DD/MM/YYYY
 */
const formatVN = (dateStr) => {
  if (!dateStr) return 'Chưa cung cấp';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
};

/**
 * Format datetime from ISO to HH:mm DD/MM/YYYY
 */
const formatDateTimeVN = (dateTimeStr) => {
  if (!dateTimeStr) return 'Chưa cung cấp';
  try {
    const date = new Date(dateTimeStr);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${hours}:${minutes} ngày ${day}/${month}/${year}`;
  } catch (e) {
    return dateTimeStr;
  }
};

const sendBookingAlert = async (data) => {
  const sheetUrl = `https://docs.google.com/spreadsheets/d/${process.env.GOOGLE_SHEET_ID}`;
  
  // Format data for VN style
  const vnDob = formatVN(data.dob);
  const vnPreferredTime = formatDateTimeVN(data.preferredTime);

  try {
    const { data: resData, error } = await resend.emails.send({
      from: 'Tarot Booking <onboarding@resend.dev>',
      to: [process.env.ADMIN_EMAIL],
      subject: `🔮 [MỚI] Đơn đặt lịch từ ${data.fullName}`,
      html: `
        <div style="background-color: #0f071a; padding: 40px 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #ffffff;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #1a0b2e; border: 1px solid #3b2166; border-radius: 20px; overflow: hidden;">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #1a0b2e 0%, #3b2166 100%); padding: 30px; text-align: center; border-bottom: 1px solid #d4af37;">
              <h1 style="color: #d4af37; margin: 0; font-size: 24px; letter-spacing: 2px; text-transform: uppercase;">WonderLand Booking</h1>
              <p style="color: #a78bfa; margin: 10px 0 0 0; font-style: italic;">Yêu cầu mới từ vũ trụ</p>
            </div>

            <!-- Content -->
            <div style="padding: 30px;">
              <p style="font-size: 16px; color: #e9d5ff;">Chào bạn, một khách hàng vừa gửi yêu cầu đặt lịch:</p>
              
              <div style="background-color: #24143d; border-left: 4px solid #d4af37; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>👤 Khách hàng:</strong> <span style="color: #ffffff;">${data.fullName}</span></p>
                <p style="margin: 5px 0;"><strong>🎂 Ngày sinh:</strong> <span style="color: #ffffff;">${vnDob}</span></p>
                <p style="margin: 5px 0;"><strong>📜 Gói dịch vụ:</strong> <span style="color: #d4af37; font-weight: bold;">${data.packageName}</span></p>
                <p style="margin: 5px 0;"><strong>⏰ Hẹn lúc:</strong> <span style="color: #ffffff;">${vnPreferredTime}</span></p>
                <p style="margin: 15px 0 5px 0;"><strong>🔗 Liên hệ khách:</strong></p>
                <a href="${data.contactLink}" style="color: #60a5fa; text-decoration: none; word-break: break-all;">${data.contactLink}</a>
              </div>

              <!-- Button -->
              <div style="text-align: center; margin-top: 30px;">
                <a href="${sheetUrl}" style="background-color: #d4af37; color: #1a0b2e; padding: 15px 30px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
                  📊 Quản lý trên Google Sheets
                </a>
              </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #12081f; padding: 20px; text-align: center; border-top: 1px solid #3b2166;">
              <p style="font-size: 12px; color: #6d28d9; margin: 0;">© 2026 Tarot Online System</p>
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
