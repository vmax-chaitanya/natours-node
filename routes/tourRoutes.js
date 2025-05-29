const express = require('express');
const {
  getTourStats,
  aliasTopTours,
  checkID,
  checkBody,
  allTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
} = require('./../controllers/tourController');
const { protect, restrictTo } = require('./../controllers/authController');
const { createReview } = require('./../controllers/reviewController');
const reviewRouter = require('./../routes/reviewRoutes');

const routes = express.Router();

// routes.use('/:tourId/reviews', reviewRouter);
routes.use('/:tourId/review', reviewRouter);
// routes.param('id', checkID);
routes.route('/top-5-tours').get(aliasTopTours, allTours);
routes.route('/tourAgger').get(getTourStats);

routes.route('/').get(protect, allTours).post(createTour);
routes
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

routes.route('/:tourId/reviews').post(protect, createReview);

module.exports = routes;
