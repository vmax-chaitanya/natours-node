const mongoose = require('mongoose');
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'tour name is required'],
    unique: true,
  },
  price: {
    type: Number,
    require: [true, 'price is required'],
  },
  rating: {
    type: Number,
    default: 1.0,
  },
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
