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
  contactLink: Joi.string().trim().min(5).max(500).required().messages({
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
