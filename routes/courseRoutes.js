const express = require('express');
const {
  createCourse,
  getAllCourses,
  getCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courseController');
const courseController = require('../controllers/courseController');

const router = express.Router();

router.route('/').post(createCourse).get(getAllCourses);

router.route('/:id').get(getCourse).patch(updateCourse).delete(deleteCourse);

// Get Expensive courses
router.get('/expensive-courses', courseController.getExpensiveCourses);

// Get ceap courses
router.get('/cheap-courses', courseController.getCheapCourses);

module.exports = router;
