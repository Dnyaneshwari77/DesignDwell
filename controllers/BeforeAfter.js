const { response } = require("express");
const BeforeAfter = require("../models/BeforeAfter");
const { StatusCodes } = require("http-status-codes");

const uploadBeforeAfter = async (req, res) => {
  const beforeAfter = await BeforeAfter.create({ ...req.body });
  console.log(req.body);
  res.status(StatusCodes.CREATED).json({
    BeforeAfter: {
      BeforeImage: beforeAfter.BeforeImages,
      AfterImages: beforeAfter.AfterImages,
      _id: beforeAfter._id,
      creatorID: beforeAfter.designerID,
    },
  });
};
const getsBeforeAfter = async (req, res) => {
  const { developer_id } = req.params;

  console.log(developer_id);

  try {
    const allBeforeAfter = await BeforeAfter.find({ designerID: developer_id });

    res.status(StatusCodes.CREATED).json({
      message: "Design Before and After found successfully",
      beforeAfterSample: allBeforeAfter,
      hits: allBeforeAfter.length,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Could not find the  Before and After  sample",
    });
  }
};

const getAllBeforeAfter = async (req, res) => {
  try {
    const allBeforeAfter = await BeforeAfter.find();

    res.status(StatusCodes.CREATED).json({
      message: "Design Before and After found successfully",
      beforeAfterSample: allBeforeAfter,
      hits: allBeforeAfter.length,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Could not find the  Before and After  sample",
    });
  }
};

module.exports = {
  uploadBeforeAfter,
  getsBeforeAfter,
  getAllBeforeAfter,
};
