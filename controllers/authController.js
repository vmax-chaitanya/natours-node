const fs = require('fs');

const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');

const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}
exports.signup = catchAsync(async (req, res, next) => {
    // const newUser = await User.create(req.body);
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,

    });

    const token = signToken(newUser._id);
    res.status(201).json({
        status: "success",
        // message: "user created successfully",
        token: token,
        data: {
            user: newUser
        }
    });
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password)
        return new AppError('please enter email and password', 404);

    const user = await User.findOne({ email }).select('+password');

    if (!user || ! await user.correctPassword(password, user.password))
        return new AppError('email or password are incorrect', 401);

    token = signToken(user._id)
    res.status(200).json({
        status: "success",
        token: token
    })

})