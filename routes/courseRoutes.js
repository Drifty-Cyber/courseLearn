const express = require('express');
const { sayWelcome, createCourse } = require('../controllers/courseController');

const router = express.Router();

router.get('/', sayWelcome);

router.route('/').post(createCourse);

module.exports = router;
