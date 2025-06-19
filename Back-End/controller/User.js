require('dotenv').config();
const User = require("../shcema/User");
const { generateAccessToken, generateRefreshToken } = require("../Util/tokenUtils");

// Use fetch for sending SMS
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// In-memory OTP store (for testing only)
const otpStore = {}; // { phoneNumber: { otp: "123456", expiresAt: 1234567890 } }

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
