// song schema

// modelled after code provided from "https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4"
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

// define the user model schema using the ID3v1 tag specifications
var SongSchema   = new Schema({
	title: String,		// 30 char
	artist: String,		// 30 char
	album: String,		// 30 char
	year: Number,       // 4 char
	comment: String,	// 30 char
	//track: Number,
	genre: Number,      // 1 byte
	rating: Number,
	hidden: String,	// Y or N
    loginid: String, //indicates who submitted
});

// export the module so other js modules can use it when the require it
module.exports = mongoose.model('User', BearSchema);