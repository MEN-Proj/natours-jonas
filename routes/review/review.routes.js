const express = require('express');
const {
  getAllReviews,
  createReview,
} = require('../../controllers/reivew/review.controller');
const {
  authMiddleware,
  restrictTo,
} = require('../../middlewares/auth.middleware');

const reviewRouter = express.Router();

reviewRouter
  .route('/')
  .get(getAllReviews)
  .post(authMiddleware, restrictTo('user'), createReview);

module.exports = { reviewRouter };
