var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var app = express();
var gallery = require('./controllers/gallery');

var mongoose = require('mongoose');
// /photo is pointing to the database name
mongoose.connect('mongodb://localhost/photo');
var Photo = require('../models/photo');

// Middleware
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.set('view engine', 'jade');
app.use('/gallery', gallery);

// Renders Main Gallery Page
app.get('/', gallery.list);

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});