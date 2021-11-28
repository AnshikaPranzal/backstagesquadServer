var express = require('express')
const { check, validationResult } = require('express-validator');

var router = express.Router()
const { signout,signup,signin,isSignedIn } = require("../controllers/auth");
const { editUser, getUserById, getUser } = require('../controllers/user');

router.param("userId", getUserById); 

router.post("/signup",[
    check('name', "Name length should be more than 3").isLength({min:3}),
    check('email', "Incorrect Email").isEmail(),
    check('password', "Password length should be more than 3").isLength({min:3})
], signup);

router.post("/signin",[
    check('email', "Incorrect Email").isEmail(),
    check('password', "Password length should be more than 3").isLength({min:3})
], signin);

router.get("/signout", signout);
router.get("/user/:userId", getUser);

router.put("/edit/user/:userId", editUser);

router.get("/test", isSignedIn, (req,res) =>{
    res.json(req.auth);
});

module.exports = router;