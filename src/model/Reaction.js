
const mongoose = require("mongoose");
const Schema = mongoose.Schema;



const reactionSchema = Schema(
  {
    rate: {
        type: Number,
        min: 1,
        max: 5 
        },
    refPaths: {
      type: String,
      enum: ["Review", "Product"],
      require: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        refPath: "User",
        required: true 
        },
    targetId: {
      type: Schema.Types.ObjectId,
      refPath: "refPaths",
      required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false 
        },
  },
  {
    timestamps: true,
  }
);

reactionSchema.statics.calTotalRating = async function (targetId) {
  targetId = mongoose.Types.ObjectId(targetId);

  const totalRatings = await this.aggregate([
    {
      $match: {
        targetId: targetId,
      },
    },
    {
      $group: {
        _id: "$targetId",
        totalRatings: { $sum: 1 },
        rateAverage: { $avg: "$rate" },
      },
    },
    {
      $project: {
        totalRatings: 1,
        rateAverage: { $round: ["$rateAverage", 1] },
      },
    },
  ]);

  return totalRatings[0];
};

const Reaction = mongoose.model("Reaction", reactionSchema);
module.exports = Reaction;