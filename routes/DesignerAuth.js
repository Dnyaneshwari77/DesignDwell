const express = require("express");
const router = express.Router();

const { signup, login, getDesigner } = require("../controllers/DesignerAuth");

router.post("/signup", signup);
router.post("/login", login);
router.get("/:id", getDesigner);

module.exports = router;
