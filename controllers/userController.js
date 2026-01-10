const userModel = require('../models/userModel.js');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail.js');

//SENDING OTP TO EMAIL
exports.sendOtpController = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Email is required",
      });
    }

    // generate 6 digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // save or update OTP for this email
    await userModel.findOneAndUpdate(
      { email },
      {
        otp,
        otpExpiry: Date.now() + 10 * 60 * 1000, // 10 minutes
      },
      { upsert: true }
    );

    // send OTP email
    await sendEmail(
      email,
      "Nitzzy Cosmos - Email Verification",
      `<h2>Your OTP is: ${otp}</h2><p>Valid for 10 minutes</p>`
    );

    return res.status(200).send({
      success: true,
      message: "OTP sent to email",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in sending OTP",
      error,
    });
  }
};

//VERIFY OTP & REGISTER USER
exports.verifyOtpAndRegisterController = async (req, res) => {
  try {
    const { username, email, password, otp } = req.body;

    if (!username || !email || !password || !otp) {
      return res.status(400).send({
        success: false,
        message: "All fields including OTP are required",
      });
    }

    const user = await userModel.findOne({ email });

    if (
      !user ||
      user.otp !== otp ||
      user.otpExpiry < Date.now()
    ) {
      return res.status(400).send({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    user.username = username;
    user.password = hashedPassword;
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    return res.status(201).send({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in verifying OTP & registering user",
      error,
    });
  }
};

//GET ALL USERS 
exports.getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({});
    return res.status(200).send({
      userCount: users.length,
      success: true,
      message: "All users fetched successfully",
      users,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in getting all users",
      error,
    });
  }
};
 //blocks unverified users
exports.loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Please fill all the fields",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email not found, please register",
      });
    }

    if (!user.isVerified) {
      return res.status(401).send({
        success: false,
        message: "Please verify your email first",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({
        success: false,
        message: "Invalid password",
      });
    }

    return res.status(200).send({
      success: true,
      message: "User logged in successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in user login",
      error,
    });
  }
};
