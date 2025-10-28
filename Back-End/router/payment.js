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
  getPendingApprovals,
  getAllPayments,
  getCustomerNameByPaymentId, // ✅ NEW: Import getCustomerNameByPaymentId
  getPaymentOrderById, // ✅ NEW: Import getPaymentOrderById
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
router.get("/getAll", getAllPayments) // ✅ NEW: Get all payments route

// ✅ NEW: Get customer name by payment ID
router.get("/customer-name/:paymentId", getCustomerNameByPaymentId)

// ✅ NEW: Get payment order by Mongo ID
router.get("/order/:id", getPaymentOrderById)

module.exports = router