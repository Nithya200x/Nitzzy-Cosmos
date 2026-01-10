const express = require('express');
const {
  getAllUsers,
  loginController,
  sendOtpController,
  verifyOtpAndRegisterController
} = require('../controllers/userController');

// router obj
const router = express.Router();

// get all users || GET
router.get('/all-users', getAllUsers);

// send OTP to email || POST
router.post('/send-otp', sendOtpController);

// verify OTP & register user || POST
router.post('/verify-otp', verifyOtpAndRegisterController);

// login user || POST
router.post('/login', loginController);

module.exports = router;
