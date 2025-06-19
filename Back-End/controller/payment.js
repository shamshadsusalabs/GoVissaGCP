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
  const { amount, country, visaId, email, phone,selectedDate,  travellers } = req.body

  const options = {
    amount: amount,
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
    notes: {
      visaId,
       country,
      email,
      phone,
      selectedDate,
        travellers
    },
  }

  try {
    const order = await razorpay.orders.create(options)

    const newOrder = new PaymentOrder({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      status: "created",
      receipt: order.receipt,
      createdAt: order.created_at,
      visaId,
       country,
      email,
      phone,
      selectedDate,
        travellers
    })

    await newOrder.save()
    res.status(200).json(order)
  } catch (error) {
    console.error("Razorpay order error:", error)
    res.status(500).json({ error: "Order creation failed" })
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
