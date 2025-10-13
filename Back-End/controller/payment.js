const Razorpay = require("razorpay")
const crypto = require("crypto")
const PaymentOrder = require("../shcema/Payment")
require("dotenv").config()

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

// Create Order
exports.createOrder = async (req, res) => {
  const { amount, country, visaId, email, phone, selectedDate, travellers, travellerDetails, paymentType = "online", paymentMethod = "razorpay", payLaterDetails = null, cashDetails = null, promoCode = null, promoCodeId = null, discountAmount = 0, originalAmount = null } = req.body
  
  // ✅ Determine total travellers (prefer travellerDetails.total when available)
  const computedTravellers = (travellerDetails && typeof travellerDetails.total === "number")
    ? travellerDetails.total
    : travellers

  // ✅ Console log for debugging
  console.log("🎯 Received payment data:")
  console.log("- travellers (raw):", travellers)
  console.log("- travellerDetails:", travellerDetails)
  console.log("- travellers (computed):", computedTravellers)

  const options = {
    amount: amount * 100, // Convert rupees to paise for Razorpay
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
    notes: {
      visaId,
      country,
      email,
      phone,
      selectedDate,
      travellers: computedTravellers,
      paymentType,
      paymentMethod
    },
  }

  try {
    const order = await razorpay.orders.create(options)

    const newOrder = new PaymentOrder({
      orderId: order.id,
      amount: amount.toString(),
      currency: order.currency,
      status: paymentType === "online" ? "created" : "pending_approval",
      receipt: order.receipt,
      createdAt: order.created_at,
      visaId,
      country,
      email,
      phone,
      selectedDate,
      travellers: computedTravellers,
      travellerDetails, // ✅ NEW: Age group breakdown
      paymentType,
      paymentMethod,
      payLaterDetails,
      cashDetails,
      promoCode,
      promoCodeId,
      discountAmount,
      originalAmount
    })
    
    // ✅ Console log saved data
    console.log("💾 Saving payment order with travellerDetails:", newOrder.travellerDetails)

    await newOrder.save()
    res.status(200).json(order)
  } catch (error) {
    console.error("Razorpay order error:", error)
    res.status(500).json({ error: "Order creation failed" })
  }
}

// ✅ NEW: Create Cash Payment Order
exports.createCashOrder = async (req, res) => {
  try {
    const { amount, country, visaId, email, phone, selectedDate, travellers, travellerDetails, cashDetails, promoCode = null, promoCodeId = null, discountAmount = 0, originalAmount = null } = req.body
    const computedTravellers = (travellerDetails && typeof travellerDetails.total === "number")
      ? travellerDetails.total
      : travellers
    
    // ✅ Console log for debugging
    console.log("🎯 Cash payment - travellerDetails:", travellerDetails)
    console.log("🎯 Cash payment - travellers (computed):", computedTravellers)

    const newOrder = new PaymentOrder({
      orderId: `cash_${Date.now()}`,
      amount: amount.toString(),
      currency: "INR",
      status: "pending_approval",
      receipt: `cash_receipt_${Date.now()}`,
      createdAt: Date.now(),
      visaId,
      country,
      email,
      phone,
      selectedDate,
      travellers: computedTravellers,
      travellerDetails, // ✅ NEW: Age group breakdown
      paymentType: "cash",
      paymentMethod: "cash",
      cashDetails,
      promoCode,
      promoCodeId,
      discountAmount,
      originalAmount
    })

    await newOrder.save()
    
    res.status(200).json({
      success: true,
      message: "Cash payment order created successfully",
      order: newOrder
    })
  } catch (error) {
    console.error("Cash order error:", error)
    res.status(500).json({ error: "Cash order creation failed" })
  }
}

// ✅ NEW: Create Pay Later Order
exports.createPayLaterOrder = async (req, res) => {
  try {
    const { amount, country, visaId, email, phone, selectedDate, travellers, travellerDetails, payLaterDetails, promoCode = null, promoCodeId = null, discountAmount = 0, originalAmount = null } = req.body
    const computedTravellers = (travellerDetails && typeof travellerDetails.total === "number")
      ? travellerDetails.total
      : travellers
    
    // ✅ Console log for debugging
    console.log("🎯 Pay Later - travellerDetails:", travellerDetails)
    console.log("🎯 Pay Later - travellers (computed):", computedTravellers)

    const newOrder = new PaymentOrder({
      orderId: `paylater_${Date.now()}`,
      amount: amount.toString(),
      currency: "INR",
      status: "pending_approval",
      receipt: `paylater_receipt_${Date.now()}`,
      createdAt: Date.now(),
      visaId,
      country,
      email,
      phone,
      selectedDate,
      travellers: computedTravellers,
      travellerDetails, // ✅ NEW: Age group breakdown
      paymentType: "paylater",
      paymentMethod: "paylater",
      payLaterDetails,
      promoCode,
      promoCodeId,
      discountAmount,
      originalAmount
    })

    await newOrder.save()
    
    res.status(200).json({
      success: true,
      message: "Pay Later order created successfully",
      order: newOrder
    })
  } catch (error) {
    console.error("Pay Later order error:", error)
    res.status(500).json({ error: "Pay Later order creation failed" })
  }
}

