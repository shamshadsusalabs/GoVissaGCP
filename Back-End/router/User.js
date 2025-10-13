const express = require("express");
const router = express.Router();
const { verifyAccessToken } = require('../middileware/authMiddleware');

const {
  sendOtp,
  verifyOtp,
  loginOrSignupWithPhone,
  logoutUser,
  checkUserExistence,
  sendEmailOtp,
  verifyEmailOtp,
  loginOrSignupWithEmail,
  registerEmailForUser,
  getAllUsersWithStats,
  sendSuccessEmail
} = require("../controller/User");

// Send OTP
router.post("/send-otp", sendOtp);

// Verify OTP and login/signup
router.post("/verify-otp", verifyOtp);

// ✅ NEW: Email OTP routes
router.post("/send-email-otp", sendEmailOtp);
router.post("/verify-email-otp", verifyEmailOtp);
router.post("/register-email", registerEmailForUser);

// ✅ NEW: Success email route
router.post("/send-success-email", sendSuccessEmail);

// Direct login/signup (optional: if you use custom token validation flow)
router.post("/login", loginOrSignupWithPhone);

// Logout (via refresh token)
router.post("/logout",verifyAccessToken, logoutUser);

router.post("/check-user",checkUserExistence);

// ✅ NEW: Get all users with statistics
router.get("/all-users-with-stats", getAllUsersWithStats);

module.exports = router;
