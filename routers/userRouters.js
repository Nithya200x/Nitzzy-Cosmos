const express = require('express');
const {
  getAllUsers,
  loginController,
  sendOtpController,
  verifyOtpAndRegisterController
} = require('../controllers/userController');

const authMiddleware = require('../middleware/authMiddleware');

// router obj
const router = express.Router();

// PROTECTED ROUTE (JWT REQUIRED)
router.get('/all-users', authMiddleware, getAllUsers);

// send OTP to email || POST
router.post('/send-otp', sendOtpController);

// verify OTP & register user || POST
router.post('/verify-otp', verifyOtpAndRegisterController);

// login user || POST
router.post('/login', loginController);

module.exports = router;
