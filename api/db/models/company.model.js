const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
    title: { // name of the company page
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    image: {  // a reference image of the company
        type: String,
        requried: true,
        minlength: 1,
        trim:false
    },
    body: { //brief description of the company
        type: String,
        required: true,
        minlength: 1,
        trim: true
    }
});

const Company = mongoose.model('Company', CompanySchema);

module.exports = {Company};