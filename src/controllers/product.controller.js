const { sendResponse, AppError, catchAsync } = require("../helpers/utils");
const Product = require("../model/Product");

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
    author: currentSellerId,
  });

  product = await product.populate("author");

  sendResponse(res, 200, true, product, null, "Create Product Successfully");
});

// GET ALL PRODUCTS

productController.getProduct = catchAsync(async (req, res, next) => {
  let { page, limit, name, types, ...filterQuery } = req.query;

  const filterKeys = Object.keys(filterQuery);
  if (filterKeys.length) {
    throw new AppError(400, "Not Accepted Query", "Bad Request");
  }

  const filterConditions = [{ isDeleted: false }];
  if (name) {
    filterConditions.push({
      productName: { $regex: name, $options: "i" },
    });
  }
  const filterCriteria = filterConditions.length
    ? { $and: filterConditions }
    : {};

  const count = await Product.countDocuments(filterCriteria);
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  const totalPages = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  let Products = await Product.find(filterCriteria)
    .sort({ createAt: -1 })
    .populate("author")
    .limit(limit);
  return sendResponse(
    res,
    200,
    true,
    { Products, totalPages, count },
    null,
    "Get Current Product Successfully"
  );
});

//  GET PRODUCT TOP SELLING

productController.getProductTopSelling = catchAsync(async (req, res, next) => {

    let { page, limit, name, ...filterQuery } = req.query

    const filterKeys = Object.keys(filterQuery);
    if (filterKeys.length)
        throw new AppError(400, "Not Accepted Query", "Bad Request");

    const filterConditions = [{ isDeleted: false, status: "Top" }]
    if (name) {
        filterConditions.push({
            productName: { $regex: name, $options: "i" },
        })
    }
    const filterCritera = filterConditions.length
        ? { $and: filterConditions }
        : {};

    const count = await Product.countDocuments(filterCritera)
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const totalPages = Math.ceil(count / limit);
    const offset = limit * (page - 1)

    let Products = await Product.find(filterCritera)
        .sort({ createdAt: -1 })
        .populate("author")
        .limit(limit)
        .skip(offset)

    return sendResponse(res, 200, true, { Products, totalPages, count }, null, "Get  Product Topselling successful")

});

//  GET PRODUCT NEW

productController.getProductNew = catchAsync(async (req, res, next) => {

    let { page, limit, name, ...filterQuery } = req.query

    const filterKeys = Object.keys(filterQuery);
    if (filterKeys.length)
        throw new AppError(400, "Not Accepted Query", "Bad Request");

    const filterConditions = [{ isDeleted: false, status: "Top" }]
    if (name) {
        filterConditions.push({
            productName: { $regex: name, $options: "i" },
        })
    }
    const filterCritera = filterConditions.length
        ? { $and: filterConditions }
        : {};

    const count = await Product.countDocuments(filterCritera)
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const totalPages = Math.ceil(count / limit);
    const offset = limit * (page - 1)

    let Products = await Product.find(filterCritera)
        .sort({ createdAt: -1 })
        .populate("author")
        .limit(limit)
        .skip(offset)

    return sendResponse(res, 200, true, { Products, totalPages, count }, null, "Get Product New successful")

});

//  GET PRODUCT DISCOUNT

productController.getProductDiscount = catchAsync(async (req, res, next) => {

    let { page, limit, name, ...filterQuery } = req.query

    const filterKeys = Object.keys(filterQuery);
    if (filterKeys.length)
        throw new AppError(400, "Not Accepted Query", "Bad Request");

    const filterConditions = [{ isDeleted: false, status: "Top" }]
    if (name) {
        filterConditions.push({
            productName: { $regex: name, $options: "i" },
        })
    }
    const filterCritera = filterConditions.length
        ? { $and: filterConditions }
        : {};

    const count = await Product.countDocuments(filterCritera)
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const totalPages = Math.ceil(count / limit);
    const offset = limit * (page - 1)

    let Products = await Product.find(filterCritera)
        .sort({ createdAt: -1 })
        .populate("author")
        .limit(limit)
        .skip(offset)

    return sendResponse(res, 200, true, { Products, totalPages, count }, null, "Get  Product Discount successful")

});


//  GET SINGLE PRODUCT

productController.getSingleProduct = catchAsync(async (req, res, next) => {
  const productId = req.params.id;

  let product = await Product.findById(productId).populate("author");
  if (!product) {
    throw new AppError(400, "Product Not Found", "Get Single Product Error");
  }

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

productController.deleteSingleProduct = catchAsync(async(req, res, next)=> {
    const currentSellerId = req.userId;
    const productId = req.params.id;
    let product = await Product.findOneAndUpdate(
        { _id: productId, author: currentSellerId },
        { isDeleted: true },
        { new: true }
    );
    if (!product) {
        throw  new AppError (400, "Producr Not Authorrized Or Product Not Found", " Delete Product Error");
    };

    return sendResponse(
        res,
         200,
          true,
           product, 
           null,
           "Delete Product Successfully"
    )
});

module.exports = productController;