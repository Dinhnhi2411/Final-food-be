const { AppError, catchAsync, sendResponse } = require("../helpers/utils");
const bcrypt = require("bcryptjs");
const Cart = require("../model/Cart");

const cartController = {};

// CREATE CART

cartController.createCart = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  let { productId } = req.body;
  let cart = await Cart.findOne({ productId, author: currentUserId });
  if (cart) {
    cart.amount += 1;
    await cart.save();
  }
  if (!cart) {
    cart = await Cart.create({ amount: 1, productId, author: currentUserId });
  }
  sendResponse(res, 200, true, cart, null, "Create Cart Successfully");
});

//  GET CART

cartController.getCart = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;

  let { page, limit, name, ...filterQuery } = req.query;

  const filterKeys = Object.keys(filterQuery);
  if (filterKeys.length) {
    throw new AppError(400, "Not Accepted Query", "Bad Request");
  }
  const count = await Cart.countDocuments();
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  const offset = limit * (page - 1);
  const totalPages = Math.ceil(count / limit);

  let Carts = await Cart.find({ author: currentUserId })
    .sort({ createAt: 1 })
    .populate("productId")
    .populate("author")
    .limit(limit)
    .skip(offset);

  let totalItem = 0;
  if (Carts.length) {
    Carts.forEach((item) => {
      totalItem += item.amount;
    });
  }
  return sendResponse(
    res,
    200,
    { Carts, count, totalPages, totalItem },
    null,
    "Get Current Cart Successfully"
  );
});

//  UPDATE CART

cartController.updateSingleCart = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const cartId = req.params.id;

  let cart = await Cart.findById(cartId);
  if (!cart) {
    throw new AppError(400, "Cart Not Found", "Update Cart Error");
  }
  if (!cart.author.equals(currentUserId)) {
    throw new AppError(400, "Only Author Can Edit Cart ", "Update Cart Error");
  }
  const allows = ["amount"];
  allows.forEach((field) => {
    if (req.body[field] !== undefined) {
      cart[field] = req.body[field];
    }
  });

  await cart.save();
  return sendResponse(res, 200, true, cart, null, "Update Cart Successfully");
});

// DELETE CART

cartController.deleteCart = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const cartId = req.params.id;

  let cart = await Cart.findOneAndRemove(
    { _id: cartId, userId: currentUserId },
    { new: true }
  );
  if (!cart)
    throw new AppError(
      400,
      "Post not found or Cart not authorrized",
      "Deleta Cart Error"
    );

  return sendResponse(res, 200, true, cart, null, "Delete Cart successful");
});

module.exports = cartController;
