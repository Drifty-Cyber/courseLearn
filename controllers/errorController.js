const AppError = require('../utils/appError');

// Handle Duplicate Fields
const handleDuplicateFieldsDB = (err) => {
  const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field ${value}. Please use another value!`;
  return new AppError(message, 400);
};

// Handle Cast Error
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

// Handle Validation Error
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((errObj) => errObj.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

// Send Error in 'Development' Environment
const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // If Rendered Website becomes available⬇⬇⬇⬇⬇
};

// Send Error in 'Production' Environment
const sendErrorProd = (err, req, res, next) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Programming Error
  return res.status(err.statusCode).json({
    status: 'error',
    message: 'Something went very wrong!',
  });
};

// Export Error Function
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (err.name === 'CastError') error = handleCastErrorDB(err);
    if (err.code === 11000) error = handleDuplicateFieldsDB(err);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(err);

    sendErrorProd(error, req, res);
  }
};
