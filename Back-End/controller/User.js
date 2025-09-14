require('dotenv').config();
const User = require("../shcema/User");
const { generateAccessToken, generateRefreshToken } = require("../Util/tokenUtils");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const nodemailer = require('nodemailer');

const otpStore = {}; 
const emailOtpStore = {}; // New store for email OTPs

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'shamshadalamansari2@gmail.com',
    pass: process.env.EMAIL_PASS || 'sasq osvs irwt jtvg' // Use app password for Gmail
  },
  tls: {
    rejectUnauthorized: false
  }
});

exports.sendOtp = async (req, res) => {
  const { phoneNumber } = req.body;

  const authKey = process.env.OTP_AUTH_KEY;
  const senderId = process.env.OTP_SENDER_ID;

  if (!phoneNumber) {
    return res.status(400).json({ message: "Phone number is required" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const message = `Your OTP is ${otp}. Please do not share it with anyone.`;

  const url = `http://msg.msgclub.net/rest/services/sendSMS/sendGroupSms?AUTH_KEY=${authKey}&message=${encodeURIComponent(
    message
  )}&senderId=${senderId}&routeId=1&mobileNos=91${phoneNumber}&smsContentType=english`;

  try {
    const response = await fetch(url);
    const result = await response.json();

    console.log("✅ SMS API Response:", result);
    console.log("📲 OTP Sent to:", phoneNumber, "OTP:", otp);

    otpStore[phoneNumber] = {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    };

    return res.status(200).json({
      message: "OTP sent successfully",
      result,
    });
  } catch (error) {
    console.error("❌ Error sending OTP:", error);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};


exports.verifyOtp = async (req, res) => {
  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) {
    return res.status(400).json({ message: "Phone number and OTP are required" });
  }

  const record = otpStore[phoneNumber];

  if (!record) {
    return res.status(400).json({ message: "OTP not found. Please request a new one." });
  }

  if (Date.now() > record.expiresAt) {
    delete otpStore[phoneNumber];
    return res.status(400).json({ message: "OTP has expired. Please request a new one." });
  }

  if (record.otp !== otp) {
    return res.status(401).json({ message: "Invalid OTP" });
  }

  // OTP is valid
  delete otpStore[phoneNumber]; // Clear OTP from store

  console.log("✅ OTP verified for:", phoneNumber);

  // Attach phoneNumber to request and call login/signup
  req.body.phoneNumber = phoneNumber;
  return exports.loginOrSignupWithPhone(req, res);
};

exports.loginOrSignupWithPhone = async (req, res) => {
  const phoneNumber = req.body?.phoneNumber;
  console.log("➡️ Logging in with phone number:", phoneNumber);

  if (!phoneNumber) {
    return res.status(400).json({ message: "Phone number is required" });
  }

  try {
    let user = await User.findOne({ phoneNumber });

    if (!user) {
      user = new User({ phoneNumber });
      await user.save();
      console.log("🆕 New user created:", user);
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    return res.status(200).json({
      message: "User logged in successfully",
      user,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("🔥 Login/Signup error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.logoutUser = async (req, res) => {
  const token =
    req.body.refreshToken ||
    req.query.refreshToken ||
    req.headers["x-refresh-token"] ||
    req.headers["authorization"];

  if (!token) {
    return res.status(400).json({ message: "Refresh token is required for logout" });
  }

  try {
    const user = await User.findOne({ refreshToken: token });

    if (!user) {
      return res.status(400).json({ message: "Invalid refresh token" });
    }

    user.refreshToken = null;
    await user.save();

    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("❌ Logout error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


exports.checkUserExistence = async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ message: "Phone number is required" });
  }

  try {
    const user = await User.findOne({ phoneNumber });

    if (user) {
      return res.status(200).json({ exists: true });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error("❌ Error checking user existence:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ NEW: Email OTP functionality
exports.sendEmailOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const message = `Your GoVissa OTP is ${otp}. Please do not share it with anyone. This OTP will expire in 5 minutes.`;

  const mailOptions = {
    from: process.env.EMAIL_USER || 'shamshadalamansari2@gmail.com',
    to: email,
    subject: 'GoVissa - Email Verification OTP',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; text-align: center;">GoVissa</h1>
          <p style="margin: 10px 0 0 0; text-align: center; opacity: 0.9;">Email Verification</p>
        </div>
        <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">Your Verification Code</h2>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px;">${otp}</span>
          </div>
          <p style="color: #666; line-height: 1.6;">
            Please enter this 6-digit code to verify your email address. This code will expire in 5 minutes.
          </p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              If you didn't request this code, please ignore this email.
            </p>
          </div>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);

    console.log("✅ Email OTP Sent to:", email, "OTP:", otp);

    emailOtpStore[email] = {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    };

    return res.status(200).json({
      message: "Email OTP sent successfully",
    });
  } catch (error) {
    console.error("❌ Error sending email OTP:", error);
    return res.status(500).json({ message: "Failed to send email OTP" });
  }
};

exports.verifyEmailOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  const record = emailOtpStore[email];

  if (!record) {
    return res.status(400).json({ message: "Email OTP not found. Please request a new one." });
  }

  if (Date.now() > record.expiresAt) {
    delete emailOtpStore[email];
    return res.status(400).json({ message: "Email OTP has expired. Please request a new one." });
  }

  if (record.otp !== otp) {
    return res.status(401).json({ message: "Invalid email OTP" });
  }

  // Email OTP is valid
  delete emailOtpStore[email]; // Clear OTP from store

  console.log("✅ Email OTP verified for:", email);

  // Just return success - frontend will handle user profile update
  return res.status(200).json({
    message: "Email OTP verified successfully",
    email: email
  });
};

// ✅ NEW: Function to register email for existing users
exports.registerEmailForUser = async (req, res) => {
  const { email, userId } = req.body;

  if (!email || !userId) {
    return res.status(400).json({ message: "Email and userId are required" });
  }

  try {
    // Check if email is already registered with another user
    const existingUserWithEmail = await User.findOne({ email });
    if (existingUserWithEmail && existingUserWithEmail._id.toString() !== userId) {
      return res.status(400).json({ message: "Email is already registered with another user" });
    }

    // Find the user by userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user with email
    user.email = email;
    await user.save();

    console.log("✅ Email registered for existing user:", user);

    return res.status(200).json({
      message: "Email registered successfully",
      user,
    });
  } catch (error) {
    console.error("🔥 Email registration error:", error);
    return res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};

exports.loginOrSignupWithEmail = async (req, res) => {
  const email = req.body?.email;
  console.log("➡️ Logging in with email:", email);

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // First try to find user by email
    let user = await User.findOne({ email });

    if (!user) {
      // If no user found by email, create new user with email
      user = new User({ email });
      await user.save();
      console.log("🆕 New user created with email:", user);
    } else {
      console.log("✅ Existing user found with email:", user);
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    return res.status(200).json({
      message: "User logged in successfully",
      user,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("🔥 Email Login/Signup error:", error);
    console.error("Error details:", error.message);
    return res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};
