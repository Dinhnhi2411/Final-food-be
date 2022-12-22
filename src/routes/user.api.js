const express = require("express");
const { body, param } = require("express-validator");
const userController = require("../controllers/user.controller");
const authentication = require("../middlewares/authentication");
const validators = require("../middlewares/validators");
const router = express.Router();


router.get("/",
authentication.loginRequired,
userController.getUsers
);

// CUSTOMER
/**
@route POST /users/customer
@description Register new (user) customer
@body {name, email, password}
@access public
*/
router.post(
    "/customer",
    validators.validate([
    body("name", "Invalid name").exists().notEmpty(),
    body("email", "Invalid email")
    .exists()
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: false }),
    body("password", "Invalid password").exists().notEmpty(),
    ]),
    userController.registerUser
);

/**
@route GET /users/me
@description Get current user info
@body
@access Login required
*/

router.get("/me",
authentication.loginRequired,
userController.getCurrentUser
);

/**
@route GET /users/:id
@description Get a user profile
@access Login required
*/

router.get("/:id",
    authentication.loginRequired,
    validators.validate([
        param("id").exists().isString().custom(validators.checkObjectId)
    ])
    , userController.getSingleUser
);


/**
@route PUT /users/customer/:id
@description Update customer profile
@body {name, avataUrl, address}
@access Login required
*/

router.put("/customer/:id",
authentication.loginRequired,
validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId)
]),
userController.updateProfileUser
);

// SELLER

/**

@route POST /users/seller
@description Register new admin
@body {name, email, password}
@access public
*/





module.exports = router;