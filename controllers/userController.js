const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

//GOOGLE AUTH
exports.googleAuthController = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential missing",
      });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        username: name,
        email,
        googleId: sub,
        avatar: picture || "",
        isVerified: true,
        password: null, // IMPORTANT: Google-only user
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Google Auth Error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Google authentication failed",
    });
  }
};

/**
 * EMAIL + PASSWORD LOGIN
 */
exports.loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 🚫 Prevent Google-only users from password login
    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: "Please sign in using Google",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

//GET PROFILE (PROTECTED)
exports.getProfileController = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  return res.json({ success: true, user });
};

//UPDATE AVATAR (PROTECTED)
exports.updateAvatarController = async (req, res) => {
  try {
    const { avatar } = req.body;

    if (avatar === undefined) {
      return res.status(400).json({
        success: false,
        message: "Avatar path is required",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      avatar: user.avatar,
    });
  } catch (error) {
    console.error("Avatar update error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Avatar update failed",
    });
  }
};

//GET ALL USERS (PROTECTED)
exports.getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  return res.json({ success: true, users });
};
