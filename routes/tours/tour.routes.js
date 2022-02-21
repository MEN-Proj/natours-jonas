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

const tourRouter = express.Router();

tourRouter.route('/').get(getAllTours).post(createTour);

tourRouter.route('/top-5-tours').get(aliasTopTours, getAllTours);
tourRouter.route('/monthly-plan/:year').get(getMonthlyPlan);

tourRouter.route('/tour-stats').get(getTourStats);

tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = { tourRouter };
