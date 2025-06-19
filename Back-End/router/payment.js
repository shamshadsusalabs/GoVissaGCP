const express = require("express")
const router = express.Router()
const { createOrder, verifyPayment, webhook,getPaymentsByPhone } = require("../controller/payment")
const { verifyAccessToken } = require('../middileware/authMiddleware');
router.post("/create-order", createOrder)
router.post("/verify-payment", verifyPayment)
router.post("/webhook", webhook)
router.get("/by-phone/:phone",verifyAccessToken, getPaymentsByPhone);
module.exports = router
