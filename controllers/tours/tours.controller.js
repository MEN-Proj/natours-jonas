const { Tour } = require('../../models/tour/tour.model');
const { StatusCodes } = require('http-status-codes');
const { APIFeatures } = require('../../utils/APIFeatures');
const { AppError } = require('../../utils/AppError');
const { successResponse } = require('../../utils/apiSuccessResponse');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = async (req, res, next) => {
  const features = new APIFeatures(Tour, req.query)
    .filter()
    .sort()
    .limit()
    .paginate();

  // execute query
  const tours = await features.query.exec();
  // response
  return successResponse(res, tours);
};

exports.getTour = async (req, res, next) => {
  const id = req?.params?.id;

  const tour = await Tour.findById(id);

  if (!tour) {
    return next(new AppError('Tour not found', 400));
  }

  successResponse(res, tour);
};

exports.createTour = async (req, res, next) => {
  const tour = await Tour.create(req.body);

  return successResponse(res, tour, StatusCodes.CREATED);
};

exports.updateTour = async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  return successResponse(res, tour);
};

exports.deleteTour = async (req, res, next) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

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
