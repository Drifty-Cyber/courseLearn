const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

// Express Router
const router = express.Router();

// Signup
router.route('/signup').post(authController.signup);

// Login
router.route('/login').post(authController.login);

// Logout
router.route('/logout').get(authController.logout);

// Protect Regular routes
router.use(authController.protect);

// Regular User Routes
router.route('/').get(userController.getAllUsers);

router.route('/:id').get(userController.getUser);

module.exports = router;
