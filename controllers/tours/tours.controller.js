const { Tour } = require('../../models/tour/tour.model');
const { APIFeatures } = require('../../utils/APIFeatures');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = async (req, res) => {
  const features = new APIFeatures(Tour, req.query)
    .filter()
    .sort()
    .limit()
    .paginate();

  try {
    // execute query
    const tours = await features.query.exec();
    // response
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (e) {
    res.status(500).json({ status: 'fail', error: e.message });
  }
};

exports.getTour = (req, res) => {
  const id = req.params.id;

  res.status(200).json({
    status: 'success',
    data: {
      tour: 'Get tour by id',
    },
  });
};

exports.createTour = async (req, res) => {
  try {
    const tour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (e) {
    res.status(500).json(e);
  }
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>',
    },
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
