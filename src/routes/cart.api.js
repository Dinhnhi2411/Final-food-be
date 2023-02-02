const express = require("express");
const { body, param } = require("express-validator");
const cartController = require("../controllers/cart.controller");
const authentication = require("../middlewares/authentication");
const validators = require("../middlewares/validators");
const router = express.Router();
/**
 * @route POST /carts/me
 * @description Create a new cart
 * @body {productId:Types.ObjectId, authorUser:Types.ObjectId, amount}
 * @access  Login required
 */
router.post("/me",
    authentication.loginRequired,
    cartController.createCart
  );

/**
 * @route GET /carts/me
 * @description Get cart 
 * @access public
 */
router.get("/me",
    authentication.loginRequired,
    cartController.getCart);


/**
 * @route GET /cars/me/:id
 * @description Get a Oders by id
 * @access Login required
 */

// router.get(
//     "/me/:id",
//     authentication.loginRequired,
//     validators.validate([
//         param("id").exists().isString().custom(validators.checkObjectId)
//     ]),
//     cartController.getSingleOrder
   
// );

/**
 * @route PUT /carts/me/:id
 * @description Update a cart
 * @body {amount}
 * @access  Login required
 */
router.put(
  "/me/:id",
  authentication.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  cartController.updateSingleCart
);

/**
 * @route DELETE /cart/:id
 * @description Delete a cart
 * @access Login required
 */
router.delete(
  "/me/:id",
  authentication.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  cartController.deleteCart
);

module.exports = router;
