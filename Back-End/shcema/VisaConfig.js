const mongoose = require('mongoose');

const VisaTypeSchema = new mongoose.Schema({
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
  visaFee: Number,
  currency: String,
  serviceFee: Number,
  notes: String
}, { _id: false });

const DocumentSchema = new mongoose.Schema({
  id: String,
  name: String,
  description: String,
  format: String,
  example: String,
  isMandatory: Boolean
}, { _id: false });

const RejectionReasonSchema = new mongoose.Schema({
  id: String,
  reason: String,
  description: String,
  frequency: String
}, { _id: false });

const CountryDetailsSchema = new mongoose.Schema({
  code: String,
  name: String,
  embassyLocation: String,
  generalRequirements: String
}, { _id: false });

const VisaSubmissionSchema = new mongoose.Schema({
  continent: { type: String, required: true },
  countryDetails: { type: CountryDetailsSchema, required: true },
  visaTypes: { type: [VisaTypeSchema], required: true },
  documents: { type: [DocumentSchema], required: true },
  eligibility: { type: String, required: true },
  images: { type: [String], required: false }, // Array of image URLs
  rejectionReasons: { type: [RejectionReasonSchema], required: false }
}, { timestamps: true });

module.exports = mongoose.model('VisaConfig', VisaSubmissionSchema);
