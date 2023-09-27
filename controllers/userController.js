const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Utility Function
const sendResponse = (statusCode, payload, req, res) => {
  res.status(statusCode).json({
    status: 'success',
    data: {
      payload,
    },
  });
};

// Get all users
exports.getAllUsers = catchAsync(async (req, res, next) => {
  // Query
  const users = await User.find();

  // Response
  res.status(200).json({
    status: 'success',
    data: {
      users,
    },
  });
});

// Get user by ID
exports.getUser = catchAsync(async (req, res, next) => {
  // Query
  const user = await User.findById(req.params.id);

  // Response
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});
