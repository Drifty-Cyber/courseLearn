const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'An assessment must contain a question'],
    unique: true,
  },
  course: {
    type: mongoose.Schema.ObjectId,
    ref: 'Course',
  },
  instructor: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'An assessment must have an Instructor(s)'],
  },
});

const Assessment = mongoose.model('Assessment', assessmentSchema);
module.exports = Assessment;
