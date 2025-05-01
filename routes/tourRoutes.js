const express = require('express');
const {
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

routes.route('/').get(allTours).post(createTour);
routes.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = routes;
