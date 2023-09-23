const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Handling Uncaught Exceptions
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION 💥 Shutting down..........');
  console.log(err.name, err.message);
  process.exit(1);
});

// LOAD CONFIG
dotenv.config({ path: './config.env' });

// Import Express App
const app = require('./app');

//CONNECTING DATABASE
// Replace password in connection string
const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

//CONNECT DB
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful 😉'));

// Define Port
const port = process.env.PORT || 3000;

// Start Server
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

// Handling Unhandled Promise Rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION 💥 Shutting down..........');
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});
