const { Review } = require('../../models/review/review.model');
const { successResponse } = require('../../utils/apiSuccessResponse');
const {
  deleteOne,
  updateOne,
  createOne,
} = require('../factory-controllers/handlerFactory');

exports.getAllReviews = async (req, res, next) => {
  const filter = req.params.tourId ? { tour: req.params.tourId } : {};

  const reviews = await Review.find(filter);

  successResponse(res, reviews);
};

exports.createReview = createOne(Review);

exports.updateReview = updateOne(Review);
exports.deleteReview = deleteOne(Review);
