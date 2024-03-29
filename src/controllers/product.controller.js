const { sendResponse, AppError, catchAsync } = require("../helpers/utils");
const Product = require("../model/Product");
const Review = require("../model/Review");

const productController = {};

// CREATE NEW PRODUCT

productController.createNewProduct = catchAsync(async (req, res, next) => {
  const currentAdminId = req.userId;

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

  // check exist product

  if (product) {
    throw new AppError(400, "Product Already Exists", "Error Create Product");
  }

  // create product

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
    author: currentAdminId,
  });

  product = await product.populate("author");

  // response

  sendResponse(res, 200, true, product, null, "Create Product Successfully");
});

// GET ALL PRODUCTS

productController.getAllProducts = catchAsync(async (req, res, next) => {
 

  let { limit, page, sortBy, populate, select,  ...filter } = req.query;


  // setup search by name

  if (req.query.productName) {
    req.query.productName = { $regex: req.query.productName, $options: "i" };
  } else {
    delete req.query.productName;
  }

  //  set up filter by status product

  if (req.query.sortBy === "New") {
  req.query.status = "New";
  }
  if (req.query.sortBy?.includes("Discount")) {
    req.query.status = "Discount";
  }
  if (req.query.sortBy?.includes("Top")) {
    req.query.status = "Top";
  }

  //  setup filter by types

    if (req.query.sortBy === "Fruit") {
    req.query.types = "Fruit";
  }
      if (req.query.sortBy === "Vegetable") {
    req.query.types = "Vegetable";
  }

   //  setup filter by price
if(req.query.sortBy === "All" ) {
  req.query.price
}

if(req.query.sortBy === "Below" ){
  req.query.price = {$lt:6}
}
if(req.query.sortBy === "Above" ){
  req.query.price = {$gt:10}
}
if(req.query.sortBy === "Between" ){
  req.query.price = {$in:[6,10]}
}


  // count & page & totalPages
  const count = await Product.countDocuments(req.query);
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  const totalPages = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  // find product theo điều kiện

   let products = await Product.find(req.query, {isDeleted:false})
    .sort({ updatedAt: -1})
    .limit(limit)
    .skip(offset);
  

  // response
  return sendResponse(
    res,
    200,
    true,
    { products, totalPages, count, page },
    null,
    "Get Current Product Successfully"
  );
});

// productController.getAllProducts = catchAsync(async (req, res, next) => {
//   let {
//     page,
//     limit,
//     name,
//     types,
//     status,
//     price_max,
//     price_min,
//     ...filterQuery
//   } = req.query;

//   const filterKeys = Object.keys(filterQuery);
//   if (filterKeys.length)
//     throw new AppError(400, "Not accepted query", "Bad Request");

//   const filterConditions = [{ isDeleted: false }];
//   if (name) {
//     filterConditions.push({
//       productName: { $regex: name, $options: "i" },
//     });
//   }
//   if (types) {
//     filterConditions.push({
//       types: { $regex: types, $options: "i" },
//     });
//   }
//   if (status) {
//     filterConditions.push({
//       status: { $regex: status, $options: "i" },
//     });
//   }
  
//   if (price_max && price_min) {
//    filterConditions.push({
//       price: {
//       $lte: parseInt(price_max) || 15,
//       $gte: parseInt(price_min) || 0,
//       }
//     });

//   }

//   const filterCritera = filterConditions.length
//     ? { $and: filterConditions }
//     : {};

//   const count = await Product.countDocuments(filterCritera);
//   page = parseInt(page) || 1;
//   limit = parseInt(limit) || 10;
//   const totalPages = Math.ceil(count / limit);
//   const offset = limit * (page - 1);

//   let products = await Product.find(filterCritera)
//     .sort({ createdAt: -1 })
//     .populate("author")
//     .limit(limit)
//     .skip(offset);

//   return sendResponse(
//     res,
//     200,
//     true,
//     { products, totalPages, count, page },
//     null,
//     "Get Currenr Product successful"
//   );
// });

//  GET PRODUCT TOP SELLING

productController.getProductTopSelling = catchAsync(async (req, res, next) => {
  let { page, limit, name, ...filterQuery } = req.query;

  // filterkeys

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

  // count product & page & totalPages

  const count = await Product.countDocuments(filterCritera);
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  const totalPages = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  // find product

  let Products = await Product.find(filterCritera)
    .sort({ createdAt: -1 })
    .populate("author")
    .limit(limit)
    .skip(offset);

  // response

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

  // filterkeys

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

  // count product & page & totalPages

  const count = await Product.countDocuments(filterCritera);
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  const totalPages = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  // find product

  let Products = await Product.find(filterCritera)
    .sort({ createdAt: -1 })
    .populate("author")
    .limit(limit)
    .skip(offset);

  // response

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

  // filterkeys

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

  // count product & page & totalPages

  const count = await Product.countDocuments(filterCritera);
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  const totalPages = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  // find product

  let Products = await Product.find(filterCritera)
    .sort({ createdAt: -1 })
    .populate("author")
    .limit(limit)
    .skip(offset);

  // response

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

  // find product by id

  let product = await Product.findById(productId).populate("author");
  if (!product) {
    throw new AppError(400, "Product Not Found", "Get Single Product Error");
  }

  product = product.toJSON();

  // find review

  product.review = await Review.find({ product: product._id });

  // reponse

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
  const currentAdmintId = req.userId;
  const productId = req.params.id;

  let product = await Product.findById(productId);

  // check exist product

  if (!product) {
    throw new AppError(400, "Product Not Found", "Update Product Error");
  }

  // check author

  if (!product.author.equals(currentAdmintId)) {
    throw new AppError(
      400,
      "Only Author Can Edit Product",
      "Update Product Error"
    );
  }

  // allows update

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

  // response

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
  // const {user} = req.user;

  let product = await Product.findByIdAndDelete(
    productId)
  

  // check exist product

  if (!product) {
    throw new AppError(400, " Product Not Found", " Delete Product Error");
  }

  // response

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
