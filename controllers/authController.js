const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = (id) => {
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Signup Controller
exports.signup = catchAsync(async (req, res, _next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(201).json({
    status: 'success',
    token,
    newUser,
  });

  // createSendToken(newUser, 201, req, res);
});

// Login
// exports.login = catchAsync(async (req, res, next) => {
//   const { email, password } = req.body;

//   // Check if user provides email and password
//   if (!email || !password) {
//     return next(new AppError('Please provide an Email and Password', 400));
//   }

//   // Check if user exists and password is vaid
//   const user = await User.findOne({ email }).select('+password');

//   if (!user || !(await user.correctPassword(password, user.password))) {
//     return next(new AppError('Incorrect Email or Password', 401));
//   }

//   // Send Token
//   createSendToken(user, 200, req, res);

//   //
// });
