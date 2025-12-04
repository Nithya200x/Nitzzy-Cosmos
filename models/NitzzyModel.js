const mongoose = require('mongoose');

const NitzzySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true,'title is required' ],
    },
    description: {
      type: String,
      required: [true,'description is required' ],
    },
    image : {
      type: String,
      required: [true,'image is required' ]
    },
    user:{
      type : mongoose.Types.ObjectId,
      ref: 'user',
      required: [true,"userId is required" ]
    }
  },
  { timestamps: true }
);

const NitzzyModel = mongoose.model('Nitzzy', NitzzySchema);

module.exports = NitzzyModel;   