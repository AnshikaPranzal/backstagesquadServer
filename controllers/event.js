const Event= require("../models/event");
const Duration= require("../models/duration");
const util = require('util')

const formidable = require('formidable')
const _ = require('lodash');
const fs = require('fs');  
const { createDuration, editDuration, editDurationEventId, createDurationInternal } = require("./duration");
const { addDuration } = require("./venue");
const User = require("../models/user");

exports.getEventById = (req, res, next, id) => {
    Event.findById(id)
    .populate("speaker eventCoordinator venue duration","-picture")
    .exec((err, event)=>{      
        if(err || !event){
            return res.status(400).json({
                message: "No such Event exists",
                error: err
            })
        }
        req.event = event;
        next();
    })
}

exports.getEvent = (req, res) => {
    req.event.poster = undefined
    return res.json(req.event)
}

exports.createEvent = (req,res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err,fields,files)=>{
        console.log(fields,err)
        if(err){
            console.error("Event Creation Error: "+ err)
            return res.status(500).json({
                success: false,
                message: "Event Creation Failed",
                reason: err
            })
        }

        const { title,paid,amountPayable,mode,startTime,endTime,speaker,venue,eventCoordinator } = fields; 
        
        if(
            !title ||
            paid === undefined ||
            !startTime ||
            !endTime ||
            !mode 
        ){
            console.log("errorr",paid,title,mode)
            return res.status(400).json({
                error: "Required fields are missing"
            }) 
        }
        
        console.log("creating")
        //handle file here 
        let event = new Event(fields)
        console.log(event)
        let duration = new Duration({startTime,endTime})
        duration.totalHours = (duration.endTime - duration.startTime)/(60*60)
        duration.save((err,obj) => {
        if(err){
            console.error("Duration Creation Error: "+ err)
            return  res.status(400).json({
                success: false,
                message: "Duration Creation Failed",
                reason: err
            })
        }
            event.duration=obj._id
            if(files.poster){
                console.log(files.poster,"kk")
                if(files.poster.size >6000000 ) //6mb
                {
                    return res.status(400).json({
                        error: "File size exceeded"
                    })
                }
                event.poster.data = fs.readFileSync(files.poster.filepath);
                event.poster.contentType = files.poster.type;
                // console.log(event.poster.data)
            }

            event.save((err,obj) => {
                if(err){
                    console.error("Event Creation Error: "+ err)
                    return res.status(403).json({
                        success: false,
                        message: "Event Creation Failed",
                        reason: err
                    })
                }
                // updating event coordinator's data:
                if(event.eventCoordinator){ 
                    User.findByIdAndUpdate({_id: event.eventCoordinator},
                        {$push: {coordinatingEvents: obj._id}},
                        {new: true,useFindAndModify: false},
                        (err,obj) => {
                            if(err){
                                res.json({
                                    error: "Updating not authorized"
                                })
                            }
                        }
                    );
                }
                console.log("here 1")
                addDuration(event.duration,venue)
                console.log("here 2")

                editDurationEventId({body:{eventId: obj._id}},event.duration)
                console.log("here 3")

                res.json(obj)
            })

    })
        
    });
}

// adding event to the details of updated co-ordinator
const updateEventCoordinatorData = (res,rej,fields,event,flag)=>{
    if(fields.eventCoordinator || flag){
        if(event.eventCoordinator){ // we had an coordinator previously
        User.findByIdAndUpdate({_id: event.eventCoordinator},
            {$pull: {coordinatingEvents: event._id }},
            {new: true,useFindAndModify: false},
            (err,obj) => {
                if(err){
                    rej(err)
                    return {
                        error: "Updating not authorized (removal)"+err
                    }
                }
                if(!flag){ // flag true denotes that there is no new coordinator
                User.findByIdAndUpdate({_id: fields.eventCoordinator},
                    {$push: {coordinatingEvents: event._id}},
                    {new: true,useFindAndModify: false},
                    (err,obj) => {
                        if(err){
                            rej(err)
                            return {
                                error: "Updating not authorized (addition)"+err
                            }
                        }
                        res(obj)
                }
                )}
                else{
                    res(obj)
                }
            }
        )}
        else{ // we have a new coordinator and did not have one before
            User.findByIdAndUpdate({_id: fields.eventCoordinator},
                {$push: {coordinatingEvents: event._id}},
                {new: true,useFindAndModify: false},
                (err,obj) => {
                    if(err){
                        rej(err)
                        return {
                            error: "Updating not authorized (adding)"+err
                        }
                    }
                    res(obj)
            }
            )
        }
    }
        else{
            res('No event Change')
        }
}

exports.editEvent = (req,res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err,fields,files)=>{
        let flag = 0
        if(err){
            console.error("Event Updation Error: "+ err)
            return res.status(500).json({
                success: false,
                message: "Event Updation Failed",
                reason: err
            })
        }
        
        // need to do the following castings for ObjectId data
        if(fields.eventCoordinator == ""){
            fields.eventCoordinator=null;
            flag=1
        }
        if(fields.venue == ""){
            fields.venue=null;
        }

        let event = req.event
        
        // handle coordinator updation
        const user = new Promise((res,rej)=>(updateEventCoordinatorData(res,rej,fields,event,flag)))

        //handle file here 
        event = _.extend(event,fields)
        if(files.poster){
            if(files.poster.size >6000000 ) //6mb
            {
                return res.status(400).json({
                    error: "File size exceeded"
                })
            }
            event.poster.data = fs.readFileSync(files.poster.filepath);
            event.poster.contentType = files.poster.type;
        }

        user.then(obj =>{
            event.save((err,obj) => {
                if(err){
                    console.error("Event Updation Error: "+ err)
                    return res.status(403).json({
                        success: false,
                        message: "Event Updation Failed",
                        reason: err
                    })
                }
                res.json({obj})
            })
        }).catch(err =>{
            return res.status(400).json({
                error: "Error in user"
            })
        })
        
    });
}

//middleware
exports.image = (req,res) => {
    if(req.event.poster.data){
        res.set("Content-Type",req.event.poster.contentType)
        return res.send(req.event.poster.data);
    }
    // next();
};

exports.removeEvent = (req,res) =>{
    const event = req.event;
    event.remove((err,event)=>{
        if(err){
            return res.status(400).json({
                message: "Event Deletion failed",
                error: err
            })
        }
        res.json({
            message: event.title + " deleted"
        });
        }
    )
}

exports.getAllEvents = (req,res) =>{
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

    //poster and picture will be loaded separately to avoid waiting time for the content
    Event.find()
    .select("-poster")
    .sort([[sortBy, "asc"]])
    .exec((err,event) => {
        if(err){
            return res.status(400).json({
                message: "No Event found.",
                error: err
            })
        }
        res.json(event);
    })
}
