const morgan = require('morgan');
const express = require('express');
const xss = require('xss-clean');
const coursesRouter = require('./routes/courseRoutes');
const AppError = require('./utils/appError');

// Create Express app
const app = express();

// SETUP MORGAN - Dev Environment
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// PARSE BODY DATA
app.use(express.json());

// Prevent XSS attacks
app.use(xss());

//MIDDLEWARE TO TRACK REQUEST TIME
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// MOUNT ROUTERS
app.use('/api/v1/courses', coursesRouter);

// UNSPECIFIED ROUTES
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

// Export App
module.exports = app;
