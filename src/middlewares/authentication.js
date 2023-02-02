const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const { sendResponse, AppError } = require("../helpers/utils.js");

const authentication = {};

authentication.loginRequired = (req, res, next) => {
  try {
    const tokenString = req.headers.authorization;
    // console.log(tokenString);
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
    //   payload là thông tin từ token ( xem trong model User)
      req.userId = payload._id;
    });

    next();
  } catch (err) {
    next(err);
  }
};
module.exports = authentication;
