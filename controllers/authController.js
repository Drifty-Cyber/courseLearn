const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// const signToken = (id) => {
//   jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: })
// }

// Signup Controller
exports.signup = catchAsync(async (req, res, _next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  // Response
  res.status(201).json({
    status: 'success',
    data: {
      newUser,
    },
  });
});

// Login
