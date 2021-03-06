const express = require('express');
const {
  getAllReviews,
  createReview,
  deleteReview,
  updateReview,
  getReview,
} = require('../../controllers/reivew/review.controller');
const {
  authMiddleware,
  restrictTo,
} = require('../../middlewares/auth.middleware');
const { setUserAndTourId } = require('../../middlewares/review.middleware');

const reviewRouter = express.Router({ mergeParams: true });

reviewRouter.use(authMiddleware);

reviewRouter
  .route('/')
  .get(getAllReviews)
  .post(restrictTo('user'), setUserAndTourId, createReview);

reviewRouter
  .route('/:id')
  .get(getReview)
  .patch(updateReview)
  .delete(deleteReview);

module.exports = { reviewRouter };
