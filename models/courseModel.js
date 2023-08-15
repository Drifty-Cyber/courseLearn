const mongoose = require('mongoose');
const slugify = require('slugify');

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A course must have a name'],
    unique: true,
  },
  slug: String,
  price: {
    type: Number,
    required: [true, 'A course must have a price'],
  },
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
