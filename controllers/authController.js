const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { promisify } = require('util');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Email = require('../utils/email');

const signToken = (id) =>
  jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    // secure:
    //   req.secure === 'true' || req.headers['x-forwarded-proto'] === 'true',
  };

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  // Response
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
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

  createSendToken(newUser, 201, req, res);
});

// Login
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if user provides email and password
  if (!email || !password) {
    return next(new AppError('Please provide an Email and Password', 400));
  }

  // Check if user exists and password is vaid
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect Email or Password', 401));
  }

  // Send Token
  createSendToken(user, 200, req, res);
});

// Protect
exports.protect = catchAsync(async (req, res, next) => {
  let token;

  // Check if token is present
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  // console.log(req.cookies);

  // console.log(token);

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401)
    );
  }

  // Verify Token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // console.log(decoded);

  // Get user based on decoded ID
  const currentUser = await User.findById(decoded.id);
  // console.log(currentUser);

  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token does not exist', 401)
    );
  }

  // Check if user has changed password after JWT was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return new AppError(
      'User recently changed password! Please log in again',
      401
    );
  }

  // If all checks complete with no errors, place user on request object
  req.user = currentUser;
  // console.log(req);

  // Grant access by moving to next middleware
  next();
});

// Logout
exports.logout = (req, res, next) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 50 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully',
  });
};

// Restrict User Actions based on Roles
exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };

// Get user profile
exports.profile = catchAsync(async (req, res, next) => {
  let token;

  // Get token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  // Guard Clause
  if (!token) {
    return next(
      new AppError(
        'You are not logged in! Please log in to view your profile.',
        401
      )
    );
  }

  // Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // Find user by ID from JWT
  const currentUser = await User.findById(decoded.id);

  res.status(200).json({
    status: 'success',
    data: {
      currentUser,
    },
  });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // Get email from request body
  const { email } = req.body;

  // Get user with email
  const user = await User.findOne({ email });

  // Guard clause
  if (!user) {
    return next(new AppError('There is no user with this email address.', 404));
  }

  // Generate random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // Send Mail to user
  try {
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;
    // console.log(resetURL);
    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    // console.log(err);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Receive Token and Find user
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  // THIS QUERY FINDS THE USER FOR THE TOKEN AND CHECKS IF THE TOKEN HAS NOT YET EXPIRED
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired and there is a user, set the new password
  if (!user) {
    return next(new AppError('The token has expired or is invalid!', 400));
  }

  // Changing user password to requested password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // Log user in and send JWT
  createSendToken(user, 200, req, res);
});
