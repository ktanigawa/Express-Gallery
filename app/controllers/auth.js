var express = require('express');
var router = express.Router();
var User = require('./../models/user');

var passport = require('passport'), 
  LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

//all other routes will look like router.*()
// Renders login form
router.get('/login', function (req, res) {
  res.render('auth/login_form');
});

//uses passport module to authenticate
router.authenticate = passport.authenticate('local', { successRedirect: '/gallery/admin',
  failureRedirect: '/login',
});

//you can pass in an array of middleware, not just one function (e.g. 'authenticate')
router.post('/login', router.authenticate);

// Destroys the current session then redirect to /
router.get('/logout', function (req, res) {
  //destroy session
  req.logout();
  res.redirect('/');
});

module.exports = router;

/*
  method  path  action  response
  GET /login  login_form  renders a jade template login form
  POST  /login  login uses passport module to authenticate. On success: redirect to admin On fail: redirect to login_form
  GET /logout logout  destroys the current session then redirects to /
  GET /admin  admin gets all [resources] then renders a jade template that lists all items with edit and delete buttons
 */