const express = require("express");
const {
  getAllNitzzyController,
  createNitzzyController,
  updateNitzzyController,
  getNitzzyByIdController,
  deleteNitzzyController,
  getDeletedBlogsController,
  restoreBlogController,
  permanentDeleteBlogController,
  getUserNitzzyController,
} = require("../controllers/NitzzyController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/* ========= PUBLIC ROUTES ========= */

// all blogs
router.get("/all-blogs", getAllNitzzyController);

// single blog (PUBLIC)
router.get("/single-blog/:id", getNitzzyByIdController);

/* ========= PROTECTED ROUTES ========= */

// create blog
router.post("/create-blog", authMiddleware, createNitzzyController);

// update blog (owner only)
router.put("/update-blog/:id", authMiddleware, updateNitzzyController);

// delete blog (soft delete)
router.delete("/delete-blog/:id", authMiddleware, deleteNitzzyController);

// logged-in user's blogs
router.get("/user-blogs", authMiddleware, getUserNitzzyController);

// trash
router.get("/trash", authMiddleware, getDeletedBlogsController);

// restore
router.put("/restore/:id", authMiddleware, restoreBlogController);

// permanent delete
router.delete(
  "/permanent-delete/:id",
  authMiddleware,
  permanentDeleteBlogController
);

module.exports = router;
