const { sendResponse, AppError } = require("../helpers/utils");

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).send("Welcome to FoodStore!")
});

// authApi
const authApi = require("./auth.api");
router.use("/auth", authApi)

// userApi
const userApi = require("./user.api");
router.use("/users", userApi)

module.exports = router;
