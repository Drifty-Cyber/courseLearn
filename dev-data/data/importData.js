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
    // useCreateIndex: true,
    // useFindAndModify: false,
  })
  .then(() => console.log('DB connection successful'));

// READ FILE - Courses Data
const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/courses.json`, 'utf-8')
);

// Read File - Users Data
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));

// Read File - Reviews Data
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);

// IMPORT THE DATA
const importData = async () => {
  try {
    await Course.create(courses);
    await User.create(users);
    console.log('Data successfully loaded');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE DATA
const deleteData = async () => {
  try {
    await Course.deleteMany();
    console.log('Data successfully loaded');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv[2]);
