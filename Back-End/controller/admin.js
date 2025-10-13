require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Admin = require('../shcema/admin');
const { generateAccessToken, generateRefreshToken } = require('../Util/tokenUtils');


//sfbb efgygf hefbugevfe iuyegfuef ehfbhef
// Signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Admin already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ name, email, password: hashedPassword });

    res.status(201).json({ message: 'Admin created', adminId: admin._id });
  } catch (err) {
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  console.log(req.body)
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const accessToken = generateAccessToken(admin._id);
    const refreshToken = generateRefreshToken(admin._id);

    admin.refreshToken = refreshToken;
    await admin.save();

    res.status(200).json({
      message: 'Login successful',
      adminId: admin._id,
      accessToken,
      refreshToken
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// Logout
exports.logout = async (req, res) => {
  try {
    const token =
      req.body?.token ||
      req.query?.token ||
      req.headers['x-access-token'] ||
      req.headers['authorization']?.split(' ')[1] ||
      req.cookies?.token;

    if (!token) return res.status(400).json({ message: 'Token required for logout' });

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const admin = await Admin.findById(decoded.id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    admin.refreshToken = '';
    await admin.save();

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Logout failed', error: err.message });
  }
};

// Refresh Access Token
exports.refreshAccessToken = async (req, res) => {
  try {
    const token =
      req.body?.token ||
      req.query?.token ||
      req.headers['x-access-token'] ||
      req.headers['authorization']?.split(' ')[1] ||
      req.cookies?.token;

    if (!token) return res.status(400).json({ message: 'Refresh token required' });

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const admin = await Admin.findById(decoded.id);
    if (!admin || admin.refreshToken !== token) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const newAccessToken = generateAccessToken(admin._id);
    res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Refresh token expired' });
    }
    res.status(401).json({ message: 'Refresh token invalid', error: err.message });
  }
};

// Get Admin Profile
exports.getProfile = async (req, res) => {
  try {
    const adminId = req.adminId; // From auth middleware
    
    if (!adminId) {
      return res.status(401).json({ message: 'Admin ID not found in token' });
    }
    
    const admin = await Admin.findById(adminId).select('name email _id');
    
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    
    res.status(200).json({
      name: admin.name,
      email: admin.email,
      _id: admin._id
    });
  } catch (err) {
    console.error('Error fetching admin profile:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
