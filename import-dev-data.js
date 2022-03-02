require('dotenv').config();
const fs = require('fs');
const { dbConnect } = require('./config/dbconfig');
const { Tour } = require('./models/tour/tour.model');
const { User } = require('./models/user/user.model');
const { Review } = require('./models/review/review.model');

dbConnect();

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours.json`, 'utf-8'),
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/users.json`, 'utf-8'),
);
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/reviews.json`, 'utf-8'),
);

async function importData() {
  try {
    await User.create(users);
    await Tour.create(tours);
    await Review.create(reviews);
    console.log('Data imported successfully');
    process.exit();
  } catch (e) {
    console.log(e);
  }
}

async function deleteData() {
  try {
    await User.deleteMany();
    await Tour.deleteMany();
    console.log('Data deleted successfully');
    process.exit();
  } catch (e) {
    console.log(e);
  }
}

console.log(process.argv);

const flag = process.argv[2].split('--')[1];

if (flag === 'import') {
  importData();
} else if (flag === 'delete') {
  deleteData();
}
