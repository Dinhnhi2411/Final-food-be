const express = require("express");
const { body, param } = require("express-validator");
const reviewController = require("../controllers/review.controller");
const authentication = require("../middlewares/authentication");
const validators = require("../middlewares/validators");

const router = express.Router();


/**
* @route POST/reviews/me
* @description Create a new comment
* @body { content, productId }
* @access Login required
*/

router.post(
  "/me/:id",
  authentication.loginRequired,
  validators.validate([
        param("id").exists().isString().custom(validators.checkObjectId),
    ]),
  
  reviewController.createReview
);

/**
* @route PUT/reviews/me/:id
* @description Update a comment
* @access Login required
*/

router.put(
    "/me/:id",
    authentication.loginRequired,
    validators.validate([
        param("id").exists().isString().custom(validators.checkObjectId),
        body("content", "Missing content").exists().notEmpty(),
    ]),
reviewController.updateSingleReview
);

/**
* @route DELETE/reviews/me/:id
* @description Delete a comment
* @body 
* @access Login required
*/

router.delete(
    "/me/:id",
    authentication.loginRequired,
    validators.validate([
        param("id").exists().isString().custom(validators.checkObjectId),
    ]),
    reviewController.deleteSingleReview
);

/**
* @route GET/reviews/:id
* @description Get details of comment
* @access Login required
*/

router.get(
  "/public/:id",
  //   validate(reviewVal.getAllReviewsPublic, ["body"]),
  reviewController.getReviewByProductId
);

/**
 * @route GET /reviews/public?page=1&limit=10
 * @description Get all reviews
 * @access public
 */

router.get("/public",
// validators.validate([
//         param("id").exists().isString().custom(validators.checkObjectId)
//     ]),
 reviewController.getAllReviews
 );


module.exports = router;