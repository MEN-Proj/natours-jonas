const mongoose = require('mongoose');
const { AppError } = require('../utils/AppError');
const { StatusCodes } = require('../utils/statusCodes');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, StatusCodes.BAD_REQUEST);
};

const handleDuplicateFieldsDB = (err) => {
  const message = `Duplicate field value: ${err.keyValue.name}. Please use another value!`;
  return new AppError(message, StatusCodes.BAD_REQUEST);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, StatusCodes.BAD_REQUEST);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', StatusCodes.UNAUTHORIZED);

const handleJWTExpiredError = () =>
  new AppError(
    'Your token has expired! Please log in again.',
    StatusCodes.UNAUTHORIZED,
  );

const sendErrorDev = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  } else {
    res.json({ msg: 'not a isOperational error.', err });
    console.log(err);
  }
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error('ERROR 💥', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

exports.globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = null;
    // console.log(err.name);

    if (err instanceof mongoose.Error.CastError || err.name === 'CastError') {
      error = handleCastErrorDB(err);
    }

    if (
      err instanceof mongoose.Error.ValidationError ||
      err.name === 'ValidationError'
    ) {
      error = handleValidationErrorDB(err);
    }

    if (err.name === 'MongoServerError' && err.code === 11000) {
      error = handleDuplicateFieldsDB(err);
    }

    if (err.name === 'JsonWebTokenError') {
      error = handleJWTError();
    }

    if (err.name === 'TokenExpiredError') {
      error = handleJWTExpiredError();
    }

    error ? sendErrorProd(error, res) : sendErrorProd(err, res);
  }
};
