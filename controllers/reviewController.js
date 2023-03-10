const Review = require('./../models/reviewModel');
const catchAsync = require('./../Utils/catchAsync');

exports.createReviews = catchAsync(async (req, res, next) => {
    const newReview = await Review.create(req.body);

    res.status(201).json({
        status: 'success',
        results: newReview.length,
        data: {
            newReview
        }
    });
});

exports.getAllReviews = catchAsync(async (req, res, next) => {
    const reviews = await Review.find();

    res.status(200).json({
        status: 'success',
        data: {
            reviews
        }
    });
});