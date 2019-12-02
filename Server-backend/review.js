// user schema

// modelled after code provided from "https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4"
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

// define the user model schema
var ReviewSchema   = new Schema({
    songid: String,
    note: String,
    rating: String,
    loginid: String,
});

// export the module so other js modules can use it when the require it
module.exports = mongoose.model('Review', ReviewSchema);