const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  phoneNumber: { type: String, unique: true, required: true },
  email: { type: String, unique: true, sparse: true }, // Added email field
  refreshToken: {
    type: String,
    default: null,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
