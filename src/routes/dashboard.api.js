const express = require("express");
const dashboardController = require("../controllers/dashboard.controller");
const authentication = require("../middlewares/authentication");
const router = express.Router();

/**
 * @route GET /dashboard
 * @description Get dashboard
 * @access Login required
 */

router.get(
  "/",
  authentication.loginRequired,
  authentication.isAdmin,
  dashboardController.getAllDashBoard
);

module.exports = router;
