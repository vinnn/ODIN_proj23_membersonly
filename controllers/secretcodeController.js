const Secretcode = require("../models/secretcode");

const async = require("async");
const { body, validationResult } = require("express-validator");
const passport = require("passport");

const bcrypt = require('bcryptjs');
const secretcode = require("../models/secretcode");


// GET create admin code form
exports.secretcode_create_get = (req, res) => {
    res.render("secretcodes", {
        title: "Secret Codes",
        errorsArray: [],
    });
};


// POST create admin code form
exports.secretcode_create_post = [

    body("newCode", "Code must not be empty")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Code must be longer than 1 letter")
      .escape(),

    (req, res, next) => {
        const errors = validationResult(req);

        // If there are errors. Render login form again 
        if (!errors.isEmpty()) {
            res.render("secretcodes", {
                title: "Secret Codes (try again)",
                errorsArray: errors.array(),
            });
            return;
        }

        // Get the secret code record
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

                // IF ADMIN CODE TO BE UPDATED:
                if (req.params.code == "admin") {
        
                    // Encrypt the admin secret code         
                    bcrypt.hash(req.body.newCode, 10, (err, hashedCode) => {
                        // if err:
                        if (err) {
                            res.render("secretcodes", {
                                title: "Secret Codes (try again hashing issue)",
                                errorsArray: [],
                            });
                            return;
                        } else {
        
                            // create the new record with updated code:
                            const updatedsecretcode = new Secretcode({
                                _id: results.secretcodes._id,
                                name: "codes",
                                admincode: hashedCode,
                                membercode: results.secretcodes.membercode,
                            });
                            // update the record:
                            Secretcode.findOneAndUpdate( { name: "codes" }, updatedsecretcode, {}, (err, therecord) => {
                                if (err) {
                                    return next(err);
                                }
                                // successful. Redirect to login page
                                res.redirect('/secretcodes');                                 
                            })

 
        
                        }
                    })
                }


                // IF MEMBER CODE TO BE UPDATED:
                if (req.params.code == "member") {
        
                    // Encrypt the admin secret code         
                    bcrypt.hash(req.body.newCode, 10, (err, hashedCode) => {
                        // if err:
                        if (err) {
                            res.render("secretcodes", {
                                title: "Secret Codes (try again hashing issue)",
                                errorsArray: [],
                            });
                            return;
                        } else {
        
                            // create the new record with updated code:
                            const updatedsecretcode = new Secretcode({
                                _id: results.secretcodes._id,
                                name: "codes",
                                admincode: results.secretcodes.admincode,
                                membercode: hashedCode,
                            });
                            // update the record:
                            Secretcode.findOneAndUpdate( { name: "codes" }, updatedsecretcode, {}, (err, therecord) => {
                                if (err) {
                                    return next(err);
                                }
                                // successful. Redirect to login page
                                res.redirect('/secretcodes');                                 
                            })

 
        
                        }
                    })
                }










            }
        )
    }
]


