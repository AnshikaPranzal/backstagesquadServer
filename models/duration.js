var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var { ObjectId,Object } = Schema;

var durationSchema = new Schema({
    startTime:{
        type: Date,
        required: true
    },
    endTime:{
        type: Date,
        required: true
    },
    totalHours:{
        type: Number
    },
    eventId:{
        type: ObjectId,
        ref: 'Event'
    }
},{timestamps: true});

module.exports = mongoose.model('Duration',durationSchema);