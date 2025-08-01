const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: true
  },
  visaIds: {
    type: [String], // Array of visa ID strings
    default: []
  },
  employeeId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  points: {
    type: Number,
    default: 0
  },
  refreshToken: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Pre-save hook to update points based on visaIds
employeeSchema.pre('save', function (next) {
  this.points = (this.visaIds && this.visaIds.length) ? this.visaIds.length * 50 : 0;
  next();
});

module.exports = mongoose.model('Employee', employeeSchema);
