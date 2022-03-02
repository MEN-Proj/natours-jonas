const { Review } = require('../../models/review/review.model');
const { successResponse } = require('../../utils/apiSuccessResponse');

exports.getAllReviews = async (req, res, next) => {
  const filter = req.params.tourId ? { tour: req.params.tourId } : {};

  const reviews = await Review.find(filter);

  successResponse(res, reviews);
};

exports.createReview = async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user._id;

  const { review, rating, tour, user } = req.body;

  const newReview = await Review.create({
    review,
    rating,
    tour,
    user,
  });

  successResponse(res, newReview, 201);
};
