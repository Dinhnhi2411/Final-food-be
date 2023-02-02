const { Router } = require("express");
const express = require("express");
const { body, param } = require("express-validator");
const productController = require("../controllers/product.controller");
const authentication = require("../middlewares/authentication");
const validators = require("../middlewares/validators");
const router = express.Router();

// PUBLIC

/**
- @route GET /products?page=1&limit=10
- @description Get all products with pagination
- @body
- @access public 
 */
router.get("/public", productController.getAllProducts);

/**
 * @route GET /products/productsTopSelling?page=1&limit=10&name=`$productName`
 * @description Get products top selling with pagination
 * @access public
 */
router.get(
  "/public/productsTopSelling",
  productController.getProductTopSelling
);

/**
 * @route GET /products/productsNew?page=1&limit=10&name=`$productName`
 * @description Get products new with pagination
 * @access public
 */
router.get("/public/productsNew", productController.getProductNew);

/**
 * @route GET /products/productsDiscount?page=1&limit=10&name=`$productName`
 * @description Get products top selling with pagination
 * @access public
 */
router.get("/public/productsDiscount", productController.getProductDiscount);

/**
- @route GET /products/:id
- @description Get a product
- @body
- @access public
 */

router.get(
  "/public/:id",
  // authentication.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  productController.getSingleProduct
);

// SELLER

/**
- @route GET /products
- @description Get all products with pagination
- @body
- @access Login required
 */

router.get(
  "/",
  authentication.loginRequired,
  productController.getAllProducts
);
/**
- @route GET /products/:id
- @description Get detail product
- @body
- @access Login required
 */

router.get(
  "/:id",
  authentication.loginRequired,
  validators.validate([
       param("id").exists().isString().custom(validators.checkObjectId),
 
  ]),
  productController.getSingleProduct
)

/** 
- @route POST /products
- @description Create a new products
- @body { name, image, description, types:[ Fruit, Vetgetable ], price, unit, amount }
- @access  Login required
*/

router.post(
  "/",
  authentication.loginRequired,
  validators.validate([
    body("productName", "Missing productName").exists().notEmpty(),
    body("description", "Missing description").exists().notEmpty(),
    body("types", "Missing types").exists().notEmpty(),
    body("unit", "Missing unit").exists().notEmpty(),
    body("image", "Missing image").exists().notEmpty(),
    body("price", "Missing price").exists().notEmpty(),
    body("status", "Missing status").exists().notEmpty(),
  ]),
  productController.createNewProduct
);


/**
- @route PUT /products
- @description Update a new products
- @body {name, image, description, types:[ Fruit, Vetgetable ], price, unit, amount}
- @access  Login required
 */

router.put(
  "/:id",
  authentication.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  productController.updateSingleProduct
);


/**
- @route DELETE /products/:id
- @description Delete a product
- @body
- @access Login required
 */

router.delete(
  "/:id",
  authentication.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  productController.deleteSingleProduct
);


module.exports = router;
