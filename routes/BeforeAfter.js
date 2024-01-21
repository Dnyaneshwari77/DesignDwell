const express = require("express");
const router = express.Router();

const authentication = require("../middleware/authentication");

const {
  uploadBeforeAfter,
  getsBeforeAfter,
  getAllBeforeAfter,
} = require("../controllers/BeforeAfter");

router.post("/beforeAfter", uploadBeforeAfter);
router.get("/beforeAfter/:developer_id",  getsBeforeAfter);
router.get("/beforeAfter/", authentication,getAllBeforeAfter);

module.exports = router;
