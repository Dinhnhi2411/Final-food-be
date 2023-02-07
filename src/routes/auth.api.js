const express = require("express");
const { body } = require("express-validator");
const authController = require("../controllers/auth.controller");
const validators = require("../middlewares/validators");
const router = express.Router();
const passport = require('passport');
const { loginGoogle, loginFacebook } = require("../middlewares/passport");
/**
@route POST /auth/login
@description Log in with email and password
@body {email, password}
@access public
*/
router.post(
  "/login",
  validators.validate([
    body("email", "Invalid email")
      .exists()
      .isEmail()
      .normalizeEmail({ gmail_remove_dots: false }),
    body("password", "Invalid password").exists().notEmpty(),
  ]),
  authController.loginWithEmail
);

/**
@route POST /auth/facbook
@description Log in with facebook
@body {accessToken}
@access public
*/
router.post("/facebook",
loginFacebook,
authController.loginUserWithFacebook);

/**
@route POST /auth/google
@description Log in with google
@body {accessToken}
@access public
*/
router.post("/google",
loginGoogle,
authController.loginUserWithGoogle);




module.exports = router;
