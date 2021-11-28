var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var { ObjectId,Object } = Schema;

var venueSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    noOfSeats: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    blockedDurations:{
        type: [ObjectId],
        ref:'Duration'
    },
},{timestamps: true});

module.exports = mongoose.model('Venue',venueSchema);