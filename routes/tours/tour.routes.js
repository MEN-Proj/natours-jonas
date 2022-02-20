const express = require('express');
const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTours,
} = require('../../controllers/tours/tours.controller');

const tourRouter = express.Router();

tourRouter.route('/').get(getAllTours).post(createTour);

tourRouter.route('/top-5-tours').get(aliasTopTours, getAllTours);

tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = { tourRouter };
