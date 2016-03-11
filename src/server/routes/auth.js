var express  = require('express');
var router   = express.Router();
var passport = require('passport');

router.get('/linkedin', passport.authenticate('linkedin'));

// router.get('/linkedin', function(req, res, next){
//   res.json('Success');
// });

router.get('/linkedin/callback', passport.authenticate('linkedin', {
  failureRedirect: '/'
}), function (req, res, next) {
  console.log('user:', req.user);
  res.redirect('/');
});

router.get('/logout', function(req, res, next) {
  req.logout();
  console.log(req.user);
  res.redirect('/');
});


module.exports = router;