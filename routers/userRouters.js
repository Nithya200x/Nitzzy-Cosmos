const express = require("express");
const {
  getAllUsers,
  loginController,
  getProfileController,
  updateAvatarController,
  googleAuthController,
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

//GOOGLE AUTH (PUBLIC)
router.post("/google-auth", googleAuthController);

//EMAIL + PASSWORD LOGIN (PUBLIC)

router.post("/login", loginController);

//GET PROFILE (PROTECTED)
router.get("/profile", authMiddleware, getProfileController);

// GET ALL USERS (PROTECTED)
 router.get("/all-users", authMiddleware, getAllUsers);

//UPDATE AVATAR (PROTECTED)

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

module.exports = router;
