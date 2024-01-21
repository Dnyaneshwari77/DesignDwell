const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  index: {
    type: Number,
    required: true,
  },
  src: {
    type: String,
    required: true,
  },
});

const DesignSampleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title for the design sample"],
    maxlength: 100,
  },
  description: {
    type: String,
    required: [true, "Please provide a description for the design sample"],
    maxlength: 500,
  },
  images: [ImageSchema],
  category: {
    modern: Boolean,
    contemporary: Boolean,
    traditional: Boolean,
  },
  types: {
    kitchen: Boolean,
    bedroom: Boolean,
    office: Boolean,
    bathroom: Boolean,
    gallery: Boolean,
  },

  dateCreated: {
    type: Date,
    default: Date.now,
  },
  designerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "designers",
    required: true,
  },
});

const DesignSample = mongoose.model("DesignSample", DesignSampleSchema);

module.exports = DesignSample;
