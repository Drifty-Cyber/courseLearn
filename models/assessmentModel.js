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
});
