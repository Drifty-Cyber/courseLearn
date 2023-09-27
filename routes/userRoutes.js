const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

// Express Router
const router = express.Router();

// Signup
router.route('/signup').post(authController.signup);

// Users Routes
router.route('/').get(userController.getAllUsers);

router.route('/:id').get(userController.getUser);

module.exports = router;
