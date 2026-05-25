const Joi = require('joi');

const bookingSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(100).required().messages({
    'string.empty': 'Họ tên không được để trống.',
    'string.min': 'Họ tên phải có ít nhất 2 ký tự.',
    'string.max': 'Họ tên quá dài (tối đa 100 ký tự).'
  }),
  dob: Joi.date().iso().max('now').required().messages({
    'date.format': 'Ngày sinh không hợp lệ.',
    'date.max': 'Ngày sinh không thể ở tương lai.'
  }),
  contactLink: Joi.string().trim().min(5).max(500).required().custom((value, helpers) => {
    const nums = value.replace(/[\s\.\-\+]/g, '');
    if (/^\d{9,12}$/.test(nums)) return value;

    let isSafeDomain = false;
    try {
      const urlString = value.startsWith('http') ? value : `https://${value}`;
      const url = new URL(urlString);
      isSafeDomain = /(^|\.)(facebook\.com|fb\.com|fb\.me|messenger\.com|m\.me|zalo\.me|instagram\.com)$/i.test(url.hostname);
    } catch {
      isSafeDomain = false;
    }
    const looksLikeUrl = value.includes('.');
    
    if (looksLikeUrl && !isSafeDomain) {
      return helpers.message('Vui lòng chỉ nhập SĐT hoặc link Facebook/Zalo/Instagram an toàn. Link lạ đã bị từ chối.');
    }
    return value;
  }).messages({
    'string.empty': 'Thông tin liên hệ là bắt buộc.',
    'string.min': 'Thông tin liên hệ quá ngắn.'
  }),
  packageName: Joi.string().trim().min(1).max(150).required().messages({
    'string.empty': 'Vui lòng chọn gói dịch vụ.',
    'any.required': 'Vui lòng chọn gói dịch vụ.'
  }),
  preferredTime: Joi.date().iso().greater('now').allow(null, '').messages({
    'date.greater': 'Thời gian hẹn phải ở tương lai.'
  })
});

module.exports = bookingSchema;
