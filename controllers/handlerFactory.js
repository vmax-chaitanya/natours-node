const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

const { Model } = require('mongoose');

exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    const id = req.params.id;
    // const tour = await Tour.deleteOne({ _id: id });
    const doc = await Model.findByIdAndDelete(id);

    if (!doc) {
        return next(new AppError('No doc found with that id', 404));
    }

    res.status(204).json({
        status: 'DELETED',
        data: {
            tour: null,
        },
    });
});

exports.updateOne = Model => catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const doc = await Model.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!doc) {
        return new AppError('Document not fount ', 404)
    }
    res.status(200).json({
        status: 'updated',
        data: {
            doc: doc,
        },
    });
});


exports.createOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
        message: 'record created',
        status: 'created successfully',
        data: {
            data: doc,
        },
    });
});

exports.getOne = (Model, popOptions) => catchAsync(async (req, res, next) => {
    const id = req.params.id;
    console.log(id);
    let query = await Model.findById(id)

    if (popOptions) query = query.popOptions;

    const doc = query;
    // const tour = await Tour.findOne({ _id: id });
    console.log(doc);

    if (!doc) {
        return next(new AppError('document not found!', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            data: doc,
        },
    });
});


exports.getall = Model => catchAsync(async (req, res, next) => {
    //this is for nested routes for reviews
    let filter = {}
    if (req.params.tourId) filter = { tour: req.params.tourId }

    const features = new APIFeatures(Model.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const doc = await features.query;

    res.status(200).json({
        status: 'success',
        result: doc.length,
        data: {
            data: doc,
        },
    });
})