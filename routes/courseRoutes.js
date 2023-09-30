const express = require('express');
const {
  createCourse,
  getAllCourses,
  getCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courseController');
const courseController = require('../controllers/courseController');
const authController = require('../controllers/authController');

// Express Router
const router = express.Router();

// Get Expensive courses
router.get('/expensive-courses', courseController.getExpensiveCourses);

// Get cheap courses
router.get('/cheap-courses', courseController.getCheapCourses);

// Regular Routes
router.route('/').post(createCourse).get(authController.protect, getAllCourses);

router.route('/:id').get(getCourse).patch(updateCourse).delete(deleteCourse);

module.exports = router;
