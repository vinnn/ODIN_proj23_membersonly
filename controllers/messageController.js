const Message = require("../models/message");
const User = require("../models/user");

const async = require("async");
const { body, validationResult } = require("express-validator");





// Create New Message - GET create message form
exports.message_create_get = (req, res) => {
    res.send("NOT IMPLEMENTED. Message Create GET");
};


// Create New Message - POST create message form
exports.message_create_post = [

    body("text", "Message text must not be empty")
      .trim()
      .isLength({ min: 1 })
      .escape(),


    (req, res, next) => {
      const errors = validationResult(req);
  
      const message = new Message({
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




// Create New Message - POST create message form
exports.message_delete_post = (req, res, next) => {
  // Get the message to delete
  async.parallel(
    {
        messagetodelete(callback) {
            Message.findById( req.params.id )
            .populate("author")
            .exec(callback);
        },
    },
    (err, results, next2) => {
        if (err) {
            return next(err);
        }

        results.messagetodelete.delete().then( () => {

        // passportjs checks if there is a user
        // logged in (by checking the cookies that
        // come with the 'req' object) 
        console.log("deleted?");
        // return;
        //  next2();
        
        res.redirect('/');
  
        });
    }
  )
}






// for this app, no update 

