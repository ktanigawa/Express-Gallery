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
    // rendering jade template gallery all of the photos are passed to template
    // for photo in photos
    res.render('gallery', { photos : photos });
  });
});

// Renders single gallery photo page 
app.get('/gallery/:id', function (req, res) {
//find photo by id, cb get photo back
  Photo.findOne({_id : req.params.id}, function (err, photo) {
    if (err) throw err;
// gives template photo that is found
    res.render('gallery', { photo: photo});
  });
});

// Renders gallery photo form 
// url /new_photo 
app.get('/new_photo', function (req, res) {
  // ++new_photo.jade??
  res.render('new_photo');
});

// Saves new photo id
// post gallery goes here to test for making new ones
// this route accepts new user data from the client
app.post('/gallery', function (req, res){
  console.log(req.body);
  // creates a newPhoto item with that data 
  var newPhoto = new Photo({
    author: req.body.author,
    link: req.body.link,
    description: req.body.description,
    created_at: new Date()
  });
  console.log(newPhoto);
  newPhoto.save(function (err){
    if (err) {
      throw err;
    }
    // Redirects to root
    res.redirect('/');
    console.log('saved');
  });
});

// Renders prefilled photo form
app.get('/gallery/:id/edit', function (req, res){
  // find photo 
  Photo.findOne({_id : req.params.id}, function (err, photo) {
    // ++edit_photo.jade
    res.render('edit_photo', {photo : photo});
  });
});

// Updates gallery photo
app.put('/gallery/:id', function (req, res){
  // http://mongoosejs.com/docs/api.html#query_Query-findOneAndUpdate
  Photo.findOneAndUpdate({_id : req.params.id}, {$set: {
    author: req.body.author,
    link: req.body.link,
    description: req.body.description
  }},
    function (err, photo){
    if (err) throw err;
    // Redirects to gallery/:id
    res.redirect('/gallery/'+req.params.id);
  });
});


// Delete Gallery Photo :id
app.delete('/gallery/:id', function (req, res){
  Photo.remove({_id: req.params.id}, function (err){
    if (err) throw err;
    // Redirects to '/' Root
    res.redirect('/');
  });
});


var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});