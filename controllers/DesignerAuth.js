const { response } = require("express");
const DesignerSchema = require("../models/Designers");
const { StatusCodes } = require("http-status-codes");

const signup = async (req, res) => {
  console.log("Signup");
  const designer = await DesignerSchema.create({ ...req.body });
  const token = designer.createJWT();
  console.log(req.body);
  res.status(StatusCodes.CREATED).json({
    designer: {
      email: designer.email,
      name: designer.firstName,
      _id: designer._id,
      token,
    },
  });
  // res.send("Send data");
};

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  if (!email || !password) {
    res
      .status(StatusCodes.BAD_GATEWAY)
      .json({ msg: "Provide valid email and password" });
  }
  const designer = await DesignerSchema.findOne({ email });
  console.log(designer);

  if (!designer) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Email and Password is wrong" });
  }
  const isPasswordCorrect = await designer.comparePassword(password);
  if (!isPasswordCorrect) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Email and Password is wrong" });
  }

  const token = designer.createJWT();
  res.status(StatusCodes.OK).json({
    user: {
      email: designer.email,
      name: designer.firstName,
      _id: designer._id,
      token,
    },
  });
};

const getDesigner = async (req, res) => {
  const { id } = req.params;

  try {
    const designer = await DesignerSchema.findOne({ _id: id });

    if (!designer) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Designer not found" });
    }

    res.status(StatusCodes.OK).json({ designer });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Could not fetch designer" });
  }
};

module.exports = {
  signup,
  login,
  getDesigner
};
