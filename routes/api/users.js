const express = require('express');

let router = express.Router();
let {User} = require("../../models/User");
var bcrypt = require('bcryptjs');
const _ = require('lodash');
const jwt = require('jsonwebtoken');

const config = require('config');
router.post("/register",async(req,res)=>{
    let user = await User.findOne({email:req.body.email});
    if (user) return res.status(400).send("User with given email already exist");
    user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;
    let salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password,salt);
    await user.save();
    let token = jwt.sign({_id:user._id,name:user.name,role:user.role},config.get("jwtPrivateKey"));
    res.send(token);
    let dataTOReturn = {
        name:user.name,
        email:user.email,
        token:user.token
    }
    return res.send(dataTOReturn);

});
router.post('/login',async(req,res)=>{
    let user = await User.findOne({email:req.body.email});
    if (!user) return res.status(400).send("User not Registered");
    let isValid = await bcrypt.compare(req.body.password,user.password);
    if(!isValid) return res.status(401).send("Invalid Password");
    let token = jwt.sign({_id:user._id,name:user.name,role:user.role},config.get("jwtPrivateKey"));
    res.send(token);
})

module.exports = router;