const fs = require('fs');
const tour = require('./../models/tourModel');
const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
const { error } = require('console');
const { match } = require('assert');
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
}



exports.allTours = async (req, res) => {
	try {
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


		const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate();
		const tours = await features.query;

		res.status(200).json({
			status: 'success',
			result: tours.length,
			data: {
				tours: tours,
			},
		});
	} catch (err) {
		// console.log(err);

		res.status(404).json({
			status: 'error',
			message: err,
		});
	}
};

exports.getTour = async (req, res) => {
	try {
		const id = req.params.id;
		console.log(id);
		// const tour = await Tour.findById(id);
		const tour = await Tour.findOne({ _id: id });
		res.status(200).json({
			status: 'success',
			data: {
				tour: tour,
			},
		});
	} catch (err) {
		res.status(404).json({
			status: 'error',
			message: 'something went wrong',
		});
	}
};

exports.createTour = async (req, res) => {
	try {
		const newTour = await Tour.create(req.body);
		res.status(201).json({
			message: 'record created',
			status: 'created successfully',
			data: {
				tours: newTour,
			},
		});
	} catch (err) {
		res.status(404).json({
			status: 'error',
			message: err,
		});
	}
};

exports.updateTour = async (req, res) => {
	try {
		const id = req.params.id;
		const tour = await Tour.findByIdAndUpdate(id, req.body, {
			new: true,
			runValidators: true,
		});
		res.status(200).json({
			status: 'updated',
			data: {
				tour: tour,
			},
		});
	} catch (err) {
		res.status(404).json({
			status: 'error',
			message: err,
		});
	}
};

exports.deleteTour = async (req, res) => {
	try {
		const id = req.params.id;
		// const tour = await Tour.deleteOne({ _id: id });
		const tour = await Tour.findByIdAndDelete(id);

		res.status(204).json({
			status: 'DELETED',
			data: {
				tour: null,
			},
		});
	} catch (err) {
		res.status(404).json({
			status: 'error',
			message: err,
		});
	}
};

exports.getTourStats = async (req, res) => {
	try {
		const stats = await Tour.aggregate([
			{
				$match: { ratingsAverage: { $gte: 4.5 } }
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

					numTours: { $sum: 1 }

				}
			},
			{
				$sort: { minPrice: 1 }
			}
		]);
		console.log(stats);

		res.status(200).json({
			status: 'success',
			data: {
				stats: stats,
			},
		});
	} catch (err) {
		res.status(404).json({
			status: 'error1',
			message: err,
		});
	}
}
