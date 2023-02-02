const { sendResponse, AppError } = require("../helpers/utils");

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).send("Welcome to FoodStore!")
});

// authApi
const authApi = require("./auth.api");
router.use("/auth", authApi);

// userApi
const userApi = require("./user.api");
router.use("/users", userApi);

// productApi
const productApi = require("./product.api");
router.use("/products", productApi);

// cartApi
const cartApi = require('./cart.api');
router.use("/carts", cartApi);

//  sliderApi
const sliderApi = require('./slider.api');
router.use("/sliders", sliderApi);

//  oderApi
const orderApi = require('./order.api');
router.use("/orders", orderApi);

const reviewApi = require('./review.api')
router.use("/reviews", reviewApi)

const reactionApi = require('./reaction.api')
router.use("/reactions", reactionApi)


const dashboardApi = require('./dashboard.api')
router.use("/dashboards", dashboardApi);



module.exports = router;
