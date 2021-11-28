var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var { ObjectId,Object } = Schema;

const User = require("../models/user");
const Picture = require("../models/picture");

const LikeSchema = new Schema({
    user: {
        type: [ObjectId],
        ref: 'User'
    },
    count: Number
})

const eventSchema = new Schema({
    title: {
        type: String,
        required: true,
        maxlength: 60,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    instruction: {
        type: [String],
        trim: true
    },
    speaker: {
        type: [ObjectId],
        ref: 'Speaker'
    },
    venue: {
        type: ObjectId,
        ref:'Venue'
    },
    duration: {
        type: ObjectId,
        ref:'Duration'
    },
    poster: {
        data: Buffer,
        contentType: String
    },
    mode: {
        type: String,
        enum: ["Virtual","Hybrid","Offline"],
        required: true
    },
    joiningLink:{
        type: String,
    },
    vaccineRequirement:{
        type: Number
    },
    paid:{
        type: Boolean,
        required: true
    },
    amountPayable:{
        type: Number
    },
    hashtags:{
        type: [String]
    },
    pictures: {
        type: [Object],
        ref: 'Picture'
    },
    keyNotes: {
        type: [String],
        trim: true
    },
    eventCoordinator: {
        type: ObjectId,
        ref: 'User'
    },
    likes: {
        type: [ObjectId],
        ref: 'User'
    },
    feedback: {
        type: [String],
        trim: true
    }
})

module.exports = mongoose.model("Event", eventSchema);