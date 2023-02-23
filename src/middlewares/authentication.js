const jwt = require("jsonwebtoken");
const config = require("../config/config.js");
const httpStatus = require("http-status");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const { sendResponse, AppError } = require("../helpers/utils.js");
const User = require("../model/User.js");

const authentication = {};

authentication.loginRequired = (req, res, next) => {
  try {
    const tokenString = req.headers.authorization;
    if (!tokenString) {
      throw new AppError(401, "Login Required", "Authentication Error");
    }
    const token = tokenString.replace("Bearer ", "");
    jwt.verify(token, JWT_SECRET_KEY, (err, payload) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          throw new AppError("401", "Token Expired", "Authentication Error");
        } else {
          throw new AppError("401", "Token is invalid", "Authentication Error");
        }
      }
      req.userId = payload._id;

    });

    next();
  } catch (err) {
    next(err);
  }
};

authentication.isAdmin = async(req, res, next) => {  
  try {
    const userId = req.userId;
 
    let user = await User.findById(userId)
 
    let role = user.role
    
    if (role !== "seller") {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are not a seller",
        "Authorization error"
      );
    }
    next();
  } catch (error) {
    next(error);
  }
}
module.exports = authentication;
