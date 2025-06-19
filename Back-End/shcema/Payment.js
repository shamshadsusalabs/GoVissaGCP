const mongoose = require("mongoose")

const paymentOrderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    paymentId: String,
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: {
      type: String,
      enum: ["created", "paid", "captured", "failed"],
      default: "created",
    },
    receipt: String,
    signature: String,
    visaId: String,
     country:String,
    email: String,
    
paymentId:String,
    phone: String,
      selectedDate:Date,
          travellers:Number, // Include travellers count
    webhookVerified: { type: Boolean, default: false },
    createdAt: Number,
    paidAt: Date,
  },
  { timestamps: true },
)

module.exports = mongoose.model("PaymentOrder", paymentOrderSchema)
