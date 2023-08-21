const mongoose = require('mongoose');
const dotenv = require('dotenv');

// LOAD CONFIG
dotenv.config({ path: './config.env' });

const app = require('./app');

//CONNECTING DATABASE
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

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
