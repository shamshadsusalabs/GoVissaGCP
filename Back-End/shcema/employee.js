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
    default: false
  },
  visaIds: {
    type: [String], // Array of visa ID strings
    default: []
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

module.exports = mongoose.model('Employee', employeeSchema);
