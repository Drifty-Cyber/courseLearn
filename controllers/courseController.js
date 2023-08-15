const Course = require('../models/courseModel');

exports.sayWelcome = (req, res, next) => {
  console.log('Welcome to Course Learn');
  res.status(200).json({
    status: 'success',
    message: 'Welcome to course learn',
  });

  next();
};

exports.createCourse = async (req, res, next) => {
  const course = await Course.create(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      course,
    },
  });
};
