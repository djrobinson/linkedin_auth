var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  var name = '';
  if ( req.user ){
    name = req.user.displayName;
  } else {
    name = 'Logged out';
  }
  res.render('index', { title: 'Hello ' + name });
});

module.exports = router;
