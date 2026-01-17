const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Username (Google or manual)
    username: {
      type: String,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },

    // Email (unique identifier)
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      unique: true,
      index: true,
    },

    // Password (null for Google users)
    password: {
      type: String,
      minlength: 6,
      default: null,
    },

    // Google OAuth ID
    googleId: {
      type: String,
      default: null,
    },

    // Profile avatar
    avatar: {
      type: String,
      default: "",
    },

    // Verification status
    isVerified: {
      type: Boolean,
      default: true, // Google users verified by default
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
