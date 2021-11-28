var mongoose = require('mongoose');
const crypto = require('crypto'); 
const { v1: uuidv1 } = require('uuid');
var Schema = mongoose.Schema;

var speakerSchema = new Schema({
  name:{
      type: String,
      required: true,
      maxlength: 40,
      trim: true,
  },
  email:{
    type: String,
    trim: true
  },
  contactNumber:{
    type: String,
    trim: true
  },
  picture: {
    data: Buffer,
    contentType: String
  },
  skillSet:{
    type: [String],
    trim: true
  },
  about:{
    type: String,
    trim: true,
  },
  linkedinUrl:{
    type: String,
    trim: true,
  },
  githubUrl:{
    type: String,
    trim: true,
  },
  portfolioUrl:{
    type: String,
    trim: true,
  },
  vaccineStatus:{
      type: Number,
      default: 0
  }
},{timestamps: true});

module.exports = mongoose.model('Speaker',speakerSchema);