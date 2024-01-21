const path = require("path");
const { StatusCodes } = require("http-status-codes");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const uploadProductImages = async (req, res) => {
  try {
    const uploadedImages = [];

    if (!req.files || !req.files.images) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "No images uploaded" });
    }

    const files = Array.isArray(req.files.images)
      ? req.files.images // If multiple files are uploaded
      : [req.files.images]; // If only a single file is uploaded

    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        use_filename: true,
        folder: "Upload Interior Samples",
      });

      uploadedImages.push({ src: result.secure_url });

      fs.unlinkSync(file.tempFilePath);
    }

    return res.status(StatusCodes.OK).json({ images: uploadedImages });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Error uploading images" });
  }
};


module.exports = {
  uploadProductImages,
};
