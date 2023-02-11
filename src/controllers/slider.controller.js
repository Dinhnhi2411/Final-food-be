const { catchAsync, AppError, sendResponse } = require("../helpers/utils");
const Slider = require("../model/Slider");

const sliderController = {};

// CREATE SLIDER

sliderController.createSlider = catchAsync(async (req, res, next) => {
  let { sliderShow } = req.body;

  let sliderItem = await Slider.findOne({ sliderShow });

  // check exist slider

  if (sliderItem) {
    throw new AppError(
      400,
      "SliderItem Already Exists",
      "Create SliderItem Error"
    );
  }

  // create slider

  sliderItem = await Slider.create({ sliderShow });

  // response

  sendResponse(
    res,
    200,
    true,
    sliderItem,
    null,
    "Create SliderItem Successfully"
  );
});

// GET ALL SLIDER

sliderController.getSlider = catchAsync(async (req, res, next) => {
  let { page, limit, ...filterQuery } = req.query;

// filterkeys

  const filterKeys = Object.keys(filterQuery);
  if (filterKeys.length) {
    throw new AppError(400, "Not Accepted Query", "Bad Request");
  }

// find slider

  let Sliders = await Slider.find({ isDeleted: false }).sort({ createAt: -1 });


 // count & page & totalPages

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  const count = Sliders.length;
  const totalPages = Math.ceil(count / limit);

// response

  return sendResponse(
    res,
    200,
    true,
    { Sliders, totalPages, count },
    null,
    "Get Slider Successfully"
  );
});

module.exports = sliderController;
