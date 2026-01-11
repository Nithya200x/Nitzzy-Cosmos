const mongoose = require("mongoose");
const NitzzyModel = require("../models/NitzzyModel.js");

/* =========================================
   GET ALL PUBLIC BLOGS
========================================= */
const getAllNitzzyController = async (req, res) => {
  try {
    const blogs = await NitzzyModel.find({ isDeleted: false })
      .populate("user", "username email")
      .sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      NitzzyCount: blogs.length,
      Nitzzy: blogs,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error fetching blogs",
    });
  }
};

/* =========================================
   CREATE BLOG (AUTH REQUIRED)
========================================= */
const createNitzzyController = async (req, res) => {
  try {
    const { title, description, image } = req.body;

    if (!title || !description) {
      return res.status(400).send({
        success: false,
        message: "Title and description are required",
      });
    }

    const blog = await NitzzyModel.create({
      title,
      description,
      image: image || "",
      user: req.user.id,
    });

    return res.status(201).send({
      success: true,
      message: "Blog created successfully",
      Nitzzy: blog,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error creating blog",
    });
  }
};

/* =========================================
   UPDATE BLOG (OWNER ONLY)
========================================= */
const updateNitzzyController = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await NitzzyModel.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!blog) {
      return res.status(404).send({
        success: false,
        message: "Blog not found",
      });
    }

    // ownership check
    if (blog.user.toString() !== req.user.id) {
      return res.status(403).send({
        success: false,
        message: "You are not allowed to edit this blog",
      });
    }

    const updatedBlog = await NitzzyModel.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    return res.status(200).send({
      success: true,
      message: "Blog updated successfully",
      Nitzzy: updatedBlog,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error updating blog",
    });
  }
};

/* =========================================
   GET SINGLE BLOG (PUBLIC)
========================================= */
// GET SINGLE BLOG (PUBLIC)
const getNitzzyByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await NitzzyModel.findOne({
      _id: id,
      isDeleted: false,
    }).populate("user", "username email");

    if (!blog) {
      return res.status(404).send({
        success: false,
        message: "Blog not found",
      });
    }

    return res.status(200).send({
      success: true,
      Nitzzy: blog,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error fetching blog",
    });
  }
};


/* =========================================
   SOFT DELETE BLOG (OWNER ONLY)
========================================= */
const deleteNitzzyController = async (req, res) => {
  try {
    const blog = await NitzzyModel.findById(req.params.id);

    if (!blog || blog.isDeleted) {
      return res.status(404).send({
        success: false,
        message: "Blog not found",
      });
    }

    if (blog.user.toString() !== req.user.id) {
      return res.status(403).send({
        success: false,
        message: "You are not allowed to delete this blog",
      });
    }

    blog.isDeleted = true;
    blog.deletedAt = new Date();
    blog.deletedBy = req.user.id;
    await blog.save();

    return res.status(200).send({
      success: true,
      message: "Blog moved to trash",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error deleting blog",
    });
  }
};

/* =========================================
   GET LOGGED-IN USER BLOGS
========================================= */
const getUserNitzzyController = async (req, res) => {
  try {
    const blogs = await NitzzyModel.find({
      user: req.user.id,          // 🔑 FIX
      isDeleted: false,
    })
      .populate("user", "username email")
      .sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      NitzzyCount: blogs.length,
      Nitzzy: blogs,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error fetching user blogs",
    });
  }
};

/* =========================================
   GET DELETED BLOGS (USER)
========================================= */
const getDeletedBlogsController = async (req, res) => {
  try {
    const blogs = await NitzzyModel.find({
      isDeleted: true,
      deletedBy: req.user.id,
    });

    return res.status(200).send({
      success: true,
      count: blogs.length,
      blogs,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error fetching deleted blogs",
    });
  }
};

/* =========================================
   RESTORE BLOG
========================================= */
const restoreBlogController = async (req, res) => {
  const blog = await NitzzyModel.findById(req.params.id);

  if (!blog || !blog.isDeleted) {
    return res.status(404).send({ success: false });
  }

  if (blog.deletedBy.toString() !== req.user.id) {
    return res.status(403).send({ success: false });
  }

  blog.isDeleted = false;
  blog.deletedAt = null;
  blog.deletedBy = null;
  await blog.save();

  res.send({ success: true, message: "Blog restored" });
};

/* =========================================
   PERMANENT DELETE
========================================= */
const permanentDeleteBlogController = async (req, res) => {
  const blog = await NitzzyModel.findById(req.params.id);

  if (!blog) {
    return res.status(404).send({ success: false });
  }

  if (blog.user.toString() !== req.user.id) {
    return res.status(403).send({ success: false });
  }

  await blog.deleteOne();
  res.send({ success: true, message: "Blog permanently deleted" });
};

module.exports = {
  getAllNitzzyController,
  createNitzzyController,
  updateNitzzyController,
  getNitzzyByIdController,
  deleteNitzzyController,
  getDeletedBlogsController,
  restoreBlogController,
  permanentDeleteBlogController,
  getUserNitzzyController,
};
