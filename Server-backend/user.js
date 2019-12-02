// user schema

// modelled after code provided from "https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4"
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

// define the user model schema
var UserSchema   = new Schema({
    loginid: String,
    password: String,
    role: String,           // role is either a regular user or an admin
    status: String,         // status indicates whether they are active or deactivated
});

// export the module so other js modules can use it when the require it
module.exports = mongoose.model('User', UserSchema);