const { JWT } = require('google-auth-library');
const path = require('path');

const getAuthToken = () => {
  const serviceAccountPath = path.join(__dirname, '../../service-account.json');
  
  try {
    const creds = require(serviceAccountPath);
    return new JWT({
      email: creds.client_email,
      key: creds.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
  } catch (error) {
    console.error('Lỗi khi tải service-account.json:', error.message);
    return null;
  }
};

module.exports = { getAuthToken };
