const express = require("express");
const { body } = require("express-validator");
const authController = require("../controllers/auth.controller");
const validators = require("../middlewares/validators");
const router = express.Router();


/**
@route POST /auth/login
@description Log in with email and password
@body {email, password}
@access public
*/
router.post("/login",
validators.validate([
body("email", "Invalid email")
.exists()
.isEmail()
.normalizeEmail({ gmail_remove_dots: false }),
body("password", "Invalid password").exists().notEmpty(),
]),
authController.loginWithEmail
);

module.exports = router;