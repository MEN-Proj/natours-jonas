const express = require('express');
const {
  getAllReviews,
  createReview,
} = require('../../controllers/reivew/review.controller');
const {
  authMiddleware,
  restrictTo,
} = require('../../middlewares/auth.middleware');

const reviewRouter = express.Router({ mergeParams: true });

reviewRouter.use(authMiddleware);

reviewRouter
  .route('/')
  .get(getAllReviews)
  .post(restrictTo('user'), createReview);

module.exports = { reviewRouter };
