const User = require("../models/user");
const Message = require("../models/message");

const async = require("async");
const { body, validationResult } = require("express-validator");
const passport = require("passport");

const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const bcrypt = require('bcryptjs');


// SIGNUP - GET create user form
exports.user_create_get = (req, res) => {
    res.render("signup", {
        title: "Sign Up",
        errorsArray: [],
    });
};


// SIGNUP - POST create user form
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
                    admin: false,
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
]


// HOME - GET home page
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









// LOGIN - GET login form
exports.login_get = (req, res) => {
    res.render("login", {
        title: "Login",
    });
};
// LOGIN - POST login form
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
    
// LOGOUT - GET logout
exports.logout_get = (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
};




// JOIN - GET join form
exports.join_get = (req, res) => {
    res.send("NOT IMPLEMENTED. GET join page");
};
// JOIN - POST join form
exports.join_post = (req, res) => {
    res.send("NOT IMPLEMENTED. POST join page");
};


// MESSAGEBOARD - GET message list
exports.messageboard_get = (req, res) => {
    res.send("NOT IMPLEMENTED. GET messageboard page");
};
// NEW MESSAGE - POST new message form
exports.message_post = (req, res) => {
    res.send("NOT IMPLEMENTED. POST new message form");
};





// for this app, no update or delete

