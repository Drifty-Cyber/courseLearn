const morgan = require('morgan');
const express = require('express');
const coursesRouter = require('./routes/courseRoutes');

const app = express();

// SETUP MORGAN
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// PARSE BODY DATA
app.use(express.json());

// MOUNT ROUTERS
app.use('/api/v1/courses', coursesRouter);

module.exports = app;
