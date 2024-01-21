const mongoose = require("mongoose");

const BeforeAfterSchema = new mongoose.Schema({
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
  BeforeImages: {
    type: "String",
    required: true,
  },
  AfterImages: {
    type: "String",
    required: true,
  },
  category: [
    {
      type: String,
      required: true,
    },
  ],
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

const BeforeAfter = mongoose.model("BeforeAfter", BeforeAfterSchema);

module.exports = BeforeAfter;
