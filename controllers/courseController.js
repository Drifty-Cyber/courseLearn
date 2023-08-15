const Course = require('../models/courseModel');

// Create Course
exports.createCourse = async (req, res, _next) => {
  const course = await Course.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      course,
    },
  });
};

// Get All Courses
exports.getAllCourses = async (req, res, _next) => {
  const courses = await Course.find();

  res.status(200).json({
    status: 'success',
    data: {
      courses,
    },
  });
};

// Get Course
exports.getCourse = async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      course,
    },
  });
};

// Update Course
exports.updateCourse = async (req, res, next) => {
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
};

// Delete Course
exports.deleteCourse = async (req, res, next) => {
  const course = await Course.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
};
