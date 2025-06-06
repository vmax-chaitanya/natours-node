const fs = require('fs');
// const tour = require('./../models/tourModel');
const Tour = require('./../models/tourModel');
// const APIFeatures = require('./../utils/apiFeatures');
const factory = require('./handlerFactory');

const catchAsync = require('./../utils/catchAsync');
// const AppError = require('./../utils/appError');

const { error } = require('console');
const { match } = require('assert');
const AppError = require('../utils/appError');
// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// exports.checkID = (req, res, next, val) => {
//   // console.log(`param id is ${val}`);

//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'error',
//       message: 'invalid id',
//     });
//   }
//   next();
// };

// exports.checkBody = (req, res, next) => {
//   if (req.body.name == null || req.body.price == null) {
//     return res.status(404).json({
//       status: 'error',
//       message: 'name or price value is null',
//     });
//   }
//   next();
// };

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,duration,difficulty,price,ratingsAverage';
  next();
};

//exports.allTours = catchAsync(async (req, res, next) => {
//FILTERING
// const queryObj = { ...req.body };
// const excludedFields = ['page', 'sort', 'limit', 'fields'];
// excludedFields.forEach(el => delete queryObj[el]);

// ///ADVANCE FILTER
// let queryString = JSON.stringify(queryObj);
// queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
// query = Tour.find(JSON.parse(queryString));

///SORTING
// if (req.query.sort) {
// 	const sortBy = req.query.sort.split(',').join(' ');
// 	query = query.sort(sortBy);
// } else {
// 	query = query.sort('-createdAt');
// }
// console.log(query);

//field limiting

// if (req.query.fields) {
// 	const fields = req.query.fields.split(',').join(' ');
// 	query = query.select(fields);
// } else {
// 	query = query.select('-__v');
// }

//pagination
// const page = req.query.page * 1 || 1;
// const limit = req.query.limit * 1 || 100;
// const skip = (page - 1) * limit;
// query = query.skip(skip).limit(limit);

// if (req.query.page) {
// 	const totalRows = await Tour.countDocuments();
// 	if (skip >= totalRows) throw new error("page not found")
// }

//   console.log(req.headers);
//   const features = new APIFeatures(Tour.find(), req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();
//   const tours = await features.query;

//   res.status(200).json({
//     status: 'success',
//     result: tours.length,
//     data: {
//       tours: tours,
//     },
//   });
// });

exports.allTours = factory.getall(Tour);
exports.getTour = factory.getOne(Tour, { path: 'reviews' })


exports.createTour = factory.createOne(Tour)

exports.updateTour = factory.updateOne(Tour);

// exports.deleteTour = catchAsync(async (req, res, next) => {
//   const id = req.params.id;
//   // const tour = await Tour.deleteOne({ _id: id });
//   const tour = await Tour.findByIdAndDelete(id);

//   res.status(204).json({
//     status: 'DELETED',
//     data: {
//       tour: null,
//     },
//   });
// });

exports.deleteTour = factory.deleteOne(Tour);

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: '$difficulty',
        avgPrice: { $avg: '$price' },
        maxPrice: { $max: '$price' },
        minPrice: { $min: '$price' },

        avgRating: { $avg: '$ratingsAverage' },
        maxRating: { $max: '$ratingsAverage' },
        minRating: { $min: '$ratingsAverage' },

        numTours: { $sum: 1 },
      },
    },
    {
      $sort: { minPrice: 1 },
    },
  ]);
  console.log(stats);

  res.status(200).json({
    status: 'success',
    data: {
      stats: stats,
    },
  });
});


exports.getToursByLocation = catchAsync(async (req, res, next) => {
  const { distance, lat, lng, unit } = req.params;

  if (!lat || !lng) {
    return next(new AppError('Please provide latitude and longitude in the format lat,lng.', 400));
  }

  const radius = (unit === 'mi') ? distance / 3963.2 : distance / 6378.1;

  const latNum = parseFloat(lat);
  const lngNum = parseFloat(lng);

  if (isNaN(latNum) || isNaN(lngNum)) {
    return next(new AppError('Latitude and Longitude must be valid numbers.', 400));
  }

  const tours = await Tour.find({
    startLocation: {
      $geoWithin: {
        $centerSphere: [[lngNum, latNum], radius]
      }
    }
  });

  if (!tours || tours.length === 0) {
    return next(new AppError('No tours found in your location.', 400));
  }

  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours
    }
  });
});

