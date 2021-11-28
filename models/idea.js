var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var { ObjectId }= Schema;

const User = require("../models/user");

var ideaSchema = new Schema({
    subject:{
        type: String,
        required: true,
        maxlength: 40,
        trim: true
    },
    content:{
        type: String,
        required: true
    },
    author: {
        type: ObjectId,
        ref: 'User'
    },
    ratings: {
        type: [Object],
        ref: 'Rating'
    },
    avgRating:{
        type: Number,
        default: 0
    }
},{timestamps: true});

module.exports = mongoose.model("Idea", ideaSchema);