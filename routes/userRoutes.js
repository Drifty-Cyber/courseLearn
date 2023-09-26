const express = require('express');
const authController = require('../controllers/authController');

// Express Router
const router = express.Router();

// Signup
router.route('/signup').post(authController.signup);

module.exports = router;
