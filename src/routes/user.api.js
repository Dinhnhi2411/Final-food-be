const express = require("express");
const { body } = require("express-validator");
const userController = require("../controllers/user.controller");
const authentication = require("../middlewares/authentication");
const validators = require("../middlewares/validators");
const router = express.Router();


router.post(
    "/",
    validators.validate([
    body("name", "Invalid name").exists().notEmpty(),
    body("email", "Invalid email")
    .exists()
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: false }),
    body("password", "Invalid password").exists().notEmpty(),
    ]),
    userController.register
);


router.get("/",authentication.loginRequired, userController.getUsers);

router.get("/me",authentication.loginRequired, userController.getCurrentUser);







/**

@route POST /users/customer
@description Register new (user) customer
@body {name, email, password}
@access public
*/

/**

@route POST /users/admin
@description Register new admin
@body {name, email, password}
@access public
*/
/**

@route GET /users/me
@description Get current user info
@body
@access Login required
*/
/**

@route GET /users/:id
@description Get a user profile
@access Login required
*/
/**

@route PUT /users/admin/:id
@description Update admin profile
@body {name, avataUrl, address}
@access Login required
*/

module.exports = router;