const mongoose = require('mongoose');
const NitzzyModel = require('../models/NitzzyModel.js');
const User = require('../models/userModel.js');

// get all blogs
exports.getAllNitzzyController = async (req, res) => {
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
      NitzzyCount: nitzzyList.length,
      message: "All blogs fetched successfully",
      Nitzzy: nitzzyList,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in getting all blogs",
      error,
    });
  }
};

// create blog
exports.createNitzzyController = async (req, res) => {
  try {
    const { title, description, image, user } = req.body;

    // validation
    if (!title || !description || !image || !user) {
      return res.status(400).send({
        success: false,
        message: "Please provide title, description, image, and user ID",
      });
    }

    // check if user exists
    const existingUser = await User.findById(user);
    if (!existingUser) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // create blog
    const newNitzzy = new NitzzyModel({ title, description, image, user });
    const session = await mongoose.startSession();
    session.startTransaction();

    await newNitzzy.save({ session });

    // if you have a 'blogs' or 'nitzzy' array in userModel, push here
    // otherwise, skip this part
    existingUser.nitzzy.push(newNitzzy);
    await existingUser.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).send({
      success: true,
      message: "Blog created successfully",
      newNitzzy,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in creating blog",
      error,
    });
  }
};

// update blog
exports.updateNitzzyController = async (req, res) => {
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

// get blog by id
exports.getNitzzyByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const Nitzzy = await NitzzyModel.findById(id).populate('user', 'username email');
    if (!Nitzzy) {
      return res.status(404).send({
        success: false,
        message: "Blog not found",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Blog fetched successfully",
      Nitzzy,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in getting blog by id",
      error,
    });
  }
};

// delete blog
exports.deleteNitzzyController = async (req, res) => {
  try {
    const nitzzy = await NitzzyModel.findById(req.params.id).populate('user');
    await nitzzy.user.nitzzy.pull(nitzzy);
    await nitzzy.user.save();


    const { id } = req.params;
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

// get blogs by user
exports.getUserNitzzyController = async (req, res) => {
  try {
    const { id } = req.params;

    // validate user id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid user id",
      });
    }

    // check if user exists
    const existingUser = await User.findById(id).select("_id");
    if (!existingUser) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // find all blogs by this user
    const Nitzzy = await NitzzyModel.find({ user: id }).sort({ createdAt: -1 });

    // always return success, even if no blogs
    return res.status(200).send({
      success: true,
      NitzzyCount: Nitzzy.length,
      message:
        Nitzzy.length > 0
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
