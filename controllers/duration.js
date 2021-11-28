const Duration= require("../models/duration");

exports.getDurationById = (req, res, next, id) => {
    Duration.findById(id)
    .exec((err, duration)=>{      
        if(err || !duration){
            return res.status(400).json({
                message: "No such Duration exists",
                error: err
            })
        }
        req.duration = duration;
        next();
    })
}

exports.getDuration = (req, res) => {
    return res.json(req.duration)
}

exports.createDuration = (req,res) => {
    let duration = new Duration(req.body)
    duration.totalHours = (duration.endTime - duration.startTime)/(60*60)
    duration.save((err,obj) => {
        if(err){
            console.error("Duration Creation Error: "+ err)
            return res.status(403).json({
                success: false,
                message: "Duration Creation Failed",
                reason: err
            })
        }
        return res.json(obj)
    })
}

function createDurationInternal(req){
    let duration = new Duration(req.body)
    duration.totalHours = (duration.endTime - duration.startTime)/(60*60)
    duration.save((err,obj) => {
        if(err){
            console.error("Duration Creation Error: "+ err)
            return {
                success: false,
                message: "Duration Creation Failed",
                reason: err
            }
        }
        const id = obj._id
        console.log(id.valueOf(),"1")
        return obj
    })
}

exports.editDuration = (req,res) => {
    
    Duration.findByIdAndUpdate({_id: req.duration._id},
        {$set: req.body},
        {new: true,useFindAndModify: false},
        (err,duration) => {
            if(err){
                return res.status(400).json({
                    error: "Updating not authorized"
                })
            }
            res.json(duration);
        }
    );
}

exports.editDurationEventId = (req,id) => {
    Duration.findByIdAndUpdate({_id: id},
        {$set: req.body},
        {new: true,useFindAndModify: false},
        (err,duration) => {
            if(err){
                return {
                    error: "Updating not authorized"
                }
            }
            return duration;
        }
    );
}

exports.removeDuration = (req,res) =>{
    const duration = req.duration;
    duration.remove((err,duration)=>{
        if(err){
            return res.status(400).json({
                success: false,
                message: "Duration Deletion failed",
                error: err
            })
        }
        res.json({
            success: true,
            message: "Duration deleted"
        });
        }
    )
}

exports.getAllDurations = (req,res) =>{
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy : "startTime";

    Duration.find()
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err,duration) => {
        console.log(err,duration)
        if(err){
            return res.status(400).json({
                message: "No Duration found with this id",
                error: err
            })
        }
        res.json(duration);
    })
}
