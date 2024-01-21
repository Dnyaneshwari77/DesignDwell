const express = require("express");
const router = express.Router();
const authorization = require("../middleware/authentication.js");
const { signup, login, validate } = require("../controllers/Auth");

router.post("/signup", signup);
router.post("/login", login);
router.get("/validate", authorization, validate);

module.exports = router;
