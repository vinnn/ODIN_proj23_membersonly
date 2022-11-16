var express = require('express');
var router = express.Router();

// Require controller modules.
const user_controller = require("../controllers/userController");
const message_controller = require("../controllers/messageController");
const secretcode_controller = require("../controllers/secretcodeController");



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
router.post('/join/:id', user_controller.join_post);

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// POST Message form
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
router.post('/new-message', message_controller.message_create_post);


//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// GET Delete Message page
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// router.get('/delete/:id', message_controller.message_delete_get);

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// POST Delete Message
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
router.post('/delete/:id', message_controller.message_delete_post);


//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// TEMPORARY ADMIN ROUTE - POST ADMIN CODE
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
router.get('/secretcodes', secretcode_controller.secretcode_create_get);
router.post('/secretcodes/:code', secretcode_controller.secretcode_create_post);




module.exports = router;
