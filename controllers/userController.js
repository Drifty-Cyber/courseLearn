const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Utility Function
const sendResponse = (statusCode, data, req, res) => {
  res.status(statusCode).json({
    status: 'success',
    data: {
      data,
    },
  });
};

// Get all users
exports.getAllUsers = catchAsync(async (req, res, next) => {
  // Query
  const users = await User.find();

  // Response
  //   res.status(200).json({
  //     status: 'success',
  //     data: {
  //       users,
  //     },
  //   });
  sendResponse(200, users, req, res);
});

// Get user by ID
exports.getUser = catchAsync(async (req, res, next) => {
  // Query
  const user = await User.findById(req.params.id).select('+active');

  // Response
  //   res.status(200).json({
  //     status: 'success',
  //     data: {
  //       user,
  //     },
  //   });
  sendResponse(200, user, req, res);
});
