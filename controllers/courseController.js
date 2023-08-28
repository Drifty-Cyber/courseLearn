const Course = require('../models/courseModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Create Course
exports.createCourse = catchAsync(async (req, res, next) => {
  const course = await Course.create(req.body);

  if (!course) {
    return next(
      new AppError('Course could not be created. Please try again later!', 403)
    );
  }

  res.status(201).json({
    status: 'success',
    data: {
      course,
    },
  });
});

// Get All Courses
exports.getAllCourses = catchAsync(async (req, res, next) => {
  // console.log(req.query);

  const courseQuery = new APIFeatures(Course.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const courses = await courseQuery.query;
  //   const courses = await Course.find();
  const results = courses.length;

  if (!courses) {
    return next(
      new AppError('Courses could not be found. Please try again later!', 404)
    );
  }

  res.status(200).json({
    status: 'success',
    data: {
      results,
      courses,
    },
  });
});

// Get Course
exports.getCourse = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(new AppError('No course could be found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      course,
    },
  });
});

// Update Course
exports.updateCourse = catchAsync(async (req, res, next) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });

  if (!course) {
    return next(new AppError('No course could be found.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      course,
    },
  });
});

// Delete Course
exports.deleteCourse = catchAsync(async (req, res, next) => {
  const course = await Course.findByIdAndDelete(req.params.id);

  if (!course) {
    return next(new AppError('No course could be found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// AGGREGATION PIPELINE FOR COURSES
const getExpensiveCourses = catchAsync(async (req, res, next) => {
  const courses = await Course.aggregate([
    {
      $match: { price: { $gte: 500 } },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      courses,
    },
  });
});

const getCheapCourses = catchAsync(async (req, res, next) => {
  const courses = await Course.aggregate([
    {
      $match: { price: { $lte: 400 } },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      courses,
    },
  });
});
