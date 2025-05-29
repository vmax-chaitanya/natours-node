const express = require('express');
const {
    allReviews,
    createReview,
    getReview,
    deleteReview,
    updaterReview,
    setTourUserIds,
} = require('./../controllers/reviewController');
const { protect, restrictTo } = require('./../controllers/authController');

const routes = express.Router({ mergeParams: true });


routes.route('/').get(protect, allReviews).post(protect, setTourUserIds, createReview);
routes
    .route('/:id')
    .get(getReview)
    .patch(updaterReview)
    .delete(protect, restrictTo('admin', 'lead-guide'), deleteReview);

module.exports = routes;
