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

// Reset Password
router.route('/resetPassword/:token').patch(authController.resetPassword);

// Protect Regular routes
router.use(authController.protect);

// Get user profile (Logged in users)
router.route('/profile').get(authController.profile);

// Restrict to admin
router.use(authController.restrictTo('admin', 'admin-instructor'));

// Regular User Routes
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

// Export Router
module.exports = router;
