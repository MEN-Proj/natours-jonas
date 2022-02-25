const mongoose = require('mongoose');

let dbURI = '';
if (process.env.NODE_ENV !== 'production') {
  dbURI = process.env.DB_URI_LOCAL;
} else {
  dbURI = process.env.DB_URI.replace('<password>', process.env.DB_PASSWORD);
}

exports.dbConnect = async () => {
  const con = await mongoose.connect(dbURI);
  console.log('Database connection successful');
  // try {
  //   const con = await mongoose.connect(dbURI);
  //   console.log('Database connection successful');
  // } catch (error) {
  //   console.log(error);
  // }
};
