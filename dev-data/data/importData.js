const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('../../models/courseModel');
const User = require('../../models/userModel');

dotenv.config({ path: './config.env' });

//CONNECTING MONGOOSE
//REPLACING PASSWORD IN CONNECTION STRING
const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

//CONNECTING DATABASE
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connection successful'));

// READ FILE
const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/courses.json`, 'utf-8')
);

// IMPORT THE DATA
