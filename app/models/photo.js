var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var photoSchema = new Schema({
  autor: String,
  link: String,
  description: String,
  created_at: Date
});

// lets you save and get find() photos is the collection
module.exports = mongoose.model('Photo', photoSchema);