const User = require("../models/userModel");
const EmailOtp = require("../models/emailOtpModel");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const cloudinary = require("../config/cloudinary");

/* ===========================
   SEND OTP (REGISTER)
=========================== */
exports.sendOtpController = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email required" });
    }

    // ❌ Prevent duplicate users
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    // Remove old OTPs for this email
    await EmailOtp.deleteMany({ email });

    await EmailOtp.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 mins
    });

    await sendEmail(
      email,
      "Nitzzy Cosmos - Verify Email",
      `<h2>Your OTP: ${otp}</h2><p>Valid for 10 minutes</p>`
    );

    res.status(200).json({ success: true, message: "OTP sent" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "OTP send failed" });
  }
};

/* ===========================
   VERIFY OTP & REGISTER
=========================== */
exports.verifyOtpAndRegisterController = async (req, res) => {
  try {
    const { username, email, password, otp } = req.body;

    if (!username || !email || !password || !otp) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    const record = await EmailOtp.findOne({ email, otp });
    if (!record) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      isVerified: true,
    });

    // Clean OTP
    await EmailOtp.deleteMany({ email });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Registration failed" });
  }
};

/* ===========================
   LOGIN
=========================== */
exports.loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Login failed" });
  }
};

/* ===========================
   GET PROFILE
=========================== */
exports.getProfileController = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json({ success: true, user });
};

/* ===========================
   UPDATE AVATAR
=========================== */
exports.updateAvatarController = async (req, res) => {
  let avatarUrl = "";

  if (req.file) {
    const upload = await cloudinary.uploader.upload(req.file.path, {
      folder: "nitzzy-avatars",
    });
    avatarUrl = upload.secure_url;
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { avatar: avatarUrl },
    { new: true }
  );

  res.json({ success: true, avatar: user.avatar });
};
/* ===========================
   GET ALL USERS (ADMIN)
=========================== */
exports.getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json({ success: true, users });
};

/* ===========================
   SEND OTP (FORGOT PASSWORD)
=========================== */
exports.sendForgotPasswordOtpController = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const otp = crypto.randomInt(100000, 999999).toString();

  await EmailOtp.deleteMany({ email });
  await EmailOtp.create({
    email,
    otp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  await sendEmail(
    email,
    "Nitzzy Cosmos - Reset Password",
    `<h2>Your OTP: ${otp}</h2>`
  );

  res.json({ success: true, message: "OTP sent" });
};

/* ===========================
   VERIFY OTP & RESET PASSWORD
=========================== */
exports.verifyOtpAndResetPasswordController = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const record = await EmailOtp.findOne({ email, otp });
  if (!record) {
    return res.status(400).json({ success: false, message: "Invalid OTP" });
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  await User.findOneAndUpdate({ email }, { password: hashed });

  await EmailOtp.deleteMany({ email });

  res.json({ success: true, message: "Password reset successful" });
};

