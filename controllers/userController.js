const User = require("../models/user");
const Message = require("../models/message");
const Secretcode = require("../models/secretcode");

// const mongoose = require('mongoose');
const async = require("async");
const { body, validationResult } = require("express-validator");
const passport = require("passport");

// const LocalStrategy = require("passport-local").Strategy;
// const session = require("express-session");
const bcrypt = require('bcryptjs');

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// SIGNUP - GET create user form
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
exports.user_create_get = (req, res) => {
    res.render("signup", {
        title: "Sign Up",
        errorsArray: [],
    });
};

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// SIGNUP - POST create user form
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
exports.user_create_post = [

    body("firstName", "First Name must not be empty")
      .trim()
      .isLength({ min: 3 })
      .withMessage("First name must be longer than 2 letter")
      .escape(),
    body("lastName", "Last Name must not be empty")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Last name must be longer than 2 letter")
      .escape(),
    body("username", "Username must not be empty")
      .trim()
      .isEmail()
      .withMessage("Username must be an email")
      .escape(),
    body("password", "Password must not be empty")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Password must be at least 3 character long")
      .escape(),
    body("passwordbis", "Password confirmation must not be empty")
      .trim()
      .exists()
      .custom((value, { req }) => value === req.body.password)
      .withMessage("Password confirmation not valid")
      .escape(),
    body("adminCheck", "")
      .trim()
      .escape(),
    body("adminCode", "")
      .trim()
      .escape(),


    (req, res, next) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
        // There are errors. Render login form again 
            res.render("signup", {
                title: "Signup (try again)",
                errorsArray: errors.array(),
            });
            return;
        }

        // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
        // Get the secret codes for checking admin rights of new user
        // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
        async.parallel(
            {
                secretcodes(callback) {
                    Secretcode.findOne( {name: "codes"} )
                    .exec(callback);
                },
            },

            (err, results) => {
                if (err) {
                    return next(err);
                }

                // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
                // Check if admin rights allowed (compare admin pwd with secretcodes.admincode)
                // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%                
                let isAdmin = false;
                if (req.body.adminCheck === "on") {
                    bcrypt.compare(req.body.adminCode, results.secretcodes.admincode, (err, res) => {
                        if (res) {
                            // passwords match! log user in
                            console.log("ADMIN CODE MATCHES!!!")
                            isAdmin = true;
                        } else {
                            // passwords do not match!
                            console.log("ADMIN CODE DOES NOT MATCH!!!")
                            isAdmin = false;
                        }
                    })
                }

                // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
                // Encrypt the new user password and save the record in the db
                // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%                
                bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
                    // if err:
                    if (err) {
                        res.render("signup", {
                            title: "Try again later (password hashing issue)",
                            errorsArray: [],
                        });
                        return;
                    } else {
                    // otherwise save the User record with the hashed password:
                        const user = new User({
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            username: req.body.username,
                            password: hashedPassword,
                            member: false,
                            admin: isAdmin,
                            messages: [],
                        });

                        user.save((err) => {
                            if (err) {
                            return next(err);
                            }
                            // successful. Redirect to login page
                            res.redirect('/login'); 
                        })
                    }
                })
            }
        )
    }
]

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// HOME - GET home page
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
exports.home_get = (req, res) => {
  // Get all messages which will be displayed on the home page
    async.parallel(
        {
            messages(callback) {
                Message.find()
                .populate("author")
                .exec(callback);
            },
        },
        (err, results) => {
            if (err) {
                return next(err);
            }
            // passportjs checks if there is a user
            // logged in (by checking the cookies that
            // come with the 'req' object)  
            res.render("home", {
                title: "Home",
                user: req.user,
                messages: results.messages,
            });
        }
    )
};



// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// LOGIN - GET login form
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
exports.login_get = (req, res) => {
    res.render("login", {
        title: "Login",
    });
};

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// LOGIN - POST login form
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
exports.login_post = [
    
    // 1st middleware: validation & sanitation
    body("username", "Username must not be empty")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("password", "Password must not be empty")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    
    // 2nd middleware: deal with validation errors
    (req, res, next) => {
        const errors = validationResult(req);
      
        if (!errors.isEmpty()) {
            // There are errors. Render login form again 
            res.render("login", {
                title: "Login (try again)",
            });
            return;
        }
        // go to next middleware (authenticate)
        next();
    },

    // 3rd middleware: authenticate
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login"
    })

]

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// LOGOUT - GET logout
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
exports.logout_get = (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
};


// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// JOIN - GET join form
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
exports.join_get = (req, res) => {
    res.render("join", {
        title: "Become a member",
        errorsArray: [],
    });
};

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// JOIN - POST join form
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
exports.join_post = [

    body("code", "Code must not be empty")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Code must be longer than 2 letter")
      .escape(),
 
    (req, res1, next) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
        // There are errors. Render login form again 
            res1.render("join", {
                title: "Join (try again)",
                errorsArray: errors.array(),
            });
            return;
        }

        // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
        // Get the secret codes for checking member access for new user
        // and get the user to be updated
        // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
        async.parallel(
            {
                secretcodes(callback) {
                    Secretcode.findOne( {name: "codes"} )
                    .exec(callback);
                },
                usertoupdate(callback) {
                    User.findById(req.params.id)
                    .exec(callback);
                },
                messages(callback) {
                    Message.find()
                    .populate("author")
                    .exec(callback);
                },
            },

            (err, res2) => {
                if (err) {
                    return next(err);
                }

                // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
                // Check if membership allowed (compare member code with secretcodes.membercode)
                // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%                
                let isMember = false;

                bcrypt.compare(req.body.code, res2.secretcodes.membercode, (err, res3) => {
                    if (err) {
                        return next(err);
                    }
                    if (res3) {
                        // passwords match!
                        // save the updated User record with the member = true:
                        res2.usertoupdate.member = true;

                        res2.usertoupdate.save().then( () => {
                                res1.redirect('/');

                                // res1.render("home", {
                                //     title: "Home",
                                //     user: res2.usertoupdate,
                                //     messages: res2.usertoupdate.messages,
                                // });
                            }
                        )
                
                    } else {
                        // passwords do not match!
                        console.log("MEMBER CODE DOES NOT MATCH!!!")
                        // isMember = false;
                        res1.render("join", {
                            title: "Try again later (code does not match)",
                            errorsArray: [],
                        });
                        return;
                    }
                })


    
            }
        )
    }
]




// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// SIGNUP - GET create user form
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
exports.user_join_get = (req, res) => {
    res.render("join", {
        title: "Join the Club",
        errorsArray: [],
    });
};


