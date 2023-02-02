const express = require("express");
const sliderController = require("../controllers/slider.controller");
const router = express.Router();

/**
 * @route POST /sliders
 * @description Create a new slider
 * @body sliderShow
 * @access  Login required
 */

router.post("/", sliderController.createSlider);

/**
 * @route GET /slider?page=1&limit=10
 * @description Get slider
 * @access public
 */
router.get("/", sliderController.getSlider);

module.exports = router;
