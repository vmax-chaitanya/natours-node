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

const routes = express.Router();

// routes.param('id', checkID);
routes.route('/top-5-tours').get(aliasTopTours, allTours);
routes.route('/tourAgger').get(getTourStats);

routes.route('/').get(allTours).post(createTour);
routes.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = routes;
