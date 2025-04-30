const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

dotenv.config({ path: './config.env' });

const app = express();


if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));


app.use((req, res, next) => {
    req.requestedTime = new Date().toString();
    next();
})
// app.get('/', (req, res) => {
//     res.status(200).json({ message: "Hello world from the server!", app: "natours" })
// });
// app.post('/', (req, res) => {
//     res.status(200).json({ message: "you can post here!!", app: "natours" })
// });




// app.get('/api/v1/tours', allTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);



app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);


module.exports = app;
