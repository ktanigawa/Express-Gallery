var express = require('express');
var router = express.Router();
var Photo = require('./../models/photo');
var auth = require('./auth');

function ensureAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

function getUsername (req, res) {
  if (req.isAuthenticated()) {
    return req.user.username;
  }
  return false;
}

router.get('/admin', ensureAuthenticated, function (req, res) {
  // calls all photos in database
  Photo.find(function (err, photos ) {
    if (err) throw err;
    console.log(photos);
    // rendering jade template gallery all of the photos are passed to template
    // for photo in photos
    res.render('admin', { photos : photos, logged_in : true, username : req.user.username });
  });
});

//app.get('/') route will look like router.list
// Renders Main Gallery Page
router.list = function (req, res) {
  // calls all photos in database
  Photo.find().sort({created_at:-1}).exec(function (err, photos ) {
    if (err) throw err;
    console.log(photos);
    // rendering jade template gallery all of the photos are passed to template
    // for photo in photos
    var userLoggedIn = getUsername(req, res);
    if (userLoggedIn) {
      res.render('gallery', { photos : photos, logged_in : true, username : req.user.username });
    } else {
      res.render('gallery', { photos : photos, logged_in : false });
    }
  });
};

//all other routes will look like router.*()
// Renders gallery photo form 
// url /gallery/new
router.get('/new', ensureAuthenticated, function (req, res) {
  res.render('new_photo', { logged_in : true, username : req.user.username });
});


// Updates gallery photo
router.put('/:id', ensureAuthenticated, function (req, res) {
  // http://mongoosejs.com/docs/api.html#query_Query-findOneAndUpdate
  Photo.findOneAndUpdate({_id : req.params.id}, {$set: {
    author: req.body.author,
    link: req.body.link,
    description: req.body.description
  }}, function (err, photo) {
    if (err) throw err;
    // Redirects to /:id
    res.redirect('/gallery/'+req.params.id);
  });
});

// Renders prefilled photo form
router.get('/:id/edit', ensureAuthenticated, function (req, res) {
  // find photo 
  Photo.findOne({_id : req.params.id}, function (err, photo) {
    // ++edit_photo.jade
    res.render('edit_photo', {photo : photo, logged_in : true, username: req.user.username });
  });
});

// Renders single gallery photo page 
router.get('/:id', function (req, res) {
  //find photo by id, cb get photo back
  Photo.findOne({_id : req.params.id}, function (err, photo) {
    Photo.find().sort({created_at:-1}).limit(3).exec(function (err, photos){
      if (err) throw err;
      // gives template photo that is found
      var userLoggedIn = getUsername(req, res);
      if (userLoggedIn) {
        res.render('photo', { photo: photo, photos: photos, logged_in : true, username : req.user.username });
      } else {
        res.render('photo', { photo: photo, photos: photos, logged_in : false });
      }
    });
  });
});

// Saves new photo id
// post gallery goes here to test for making new ones
// this route accepts new user data from the client
router.post('/', ensureAuthenticated, function (req, res) {
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

// Delete Gallery Photo :id
router.delete('/:id', ensureAuthenticated, function (req, res) {
  Photo.remove({_id: req.params.id}, function (err){
    if (err) throw err;
    // Redirects to '/' Root
    res.redirect('/');
  });
});



module.exports = router;

/*
  method  path  action  response
  GET / list  gets all Photo documents from db then renders a jade template listing all photos
  GET /gallery/:id  show  gets a single Photo from db then renders a jade template with photo details
  GET /new_photo  new_photo renders a jade template containing a form
  POST  /gallery  create_photo  saves new Photo to db then redirects to admin
  GET /gallery/:id/edit edit_photo  gets a single Photo from db then renders a jade template containing a form pre-filled with photo values
  PUT /gallery/:id  update_photo  saves existing Photo to db then redirects to admin
  DELETE  /gallery/:id  delete_photo  deletes Photo from db then redirects to admin
  GET /admin  admin gets all [resources] then renders a jade template that lists all items with edit and delete buttons
 */