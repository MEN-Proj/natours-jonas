const { Review } = require('../../models/review/review.model');
const { successResponse } = require('../../utils/apiSuccessResponse');

exports.getAllReviews = async (req, res, next) => {
  const reviews = await Review.find();

  successResponse(res, reviews);
};

exports.createReview = async (req, res, next) => {
  const { review, rating, tour } = req.body;

  const newReview = await Review.create({
    review,
    rating,
    tour,
    user: req.user._id,
  });

  successResponse(res, newReview, 201);
};
