var express = require('express');
var router = express.Router();

// Require controller modules.
const user_controller = require("../controllers/userController");

const message_controller = require("../controllers/messageController");




//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// GET home page. 
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
router.get('/', user_controller.home_get );




//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// GET Sign-up form 
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// router.get('/sign-up', function(req, res, next) { 
//   res.render('signup', { title: 'Express' });
// });
router.get('/sign-up', user_controller.user_create_get );


//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// POST Sign-up form
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
router.post('/sign-up', user_controller.user_create_post);


//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// GET Login form
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
router.get('/login', user_controller.login_get);

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// POST Login form
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
router.post('/login', user_controller.login_post);

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// GET Logout
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
router.get('/logout', user_controller.logout_get);


//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// GET Join form
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
router.get('/join', user_controller.join_get);

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// POST Join form
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
router.post('/join', user_controller.join_post);


//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// GET Messageboard page
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
router.get('/messageboard', user_controller.messageboard_get);

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// POST Message form
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
router.post('/new-message', message_controller.message_create_post);










module.exports = router;
