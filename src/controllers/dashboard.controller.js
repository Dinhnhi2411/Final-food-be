const { catchAsync, sendResponse } = require("../helpers/utils");
const Order = require("../model/Order");
const Product = require("../model/Product");
const User = require("../model/User");

const dashboardController = {};

const getDashBoard = async function (queryDash) {
  let { rangeDays } = queryDash;
  rangeDays = rangeDays
    .split(",")
    .map((date) => new Date(+date))
    .reverse();

  const startDays = rangeDays[0];
  // const endDays = new Date(
  //   rangeDays[rangeDays.length - 1].setUTCHour(23, 59, 59, 999)
  // );

  const day = new Date();
  let month = day.getMonth();
  let year = day.getFullYear();

  const info = {
    revenue: 0,
    totalCustomer: 0,
    totalOrder: 0,
    totalProduct: 0,
    lastestOrders: [],
  };
 
  const getOrdersByDate = [
    {
      $match: {
        createdAt: {
          $gte: startDays,
          // $lte: endDays,
        },
        
      },
    },
    {
      $project: {
        days: { $dateToString: { format: "%d-%m-%Y", date: "$createdAt" } },
      },
    },
    {
      $group: {
        _id: "$days",
        count: { $count: {} },
      },
    },
    {
      $project: {
        _id: 1,
        day: "$_id",
        count: 1,
      },
    },
  ];

  const countByMonth = [
 
    {
      $group: {
        _id: {
          year: {
            $year: "$createdAt",
          },
          month: {
            $month: "$createdAt",
          },
        },
        count: { $count: {} },
      },
    },
    {
      $match: {
        "_id.month": { $gte: month, $lte: month + 1 },
        "_id.year": year,
      },
    },
    {
      $project: {
        _id: 0,
        month: "$_id.month",
        count: 1,
      },
    },
  ];

  const sumByMonth = [
    {
      $match: {
        status: "Delivered",
      },
    },
    {
      $group: {
        _id: {
          year: {
            $year: "$createdAt",
          },
          month: {
            $month: "$createdAt",
          },
        },
        count: { $count: {} },
        total: { $sum: "$total" },
        // check
      },
    },
    {
      $match: {
        "_id.month": { $gte: month, $lte: month + 1 },
        "_id.year": year,
      },
    },
    {
      $project: { _id: 0, month: "$_id.month", total: 1, count: 1 },
    },
  ];

  const totalCustomer = await User.aggregate(countByMonth);
  const totalProduct = await Product.aggregate(countByMonth);
  const totalOrder = await Order.aggregate(countByMonth);
  const revenue = await Order.aggregate(sumByMonth);
  const lastestOrders = await Order.aggregate(getOrdersByDate);

  info.totalCustomer = totalCustomer;
  info.totalProduct = totalProduct;
  info.totalOrder = totalOrder;
  info.revenue = revenue;
  info.lastestOrders = lastestOrders;

  return info;
};

dashboardController.getAllDashBoard = catchAsync(async (req, res, next) => {
  const info = await getDashBoard(req.query);
  return sendResponse(
    res,
    200,
    true,
    info,
    "",
    "Get All DashBoard Successfully"
  );
});

module.exports = dashboardController;
