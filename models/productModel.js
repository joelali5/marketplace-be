const mongoose = require("mongoose");
const slugify = require('slugify');
// const validator = require('validator');

const productSchema = new mongoose.Schema({
    item_name: {
        type: String,
        required: [true, "A product must have a name"],
        maxlength: [40, 'A product name must have less than or equal to 40 characters'],
        // validator: [validator.isAlpha, "Product name must only contain letters"]
    },
    slug: String,
    description: {
        type: String,
        required: [true, "A product must have a description"],
    },
    img_url: {
        type: String,
        required: [true, "A product must have an image"],
    },
    price: {
        type: Number,
        required: [true, "A product must have a price"]
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function(val) {
                //This only points to current document on NEW DOCUMENT creation
                return val < this.price
            },
            message: "The discount value ({VALUE}) must be less than the regular price"
        }
    },
    category_name: {
        type: String,
        required: [true, "Indicate the category of the product"]
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, "A rating must be above 1.0"],
        max: [5, "A rating must be below 5.0"]
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    }
});

//DOCUMENT MIDDLEWARE: runs before .save() and .create()
productSchema.pre('save', function(next) {
    //'this' will point to the document that is being processed
    this.slug = slugify(this.item_name, { lower: true });
    next();
});

// productSchema.pre('save', function(next) {
//     console.log("Will save document...");
//     next();
// });

// productSchema.post('save', function(doc, next) {
//     console.log(doc);
//     next();
// })

//QUERY MIDDLEWARE


const Product = mongoose.model("Product", productSchema);
module.exports = Product;