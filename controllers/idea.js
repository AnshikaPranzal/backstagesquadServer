const Idea= require("../models/idea");
const Rating= require("../models/rating");

exports.getIdeaById = (req, res, next, id) => {
    Idea.findById(id)
    .exec((err, idea)=>{      
        if(err || !idea){
            return res.status(400).json({
                message: "No such Idea exists",
                error: err
            })
        }
        req.idea = idea;
        next();
    })
}

exports.getIdea = (req, res) => {
    return res.json(req.idea)
}

exports.createIdea = (req,res) => {
    let idea = new Idea(req.body)
    idea.author = req.user._id
    idea.save((err,obj) => {
        if(err){
            console.error("Idea Creation Error: "+ err)
            return res.status(403).json({
                success: false,
                message: "Idea Creation Failed",
                reason: err
            })
        }
        let user = req.user
        user.yourIdeas.push(obj._id)
        user.save((err,user) => {
            if(err){
                console.error("Idea Creation Error: "+ err)
                return res.status(403).json({
                    success: false,
                    message: "Idea Creation Failed",
                    reason: err
                })
            }
            return res.json(obj)
        })
    })
}



exports.editIdea = (req,res) => {
    console.log(req)
    Idea.findByIdAndUpdate({_id: req.idea._id},
        {$set: req.body},
        {new: true,useFindAndModify: false},
        (err,idea) => {
            if(err){
                return res.status(400).json({
                    error: "Updating not authorized"
                })
            }
            res.json(idea);
        }
    );
}

exports.giveRating = (req,res) =>{
    let rating = new Rating()
    rating.rate = req.body.rate
    rating.user = req.user._id
    let idea = req.idea
    // console.log(req)
    console.log(idea,idea.rating)
    idea.avgRating = (idea.avgRating * idea.ratings?idea.ratings.length:0 + parseInt(rating.rate))/(idea.ratings?idea.ratings.length:0 +1);
    if(!idea.ratings){
        idea.ratings= [rating]
        console.log(idea.ratings)
    }
    else{
        idea.ratings.push(rating)
        console.log(idea.ratings,"jhgkjhv")
    }
    console.log(idea)
    idea.save((err,obj) => {
        if(err){
            console.error("Rating Error: "+ err)
            return res.status(403).json({
                success: false,
                message: "Rating Failed",
                reason: err
            })
        }
        return res.json(obj)
    })
}

exports.bestRatedIdea = (req,res) =>{
    Idea
    .find()
    .sort({"avgRating":-1})
    .populate("author")
    .limit(1)
    .exec((err,obj) => {
        if(err){
            return res.status(403).json({
                success: false,
                message: "Fetching Failed",
                reason: err
            })
        }
        return res.json(obj)
    })
}

exports.removeIdea = (req,res) =>{
    const idea = req.idea;
    idea.remove((err,idea)=>{
        if(err){
            return res.status(400).json({
                success: false,
                message: "Idea Deletion failed",
                error: err
            })
        }
        let user = req.user
        user.yourIdeas.remove(idea._id)
        user.save((err,user) => {
            if(err){
                console.error("Idea Deletion Error: "+ err)
                return res.status(403).json({
                    success: false,
                    message: "Idea Deletion Failed",
                    reason: err
                })
            }
            return res.json({
                success: true,
                message: "Idea deleted"
            });
        })
        
        }
    )
}

exports.getAllIdeas = (req,res) =>{
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

    Idea.find()
    .sort([[sortBy, "asc"]])
    .populate("author")
    .limit(limit)
    .exec((err,idea) => {
        console.log(err,idea)
        if(err){
            return res.status(400).json({
                message: "Couldn't fetch ideas",
                error: err
            })
        }
        res.json(idea);
    })
}
