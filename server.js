const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
// mongoose
//   .connect(DB, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//   })
//   .then((con) => {
//     // console.log(con.connections);
//     console.log('DB connection successful');
//   })
//   .catch((err) => {
//     console.log(err);
//   });

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true, // Add this to fix the Server Discovery warning
  })
  .then(() => {
    console.log('DB connection successful');
  })
  .catch((err) => {
    console.error('DB connection error:', err);
  });

// const testTour = new Tour({
//   name: 'sailaja',
//   price: 325,
//   rating: 4.2,
// });

// testTour
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => {
//     console.log(`the error ${err}`);
//   });

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`app is running in port:${port}`);
});
