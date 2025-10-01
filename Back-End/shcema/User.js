const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    phoneNumber: { type: String, unique: true, required: true },
    email: { type: String, unique: true, sparse: true }, // Added email field
    refreshToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }, // adds createdAt (registration time) and updatedAt automatically
);

module.exports = mongoose.model("User", userSchema);
