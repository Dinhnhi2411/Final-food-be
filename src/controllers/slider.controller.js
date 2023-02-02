const { catchAsync, AppError, sendResponse } = require("../helpers/utils");
const Slider = require("../model/Slider");

const sliderController={};

// CREATE SLIDER

sliderController.createSlider = catchAsync(async(req, res, next)=> {
    let { sliderShow } = req.body;

    let sliderItem = await Slider.findOne({ sliderShow });

    if (sliderItem) {
        throw new AppError(400, "SliderItem Already Exists", "Create SliderItem Error");
    };

    sliderItem = await Slider.create({ sliderShow });

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

sliderController.getSlider = catchAsync(async(req, res, next)=> {

    let {page, limit, ... filterQuery } = req.query;

    const filterKeys = Object.keys(filterQuery);
    if(filterKeys.length) {
        throw new AppError(400, "Not Accepted Query", "Bad Request");
    };

    let Sliders = await Slider.find({ isDeleted: false })
        .sort({ createAt: -1 });

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const count = Sliders.length;
    const totalPages = Math.ceil(count / limit);
    
    return sendResponse(
        res,
        200,
        true,
        {Sliders, totalPages, count},
        null,
        "Get Slider Successfully"
    );
});

module.exports = sliderController;