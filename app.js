const morgan = require('morgan');
const express = require('express');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const coursesRouter = require('./routes/courseRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

// Create Express app
const app = express();

// SETUP MORGAN - Dev Environment
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// PARSE BODY DATA
app.use(express.json());

// Parse cookies
app.use(cookieParser());

// Prevent XSS attacks
app.use(xss());

//MIDDLEWARE TO TRACK REQUEST TIME
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// MOUNT ROUTERS
app.use('/api/v1/courses', coursesRouter);
app.use('/api/v1/users', userRouter);

// UNSPECIFIED ROUTES
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Error Handler
// app.use((err, req, res, next) => {
//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || 'error';

//   res.status(err.statusCode).json({
//     status: err.status,
//     message: err.message,
//   });
// });
app.use(globalErrorHandler);

// Export App
module.exports = app;
