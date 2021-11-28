var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const User = require("../models/user");
var {ObjectId}= Schema;

const LikeSchema = new Schema({
    user: {
        type: [ObjectId],
        ref: 'User'
    },
    count: Number
})
var pictureSchema = new Schema({
    image: {
        data: Buffer,
        contentType: String
    },
    title:{
        type: String,
        require: true,
        maxlength: 40,
        trim: true
    },
    likes: LikeSchema
},{timestamps: true});

module.exports = mongoose.model("Picture", pictureSchema);