const Speaker= require("../models/speaker");
const User = require("../models/user");
const Event= require("../models/event");

exports.search = (req,res) =>{
    let limit = req.body.limit ? parseInt(req.body.limit) : 8;
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";

    let str = req.body.search+".*"
    switch(req.body.filter){
        case "speaker":
            Speaker
            // .find({"$text":{"$search": req.body.search}})
            .find( { "name": {$regex: str, $options:"i"}})
            .select("-picture")
            .exec((err,obj) => {
                if(err){
                    return res.status(400).json({
                        message: "No Speaker found.",
                        error: err
                    })
                }
                res.json(obj);
            })
            break;
        case "user":
            User
            .find({"name": {$regex: str, $options:"i"}})
            .limit(limit)
            .exec((err,obj) => {
                if(err){
                    return res.status(400).json({
                        message: "No User found.",
                        error: err
                    })
                }
                res.json(obj);
            })
            break;
        case "event":
            Event
            .find( { "title": {$regex: str, $options:"i"}})
            .select("-poster")
            .limit(limit)
            .exec((err,obj) => {
                if(err){
                    return res.status(400).json({
                        message: "No Event found.",
                        error: err
                    })
                }
                res.json(obj);
            })
            break;
        default:
            res.status(400).json({
                message:"Bad request"
            })
            break;
    }
}
