const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// const createSendToken = (user, statusCode, req, res) => {
//   const token = signToken(user._id);

//   const cookieOptions = {
//     expires: new Date(
//       Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
//     ),
//     httpOnly: true,
//     // secure:
//     //   req.secure === 'true' || req.headers['x-forwarded-proto'] === 'true',
//   };

//   res.cookie('jwt', token, cookieOptions);

//   // Remove password from output
//   user.password = undefined;

//   // Response
//   res.status(statusCode).json({
//     status: 'success',
//     token,
//     data: {
//       user,
//     },
//   });
// };

// Signup Controller
exports.signup = catchAsync(async (req, res, _next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  // const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
  //   expiresIn: process.env.JWT_EXPIRES_IN,
  // });
  const token = signToken(newUser._id);

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
