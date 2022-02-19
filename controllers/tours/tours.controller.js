exports.checkID = (req, res, next, val) => {
  console.log(`Tour id is: ${val}`);

  next();
};

exports.checkBody = (req, res, next) => {
  if (!req?.body?.name || !req?.body?.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price',
    });
  }
  next();
};

exports.getAllTours = (req, res) => {
  console.log(req.requestTime);

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: 0,
    data: {
      tours: 'All tours',
    },
  });
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

exports.createTour = (req, res) => {
  res.status(201).json({
    status: 'success',
    data: {
      tour: 'newTour createTour',
    },
  });
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
