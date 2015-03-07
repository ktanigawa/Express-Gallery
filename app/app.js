var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport'), 
  LocalStrategy = require('passport-local').Strategy;

var app = express();

var mongoose = require('mongoose');
// /photo is pointing to the database name
mongoose.connect('mongodb://localhost/photo');
var Photo = require('./models/photo');
var User = require('./models/user');
var gallery = require('./controllers/gallery');
var auth = require('./controllers/auth');

// Middleware
app.use(express.static(__dirname + '/../public'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));
app.set('view engine', 'jade');
app.use('/gallery', gallery);
app.use(auth);

// Renders Main Gallery Page
app.get('/', gallery.list);

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});