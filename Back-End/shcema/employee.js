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
    type: [String], // Array of visa ID strings (deprecated - keeping for backward compatibility)
    default: []
  },
  applicationIds: {
    type: [String], // Array of individual application ID strings
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

// Pre-save hook to update points based on applicationIds (or visaIds for backward compatibility)
employeeSchema.pre('save', function (next) {
  // Use applicationIds if available, otherwise fall back to visaIds for backward compatibility
  const assignmentCount = (this.applicationIds && this.applicationIds.length) ? this.applicationIds.length : 
                         (this.visaIds && this.visaIds.length) ? this.visaIds.length : 0;
  this.points = assignmentCount * 50;
  next();
});

module.exports = mongoose.model('Employee', employeeSchema);
