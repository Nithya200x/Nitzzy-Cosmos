const mongoose = require("mongoose");

const NitzzySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
    },
    description: {
      type: String,
      required: [true, "description is required"],
    },
    image: {
      type: String,
      default: "",
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },

    //soft del fields
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    deletedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Nitzzy", NitzzySchema);
