const mongoose = require("mongoose")

const fileSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    fileName: { type: String, required: true },
  },
  { _id: false },
)

const statusSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    date: { type: Date, default: Date.now },
    rejectionReason: { type: String, required: false }, // ✅ Add rejection reason field
  },
  { _id: false },
)

const visaApplicationSchema = new mongoose.Schema(
  {
    visaId: { type: String, required: true },
    paymentId: String,
    travellers: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    country: { type: String, required: true },

    // ✅ New field: processing mode
    processingMode: {
      type: String,
      enum: ["online", "offline"],
      required: false,
    },

    // ✅ New field: employee ID
    employeeId: {
      type: String,
      required: false,
     
      trim: true,
    },

    documents: {
      type: Map,
      of: new mongoose.Schema(
        {
          front: fileSchema,
          back: fileSchema,
        },
        { _id: false },
      ),
      required: false,
    },

    passportData: [
      {
        travellerIndex: { type: Number },
        passport_number: { type: String },
        surname: { type: String },
        given_names: { type: String },
        nationality: { type: String },
        date_of_birth: { type: String },
        place_of_birth: { type: String },
        sex: { type: String },
        date_of_issue: { type: String },
        date_of_expiry: { type: String },
        place_of_issue: { type: String },
        file_number: { type: String },
        father_name: { type: String },
        mother_name: { type: String },
        spouse_name: { type: String },
        address: { type: String },
      },
    ],

    statusHistory: {
      type: [statusSchema],
      default: [],
    },

    // ✅ Promo code fields
    promoCode: String, // Promo code used
    promoCodeId: String, // Promo code ID for reference
    discountAmount: { type: Number, default: 0 }, // Discount amount applied
    originalAmount: String, // Original amount before discount
    paymentOrderId: String, // Payment Order ID reference
  },
  { timestamps: true },
)

module.exports = mongoose.model("VisaApplication", visaApplicationSchema)
