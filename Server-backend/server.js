// modelled from Lab 4 and "https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4"

// include the required packages
var express = require('express');               // call express
var jwt = require('jsonwebtoken')               // for JWT authentication
var app = express();                            // define our application
var bodyParser = require('body-parser');
var passwordHash = require('password-hash');

// import the data models that have been defined and exported
var User = require('./user');
var Song = require('./song');
var Review = require('./review');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// include the mongoose object
var mongoose = require('mongoose');

// get rid of the deprecation warning in the command prompt
//mongoose.set('useUnifiedTopology', true);

// connect to the mongoDB
// mongoose.connect("mongodb+srv://jlee2978:jeffrey3316uwo@cluster0-fyxo4.mongodb.net/test?retryWrites=true&w=majority", 
mongoose.connect("mongodb+srv://jlee2978:jeffrey3316uwo@", 
{
	useNewUrlParser: true,
}
)

// Define the port # for listening front end requests
// either the predefined or 8020
var port = process.env.PORT || 8020;        

// Define a router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
    // logging a general message to indicate a request from the client
	console.log('There is a request.');

	// as a lab requirement, set the character set to UTF-8 for response
	res.setHeader('Content-Type', 'application/json;charset=UTF-8');

	// make sure we go to the next routes and don't stop here
    next();
});

// Define a default route (i.e. http://localhost:8080/api/)
router.get('/', 
    function(req, res) {
        res.json({ message: 'hooray! welcome to our api!'});   
    }
);

// middleware
// https://www.youtube.com/watch?v=ajmB9mYAD3k&list=PLC3y8-rFHvwg2RBz6UplKTGIXREj9dV0G&index=26
function verifyToken(req, res, next) {
	if (!req.headers.authorization) {
		return res.status(401).send('unauthorization request');
	}

	let token = req.headers.authorization.split(' ')[1];

	console.log('Verify token: ' + token);

	if (token === 'null') {
		console.log('Token is null');
		return res.status(401).send('unauthorization request');
	}

	// let payload = jwt.verify(token, publicKey, verifyOptions);
	let payload = jwt.verify(token, 'secretKey');

	if (!payload) {
		console.log('Token is not verified');
		return res.status(401).send('unauthorization request');
	}

	req.userId = payload.subject;
	next();
}