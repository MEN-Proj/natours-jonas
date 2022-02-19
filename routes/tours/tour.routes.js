const express = require('express');
const {
  getAllTours,
  checkBody,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  checkID,
} = require('../../controllers/tours/tours.controller');

const tourRouter = express.Router();

tourRouter.param('id', checkID);

tourRouter.route('/').get(getAllTours).post(checkBody, createTour);

tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = { tourRouter };
