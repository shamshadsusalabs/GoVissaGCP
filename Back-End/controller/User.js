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
  const message = `[GoVisa] Dear User, Your One-Time Password (OTP) is ${otp}. This code is valid for 10 minutes. For security reasons, please do not share this OTP with anyone. KEHAR TRAVEL SERVICES PRIVATE LIMITED`;

  const url = `https://msg.icloudsms.com/rest/services/sendSMS/sendGroupSms?AUTH_KEY=${authKey}&message=${encodeURIComponent(
    message
  )}&senderId=KEHTRV&routeId=8&mobileNos=${phoneNumber}&smsContentType=english&entityid=1701175213872191155&tmid=1002408235216785541&templateid=1707175767888508970`;

  try {
    console.log("🔗 SMS API URL:", url);
    
    const response = await fetch(url);
    const result = await response.json();

    console.log("✅ SMS API Response:", result);
    console.log("📲 OTP Sent to: +91" + phoneNumber, "OTP:", otp);

    // Check if the response indicates success
    if (result.responseCode === '3001') {
      otpStore[phoneNumber] = {
        otp,
        expiresAt: Date.now() + 5 * 60 * 1000,
      };

      return res.status(200).json({
        message: "OTP sent successfully",
        result,
        debug: {
          phoneNumber: "+91" + phoneNumber,
          otp: otp, // Remove this in production
          apiResponse: result
        }
      });
    } else {
      console.error("❌ SMS API Error Response:", result);
      return res.status(400).json({ 
        message: "Failed to send OTP", 
        error: result.response || "Unknown error",
        responseCode: result.responseCode
      });
    }
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

// ✅ NEW: Get all users with visa and payment statistics
exports.getAllUsersWithStats = async (req, res) => {
  try {
    console.log("📊 Fetching all users with visa and payment statistics...");

    // Get all users
    const users = await User.find({}).select('-refreshToken').lean();
    console.log(`Found ${users.length} users`);

    // Import required models
    const VisaApplication = require("../shcema/VisaApplication");
    const Payment = require("../shcema/Payment");

    // Process each user to get their statistics
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        try {
          // Find visa applications by email or phone
          const visaQuery = {
            $or: []
          };

          if (user.email) {
            visaQuery.$or.push({ email: user.email });
          }
          if (user.phoneNumber) {
            visaQuery.$or.push({ phone: user.phoneNumber });
          }

          // If no email or phone, skip this user
          if (visaQuery.$or.length === 0) {
            return {
              ...user,
              visaCount: 0,
              totalPayments: 0,
              onlinePayments: 0,
              offlinePayments: 0,
              totalAmount: 0,
              visaApplications: [],
              paymentOrders: []
            };
          }

          const visaApplications = await VisaApplication.find(visaQuery).lean();

          // Find payment orders by email or phone
          const paymentQuery = {
            $or: []
          };

          if (user.email) {
            paymentQuery.$or.push({ email: user.email });
          }
          if (user.phoneNumber) {
            paymentQuery.$or.push({ phone: user.phoneNumber });
          }

          const paymentOrders = await Payment.find(paymentQuery).lean();

          // Calculate statistics
          const onlinePayments = visaApplications.filter(app => 
            app.processingMode === 'online' && app.paymentId && app.paymentId !== 'undefined'
          ).length;

          const offlinePayments = visaApplications.filter(app => 
            app.processingMode === 'offline' || !app.paymentId || app.paymentId === 'undefined'
          ).length;

          const totalAmount = paymentOrders.reduce((sum, payment) => {
            return sum + (parseInt(payment.amount) || 0);
          }, 0);

          return {
            ...user,
            visaCount: visaApplications.length,
            totalPayments: paymentOrders.length,
            onlinePayments,
            offlinePayments,
            totalAmount,
            visaApplications: visaApplications.slice(0, 10), // Limit to 10 for performance
            paymentOrders: paymentOrders.slice(0, 10) // Limit to 10 for performance
          };
        } catch (userError) {
          console.error(`Error processing user ${user._id}:`, userError);
          return {
            ...user,
            visaCount: 0,
            totalPayments: 0,
            onlinePayments: 0,
            offlinePayments: 0,
            totalAmount: 0,
            visaApplications: [],
            paymentOrders: []
          };
        }
      })
    );

    // Sort users by total visa count (descending)
    usersWithStats.sort((a, b) => b.visaCount - a.visaCount);

    console.log(`✅ Successfully processed ${usersWithStats.length} users with statistics`);

    return res.status(200).json({
      message: "Users with statistics fetched successfully",
      users: usersWithStats,
      summary: {
        totalUsers: usersWithStats.length,
        totalApplications: usersWithStats.reduce((sum, user) => sum + user.visaCount, 0),
        totalOnlinePayments: usersWithStats.reduce((sum, user) => sum + user.onlinePayments, 0),
        totalOfflinePayments: usersWithStats.reduce((sum, user) => sum + user.offlinePayments, 0),
        totalRevenue: usersWithStats.reduce((sum, user) => sum + user.totalAmount, 0)
      }
    });

  } catch (error) {
    console.error("❌ Error fetching users with statistics:", error);
    return res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};

