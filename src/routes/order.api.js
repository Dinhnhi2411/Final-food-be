const express = require("express");
const { param, body } = require("express-validator");
const orderController = require("../controllers/order.controller");
const authentication = require("../middlewares/authentication");
const validators = require("../middlewares/validators");
const router = express.Router();

// CUSTOMER

/**
 * @route POST /oders/me
 * @description Create a new oders
 * @body { name, addressShip, phone, products, priceShip, total }
 * @access Login required
 */

router.post(
    "/me",
    authentication.loginRequired,
    validators.validate([
    // param("id").exists().isString().custom(validators.checkObjectId),
    body("name", "Missing name").exists().notEmpty(),
    body("addressShip", "Missing addressShip").exists().notEmpty(),
    body("phone", "Missing phone").exists().notEmpty(),


]),
    orderController.createOrder
);


/**
 * @route GET /oders/me?page=1&limit=10
 * @description Get oders me
 * @access Login required
 */

router.get(
    "/me",
    authentication.loginRequired,
    orderController.getOrders
)

/**
 * @route GET /oders/me/:id
 * @description Get a Oders by id
 * @access Login required
 */

router.get(
    "/me/:id",
    authentication.loginRequired,
    validators.validate([
        param("id").exists().isString().custom(validators.checkObjectId)
    ]),
    orderController.getSingleOrder
   
);


//  SELLER

/**
 * @route GET /oders
 * @description Get all oders 
 * @access Login required
 */

router.get(
    "/",
    authentication.loginRequired,
    orderController.getOrderDashBoard
)

/**
 * @route GET /oders/me/:id
 * @description Get a oder by id
 * @access Login required
 */

router.get(
    "/:id",
    authentication.loginRequired,
    validators.validate([
        param("id").exists().isString().custom(validators.checkObjectId)
    ]),
    orderController.getSingleOrder
   
);

/**
 * @route POST /oders
 * @description Create a new oders
 * @body{ name, addressShip, phone, products, priceShip, total }
 * @access Login required
 */

router.post(
    "/",
    authentication.loginRequired,
    validators.validate([
    // param("id").exists().isString().custom(validators.checkObjectId),
    body("name", "Missing name").exists().notEmpty(),
    body("addressShip", "Missing addressShip").exists().notEmpty(),
    body("phone", "Missing phone").exists().notEmpty(),


]),
    orderController.createOrder
);


/**
 * @route PUT /oders/:id
 * @description Update a oders
 * @body {status} 
 * @access  Login required
 */

router.put(
    "/:id",
    authentication.loginRequired,
    validators.validate([
        param("id").exists().isString().custom(validators.checkObjectId)
    ]),
    orderController.updateOrder
);


/**
 * @route DELETE /oders/:id
 * @description Delete a oder
 * @access Login required
 */

router.delete(
    "/:id",
    authentication.loginRequired,
    validators.validate([
        param("id").exists().isString().custom(validators.checkObjectId)
    ]),
    orderController.deleteOrder
);


module.exports = router;