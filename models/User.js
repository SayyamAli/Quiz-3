var mongoose = require("mongoose");
const Joi = require('@hapi/joi');
var UserSchema  = mongoose.Schema({
    name: String,
    email:String,
    password: String,
    role:{
        type:String,
        default:"user"

    }
});

var User = mongoose.model("User",UserSchema);

function validateUser(data){
    const schema = Joi.object({
        name: Joi.string().min(3).max(10).required(),
        email: Joi.string().email().min(3).max(20).required(),
        password: Joi.string().min(0).max(12).required(),
    });
    return schema.validate(data,{abortEarly:false});
}

function validateUserLogin(data){
    const schema = Joi.object({
        name: Joi.string().min(3).max(10).required(),
        email: Joi.string().email().min(3).max(20).required(),
        password: Joi.string().min(0).max(12).required(),
    });
    return schema.validate(data,{abortEarly:false});
}

module.exports.User = User;
module.exports.validate = validateUser;
module.exports.validateUserLogin = validateUserLogin;