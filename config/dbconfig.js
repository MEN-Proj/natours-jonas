const mongoose = require('mongoose');

let dbURI = '';
if (process.env.NODE_ENV !== 'development') {
  dbURI = process.env.DB_URI_LOCAL;
} else {
  dbURI = process.env.DB_URI.replace('<password>', process.env.DB_PASSWORD);
}

exports.dbConnect = async () => {
  try {
    const con = await mongoose.connect(dbURI);
    console.log('Database connection successful');
  } catch (error) {
    console.log(error);
  }
};
