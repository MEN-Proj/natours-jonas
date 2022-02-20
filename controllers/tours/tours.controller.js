const { Tour } = require('../../models/tour/tour.model');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = async (req, res) => {
  // filtering
  const queryObj = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach((el) => delete queryObj[el]);

  //advanced filtering
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gt|gte|lte|lt)\b/g, (match) => `$${match}`);

  // create query
  let query = Tour.find(JSON.parse(queryStr));

  // sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // show or hide specific fields
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
  } else {
    query = query.select('-__v');
  }

  // pagination
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 100;
  const skip = (page - 1) * limit;

  console.log(typeof page);

  try {
    if (req?.query?.page) {
      const totalDocuments = await Tour.estimatedDocumentCount();
      if (skip >= totalDocuments) {
        throw new Error('This page does not exist');
      }
    }

    query = query.skip(skip).limit(limit);
    // execute query
    const tours = await query.exec();
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
