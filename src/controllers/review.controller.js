const { Types } = require("mongoose");
const { catchAsync, AppError, sendResponse } = require("../helpers/utils");
const Product = require("../model/Product");
const Review = require("../model/Review");

const reviewController = {};

const createReviewPro = async function (userId, productId, reviewBody) {
  let filter = { userId, productId, isDeleted: false };

  let review = await Review.findOne(filter);

  // if (review) {
  //   throw new AppError(404, "Review is Exist", "Create review error");
  // }

  let newReview = {};
  Object.keys(reviewBody).forEach((field) => {
    if (reviewBody[field] !== undefined) {
      newReview[field] = reviewBody[field];
    }
  });
  review = await Review.create({ userId, productId, ...newReview });

  return review;
};

const updateRevewPro = async function (userId, reviewId, reviewBody) {
  let filter = { _id: reviewId, isDeleted: false };

  let review = await Review.findOne(filter);

  if (!review) {
    throw new AppError(404, "Review Not Found", "Update review error");
  }

  if (!review.userId.equals(userId)) {
    throw new AppError(
      401,
      "Unauthorized edit other's review",
      "Update Review Products error"
    );
  }

  Object.keys(reviewBody).forEach((field) => {
    if (reviewBody[field] !== undefined) {
      review[field] = reviewBody[field];
    }
  });

  await review.save();

  return review;
};

//

const calculateReviewCount = async (productId) => {
  const reviewCount = await Review.countDocuments({
    productId: productId,
    isDeleted: false,
  });
  await Product.findByIdAndUpdate(productId, { reviewCount });
};

// GET SINGLE REVIEW BY PRODUCT ID

reviewController.getReviewByProductId = catchAsync(async (req, res, next) => {
  const { id: productId } = req.params;
   let { page, limit, ...filterQuery } = req.query;

  const filterKeys = Object.keys(filterQuery);
  if (filterKeys.length) {
    throw new AppError(400, "Not Accepted Query", "Bad Request");
  }
  
  // let query = { productId, isDelete: false, populate: "userId"};
  let product = Product.find(productId);
  if (!product) {
    throw new AppError(400, "Product is not found", "Get single review error");
  }
  // let review = await Review.find(query);


  page = parseInt(page) || 1;
  limit = parseInt(limit) || 5;
  const offset = limit * (page - 1);

  let review = await Review.find({ isDeleted: false, productId })
 .populate("userId")
 .sort({ createdAt: -1 })
 .limit(limit)
 .skip(offset);
 
 
   
  if (!review) {
    throw new AppError(400, "Review is not found", "Get single review error");
  }
  const count = await Review.countDocuments({productId});

  
  const totalPages = Math.ceil(count / limit);
  return sendResponse(
    res,
    200,
    true,
    { review, totalPages, count, page },
    null,
    "Get Review successfully"
  );
});

// CREATE NEW REVIEW

reviewController.createReview = catchAsync(async (req, res, next) => {
  const { id: userId } = req.userId;
  const { id: productId } = req.params;
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError(400, "Product not exist", "Bad request");
  }
  const review = await createReviewPro(userId, productId, req.body);
  return sendResponse(
    res,
    200,
    true,
    { review },
    null,
    "Create review successfully"
  );
});

reviewController.updateReviewById = catchAsync(async (req, res, next) => {
  const { id: userId, role } = req.user;
  const { id: reviewId } = req.params;

  const review = await updateRevewPro(userId, reviewId, req.body);
  return sendResponse(
    res,
    200,
    true,
    review,
    null,
    "Update review successfully"
  );
});

// UPDATE SINGLE REVIEW

reviewController.updateSingleReview = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const reviewId = req.params.id;
  const { content } = req.body;

  const review = await Review.findOneAndUpdate(
    {
      _id: reviewId,
      userId: currentUserId,
    },
    { content },
    { new: true }
  );
  if (!review) {
    throw new AppError(400, "Review not exists", "Update review error");
  }
  return sendResponse(
    res,
    200,
    true,
    { review },
    null,
    "Update Review Successfully"
  );
});

// DELETE REVIEW

reviewController.deleteSingleReview = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const reviewId = req.params.id;
  const review = await Review.findOneAndDelete({
    _id: reviewId,
    userId: currentUserId,
  });
  if (!review) {
    throw new AppError(400, "Review not exists", "Delete review error");
  }
  await calculateReviewCount(review.productId);
  return sendResponse(
    res,
    200,
    true,
    { review },
    null,
    "Delete Review Successfully"
  );
});

// GET ALL REVIEWS

reviewController.getAllReviews = catchAsync(async (req, res, next) => {
  let { page, limit, ...filterQuery } = req.query;

  const filterKeys = Object.keys(filterQuery);
  if (filterKeys.length) {
    throw new AppError(400, "Not Accepted Query", "Bad Request");
  }

  let review = await Review.find({ isDeleted: false })
    .sort({ createAt: -1 })
    .populate("productId")
    .populate("userId");

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 3;
  const count = review.length;
  const totalPages = Math.ceil(count / limit);

  return sendResponse(
    res,
    200,
    true,
    { review, totalPages, count, page },
    null,
    "Get All Review Successfully"
  );
});

module.exports = reviewController;
