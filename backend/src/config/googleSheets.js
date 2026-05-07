const { JWT } = require('google-auth-library');
const path = require('path');

const getAuthToken = () => {
  // Priority 1: Environment Variable (for Production like Render)
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    try {
      const creds = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
      return new JWT({
        email: creds.client_email,
        key: creds.private_key,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });
    } catch (error) {
      console.error('Lỗi khi parse GOOGLE_SERVICE_ACCOUNT_JSON:', error.message);
    }
  }

  // Priority 2: Local File (for Development)
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
