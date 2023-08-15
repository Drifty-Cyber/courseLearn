const express = require('express');
const {
  sayWelcome,
  createCourse,
  getAllCourses,
  getCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courseController');

const router = express.Router();

router.route('/').post(createCourse).get(getAllCourses);

router.route('/:id').get(getCourse).patch(updateCourse).delete(deleteCourse);

module.exports = router;
