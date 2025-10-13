const mongoose = require("mongoose")

const VisaTypeSchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    category: String,
    code: String,
    entries: String,
    biometricRequired: Boolean,
    interviewRequired: Boolean,
    processingMethod: String,
    processingTime: String,
    stayDuration: String,
    validity: String,
    // Adult pricing (12+ years)
    visaFee: Number,
    serviceFee: Number,
    // Children pricing (6-12 years)
    childVisaFee: { type: Number, default: 0 },
    childServiceFee: { type: Number, default: 0 },
    // Young children pricing (0-6 years)
    youngChildVisaFee: { type: Number, default: 0 },
    youngChildServiceFee: { type: Number, default: 0 },
    currency: String,
    expectedVisaDays: {
      type: Number,
      min: 1,
      max: 365
    },
    notes: String,
  },
  { _id: false },
)

const DocumentSchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    description: String,
    format: String,
    sample: [String], // Array of image URLs for sample documents
    isMandatory: Boolean,
  },
  { _id: false },
)

const RejectionReasonSchema = new mongoose.Schema(
  {
    id: String,
    reason: String,
    description: String,
    frequency: String,
  },
  { _id: false },
)

const CountryDetailsSchema = new mongoose.Schema(
  {
    code: String,
    name: String,
    embassyLocation: String,
   applicationTips:String
  },
  { _id: false },
)

const VisaSubmissionSchema = new mongoose.Schema(
  {
    continent: { type: String, required: false },
    countryDetails: { type: CountryDetailsSchema, required: false },
    visaTypes: { type: [VisaTypeSchema], required: false },
    documents: { type: [DocumentSchema], required: false },
    eligibility: { type: String, required: false },
    images: { type: [String], required: false },
    rejectionReasons: { type: [RejectionReasonSchema], required: false },
    // New fields for step-by-step saving
    isComplete: { type: Boolean, default: false },
    currentStep: { type: Number, default: 1 },
    lastSavedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

module.exports = mongoose.model("VisaConfig", VisaSubmissionSchema)
