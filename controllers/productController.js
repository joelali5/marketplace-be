const Product = require("./../models/productModel");
const APIFeatures = require('./../Utils/APIFeatures');
const AppError = require('./../Utils/appError');
const catchAsync = require('./../Utils/catchAsync');

exports.aliasTopProducts = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    next();
}

exports.getAllProucts = catchAsync(async (req, res, next) => {
    // //Build the Query/Filtering
    // const queryObj = {...req.query};
    // const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // excludedFields.forEach(el => delete queryObj[el]);

    // //Advance Filtering
    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b(gte|ge|lte|lt)\b/g, match => `$${match}`);

    // let query = Product.find(JSON.parse(queryStr));


    //Sorting
    // if(req.query.sort) {
    //     const sortBy = req.query.sort.split(',').join(' ');
    //     query = query.sort(sortBy);
    // } else {
    //     query = query.sort('-createdAt');
    // }

    //Field Limiting
    // if(req.query.fields) {
    //     const fields = req.query.fields.split(',').join(' ');
    //     query = query.select(fields);
    // } else {
    //     query = query.select('-__v');
    // }

    //Pagination
    // const page = req.query.page * 1|| 1;
    // const limit = req.query.limit * 1 || 100;
    // const skip = (page - 1) * limit;
    // query = query.skip(skip).limit(limit);

    // if(req.query.page) {
    //     const numProducts = await Product.countDocuments();
    //     if(skip >= numProducts) throw new Error("This page does not exist!")
    // }
    
    //Execute the query
    const features = new APIFeatures(Product.find(), req.query)
        .filter()
        .sort().
        limitFields()
        .paginate();

    const products = await features.query;

    res.status(200).json({
        status: 'success',
        result: products.length,
        data: {
            products
        }
    });
});

exports.getProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if(!product) {
        return next(new AppError('No Product found with that ID!', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            product
        }
    });
});

exports.createProduct = catchAsync(async (req, res, next) => {
    const newProduct = await Product.create(req.body);
    res.status(201).json({
        status: "success",
        data: {
            product: newProduct
        }
    });
});

exports.updateProduct = catchAsync(async(req, res, next) => {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, 
            {new: true, runValidators: true}
        );

        if(!product) {
            return next(new AppError('No Product found with that ID!', 404));
        }

        res.status(200).json({
            status: 'success',
            data: { product }
        });
});

exports.deleteProduct = catchAsync(async(req, res, next) => {
    const product = await Product.findByIdAndDelete(req.params.id);

    if(!product) {
        return next(new AppError('No Product found with that ID!', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.getProductStats = catchAsync(async (req, res, next) => {
    const stats = await Product.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } }
        },
        {
            $group: {
                _id: { $toUpper: '$category_name' },
                numProducts: { $sum: 1 },
                numRatings: { $sum: '$ratingsQuantity' },
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price'},
                maxPrice: { $max: '$price'}
            }
        },
        // {
        //     $sort: { avgPrice: 1 }
        // // },
        // {
        //     $match: { _id: {$ne: 'CLOTHING'} }
        // }
    ]);
    res.status(200).json({
        status: 'success',
        data: {
            stats
        }
    });
});