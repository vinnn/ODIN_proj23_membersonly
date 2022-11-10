const Message = require("../models/message");
const User = require("../models/user");

const async = require("async");
const { body, validationResult } = require("express-validator");




// BOARD List all Messages - GET message list
exports.message_list_get = (req, res) => {
    res.send("NOT IMPLEMENTED. Message List GET");
};





// BOARD Create New Message - GET create message form
exports.message_create_get = (req, res) => {
    res.send("NOT IMPLEMENTED. Message Create GET");
};


// BOARD Create New Message - POST create message form
exports.message_create_post = [

    body("title", "Message title must not be empty")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body("text", "Message text must not be empty")
      .trim()
      .isLength({ min: 1 })
      .escape(),


    (req, res, next) => {
      const errors = validationResult(req);
  
      const message = new Message({
        title: req.body.title,
        text: req.body.text,
        author: req.user,
        time: Date.now(),
      })
  
  
      message.save((err) => {
        if (err) {
          return next(err);
        }
        // successful. Redirect to ...
        res.redirect('/'); 
      })
  
    }
]



// for this app, no update 