// ✅ NEW: Approve Payment (Admin function)
exports.approvePayment = async (req, res) => {
  try {
    const { orderId, adminId, notes, paymentType } = req.body

    const order = await PaymentOrder.findOne({ orderId })
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" })
    }

    // Update based on payment type
    if (paymentType === "cash") {
      order.status = "paid"
      order.cashDetails = {
        ...order.cashDetails,
        collectedBy: adminId,
        collectedAt: new Date(),
        receiptNumber: `CASH_${Date.now()}`,
        notes: notes
      }
    } else if (paymentType === "paylater") {
      order.status = "paid"
      order.payLaterDetails = {
        ...order.payLaterDetails,
        approvedBy: adminId,
        approvedAt: new Date(),
        isApproved: true
      }
    }

    order.adminApproval = {
      approvedBy: adminId,
      approvedAt: new Date(),
      notes: notes,
      isApproved: true
    }

    order.paidAt = new Date()
    order.isPaymentVerified = true
    order.verificationDate = new Date()
    order.verifiedBy = adminId

    await order.save()

    res.status(200).json({
      success: true,
      message: "Payment approved successfully",
      order: order
    })
  } catch (error) {
    console.error("Payment approval error:", error)
    res.status(500).json({ success: false, message: "Payment approval failed" })
  }
}

// ✅ NEW: Get Pending Approvals
exports.getPendingApprovals = async (req, res) => {
  try {
    const pendingOrders = await PaymentOrder.find({
      status: "pending_approval"
    }).sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      data: pendingOrders
    })
  } catch (error) {
    console.error("Get pending approvals error:", error)
    res.status(500).json({ success: false, message: "Failed to fetch pending approvals" })
  }
}

// Verify Payment - CRITICAL for security
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

    // Create signature for verification
    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex")

    const isAuthentic = expectedSignature === razorpay_signature

    if (isAuthentic) {
      // Update payment status in database
      await PaymentOrder.findOneAndUpdate(
        { orderId: razorpay_order_id },
        {
          status: "paid",
          paymentId: razorpay_payment_id,
          signature: razorpay_signature,
          paidAt: new Date(),
          isPaymentVerified: true,
          verificationDate: new Date()
        },
      )

      res.json({
        success: true,
        message: "Payment verified successfully",
      })
    } else {
      res.status(400).json({
        success: false,
        message: "Payment verification failed",
      })
    }
  } catch (error) {
    console.error("Payment verification error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

// Webhook for additional security
exports.webhook = async (req, res) => {
  try {
    const webhookSignature = req.headers["x-razorpay-signature"]
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET

    const body = JSON.stringify(req.body)
    const expectedSignature = crypto.createHmac("sha256", webhookSecret).update(body).digest("hex")

    if (webhookSignature === expectedSignature) {
      const event = req.body.event
      const paymentEntity = req.body.payload.payment.entity

      if (event === "payment.captured") {
        await PaymentOrder.findOneAndUpdate(
          { orderId: paymentEntity.order_id },
          {
            status: "captured",
            webhookVerified: true,
          },
        )
      }

      res.status(200).json({ status: "ok" })
    } else {
      res.status(400).json({ error: "Invalid signature" })
    }
  } catch (error) {
    console.error("Webhook error:", error)
    res.status(500).json({ error: "Webhook processing failed" })
  }
}


// controllers/paymentController.js
exports.getPaymentsByPhone = async (req, res) => {
  const { phone } = req.params;

  try {
    const payments = await PaymentOrder.find({ phone });

    if (payments.length === 0) {
      return res.status(404).json({ message: "No payments found for this phone number" });
    }

    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching payments by phone:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ NEW: Get all payment orders for admin panel
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await PaymentOrder.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: payments,
      count: payments.length
    });
  } catch (error) {
    console.error("Error fetching all payments:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
};

