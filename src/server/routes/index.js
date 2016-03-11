var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  var name  = '';
  var email = '';
  var photo = '';
  var id = '';
  if ( req.user ){
    console.log(req.user);
    name = req.user.displayName;
    email = req.user.email[0].value;
    photo = req.user.avatar_url[0].value;
    id = req.user.id;
  } else {
    name = 'Logged out';
  }
  res.render('index', { title: 'Hello ' + name, email: email, photo: photo, id: id });
});

module.exports = router;
