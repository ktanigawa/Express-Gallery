var express = require('express');
var bodyParser = require('body-parser');

// var connect = require('connect'); **method-override
var methodOverride = require('method-override');
var app = express();

var mongoose = require('mongoose');
// /photo is pointing to the database name
mongoose.connect('mongodb://localhost/photo');
var Schema = mongoose.Schema;

var photoSchema = new Schema({
  autor: String,
  link: String,
  description: String,
  created_at: Date
});
// lets you save and get find() photos is the collection
var Photo = mongoose.model('Photo', photoSchema);

// Middleware
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.set('view engine', 'jade');

// Renders Main Gallery Page
app.get('/', function (req, res) {
  // calls all photos in database
  Photo.find(function (err, photos ) {
    if (err) throw err;
    console.log(photos);
    res.render('gallery', { photos : photos });
  });
});

// Renders single gallery photo page
// app.get('/gallery/:id', )

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});