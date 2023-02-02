
const express = require("express");
const { body } = require("express-validator");
const reactionController = require("../controllers/reaction.controller");
const authentication = require("../middlewares/authentication");
const validators = require("../middlewares/validators");
const router = express.Router();
/**
* @route POST/reactions
* @description Save a reaction to post or comment
* @body { targetId }
* @access Login required
*/

router.post(
  "/",
  authentication.loginRequired,
  validators.validate([
    // body("targetType", "Invalid targetType").exists().isIn(["Post", "Comment"]),
    body("targetId", "Invalid targetId")
      .exists()
      .custom(validators.checkObjectId),
    // body("emoji", "Invalid emoji").exists().isIn(["like", "dislike"]),
  ]),
  reactionController.createReaction
);

/**
* @route GET/reactions
* @description Get reaction
* @body 
* @access Login required
*/
router.get(
  "/",
  authentication.loginRequired,
  reactionController.getAllReaction
)

module.exports = router;