const express = require("express");
const router = express.Router();

const {
  uploadSample,
  getSample,
  getSingleSample,
  deleteSingleSample,
  updateSingleSample,
  filterSample,
} = require("../controllers/Sample");
const authorization = require("../middleware/authentication.js");

const { uploadProductImages } = require("../controllers/uploadProductImage");

router.post("/uploadSample", authorization, uploadSample);
router.get("/uploadSample/:user_id", getSample);
router.get("/uploadSample/", filterSample);
router.get("/uploadSample/sample/:sample_id", getSingleSample);
router.delete("/uploadSample/sample/:sample_id", deleteSingleSample);
router.patch("/uploadSample/sample/:sample_id", updateSingleSample);
router.post("/uploadSample/sample/uploads", authorization, uploadProductImages);
module.exports = router;
