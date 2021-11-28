const User= require("../models/user");

exports.getUserById = (req, res, next, id) => {
    User.findById(id)
    .populate("yourIdeas coordinatingEvents","-poster")
    .exec((err, user)=>{      
        if(err || !user){
            return res.status(400).json({
                message: "No such User exists",
                error: err
            })
        }
        req.user = user;
        next();
    })
}

exports.getUser = (req, res) => {
    return res.json(req.user)
}

exports.createUser = (req,res) => {
    let user = new User(req.body)
    user.totalHours = (user.endTime - user.startTime)/(60*60)
    user.save((err,obj) => {
        if(err){
            console.error("User Creation Error: "+ err)
            return res.status(403).json({
                success: false,
                message: "User Creation Failed",
                reason: err
            })
        }
        return res.json(obj)
    })
}

function createUserInternal(req){
    let user = new User(req.body)
    user.totalHours = (user.endTime - user.startTime)/(60*60)
    user.save((err,obj) => {
        if(err){
            console.error("User Creation Error: "+ err)
            return {
                success: false,
                message: "User Creation Failed",
                reason: err
            }
        }
        const id = obj._id
        console.log(id.valueOf(),"1")
        return obj
    })
}

exports.editUser = (req,res) => {
    
    User.findByIdAndUpdate({_id: req.user._id},
        {$set: req.body},
        {new: true,useFindAndModify: false},
        (err,user) => {
            if(err){
                return res.status(400).json({
                    error: "Updating not authorized"
                })
            }
            res.json(user);
        }
    );
}

exports.editUserEventId = (req,id) => {
    User.findByIdAndUpdate({_id: id},
        {$set: req.body},
        {new: true,useFindAndModify: false},
        (err,user) => {
            if(err){
                return {
                    error: "Updating not authorized"
                }
            }
            return user;
        }
    );
}

exports.removeUser = (req,res) =>{
    const user = req.user;
    user.remove((err,user)=>{
        if(err){
            return res.status(400).json({
                success: false,
                message: "User Deletion failed",
                error: err
            })
        }
        res.json({
            success: true,
            message: "User deleted"
        });
        }
    )
}

exports.getAllUsers = (req,res) =>{
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy : "startTime";

    User.find()
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err,user) => {
        console.log(err,user)
        if(err){
            return res.status(400).json({
                message: "No User found with this id",
                error: err
            })
        }
        res.json(user);
    })
}