// ✅ NEW: Send success email after OTP verification
exports.sendSuccessEmail = async (req, res) => {
  try {
    const { email, phone, name, paymentStatus } = req.body;

    if (!email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Email and phone are required"
      });
    }

    // Generate payment status message based on payment method
    let paymentMessage = '';
    let paymentColor = '#22c55e';
    let paymentIcon = '✅';
    
    if (paymentStatus === 'online') {
      paymentMessage = `
        <div style="background-color: #dcfce7; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #22c55e;">
          <h3 style="color: #15803d; margin-top: 0;">💳 Payment Status: COMPLETED</h3>
          <p style="color: #374151; margin-bottom: 0;">
            <span style="color: #22c55e; font-size: 18px; margin-right: 10px;">✓</span>
            Your online payment has been successfully processed. You can now proceed with document upload.
          </p>
        </div>
      `;
    } else if (paymentStatus === 'cash' || paymentStatus === 'offline') {
      paymentMessage = `
        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #f59e0b;">
          <h3 style="color: #d97706; margin-top: 0;">💰 Payment Status: PENDING</h3>
          <p style="color: #374151; margin-bottom: 10px;">
            <span style="color: #f59e0b; font-size: 18px; margin-right: 10px;">⏳</span>
            Your account has been verified successfully, but payment is still pending.
          </p>
          <p style="color: #374151; margin-bottom: 0; font-weight: 600;">
            Please complete your ${paymentStatus === 'cash' ? 'cash' : 'offline'} payment to proceed with your visa application.
          </p>
        </div>
      `;
    } else {
      // Default message when no payment status is provided (login verification only)
      paymentMessage = `
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #1e40af; margin-top: 0;">🚀 What's Next?</h3>
          <ol style="color: #374151; padding-left: 20px;">
            <li style="margin-bottom: 8px;">You can now proceed with your visa application</li>
            <li style="margin-bottom: 8px;">Select your travel date and payment method</li>
            <li style="margin-bottom: 8px;">Complete the booking process</li>
            <li>Upload required documents after payment</li>
          </ol>
        </div>
      `;
    }

    // Email template for success notification
    const emailSubject = "🎉 Login Verification Successful - GoVissa";
    const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #22c55e; font-size: 28px; margin: 0;">✅ Verification Successful!</h1>
          </div>
          
          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h2 style="color: #1e40af; margin-top: 0;">Hello ${name || 'User'}!</h2>
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              Congratulations! Your contact details have been successfully verified:
            </p>
            
            <div style="margin: 20px 0;">
              <div style="margin-bottom: 10px;">
                <span style="color: #22c55e; font-size: 18px; margin-right: 10px;">✓</span>
                <span style="color: #374151;"><strong>Phone:</strong> ${phone}</span>
              </div>
              <div>
                <span style="color: #22c55e; font-size: 18px; margin-right: 10px;">✓</span>
                <span style="color: #374151;"><strong>Email:</strong> ${email}</span>
              </div>
            </div>
          </div>

          ${paymentMessage}

          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #6b7280; font-size: 14px;">
              Thank you for choosing GoVissa for your visa services!
            </p>
            <p style="color: #6b7280; font-size: 12px; margin-top: 15px;">
              If you have any questions, please contact our support team.
            </p>
          </div>
        </div>
      </div>
    `;

    // Send email using existing transporter
    const mailOptions = {
      from: process.env.EMAIL_USER || 'shamshadalamansari2@gmail.com',
      to: email,
      subject: emailSubject,
      html: emailBody
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Success email sent successfully to:', email);

    res.status(200).json({
      success: true,
      message: "Success email sent successfully"
    });

  } catch (error) {
    console.error("❌ Error sending success email:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send success email",
      error: error.message
    });
  }
};
