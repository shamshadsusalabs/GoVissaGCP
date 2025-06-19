require('dotenv').config();
const jwt = require('jsonwebtoken');

const generateAccessToken = (adminId) => {
  return jwt.sign({ id: adminId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
};

const generateRefreshToken = (adminId) => {
  return jwt.sign({ id: adminId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

module.exports = { generateAccessToken, generateRefreshToken };
