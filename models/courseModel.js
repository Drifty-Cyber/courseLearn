const mongoose = require('mongoose');
const slugify = require('slugify');

const courseSchema = new mongoose.Schema({
  courseTitle: {
    type: String,
    required: [true, 'A course must have a title'],
    unique: true,
  },
  slug: String,
  price: {
    type: Number,
    required: [true, 'A course must have a price'],
  },
  courseDescription: String,
  leadInstructor: String,
  instructors: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  ],
  difficulty: String,
  prerequisites: [String],
  learningObjectives: [String],
  images: String,
  ratingsAverage: Number,
  ratingsQuantity: Number,
  enrolledStudents: Number,
  courseDuration: String,
  courseLength: [Number],
  // assignments
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
