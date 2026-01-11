const express = require('express');
const {
  getAllUsers,
  loginController,
  sendOtpController,
  verifyOtpAndRegisterController,
  sendForgotPasswordOtpController,
  verifyOtpAndResetPasswordController,
  getProfileController,
  updateAvatarController,
} = require('../controllers/userController');

const authMiddleware = require('../middleware/authMiddleware');
const upload = require("../middleware/upload");
// router obj
const router = express.Router();

// protected routes (JWT req) || GET
router.get('/all-users', authMiddleware, getAllUsers);

// user profile || GET
router.get("/profile", authMiddleware, getProfileController);

// update user avatar || PUT
router.put(
  "/update-avatar",
  authMiddleware,
  (req, res, next) => {
    upload.any()(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message || "Upload error",
        });
      }
      next();
    });
  },
  updateAvatarController
);


// send OTP to email || POST
router.post('/send-otp', sendOtpController);

// verify OTP & register user || POST
router.post('/verify-otp', verifyOtpAndRegisterController);

// login user || POST
router.post('/login', loginController);

// forgot password|| POST
router.post('/forgot-password/send-otp', sendForgotPasswordOtpController);
router.post('/forgot-password/reset', verifyOtpAndResetPasswordController);


module.exports = router;
