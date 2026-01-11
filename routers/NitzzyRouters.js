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

//public routes

router.get("/all-blogs", getAllNitzzyController);

router.get("/single-blog/:id", getNitzzyByIdController);

// protected routes

router.post("/create-blog", authMiddleware, createNitzzyController);

//owner only
router.put("/update-blog/:id", authMiddleware, updateNitzzyController);

// soft del
router.delete("/delete-blog/:id", authMiddleware, deleteNitzzyController);

router.get("/user-blogs", authMiddleware, getUserNitzzyController);

router.get("/trash", authMiddleware, getDeletedBlogsController);

router.put("/restore/:id", authMiddleware, restoreBlogController);
//hard del
router.delete(
  "/permanent-delete/:id",
  authMiddleware,
  permanentDeleteBlogController
);

module.exports = router;
