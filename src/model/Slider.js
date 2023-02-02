const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sliderSchema = Schema(
  {
    sliderShow: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
);

const Slider = mongoose.model("Slider", sliderSchema);
module.exports = Slider;
