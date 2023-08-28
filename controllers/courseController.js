const Course = require('../models/courseModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');

// Create Course
exports.createCourse = catchAsync(async (req, res, next) => {
  const course = await Course.create(req.body);

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
