const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { log } = require("console");

const DesignerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please provide a first name"],
    maxlength: 50,
    minlength: 3,
  },
  middleName: {
    type: String,
    trim: true,
    maxlength: 20,
    default: null,
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: 20,
    default: null,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 6,
  },
  location: {
    type: String,
    trim: true,
    default: "My City",
  },
  phone: {
    type: String, // Consider using String for phone numbers
    trim: true,
    maxlength: 10, // Adjust maxlength as per your requirements
    required: [true, "Please provide a phone number"],
  },
});

DesignerSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

DesignerSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, firstName: this.firstName,lastName:this.lastName,Email:this.email },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

DesignerSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("Designer", DesignerSchema);
