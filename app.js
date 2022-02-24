const express = require('express');
const morgan = require('morgan');
const { tourRouter } = require('./routes/tours/tour.routes');
const { userRouter } = require('./routes/users/user.routes');
const { AppError } = require('./utils/AppError');
const {
  globalErrorHandler,
} = require('./middlewares/globalErrorHandler.middleware');

const app = express();

app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = { app };
