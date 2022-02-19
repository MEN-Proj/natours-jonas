const express = require('express');
const morgan = require('morgan');
const { tourRouter } = require('./routes/tours/tour.routes');
const { userRouter } = require('./routes/users/user.routes');

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

module.exports = { app };
