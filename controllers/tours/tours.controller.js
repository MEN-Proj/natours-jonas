const { Tour } = require('../../models/tour/tour.model');
const { APIFeatures } = require('../../utils/APIFeatures');
const { AppError } = require('../../utils/AppError');
const { successResponse } = require('../../utils/apiSuccessResponse');
const { StatusCodes } = require('../../utils/statusCodes');
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require('../factory-controllers/handlerFactory');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = getAll(Tour);
exports.getTour = getOne(Tour, {
  path: 'reviews',
});
exports.createTour = createOne(Tour);
exports.updateTour = updateOne(Tour);
exports.deleteTour = deleteOne(Tour);

exports.getTourStats = async (req, res, next) => {
  const query = Tour.aggregate([
    { $match: { ratingsAverage: { $gte: 4.5 } } },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRating: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    { $sort: { avgPrice: 1 } },
  ]);

  // execute query
  const tours = await query.exec();
  // response
  return successResponse(res, tours);
};

exports.getMonthlyPlan = async (req, res, next) => {
  const year = +req.params.year;
  const query = Tour.aggregate([
    { $unwind: '$startDates' },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: {
          $push: '$name',
        },
      },
    },
    { $addFields: { month: '$_id' } },
    {
      $project: {
        _id: 0,
      },
    },
  ]);

  const tours = await query.exec();

  return successResponse(res, tours);
};
