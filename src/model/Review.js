const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = Schema(
  {
    content: {
      type: String,
      required: true,
    },
    image: {
       type: String 
      },
    isPurchased: {
      type: Boolean,
      default: false,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    rateAverage: {
      type: Number,
      default: 0,
    },
    rate: {
      type: Number,
      default: 0,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    productId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
