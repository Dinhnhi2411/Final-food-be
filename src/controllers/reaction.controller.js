const { sendResponse, AppError, catchAsync } = require("../helpers/utils");
const Reaction = require("../model/Reaction");
const Product = require("../model/Product")
const Review = require("../model/Review");

const reactionController = {};

// funct get reaction  return reactions
const getAllReactionPro = async function (query) {
  const reactions = await Reaction.paginate(query);

  return reactions;
};

// funct create reaction return totalRatings

const createReactionPro = async function (userId, reactionBody) {
  const { targetId, rating, refPaths } = reactionBody;
  
  let reaction = await Reaction.findOne({
    refPaths,
    targetId,
    userId
    });

  let message = "";
  if (!reaction) {
    await Reaction.create({ refPaths, targetId, userId, rating });
    message = "Added reaction";
  } else {
    reaction.rating = rating;
    await reaction.save();
    message = "Updated reaction";
  }

const totalRatings = await Reaction.calTotalRating(targetId);

// find and update

await Review.findOneAndUpdate({ _id: targetId }, { ...totalRatings });


  return totalRatings;
};


// CREATE REACTION

reactionController.createReaction = catchAsync(async (req, res, next) => {
  const userId = req.userId;
  const reaction = await createReactionPro(userId, req.body);
  
  // response

  return sendResponse(
    res,
    200,
    true,
    {reaction},
    null,
    "Create Reaction successfully"
  );
});

// GET ALL REACTIONS

reactionController.getAllReaction = catchAsync(async(req, res, next)=> {
const reaction = await Reaction.find(req.query);

// response

return sendResponse(
    res,
    200,
    true,
    reaction,
    null,
    "Get Reactions successfully"
  );

});


module.exports = reactionController;