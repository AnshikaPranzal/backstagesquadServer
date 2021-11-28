const Speaker= require("../models/speaker");

const formidable = require('formidable')
const _ = require('lodash');
const fs = require('fs');  

exports.getSpeakerById = (req, res, next, id) => {
    Speaker.findById(id)
    .exec((err, speaker)=>{      
        if(err || !speaker){
            return res.status(400).json({
                message: "No such Speaker exists",
                error: err
            })
        }
        req.speaker = speaker;
        next();
    })
}

exports.getSpeaker = (req, res) => {
    req.speaker.picture = undefined
    return res.json(req.speaker)
}

exports.createSpeaker = (req,res) => {
    console.log("creating...",req)
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err,fields,files)=>{
        if(err){
            console.error("Speaker Creation Error: "+ err)
            return res.status(500).json({
                success: false,
                message: "Speaker Creation Failed",
                reason: err
            })
        }
        
        const { name } = fields; 
        
        if(
            !name
        ){
            return res.status(400).json({
                error: "Required fields are missing"
            }) 
        }

        //handle file here 
        let speaker = new Speaker(fields)
        if(files.picture){
            if(files.picture.size >6000000 ) //6mb
            {
                consol.log("Too Large picture")
                return res.status(400).json({
                    error: "File size exceeded"
                })
            }
            speaker.picture.data = fs.readFileSync(files.picture.filepath);
            speaker.picture.contentType = files.picture.type;
            // console.log(speaker.picture.data)
        }

        speaker.save((err,obj) => {
            if(err){
                console.error("Speaker Creation Error: "+ err)
                return res.status(403).json({
                    success: false,
                    message: "Speaker Creation Failed",
                    reason: err
                })
            }
            res.json({obj})
        })
    });
}

exports.editSpeaker = (req,res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err,fields,files)=>{
        if(err){
            console.error("Speaker Updation Error: "+ err)
            return res.status(500).json({
                success: false,
                message: "Speaker Updation Failed",
                reason: err
            })
        }

        //handle file here 
        let speaker = req.speaker
        speaker = _.extend(speaker,fields)
        if(files.picture){
            if(files.picture.size >6000000 ) //6mb
            {
                return res.status(400).json({
                    error: "File size exceeded"
                })
            }
            speaker.picture.data = fs.readFileSync(files.picture.filepath);
            speaker.picture.contentType = files.picture.type;
        }
        speaker.save((err,obj) => {
            if(err){
                console.error("Speaker Updation Error: "+ err)
                return res.status(403).json({
                    success: false,
                    message: "Speaker Updation Failed",
                    reason: err
                })
            }
            res.json({obj})
        })
    });
}

//middleware
exports.image = (req,res) => {
    if(req.speaker.picture.data){
        res.set("Content-Type",req.speaker.picture.contentType)
        return res.send(req.speaker.picture.data);
    }
    // next();
};

exports.removeSpeaker = (req,res) =>{
    const speaker = req.speaker;
    speaker.remove((err,speaker)=>{
        if(err){
            return res.status(400).json({
                message: "Speaker Deletion failed",
                error: err
            })
        }
        res.json({
            message: speaker.name + " deleted"
        });
        }
    )
}

exports.getAllSpeakers = (req,res) =>{
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy : "name";

    Speaker.find()
    .select("-picture")
    .sort([[sortBy, "asc"]])
    .exec((err,speaker) => {
        if(err){
            return res.status(400).json({
                message: "No Speaker found.",
                error: err
            })
        }
        res.json(speaker);
    })
}
