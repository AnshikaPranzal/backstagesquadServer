var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var { ObjectId }= Schema;

var ratingSchema = new Schema({
    rate:{
        type: Number,
        required: true
    },
    user: {
        type: ObjectId,
        ref: 'User'
    }
},{timestamps: true});

module.exports = mongoose.model("Rating", ratingSchema);