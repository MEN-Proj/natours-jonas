require('dotenv').config();
const fs = require('fs');
const { dbConnect } = require('./config/dbconfig');
const { Tour } = require('./models/tour/tour.model');

dbConnect();

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8'),
);

async function importData() {
  try {
    await Tour.create(tours);
    console.log('Data imported successfully');
    process.exit();
  } catch (e) {
    console.log(e);
  }
}

async function deleteData() {
  try {
    await Tour.deleteMany();
    console.log('Data deleted successfully');
    process.exit();
  } catch (e) {
    console.log(e);
  }
}

console.log(process.argv[2]);

const flag = process.argv[2].split('--')[1];

if (flag === 'import') {
  importData();
} else if (flag === 'delete') {
  deleteData();
}
