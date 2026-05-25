const adminAuth = (req, res, next) => {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const providedPassword = req.headers['x-admin-password'];

  if (!adminPassword) {
    return res.status(500).json({ error: 'Chưa cấu hình mật khẩu Admin trên server.' });
  }

  if (providedPassword === adminPassword) {
    next();
  } else {
    res.status(401).json({ error: 'Mật khẩu quản trị không chính xác.' });
  }
};

module.exports = { adminAuth };
