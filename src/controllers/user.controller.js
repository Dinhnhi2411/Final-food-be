const { sendResponse, AppError, catchAsync } = require("../helpers/utils")
const User = require("../model/User");
const bcrypt = require("bcryptjs");

const userController = {};

// REGISTER USER

userController.registerUser = catchAsync(async (req, res, next) => {
  // Get data from request
  let { name, email, password } = req.body;

  // Bussiness logic Validation
  let user = await User.findOne({ email });
  if (user) {
    throw new AppError(400, "User already exists", "Registration error");
  }
  // Process
  // mã hóa password
  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);
  user = await User.create({ name, email, password });
  const accessToken = await user.generateToken();

  // Response

  sendResponse(
    res,
    200,
    true,
    { user, accessToken },
    null,
    "Create user successful"
  );
});

// REGISTER SELLER


// GET ALL USERS

userController.getUsers = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  let { page, limit, ...filter } = { ...req.query };

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  const filterConditions = [{ isDeleted: false }];
  if (filter.name) {
    filterConditions.push({
      name: { $regex: filter.name, $options: "i" },
    });
  }
  const filterCriteria = filterConditions.length
    ? { $and: filterConditions }
    : {};

  const count = await User.countDocuments(filterCriteria);
  const totalPage = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  let users = await User.find(filterCriteria)
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit);
    
    
  

  return sendResponse(
    res,
    200,
    true,
    { users: users, totalPage, count },
    null,
    ""
  );
});

//  GET CURRENT USER

userController.getCurrentUser = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;

  const user = await User.findById(currentUserId);
  if (!user)
    throw new AppError("400", "User not found", "Get current user error");

  return sendResponse(
    res,
    200,
    true,
    user,
    null,
    "Get current user successful"
  );
});

// GET SINGLE USER BY ID

userController.getSingleUser = catchAsync(async(req, res, next) => {
  const userId = req.params.id;
  let user = await User.findById(userId);
  if (!user)
        throw new AppError(400, "User not found", "Get Single User Error")

    return sendResponse(res, 200, true, user, null, "Get Single User Successfully")

});

// UPDATE USER PROFILE BY ID

userController.updateProfileUser = catchAsync(async(req, res, next) => {
  const userId = req.params.id;
  let user = await User.findById(userId);
  if(!user) {
     throw new AppError(400, "User not found", "Update User Error")
  };

  const allows = [
        "name",
        "avatarUrl",
        "address",
        "phone",
        "city",
        "country",
  ];

  allows.forEach((field) => {
    if(req.body[field] !== undefined ) {
      user[field] = req.body[field]
    }
  });

  await user.save();
  return sendResponse(
    res,
    200,
    true,
    user,
    null,
    "Update User Successfully"
  )
});


module.exports = userController;