const Venue= require("../models/venue");

exports.getVenueById = (req, res, next, id) => {
    Venue.findById(id)
    .exec((err, venue)=>{      
        if(err || !venue){
            return res.status(400).json({
                message: "No such Venue exists",
                error: err
            })
        }
        req.venue = venue;
        next();
    })
}

exports.getVenue = (req, res) => {
    return res.json(req.venue)
}

exports.createVenue = (req,res) => {
    let venue = new Venue(req.body)
    venue.save((err,obj) => {
        if(err){
            console.error("Venue Creation Error: "+ err)
            return res.status(403).json({
                success: false,
                message: "Venue Creation Failed",
                reason: err
            })
        }
        res.json({obj})
    })
}

exports.editVenue = (req,res) => {
    
    Venue.findByIdAndUpdate({_id: req.venue._id},
        {$set: req.body},
        {new: true,useFindAndModify: false},
        (err,venue) => {
            if(err){
                return res.status(400).json({
                    error: "Updating not authorized"
                })
            }
            res.json(venue);
        }
    );
}

exports.addDuration = (durationId,id) => {
    console.log(durationId,"hellloo")
    Venue.findById(id)
    .exec((err, venue)=>{      
        if(err || !venue){
            return {
                message: "No such Venue exists",
                error: err
            }
        }
        venue.blockedDurations.push(durationId)
        venue.save((err,obj) => {
            if(err){
                console.error("Duration Id couldn't be appended: "+ err)
                return {
                    success: false,
                    message: "Duration Id couldn't be appended",
                    reason: err
                }
            }
            obj
        })
    })
}

exports.removeVenue = (req,res) =>{
    const venue = req.venue;
    venue.remove((err,venue)=>{
        if(err){
            return res.status(400).json({
                success: false,
                message: "Venue Deletion failed",
                error: err
            })
        }
        res.json({
            success: true,
            message: "Venue deleted"
        });
        }
    )
}

exports.getAllVenues = (req,res) =>{
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

    Venue.find()
    .populate("blockedDurations")
    .populate({ 
        path: 'blockedDurations',
        populate: {
            path: 'eventId',
            select: 'eventCoordinator',
            populate: {
                path: 'eventCoordinator',
                model: 'User',
                select: {'contactNumber': 1, 'email': 1}
            }
        }
        
     })
    .sort([[sortBy, "asc"]])
    .exec((err,venue) => {
        if(err){
            return res.status(400).json({
                message: "No Venue found with this id",
                error: err
            })
        }
        res.json(venue);
    })
}
