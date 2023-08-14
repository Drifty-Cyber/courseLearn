const express = require('express');
const { sayWelcome } = require('../controllers/courseController');

const router = express.Router();

router.get('/', sayWelcome);

module.exports = router;
