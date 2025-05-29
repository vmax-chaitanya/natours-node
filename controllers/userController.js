const factory = require('./handlerFactory');

// const catchAsync = require('./../utils/catchAsync');
// const AppError = require('./../utils/appError');

const User = require('./../models/userModel');

exports.getMe = (req, res, next) => {
    // console.log(req.params.id);

    req.params.id = req.user.id;
    next();
}

exports.allUsers = factory.getall(User);
exports.getUser = factory.getOne(User);
exports.createUser = factory.createOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
