const morgan = require('morgan');
const express = require('express');
const coursesRouter = require('./routes/courseRoutes');
const AppError = require('./utils/appError');

const app = express();

// SETUP MORGAN
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// PARSE BODY DATA
app.use(express.json({ limit: '10kb' }));

// MOUNT ROUTERS
app.use('/api/v1/courses', coursesRouter);

// UNSPECIFIED ROUTES
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

module.exports = app;
