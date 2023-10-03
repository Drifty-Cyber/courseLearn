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

// Forgot Password
router.route('/forgotPassword').post(authController.forgotPassword);

// Protect Regular routes
router.use(authController.protect);

// Get user profile (Logged in users)
router.route('/profile').get(authController.profile);

// Regular User Routes
router.route('/').get(userController.getAllUsers);

router.route('/:id').get(userController.getUser);

// Export Router
module.exports = router;
