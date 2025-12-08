const mongoose = require('mongoose');
const NitzzyModel = require('../models/NitzzyModel.js');
const User = require('../models/userModel.js');

// GET /api/v1/nitzzy/all-blogs
const getAllNitzzyController = async (req, res) => {
  try {
    const nitzzyList = await NitzzyModel.find({}).populate('user', 'username email');
    if (!nitzzyList || nitzzyList.length === 0) {
      return res.status(200).send({
        success: true,
        message: "No blogs found",
        NitzzyCount: 0,
        Nitzzy: [],
      });
    }
    return res.status(200).send({
      success: true,
      message: "All blogs fetched successfully",
      NitzzyCount: nitzzyList.length,
      Nitzzy: nitzzyList,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in getting blogs",
      error,
    });
  }
};

// POST /api/v1/nitzzy/create-blog
const createNitzzyController = async (req, res) => {
  try {
    const { title, description, image, user } = req.body;

    if (!title || !description || !image || !user) {
      return res.status(400).send({
        success: false,
        message: "Please provide title, description, image, and user ID",
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
    try {
      session.startTransaction();

      const newNitzzy = await NitzzyModel.create([{ title, description, image, user }], { session });
      // if user has an array to track posts, maintain it
      if (Array.isArray(existingUser.nitzzy)) {
        existingUser.nitzzy.push(newNitzzy[0]._id);
        await existingUser.save({ session });
      }

      await session.commitTransaction();
      return res.status(201).send({
        success: true,
        message: "Blog created successfully",
        Nitzzy: newNitzzy[0],
      });
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in creating blog",
      error,
    });
  }
};

// PUT /api/v1/nitzzy/update-blog/:id
const updateNitzzyController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image } = req.body;

    const updatedNitzzy = await NitzzyModel.findByIdAndUpdate(
      id,
      { title, description, image },
      { new: true }
    );

    if (!updatedNitzzy) {
      return res.status(404).send({
        success: false,
        message: "Blog not found for update",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Blog updated successfully",
      Nitzzy: updatedNitzzy,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in updating blog",
      error,
    });
  }
};

// GET /api/v1/nitzzy/single-blog/:id
const getNitzzyByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await NitzzyModel.findById(id).populate('user', 'username email');

    if (!blog) {
      return res.status(404).send({
        success: false,
        message: "Blog not found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Blog fetched successfully",
      Nitzzy: blog,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in getting blog",
      error,
    });
  }
};

// DELETE /api/v1/nitzzy/delete-blog/:id
const deleteNitzzyController = async (req, res) => {
  try {
    const { id } = req.params;
    const nitzzy = await NitzzyModel.findById(id).populate('user');
    if (!nitzzy) {
      return res.status(404).send({
        success: false,
        message: "Blog not found for delete",
      });
    }

    if (nitzzy.user && Array.isArray(nitzzy.user.nitzzy)) {
      nitzzy.user.nitzzy.pull(nitzzy._id);
      await nitzzy.user.save();
    }

    await NitzzyModel.findByIdAndDelete(id);
    return res.status(200).send({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in deleting blog",
      error,
    });
  }
};

// GET /api/v1/nitzzy/user-blog/:id
const getUserNitzzyController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid user id",
      });
    }

    const existingUser = await User.findById(id).select('_id');
    if (!existingUser) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    const Nitzzy = await NitzzyModel.find({ user: id }).populate('user', 'username email');

    return res.status(200).send({
      success: true,
      NitzzyCount: Nitzzy.length,
      message: Nitzzy.length > 0
        ? "User blogs fetched successfully"
        : "No blogs found for this user",
      Nitzzy,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in getting user blogs",
      error,
    });
  }
};

module.exports = {
  getAllNitzzyController,
  createNitzzyController,
  updateNitzzyController,
  getNitzzyByIdController,
  deleteNitzzyController,
  getUserNitzzyController,
};
