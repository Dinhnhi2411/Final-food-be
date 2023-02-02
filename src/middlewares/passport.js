const httpStatus = require("http-status");
const passport = require("passport");
const facebookStrategy = require("passport-facebook-token");
const googleStrategy = require("passport-google-oauth-token");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const config = require("../config/config");
const { AppError } = require("../helpers/utils");
const passportMiddleware = {};

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  try {
    done(null, payload);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

const facebookLogin = new facebookStrategy(
  config.passport.facebook,
  async (accessToken, refreshToken, profile, done) => {
    try {
      return done(null, profile);
    } catch (error) {
      done(error, false);
    }
  }
);

const googleLogin = new googleStrategy(
  config.passport.google,
  async (accessToken, refreshToken, profile, done) => {
    try {
      return done(null, profile);
    } catch (error) {
      done(error, false);
    }
  }
);

passport.use("jwt", jwtStrategy);
passport.use(facebookLogin);
passport.use(googleLogin);

passportMiddleware.logginRequired = function (req, res, next) {
  passport.authenticate(
    "jwt",
    {
      session: false,
    },
    function (err, user, info) {
      try {
        if (err || info) {
          throw new AppError(
            httpStatus.UNAUTHORIZED,
            "Invalid access token",
            "Get access token"
          );
        }
        req.user = user;
        return next();
      } catch (error) {
        next(error);
      }
    }
  )(req, res, next);
};

passportMiddleware.loginFacebook = passport.authenticate("facebook-token", {
  session: false,
});

passportMiddleware.loginGoogle = passport.authenticate("google-oauth-token", {
  session: false,
});

module.exports = passportMiddleware;