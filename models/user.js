var mongoose = require('mongoose');
const crypto = require('crypto'); 
const { v1: uuidv1 } = require('uuid');
var Schema = mongoose.Schema;
const Idea = require("../models/idea");
var {ObjectId}= Schema;

const IdeaSchema = new Schema({
    idea: {
        type: ObjectId,
        ref: 'Idea'
    },
    count: Number
})

var userSchema = new Schema({
  name:{
      type: String,
      require: true,
      maxlength: 40,
      trim: true,
  },
  email:{
    type: String,
    require: true,
    trim: true,
    unique: true
  },
  contactNumber:{
    type: String,
    trim: true,
    unique: true
  },
  collegeId:{
    type: String,
    trim: true,
    unique: true
  },
  encryptedpassword:{
    type: String,
    require: true,
  },
  salt: String,
  role:{
    type: Number,
    default: 0
  },
  vaccineStatus:{
      type: Number,
      default: 0
  },
  vaccineCertificate: {
    data: Buffer,
    contentType: String
  },
  school: {
      type: String,
      trim: true
  },
  ideaSubmitted: [IdeaSchema],
  yourEvents:{
      type:[ObjectId],
      ref:'Event'
  },
  yourIdeas:{
    type:[ObjectId],
    ref:'Idea'
  },
  coordinatingEvents:{
    type:[ObjectId],
    ref:'Event'
  }
},{timestamps: true});

userSchema.virtual("password")
    .set(function(password){
        this._password = password;
        this.salt = uuidv1();
        this.encryptedpassword = this.passwordencrypter(password);
    })
    .get(function(){
        return this._password;
    })

userSchema.methods = {

    authenticate: function(inputPassword){
        return this.passwordencrypter(inputPassword) === this.encryptedpassword;
    },

    passwordencrypter: function(inputPassword)
    {
        if(!inputPassword) return "";
        try{
            return crypto.createHmac('sha256', this.salt)
            .update(inputPassword)
            .digest('hex');
        }
        catch{
            return "";
        }
    }

}

module.exports = mongoose.model("User",userSchema);