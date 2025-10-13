const mongoose = require("mongoose")

const paymentOrderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    paymentId: String,
    amount: { type: String, required: true },
    currency: { type: String, default: "INR" },
    status: {
      type: String,
      enum: ["created", "paid", "captured", "failed", "offline", "cash", "paylater", "pending_approval"],
      default: "created",
    },
    receipt: String,
    signature: String,
    visaId: String,
    country: String,
    email: String,
    phone: String,
    selectedDate: Date,
    travellers: Number,
    // ✅ NEW: Age group breakdown
    travellerDetails: {
      adults: { type: Number, default: 0 },
      children: { type: Number, default: 0 },
      infants: { type: Number, default: 0 },
      total: { type: Number, default: 0 }
    },
    webhookVerified: { type: Boolean, default: false },
    createdAt: Number,
    paidAt: Date,
    
    // ✅ NEW: Payment type and method
    paymentType: {
      type: String,
      enum: ["online", "offline", "cash", "paylater"],
      default: "online"
    },
    paymentMethod: {
      type: String,
      enum: ["razorpay", "cash", "paylater", "whatsapp"],
      default: "razorpay"
    },
    
    // ✅ NEW: Pay Later specific fields
    payLaterDetails: {
      corporateName: String,
      corporateEmail: String,
      corporatePhone: String,
      creditLimit: Number,
      approvedBy: String, // Admin ID who approved
      approvedAt: Date,
      dueDate: Date,
      isApproved: { type: Boolean, default: false }
    },
    
    // ✅ NEW: Cash payment specific fields
    cashDetails: {
      collectedBy: String, // Employee ID who collected
      collectedAt: Date,
      receiptNumber: String,
      notes: String
    },
    
    // ✅ NEW: Admin approval fields
    adminApproval: {
      approvedBy: String, // Admin ID
      approvedAt: Date,
      notes: String,
      isApproved: { type: Boolean, default: false }
    },
    
    // ✅ NEW: Additional tracking fields
    processingMode: {
      type: String,
      enum: ["online", "offline"],
      default: "online"
    },
    employeeId: String, // Employee handling the case
    adminNotes: String,
    customerNotes: String,
    
    // ✅ NEW: Payment verification
    isPaymentVerified: { type: Boolean, default: false },
    verificationDate: Date,
    verifiedBy: String,
    
    // ✅ NEW: Promo code fields
    promoCode: String, // Promo code used
    promoCodeId: String, // Promo code document ID
    discountAmount: { type: Number, default: 0 }, // Discount amount applied
    originalAmount: String, // Original amount before discount
  },
  { timestamps: true },
)

module.exports = mongoose.model("PaymentOrder", paymentOrderSchema)
