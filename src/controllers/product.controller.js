const { query } = require("express");
const { sendResponse, AppError, catchAsync } = require("../helpers/utils");
const Product = require("../model/Product");
const Review = require("../model/Review");

const productController = {};


// CREATE NEW PRODUCT

productController.createNewProduct = catchAsync(async (req, res, next) => {
  const currentSellerId = req.userId;
  let {
    productName,
    description,
    types,
    price,
    priceSale,
    unit,
    image,
    rating,
    status,
  } = req.body;
  let product = await Product.findOne({ productName });
  if (product) {
    throw new AppError(400, "Product Already Exists", "Error Create Product");
  }
  product = await Product.create({
    productName,
    description,
    types,
    price,
    priceSale,
    unit,
    image,
   rating,
    status,
    author: currentSellerId,
  });

  product = await product.populate("author");

  sendResponse(res, 200, true, product, null, "Create Product Successfully");
});

// GET ALL PRODUCTS

productController.getAllProducts = catchAsync(async (req, res, next) => {
  let { limit, page, sortBy, populate, select, ...filter } = req.query;

  if (req.query.productName) {
    req.query.productName = { $regex: req.query.productName, $options: "i" };
  } else {
    delete req.query.productName;
  }
  // let sortBy = req.query.sortBy && req.query.sortBy.toLowerCase();
  if (req.query.sortBy === "New") {
    req.query.status = "New";
  }
  if (req.query.sortBy?.includes("Discount")) {
    req.query.status = "Discount";
  }
  if (req.query.sortBy?.includes("Top")) {
    req.query.status = "Top";
  }
  if (req.query.sortBy?.includes("Normal")) {
    req.query.status = "Normal";
  }
  if (req.query.rating) {
    req.query.ratingAverage = {
      $gte: parseInt(req.query.rating),
      $lte: 5,
    };
  }

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  const offset = limit * (page - 1);
  const count = await Product.countDocuments(req.query);
  const totalPages = Math.ceil(count / limit);

  const products = await Product.find(req.query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(offset);

  return sendResponse(
    res,
    200,
    true,
    { products, totalPages, count, page },
    null,
    "Get Current Product Successfully"
  );
});

//  GET PRODUCT TOP SELLING

productController.getProductTopSelling = catchAsync(async (req, res, next) => {
  let { page, limit, name, ...filterQuery } = req.query;

  const filterKeys = Object.keys(filterQuery);
  if (filterKeys.length)
    throw new AppError(400, "Not Accepted Query", "Bad Request");

  const filterConditions = [{ isDeleted: false, status: "Top" }];
  if (name) {
    filterConditions.push({
      productName: { $regex: name, $options: "i" },
    });
  }
  const filterCritera = filterConditions.length
    ? { $and: filterConditions }
    : {};

  const count = await Product.countDocuments(filterCritera);
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  const totalPages = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  let Products = await Product.find(filterCritera)
    .sort({ createdAt: -1 })
    .populate("author")
    .limit(limit)
    .skip(offset);

  return sendResponse(
    res,
    200,
    true,
    { Products, totalPages, count },
    null,
    "Get  Product Topselling successful"
  );
});

//  GET PRODUCT NEW

productController.getProductNew = catchAsync(async (req, res, next) => {
  let { page, limit, name, ...filterQuery } = req.query;

  const filterKeys = Object.keys(filterQuery);
  if (filterKeys.length)
    throw new AppError(400, "Not Accepted Query", "Bad Request");

  const filterConditions = [{ isDeleted: false, status: "New" }];
  if (name) {
    filterConditions.push({
      productName: { $regex: name, $options: "i" },
    });
  }
  const filterCritera = filterConditions.length
    ? { $and: filterConditions }
    : {};

  const count = await Product.countDocuments(filterCritera);
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  const totalPages = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  let Products = await Product.find(filterCritera)
    .sort({ createdAt: -1 })
    .populate("author")
    .limit(limit)
    .skip(offset);

  return sendResponse(
    res,
    200,
    true,
    { Products, totalPages, count },
    null,
    "Get Product New successful"
  );
});

//  GET PRODUCT DISCOUNT

productController.getProductDiscount = catchAsync(async (req, res, next) => {
  let { page, limit, name, ...filterQuery } = req.query;

  const filterKeys = Object.keys(filterQuery);
  if (filterKeys.length)
    throw new AppError(400, "Not Accepted Query", "Bad Request");

  const filterConditions = [{ isDeleted: false, status: "Discount" }];
  if (name) {
    filterConditions.push({
      productName: { $regex: name, $options: "i" },
    });
  }
  const filterCritera = filterConditions.length
    ? { $and: filterConditions }
    : {};

  const count = await Product.countDocuments(filterCritera);
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  const totalPages = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  let Products = await Product.find(filterCritera)
    .sort({ createdAt: -1 })
    .populate("author")
    .limit(limit)
    .skip(offset);

  return sendResponse(
    res,
    200,
    true,
    { Products, totalPages, count },
    null,
    "Get  Product Discount successful"
  );
});

//  GET SINGLE PRODUCT

productController.getSingleProduct = catchAsync(async (req, res, next) => {
  const productId = req.params.id;

  let product = await Product.findById(productId).populate("author");
  if (!product) {
    throw new AppError(400, "Product Not Found", "Get Single Product Error");
  }
  product = product.toJSON();
  product.review = await Review.find({ product: product._id });
  return sendResponse(
    res,
    200,
    true,
    product,
    null,
    "Get Single Product Successfully"
  );
});

//  UPDATE SINGLE PRODUCT

productController.updateSingleProduct = catchAsync(async (req, res, next) => {
  const currentSellertId = req.userId;
  const productId = req.params.id;

  let product = await Product.findById(productId);
  if (!product) {
    throw new AppError(400, "Product Not Found", "Update Product Error");
  }
  if (!product.author.equals(currentSellertId)) {
    throw new AppError(
      400,
      "Only Author Can Edit Product",
      "Update Product Error"
    );
  }

  const allows = [
    "productName",
    "description",
    "types",
    "price",
    "priceSale",
    "unit",
    "image",
    "rating",
    "status",
  ];
  allows.forEach((field) => {
    if (req.body[field] !== undefined) {
      product[field] = req.body[field];
    }
  });
  await product.save();

  return sendResponse(
    res,
    200,
    true,
    product,
    null,
    "Update Product successful"
  );
});

//  DELETE SINGLE PRODUCT

productController.deleteSingleProduct = catchAsync(async (req, res, next) => {
  const productId = req.params.id;
  let product = await Product.findOneAndUpdate(
    { _id: productId },
    { isDeleted: true }
  );
  if (!product) {
    throw new AppError(400, " Product Not Found", " Delete Product Error");
  }

  return sendResponse(
    res,
    200,
    true,
    product,
    null,
    "Delete Product Successfully"
  );
});

module.exports = productController;
