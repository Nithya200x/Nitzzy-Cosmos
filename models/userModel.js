const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true
  }, 
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true
  },
  password: {
    type: String,
    required: [true, "Password is required"]
  },
  // Verification Part
  isVerified: {
    type: Boolean,
    default: false
  },
  otp: {
    type: String
  },
  otpExpiry: {
    type: Date
  },
  
  nitzzy: [{
    type: mongoose.Types.ObjectId,
    ref: 'Nitzzy'
  }]
}, {timestamps: true});

const User = mongoose.model('User', userSchema);
module.exports = User;
