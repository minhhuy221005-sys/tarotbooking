# Hướng dẫn thiết lập Google Sheets API & Email

Để Backend có thể hoạt động, bạn cần thực hiện các bước sau:

## 1. Thiết lập Google Sheets API
1.  Truy cập [Google Cloud Console](https://console.cloud.google.com/).
2.  Tạo một Project mới (ví dụ: `TarotBookingSystem`).
3.  Vào mục **APIs & Services** > **Library**, tìm và bật **Google Sheets API**.
4.  Vào mục **APIs & Services** > **Credentials**.
5.  Nhấn **Create Credentials** > **Service Account**.
6.  Đặt tên cho Service Account và nhấn **Create and Continue** (có thể bỏ qua các bước phân quyền tiếp theo).
7.  Sau khi tạo xong, nhấn vào email của Service Account đó.
8.  Chuyển sang tab **Keys** > **Add Key** > **Create new key** > Chọn **JSON**.
9.  Một file `.json` sẽ được tải về máy. Hãy đổi tên nó thành `service-account.json` và copy vào thư mục `server/`.

## 2. Chuẩn bị Google Sheet
1.  Tạo một Google Sheet mới.
2.  Copy **Spreadsheet ID** từ URL (ví dụ: `https://docs.google.com/spreadsheets/d/1abc123.../edit` thì ID là `1abc123...`).
3.  **Quan trọng**: Nhấn nút **Share** trên Google Sheet và chia sẻ quyền **Editor** cho email của Service Account bạn vừa tạo ở bước trên.
4.  Đặt tên các cột ở hàng đầu tiên (Row 1) như sau:
    `Thời gian gửi`, `Gói Tarot`, `Họ và tên`, `Ngày sinh`, `Link Facebook`, `Thời gian muốn xem`, `Trạng thái`, `Ghi chú`

## 3. Thiết lập Email (Nodemailer)
Nếu bạn dùng Gmail:
1.  Bật **2-Step Verification**.
2.  Tạo một **App Password** (Mật khẩu ứng dụng) tại [đây](https://myaccount.google.com/apppasswords).
3.  Lưu mật khẩu này lại để dùng trong file `.env`.

---
**Sau khi hoàn tất, hãy báo cho tôi biết ID của Google Sheet và email gửi nhận thông báo nhé!**
