const { AppError, catchAsync, sendResponse, generateRandomHexString } = require("../helpers/utils");
const User = require("../model/User");
const bcrypt = require("bcryptjs");
const authController = {};

const getUserByFilter = async function (filter, options) {
  const user = await User.findOne(filter, options);

  return user;
};

const checkEmailTaken = async function (filter) {
  const user = await User.findOne(filter);

  return !!user;
};

const createUser = async function (userBody) {
  const { email } = userBody;

  const isExits = await checkEmailTaken({ email });
  if (isExits) {
    throw new AppError(
      404,
      "Email is Exist, Please login or reset password",
      "Create new User"
    );
  }

  const user = await new User({ ...userBody }).save();

  await user.save();

  return user;
};

const loginWithSocial = async function (socialUser) {
   const { id, displayName, emails, photos, provider } = socialUser;
   filter = { email: emails[0].value };
   socialCriteria = { facebook: "facebookId", google: "googleId" };
   socialId = socialCriteria[provider];
   let user = await getUserByFilter(filter);
   if (!user) {
    const newUser = {
      name: displayName,
      [socialId]: id,
      email: emails[0].value,
      isEmailVerified: true,
      password: generateRandomHexString(8),
      avatarUrl: photos[0].value,
    };
    user = await createUser(newUser);
    }

  const token = await user.generateToken();

  return { user, accessToken: token };
};

// Login with facebook

authController.loginUserWithFacebook = catchAsync(async (req, res, next) => {
  const user = await loginWithSocial(req.user);

  return sendResponse(
    res,
    200,
    true,
    user,
    null,
    "User is login successfully"
  );
});

// Login with google

authController.loginUserWithGoogle = catchAsync(async (req, res, next) => {
  const user = await loginWithSocial(req.user);

  return sendResponse(
    res,
    200,
    true,
    user,
    null,
    "User is login successfully"
  );
});

// Login with email and password

authController.loginWithEmail = catchAsync(async (req, res, next) => {
  // Get data from request
  const { email, password } = req.body;

  // Bussiness logic Validation
  const user = await User.findOne({ email }, "+password");
  if (!user) {
    throw new AppError(400, "Invalid Credentials", "Login Error");
  }
  // Process
  // mã hóa password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError(400, "Wrong password", "Login Error");
  }

  const accessToken = await user.generateToken();
  // Response

  sendResponse(res, 200, true, { user, accessToken }, null, "Login successful");
});

module.exports = authController;