const morgan = require('morgan');
const express = require('express');

const app = express();

// SETUP MORGAN
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.get('/welcome', (req, res, next) => {
  res.status(200).json({
    status: 'Success',
    message: 'Welcome',
  });
});

module.exports = app;
