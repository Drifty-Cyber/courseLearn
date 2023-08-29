const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'An Assignment must have a question'],
    unique: true,
  },
  submissionDate: {
    type: String,
    required: [true, 'An Assignment must have a submission date'],
  },
});

const Assignment = mongoose.model('Assignment', assignmentSchema);
module.exports = Assignment;
