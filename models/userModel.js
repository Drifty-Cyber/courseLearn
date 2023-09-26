const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must provide a name'],
  },
  email: {
    type: String,
    required: [true, 'A user must have an email address'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minLength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  role: {
    type: String,
    enum: ['user', 'student', 'instructor', 'admin'],
    default: 'student',
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

// Encrypt passwords before saving user account to database
userSchema.pre('save', async function (next) {
  // Guard Clause
  if (!this.isModified('password')) return next();

  // Hash Password
  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;

  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
