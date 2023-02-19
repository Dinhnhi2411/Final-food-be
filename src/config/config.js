require("dotenv").config();

const env = process.env;

const config = {
                
  passport: {
    facebook: {
      clientID: env.FACEBOOK_APP_ID,
      clientSecret: env.FACEBOOK_SECRET,
    },
    google: {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },

  },
  jwt: {
    secret: env.JWT_SECRET_KEY,
  },
};

module.exports = config;