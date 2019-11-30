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


// SONG API routes

// POST Route: Create a new song
// accessed http://localhost:8080/api/createsong with POST method
// createsong is the noun + verb
router.route('/createsong')

    // create a song
    .post(function (req, res) {
        // define a null error object
        var error = {};

        // create an instance of song model
        var song = new Song();

        // song info is POSTed in the request body
        // assign the corresponding properties to song
        song.title = req.body.title;
        song.artist = req.body.artist;
        song.album = req.body.album;
        song.year = req.body.year;
        song.comment = req.body.comment;
        song.track = req.body.track;
        song.genre = req.body.genre;
        song.hidden = "N";

        // front end will map req.body.note to review.note
        if (req.body.note) {
            song.rating = 1;
        }
        else{
            song.rating = 0;
        }

        song.loginid = req.body.loginid;

        error = { code: 0, message: 'Song created successfully' };

        // log a create message to the console
        console.log('Song ' + JSON.stringify(song) + ' created!');

        // call the song object to save that song instance
        song.save(function (err, result) {
            console.log('Create song: ' + err);
            if (err) {
                error = { code: -1, message: 'Failed to create a song record' };
            } else {

                // add review if there is any						
                if (req.body.note || req.body.review_rating) {
                    var review = new Review();
                    review.songid = song._id;
                    review.note = req.body.note;
                    review.rating = req.body.review_rating;
                    review.date = getDateTime(); // year + '-' + month + '-' + day;
                    review.loginid = req.body.loginid;

                    addReview(review);
                }

                error = { code: 0, message: 'song is created successfully!' };
            }

            // since this is a new song, mongoDB will return an implicit _id property to the song
            // _id is kept in the front end page to identify the song for update/delete
            // prepare the response
            response = { error: error, song: song };

            res.json(response);
        });

    });

// PUT ROUTE: To update a song
// accessed http://localhost:8080/api/updatesong/:songid with PUT method
// updatesong is the noun + verb
router.route('/updatesong/:songid')
    // update the song with this id
    .put(function (req, res) {

        var error = {};

        // Use findById to ensure the song exists in the database for update since the same song might have been deleted by other song
        Song.findById(req.params.songid, function (err, song) {

            if (err) {
                error = { code: -1, message: err };

                // if there is an error to locate the song
                // package response with error
                res.json({ error: error });
                return;
            }

            // if song exists, assign song properties update song properties with those in the request body correspondingly
            song.title = req.body.title;
            song.artist = req.body.artist;
            song.album = req.body.album;
            song.year = req.body.year;
            song.comment = req.body.comment;
            song.track = req.body.track;
            song.genre = req.body.genre;
            song.hidden = req.body.hidden;
            song.loginid = req.body.loginid;

            if (req.body.note) {
                // increase number of ratings of the song by 1
                song.rating = song.rating + 1;
            }

            Review.find({ "songid": { $eq: song._id } }, function (err, reviews) {
                if (err) {
                    // res.send(err);
                    error = { code: -1, message: err };
                }
                else {
                    error = { code: 0, message: 'Review records retrieved' };
                }

                // log an update message to the console
                console.log('Update Song: ' + JSON.stringify(song));

                // save the song
                song.save(function (err) {
                    if (err) {
                        error = { code: -1, message: err };
                    }
                    else {
                        // add review if there is any
                        if (req.body.note || req.body.review_rating) {

                            var review = new Review();
                            review.songid = song._id;
                            review.note = req.body.note;
                            review.rating = req.body.review_rating;
                            review.date = getDateTime();    //year + '-' + month + '-' + day;
                            review.loginid = req.body.loginid;

                            addReview(review);
                        }
                        error = { code: 0, message: 'record updated successfully!' };
                    }

                    // return the response
                    // note: we don't need the song object as it is in the front end page
                    res.json({ error: error });
                });
            });
        });
    });

