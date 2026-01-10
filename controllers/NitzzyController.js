const mongoose = require("mongoose");
const NitzzyModel = require("../models/NitzzyModel.js");
const User = require("../models/userModel.js");

// get all public blogs
const getAllNitzzyController = async (req, res) => {
  try {
    const nitzzyList = await NitzzyModel.find({ isDeleted: false })
      .populate("user", "username email");

    return res.status(200).send({
      success: true,
      message: nitzzyList.length
        ? "All blogs fetched successfully"
        : "No blogs found",
      NitzzyCount: nitzzyList.length,
      Nitzzy: nitzzyList,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in getting blogs",
    });
  }
};

//create blog
const createNitzzyController = async (req, res) => {
  try {
    const { title, description, image, user } = req.body;

    if (!title || !description || !image || !user) {
      return res.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findById(user);
    if (!existingUser) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    const newBlog = await NitzzyModel.create(
      [{ title, description, image, user }],
      { session }
    );

    if (Array.isArray(existingUser.nitzzy)) {
      existingUser.nitzzy.push(newBlog[0]._id);
      await existingUser.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(201).send({
      success: true,
      message: "Blog created successfully",
      Nitzzy: newBlog[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in creating blog",
    });
  }
};

// update BLOG
const updateNitzzyController = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await NitzzyModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).send({
        success: false,
        message: "Blog not found or deleted",
      });
    }

    res.status(200).send({
      success: true,
      message: "Blog updated successfully",
      Nitzzy: updated,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error updating blog",
    });
  }
};

// GET single BLOG BY ID
const getNitzzyByIdController = async (req, res) => {
  try {
    const blog = await NitzzyModel.findOne({
      _id: req.params.id,
      isDeleted: false,
    }).populate("user", "username email");

    if (!blog) {
      return res.status(404).send({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).send({
      success: true,
      Nitzzy: blog,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error fetching blog",
    });
  }
};

// soft DELETE BLOG
const deleteNitzzyController = async (req, res) => {
  try {
    const blog = await NitzzyModel.findById(req.params.id);
    if (!blog || blog.isDeleted) {
      return res.status(404).send({
        success: false,
        message: "Blog not found",
      });
    }

    blog.isDeleted = true;
    blog.deletedAt = new Date();
    blog.deletedBy = req.user.id;
    await blog.save();

    res.status(200).send({
      success: true,
      message: "Blog moved to trash",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error deleting blog",
    });
  }
};

//  GET DELETED BLOGS
const getDeletedBlogsController = async (req, res) => {
  try {
    const blogs = await NitzzyModel.find({
      isDeleted: true,
      deletedBy: req.user.id,
    });

    res.status(200).send({
      success: true,
      count: blogs.length,
      blogs,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching deleted blogs",
    });
  }
};
//  RESTORE BLOG FROM TRASH
const restoreBlogController = async (req, res) => {
  const blog = await NitzzyModel.findById(req.params.id);
  if (!blog || !blog.isDeleted) {
    return res.status(404).send({ success: false });
  }

  blog.isDeleted = false;
  blog.deletedAt = null;
  blog.deletedBy = null;
  await blog.save();

  res.send({ success: true, message: "Blog restored" });
};

//  PERMANENT DELETE
const permanentDeleteBlogController = async (req, res) => {
  await NitzzyModel.findByIdAndDelete(req.params.id);
  res.send({ success: true, message: "Blog permanently deleted" });
};

//  USER BLOGS
const getUserNitzzyController = async (req, res) => {
  try {
    const blogs = await NitzzyModel.find({
      user: req.params.id,
      isDeleted: false,
    }).populate("user", "username email");

    res.status(200).send({
      success: true,
      NitzzyCount: blogs.length,
      Nitzzy: blogs,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching user blogs",
    });
  }
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
