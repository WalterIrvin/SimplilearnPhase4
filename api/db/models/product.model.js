const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    title: { // name of the product page
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    image: {  // a reference image of the object
        type: String,
        requried: true,
        minlength: 1,
        trim:false
    },
    price: {  // the stated price of the product
        type: Number,
        required: true,
        minlength: 1,
        trim:false
    },
    body: { //brief description of the product
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    _companyId: {
        type: String,
        required: true,
        minlength: 1,
        trim: false
    }
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = {Product};