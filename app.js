const { sendResponse, AppError } = require("./src/helpers/utils");
require("dotenv").config();
const cors = require("cors");

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const passport = require("passport");

const indexRouter = require("./src/routes/index");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

// jwt authentication
app.use(passport.initialize());

const mongoose = require("mongoose");
/* DB connection*/
const mongoURI = process.env.MONGODB_URI;
mongoose.set("strictQuery", true);
mongoose
  .connect(mongoURI)
  .then(() => console.log(`DB connected ${mongoURI}`))
  .catch((err) => console.log(err));
app.use("/api", indexRouter);

// catch 404 and forard to error handler
app.use((req, res, next) => {
  const err = new AppError(404, "Not Found", "Bad Request");
  next(err);
});

/* Initialize Error Handling */
app.use((err, req, res, next) => {
  console.log("ERROR", err);

  // handle error for passport login authentication
  if (err.oauthError) {
    const { statusCode, data } = err.oauthError;
    err.statusCode = statusCode;
    err.message = "Invalid access token";
    err.errorType = "Get access token";
    return sendResponse(
      res,
      err.statusCode,
      false,
      null,
      { message: err.message },
      err.errorType
    );
  }

  if (err.isOperational) {
    return sendResponse(
      res,
      err.statusCode ? err.statusCode : 500,
      false,
      null,
      { message: err.message },
      err.errorType
    );
  } else {
    return sendResponse(
      res,
      err.statusCode ? err.statusCode : 500,
      false,
      null,
      { message: err.message },
      "Internal Server Error"
    );
  }
});

module.exports = app;
