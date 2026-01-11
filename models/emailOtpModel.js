const mongoose = require("mongoose");

const emailOtpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },

    otp: {
      type: String,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // auto del after expiry
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EmailOtp", emailOtpSchema);
