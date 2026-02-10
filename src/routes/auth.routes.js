const express = require("express");
const { register, login } = require("../controllers/auth.controller");

const router = express.Router();

router.post("/Register", register);
router.post("/Login", login);

module.exports = router;
