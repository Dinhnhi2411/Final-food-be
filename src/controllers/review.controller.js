const { Types } = require("mongoose");
const { catchAsync, AppError, sendResponse } = require("../helpers/utils");
const Product = require("../model/Product");
const Review = require("../model/Review");

const reviewController = {};

// funct create review and return review

const createReviewPro = async function (userId, productId, reviewBody) {
  let filter = { userId, productId, isDeleted: false };

  let review = await Review.findOne(filter);


  let newReview = {};
  Object.keys(reviewBody).forEach((field) => {
    if (reviewBody[field] !== undefined) {
      newReview[field] = reviewBody[field];
    }
  });

  // create review

  review = await Review.create({ userId, productId, ...newReview });

  return review;
};


// calculate review

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
    
  let product = Product.find(productId);

  // check exist product

  if (!product) {
    throw new AppError(400, "Product is not found", "Get single review error");
  }

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 5;
  const offset = limit * (page - 1);

  // find review

  let review = await Review.find({ isDeleted: false, productId })
 .populate("userId")
 .sort({ createdAt: -1 })
 .limit(limit)
 .skip(offset);
 
 // check exist review

  if (!review) {
    throw new AppError(400, "Review is not found", "Get single review error");
  }
  const count = await Review.countDocuments({productId});

  const totalPages = Math.ceil(count / limit);

  // response

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
 
  // check exist review

  if (!product) {
    throw new AppError(400, "Product not exist", "Bad request");
  }

  // create review

  const review = await createReviewPro(userId, productId, req.body);
  
  // response

  return sendResponse(
    res,
    200,
    true,
    { review },
    null,
    "Create review successfully"
  );
});

// UPDATE SINGLE REVIEW

reviewController.updateSingleReview = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const reviewId = req.params.id;
  const { content } = req.body;

  // find and update

  const review = await Review.findOneAndUpdate(
    {
      _id: reviewId,
      userId: currentUserId,
    },
    { content },
    { new: true }
  );
  
  // check exist review

  if (!review) {
    throw new AppError(400, "Review not exists", "Update review error");
  }

  // response

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

  // find and delete

  const review = await Review.findOneAndDelete({
    _id: reviewId,
    userId: currentUserId,
  });

  // check exist review

  if (!review) {
    throw new AppError(400, "Review not exists", "Delete review error");
  }
  await calculateReviewCount(review.productId);
  
  // response

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

  // find review
  
  let review = await Review.find({ isDeleted: false })
    .sort({ createAt: -1 })
    .populate("productId")
    .populate("userId");

  // count & page & totalPages

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 3;
  const count = review.length;
  const totalPages = Math.ceil(count / limit);

  // response

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
