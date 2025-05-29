const Review = require('./../models/reviewModel');
// const APIFeatures = require('./../utils/apiFeatures');
// const catchAsync = require('./../utils/catchAsync');
// const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');


// exports.allReviews = catchAsync(async (req, res, next) => {
//     //   console.log(req.headers);
//     // const features = new APIFeatures(Review.find(), req.query)
//     //     .filter()
//     //     .sort()
//     //     .limitFields()
//     //     .paginate();

//     let filter = {}
//     if (req.params.tourId) filter = { tour: req.params.tourId }
//     const reviews = await Review.find(filter);

//     res.status(200).json({
//         status: 'success',
//         result: reviews.length,
//         data: {
//             reviews: reviews,
//         },
//     });
// });
exports.allReviews = factory.getall(Review);


exports.getReview = factory.getOne(Review)

exports.setTourUserIds = (req, res, next) => {
    //allow nested routes
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;
    next();
}

// exports.createReview = catchAsync(async (req, res, next) => {

//     const review = await Review.create(req.body);
//     res.status(201).json({
//         message: 'record created',
//         status: 'created successfully',
//         data: {
//             review: review,
//         },
//     });
// });

exports.createReview = factory.createOne(Review);
exports.updaterReview = factory.updateOne(Review);


exports.deleteReview = factory.deleteOne(Review);
