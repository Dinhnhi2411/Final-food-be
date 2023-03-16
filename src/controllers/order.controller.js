const { catchAsync, sendResponse, AppError } = require("../helpers/utils");
const Order = require("../model/Order");

const orderController = {};

// GET ALL ORDER BY DAS

orderController.getOrderDashBoard = catchAsync(async (req, res, next) => {
  const userId = req.userId;

  let { page, limit, status, ...filterQuery } = req.query;

// filterkey 

  const filterKeys = Object.keys(filterQuery);
  if (filterKeys.length)
    throw new AppError(400, "Not accepted query", "Bad Request");

    // filter conditions

  const filterConditions = [{ isDeleted: false }];
  if (status) {
    filterConditions.push({
      status: { $regex: status, $options: "i" },
    });
  }
  const filterCritera = filterConditions.length
    ? { $and: filterConditions }
    : {};

  // count & page & totalPages 

  const count = await Order.countDocuments(filterCritera);
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 5;
  const totalPages = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  // create 

  let ordersDashboard = await Order.find(filterCritera)
    .sort({ createdAt: -1 })
    .populate("userId")
    .populate({
      path: "products",
      populate: { path: "product" },
    })
    .limit(limit)
    .skip(offset);

  // response

  return sendResponse(
    res,
    200,
    true,
    { ordersDashboard, totalPages, count, page },
    null,
    "Get Currenr Order successful"
  );
});

// CREATE ORDER

orderController.createOrder = catchAsync(async (req, res, next) => {
  const userId = req.userId;
  const { name, addressShip, phone, products, priceShip, total } = req.body;

  // create order

  let order = await Order.create({
    name,
    addressShip,
    phone,
    products,
    priceShip,
    total,
    userId: userId,
  });

//response

  sendResponse(res, 200, true, order, null, "Create Order Sucessfully");
});

// GET ALL ORDER

orderController.getOrders = catchAsync(async (req, res, next) => {
  const userId = req.userId;
  let { page, limit, name, ...filterQuery } = req.query;

  // filterkeys

  const filterKeys = Object.keys(filterQuery);
  if (filterKeys.length) {
    throw new AppError(400, "Not Accepted Query", "Bad Request");
  }

  // count & page & totalPges

  const count = await Order.countDocuments({userId});
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 8;
  const totalPages = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  // orders

  let orders = await Order.find({ isDeleted: false, userId })
    .sort({ createAt: -1 })
    .populate("userId")
    .populate({
      path: "products",
      populate: { path: "product" },
    })
    .limit(limit)
    .skip(offset);

  // response

  return sendResponse(
    res,
    200,
    true,
    { orders, totalPages, count, page },
    "Get Current Order Successfully"
  );
});

// GET ORDER BY ID

orderController.getSingleOrder = catchAsync(async (req, res, next) => {
  const orderId = req.params.id;

// find order 

  let order = await Order.findById(orderId)
    .sort({ createAt: -1 })
    .populate("userId");

 // check exist order

  if (!order) {
    throw new AppError(400, "Order Not Exists", "Get Single Order Error");
  }

// response

  return sendResponse(
    res,
    200,
    true,
    { order },
    null,
    "Get Single Order Successfully"
  );
});

//  UPDATE ORDER

orderController.updateOrder = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  let order = await Order.findById(id);

  // check exist order

  if (!order) {
    throw new AppError(400, "Order Not Exists", "Update Order Error");
  }
  
  const allows = ["status", "shipping", "payment"];

  
  allows.forEach((field) => {
    if (req.body[field] !== undefined) {
      order[field] = req.body[field];
    }
  });

  await order.save();

  // response

  return sendResponse(res, 200, true, order, null, "Update Order Successfully");
});



// DELETE ORDER

orderController.deleteOrder = catchAsync(async (req, res, next) => {
  const currentOrderId = req.userId;
  const orderId = req.params.id;

// find and update order

  let order = await Order.findOneAndUpdate(
    { _id: orderId, author: currentOrderId },
    { isDeleted: true },
    { new: true }
  );

// check exist order

  if (!order) {
    throw new AppError(400, "Order Not Exists", "Delete Order Error");
  }

// response

  return sendResponse(res, 200, true, order, null, "Delete Order Successfully");
});

module.exports = orderController;
