// modelled from Lab 4 and "https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4"

// response is an object contains {code: error code, message: message text}

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
router.use(function (req, res, next) {
    // logging a general message to indicate a request from the client
    console.log('There is a request.');

    // set the character set to UTF-8 for response
    res.setHeader('Content-Type', 'application/json;charset=UTF-8');

    // make sure we go to the next routes and don't stop here
    next();
});

// Define a default route (i.e. http://localhost:8080/api/)
router.get('/',
    function (req, res) {
        res.json({ message: 'hooray! welcome to our api!' });
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

// USER API routes

// POST Route: Login
router.route('/login')
    .post(function (req, res) {

        var user = new User();      // create a new instance of the User model

        console.log("loginid: " + req.body.email)

        error = { code: 0, message: 'User login successfully' };

        // find() returns an array of data from the User collection/table (even if there is only 1 record found)
        // finding loginid that is equal to req.body.email (email in the request body)
        // once find() finishes, the callback function (as definition below) executes
        User.find({ "loginid": { $eq: req.body.email } }, function (error, users) {

            if (error) {
                console.log(error);

                res.json({ error: error });
            }
            else {
                // loginid is assumed to be the unique key in the User table
                // So we access the 1st element of the users array (which will only contain 1 user)
                user = users[0];
                console.log('find user ' + JSON.stringify(user) + ', password=' + req.body.password)
                if (!user) {
                    // if loginid is not found
                    res.status(401).send('Invalid email!');
                }
                // https://www.npmjs.com/package/password-hash?fbclid=IwAR3XAoTAW7i5-Y2jtoE28D432tt_qPFfMU-V2BMDvJLuzjpNAYlW3MARDo4
                // hash the password
                else if (req.body.verifyPassword && req.body.verifyPassword == 'Y' && !passwordHash.verify(req.body.password, user.password)) {
                    res.status(401).send('Invalid password!');
                }
                else {
                    // password is valid
                    console.log('generate token');
                    let payload = { subject: user._id };
                    let token = jwt.sign(payload, 'secretKey');
                    res.status(200).send({ token });
                }
            }
        })
    })

// POST Route: Create a new user
// accessed http://localhost:8080/api/createuser with POST method
// createuser is the noun + verb
router.route('/createuser')

    // create a user
    .post(function (req, res) {
        // define a null error object
        var error = {};

        // create an instance of User model
        var user = new User();

        // user info is POSTed in the request body
        // the corresponding properties are assigned to the user
        user.loginid = req.body.loginid;
        user.password = passwordHash.generate(req.body.password);       // generate a hash of the password argument
        user.role = req.body.role;
        user.status = req.body.status;

        error = { code: 0, message: 'User created successfully' };

        // log a create message to the console
        console.log('User ' + JSON.stringify(user) + ' created!');

        // call the user object to save that user instance
        user.save(function (err, result) {
            if (err) {
                error = { code: -1, message: 'Failed to create a user record' };

                // prepare the response
                res.json({ error: error });
            }
            else {
                error = { code: 0, message: 'User created successfully!' };

                let payload = { subject: user._id };

                // generate JWT token
                let token = jwt.sign(payload, 'secretKey');
                // since this is a new user, mongoDB will return an implicit _id property to the user
                // _id is kept in the front end page to identify the user for update/delete				
                res.status(200).send({ token: token, user: user });
            }
        });

    });

// GET Route: To get users
// accessed http://localhost:8080/api/getusers with GET method
// getusers is the noun + verb (assumed to be used by admin)
router.route('/getusers')
    // get all the users 
    .get(verifyToken, function (req, res) {
        var error = {};
        var users = [];

        // log a get message to the console
        console.log('Get users');

        // no parameter in find() other than callback finds all users in the User table
        User.find(function (err, users) {
            if (err) {
                users = [];
                error = { code: -1, message: err };
            }
            else {
                error = { code: 0, message: 'User records retrieved successfully!' };
            }

            // return the response
            res.json({ error: error, users: users });
        });
    });

// GET ROUTE: To get a single user per id
// accessed http://localhost:8080/api/getuser/:loginid with GET method
// :loginid is the request parameter
// getuser is the noun+verb
router.route('/getuser/:loginid')

    // get the user with that id
    .get(function (req, res) {
        var error = {};
        var user = new User();

        // log a get message to the console
        console.log('Get a user for ' + req.params.loginid);

        // the supplied id is embedded in the loginid (same name as in the url)
        // request params object i.e. req.params.loginid
        // User.findById(req.params.loginid, function (err, user) {
        User.find({ "loginid": { $eq: req.params.loginid } }, function (err, user) {
            if (err) {
                // res.send(err);
                error = { code: -1, message: err };
            }
            else {
                error = { code: 0, message: '1 record retrieved' };
            }

            // return the response
            res.json({ error: error, user: user });
        });
    });

// PUT ROUTE: To update a user
// accessed http://localhost:8080/api/updateuser/:loginid with PUT method
// updateuser is the noun-verb
router.route('/updateuser/:loginid')
    // update the user with this id
    .put(function (req, res) {

        var error = {};

        // log a update message to the console
        console.log('update user ' + req.params.loginid);

        // Use findById to ensure the user exists in the database for update
        // since the same user might have been deleted by other user
        User.findById(req.params.loginid, function (err, user) {

            if (err) {
                error = { code: -1, message: err };

                // if there is an error to locate the user
                // package response with error
                res.json({ error: error });
                return;
            }

            // if user exists, assign user properties 
            // update user properties with those in the request body
            // correspondingly
            user.loginid = req.body.loginid;
            user.role = req.body.role;
            user.status = req.body.status;

            // log an update message to the console
            console.log('Update User: ' + JSON.stringify(user));

            // save the user
            user.save(function (err) {
                if (err) {
                    error = { code: -1, message: err };
                }
                else {
                    error = { code: 0, message: 'record updated successfully!' };
                }

                // return the response
                // note: we don't need the user object
                // as it is in the front end page
                res.json({ error: error });
            });

        });
    });

// DELETE ROUTE: To delete a user
// accessed http://localhost:8080/api/deleteuser/:loginid with DELETE method
// deleteuser is the noun-verb
router.route('/deleteuser/:loginid')
    // delete the user with this id
    .delete(function (req, res) {
        var error = {};

        // Use findById to ensure the user exists
        // as the user we saw on the web page might have already  been deleted
        User.findById(req.params.loginid, function (err, user) {

            if (err) {
                error = { code: -1, message: err };

                // return error as response
                res.json({ error: error });
                return;
            }

            // log a delete message to the console ONLY AFTER the user is found
            console.log('Delete User: ' + JSON.stringify(user));

            // cal user remove function to delete the user
            User.remove({
                _id: req.params.loginid
            }, function (err, user) {
                if (err) {
                    error = { code: -1, message: err };
                }
                else {
                    error = { code: 0, message: 'User record is deleted successfully!' };
                }

                // return error response
                // we don't need the user object
                res.json({ error: error });
            });
        });

    });


