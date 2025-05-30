const mongoose = require('mongoose');


const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, "Review is must "]
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'tour is must for review ']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'User is must to write a review ']
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})


// reviewSchema.pre(/^find/, function (next) {
//     this.populate({
//         path: 'user',
//         select: '-__v',
//     });
//     // this.populate('guides');
//     next();
// })

reviewSchema.index({ tour: 1, user: 1 }, { unique: 1 });
reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'tour',
        select: 'name',
    }).populate({
        path: 'user',
        select: 'name'
    });
    // this.populate('guides');
    next();
})

const Review = mongoose.model('Review', reviewSchema);


module.exports = Review;