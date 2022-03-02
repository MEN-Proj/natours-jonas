const express = require('express');
const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
} = require('../../controllers/tours/tours.controller');
const {
  authMiddleware,
  restrictTo,
} = require('../../middlewares/auth.middleware');
const { reviewRouter } = require('../review/review.routes');

const tourRouter = express.Router();

tourRouter.use('/:tourId/reviews', reviewRouter);

tourRouter.route('/').get(getAllTours).post(createTour);

tourRouter
  .route('/top-5-tours')
  .get(aliasTopTours, authMiddleware, getAllTours);
tourRouter.route('/monthly-plan/:year').get(getMonthlyPlan);

tourRouter.route('/tour-stats').get(getTourStats);

tourRouter
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(authMiddleware, restrictTo('admin', 'lead-guide'), deleteTour);

module.exports = { tourRouter };