// GET Route: To get songs per login
// accessed http://localhost:8080/api/getsongs with GET method
// getsongs is the noun + verb
router.route('/getsongs/:loginid')
    .post(function (req, res) {
        var error = {};

        // log a get message to the console
        console.log('Get songs ' + JSON.stringify(req.body) + ' per loginid ' + req.params.loginid);

        var criteria = [];

        if (req.body.title) {
            criteria.push({ "title": { $regex: req.body.title, $options: 'i' } });
        }

        if (req.body.artist) {
            criteria.push({ "artist": { $regex: req.body.artist, $options: 'i' } });
        }

        if (req.body.album) {
            criteria.push({ "album": { $regex: req.body.album, $options: 'i' } });
        }

        if (req.body.year) {
            criteria.push({ "year": { $eq: req.body.year } });
        }

        if (req.body.comment) {
            criteria.push({ "comment": { $regex: req.body.comment, $options: 'i' } })
        }

        if (req.body.track) {
            criteria.push({ "track": { $eq: req.body.track } });
        }

        if (req.body.genre) {
            criteria.push({ "genre": { $eq: req.body.genre } });
        }

        // if logged in, get songs per loginid or all songs for admin
        if (req.params.loginid !== 'null' && req.params.loginid !== null) {
            // get user info to determine user role
            User.find({ "loginid": { $eq: req.params.loginid } }, function (err, user) {
                // get all songs
                Song.find(
                    function (err, songs) {
                        if (err) {
                            songs = [];
                            error = { code: -1, message: err };
                        }
                        else {
                            // according to requirement for anonymous user, return up to 10 songs
                            if (req.params.loginid == 'null' || req.params.loginid == null) {
                                songs.splice(10);
                            }
                            error = { code: 0, message: 'Song records are retrieved successfully!' };
                        }

                        // return the response
                        res.json({ error: error, songs: songs });
                    }).sort({ "rating": -1 });
                }
            );
        }
        else {
            // not logged in, get 1st 10 songs, front-end needs to disable editability
            criteria.push({ hidden: "N" });
            Song.find({ $and: criteria }, function (err, songs) {
                if (err) {
                    songs = [];
                    error = { code: -1, message: err };
                }
                else {
                    // according to requirement for anonymous user, return up to 10 songs
                    if (req.params.loginid == 'null' || req.params.loginid == null) {
                        songs.splice(10);
                    }
                    error = { code: 0, message: 'Song records are retrieved successfully!' };
                }

                // return the response
                res.json({ error: error, songs: songs });
            }).sort({ "rating": -1 });
        }
    });

// GET ROUTE: To get a single song per id
// accessed http://localhost:8080/api/getsong/:songid with GET method
// :songid is the request parameter
// getsong is the noun + verb
router.route('/getsong/:songid')

    // get the song with that id
    .get(function (req, res) {
        var error = {};
        var song = new Song();

        // log a get message to the console
        console.log('Get a song');

        // the supplied id is embedded in the songid (same name as in the url)
        // request params object i.e. req.params.songid
        Song.find({ "loginid": { $eq: req.params.songid } }, function (err, song) {
            if (err) {
                error = { code: -1, message: err };
            }
            else {
                error = { code: 0, message: '1 record retrieved' };
            }

            // return the response
            res.json({ error: error, song: song });
        });
    });

// GET ROUTE: To get reviews per song id
// accessed http://localhost:8080/api/getreviews/:songid with GET method
// :songid is the request parameter
// getsong is the noun + verb
router.route('/getreviews/:songid')

    // get the song with that id
    .get(function (req, res) {
        var error = {};

        // log a get message to the console
        console.log('Get reviews for a song');

        // the supplied id is embedded in the songid (same name as in the url)
        //  request params object i.e. req.params.songid
        // song.findById(req.params.songid, function (err, song) {
        Review.find({ "songid": { $eq: req.params.songid } }, function (err, reviews) {
            if (err) {
                // res.send(err);
                error = { code: -1, message: err };
            }
            else {
                error = { code: 0, message: 'Record(s) retrieved' };
            }

            // return the response
            res.json({ error: error, reviews: reviews });
        }).sort({ "date": -1 });;
    });


// GET Route: To get song reviews
// accessed http://localhost:8080/api/getreviews/:songid with GET method
// getreviews/:songid is the noun + verb
router.route('/getreviews/:songid')
    // get all the review per songid 
    .get(function (req, res) {
        var error = {};
        var reviews = [];

        // log a get message to the console
        console.log('Get songs');

        Review.find({ "songid": { $eq: req.params.songid } }, function (err, reviews) {
            if (err) {
                reviews = [];
                error = { code: -1, message: err };
            }
            else {
                error = { code: 0, message: 'reviews records are retrieved successfully!' };
            }

            // return the response
            res.json({ error: error, reviews: reviews });
        });
    });

function getDateTime() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hr = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();

    if (month < 10) {
        month = '0' + month;
    }

    if (day < 10) {
        day = '0' + day;
    }

    if (hr < 10) { hr = '0' + hr; }

    if (min < 10) { min = '0' + min; }

    if (sec < 10) { sec = '0' + sec; }

    return year + '-' + month + '-' + day + ' ' + hr + ':' + min + ':' + sec;
}

function addReview(review) {
    // define a null error object
    var error = {};

    error = { code: 0, message: 'review created successfully' };

    // log a create message to the console
    console.log('Create review ' + JSON.stringify(review));

    // call the review object to save that review instance
    review.save(function (err, result) {
        if (err) {
            error = { code: -1, message: 'Fail to create a review record' };
        } else {
            error = { code: 0, message: 'review is created successfully!' };
        }

        // since this is a new review, mongoDB will return an implicity _id property to the review
        // _id is kept in the front end page to identify the review for update/delete
    });
}    