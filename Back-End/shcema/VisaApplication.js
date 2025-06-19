const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  url: { type: String, required: true },
  fileName: { type: String, required: true }
}, { _id: false });

// ✅ Define statusSchema
const statusSchema = new mongoose.Schema({
  label: { type: String, required: true }, // like "First Interview Cleared", "Docs Approved", etc.
  date: { type: Date, default: Date.now }
}, { _id: false });

const visaApplicationSchema = new mongoose.Schema({
  visaId: { type: String, required: true },
 
paymentId:String,
  travellers: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  country : { type: String, required: true },


  documents: {
    type: Map,
    of: new mongoose.Schema({
      front: fileSchema,
      back: fileSchema
    }, { _id: false }),
    required: false
  },

 passportData: [{
  travellerIndex: { type: Number },
  passportNumber: { type: String },
  surname: { type: String },
  givenName: { type: String },
  nationality: { type: String },
  dob: { type: String },
  placeOfBirth: { type: String },
  sex: { type: String },
  dateOfIssue: { type: String },
  dateOfExpiry: { type: String },
  placeOfIssue: { type: String },
  fileNumber: { type: String }
}]
,

  statusHistory: {
    type: [statusSchema],
    default: []
  }

}, { timestamps: true });

module.exports = mongoose.model('VisaApplication', visaApplicationSchema);
