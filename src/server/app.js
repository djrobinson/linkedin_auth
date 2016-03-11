// At the top, where you are requiring your packages
var cookieSession = require('cookie-session');
var passport = require('passport');
var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
if ( !process.env.NODE_ENV ) { require('dotenv').config(); }

// *** main dependencies *** //
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var swig = require('swig');
var knex = require('./db/knex');
// *** routes *** //
var routes = require('./routes/index.js');
var auth = require('./routes/auth.js');

// *** express instance *** //
var app = express();

// *** view engine *** //
var swig = new swig.Swig();
app.engine('html', swig.renderFile);
app.set('view engine', 'html');


// *** static directory *** //
app.set('views', path.join(__dirname, 'views'));


// *** config middleware *** //
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../client')));


app.use(cookieSession({
  name: 'linkedin-oauth-session-example',
  keys: [process.env.COOKIE_KEY1, process.env.COOKIE_KEY2]
}));
app.use(passport.initialize());
app.use(passport.session());

// above your routes
passport.use(new LinkedInStrategy({
  clientID: process.env.LINKEDIN_API_KEY,
  clientSecret: process.env.LINKEDIN_SECRET_KEY,
  callbackURL: process.env.HOST + "auth/linkedin/callback",
  state: true,
  scope: ['r_emailaddress', 'r_basicprofile']
}, function(accessToken, refreshToken, profile, done) {
    knex('users').select().where('linkedin_id', profile.id).then(function(data){
      console.log("Data is ", data);
      if (data.length){
        console.log("some datalkjaksldfjlskdjf");
        process.nextTick(function () {
        return done(null, { id: profile.id, displayName: profile.displayName, email: profile.emails, avatar_url: profile.photos });
        });
      } else {
        console.log("inserting!!!!!");
        knex('users').insert({linkedin_id: profile.id, email: profile.emails[0].value, preffered_name: profile.displayName, last_name: profile.displayName, avatar_url: profile.photos[0].value }).then(function(data){
          process.nextTick(function () {
          return done(null, { id: profile.id, displayName: profile.displayName, email: profile.emails, avatar_url: profile.photos });
          });
        });
      }
  });
}));

passport.serializeUser(function(user, done) {
  //later this will be where you selectively send to the browser
  // an identifier for your user, like their primary key from the
  // database, or their ID from linkedin

  done(null, user);
});

passport.deserializeUser(function(user, done) {
  // here is where you will go to the database and get the
  // user each time from it's id, after you set up your db
  done(null, user);
});

// *** main routes *** //
app.use('/', routes);
app.use('/auth', auth);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// *** error handlers *** //

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
