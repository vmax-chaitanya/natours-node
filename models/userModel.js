const mongoose = require('mongoose');
const validator = require('validator');

const bcrypt = require('bcryptjs');
// const { validate } = require('./tourModel');

userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'enter user name'],
  },
  email: {
    type: String,
    required: [true, 'enter your email'],
    unique: true,
    isLowercase: true,
    validate: [validator.isEmail, 'enter valid email'],
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'admin', 'guide', 'lead-guide'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'enter your password'],
    minlength: 8,
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, 'enter confirm password'],
    minlength: 8,
    validate: {
      validator: function (confirmPassword) {
        return this.password === confirmPassword;
      },
      message: 'passwords are not same',
    },
  },
  passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.correctPassword = async function (userPassword, dbPassword) {
  return await bcrypt.compare(userPassword, dbPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};
const User = mongoose.model('User', userSchema);

module.exports = User;
