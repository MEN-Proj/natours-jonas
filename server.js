require('dotenv').config();

const { app } = require('./app');
const { dbConnect } = require('./config/dbconfig');

dbConnect();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
