const express = require("express");
const NitzzyCtrl = require("../controllers/NitzzyController.js");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// PUBLIC ROUTES 
//
// GET || all blogs
router.get("/all-blogs", NitzzyCtrl.getAllNitzzyController);

// GET || single blog
router.get("/single-blog/:id", NitzzyCtrl.getNitzzyByIdController);

// GET || user blogs 
router.get("/user-blog/:id", NitzzyCtrl.getUserNitzzyController);

// PROTECTED ROUTES (JWT REQUIRED) 
//
// POST || create blog
router.post(
  "/create-blog",
  authMiddleware,
  NitzzyCtrl.createNitzzyController
);

// PUT || update blog
router.put(
  "/update-blog/:id",
  authMiddleware,
  NitzzyCtrl.updateNitzzyController
);

// DELETE || soft delete blog (move to trash)
router.delete(
  "/delete-blog/:id",
  authMiddleware,
  NitzzyCtrl.deleteNitzzyController
);

// TRASH MANAGEMENT 
//
// GET || trashed blogs (user profile)
router.get(
  "/trash",
  authMiddleware,
  NitzzyCtrl.getDeletedBlogsController
);

// PUT || restore blog from trash
router.put(
  "/restore/:id",
  authMiddleware,
  NitzzyCtrl.restoreBlogController
);

// DELETE || permanent delete blog
router.delete(
  "/permanent-delete/:id",
  authMiddleware,
  NitzzyCtrl.permanentDeleteBlogController
);

module.exports = router;
