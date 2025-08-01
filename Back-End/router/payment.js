const express = require("express")
const router = express.Router()
const { 
  createOrder, 
  verifyPayment, 
  webhook, 
  getPaymentsByPhone,
  createCashOrder,
  createPayLaterOrder,
  approvePayment,
  getPendingApprovals
} = require("../controller/payment")
const { verifyAccessToken } = require('../middileware/authMiddleware');

// ✅ Existing routes
router.post("/create-order", createOrder)
router.post("/verify-payment", verifyPayment)
router.post("/webhook", webhook)
router.get("/by-phone/:phone", getPaymentsByPhone);

// ✅ NEW: Cash and Pay Later routes
router.post("/create-cash-order", createCashOrder)
router.post("/create-paylater-order", createPayLaterOrder)
router.post("/approve-payment", verifyAccessToken, approvePayment)
router.get("/pending-approvals", verifyAccessToken, getPendingApprovals)

module.exports = router
