const { Review } = require('../../models/review/review.model');
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require('../factory-controllers/handlerFactory');

exports.getAllReviews = getAll(Review);
exports.getReview = getOne(Review);
exports.createReview = createOne(Review);
exports.updateReview = updateOne(Review);
exports.deleteReview = deleteOne(Review);
