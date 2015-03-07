var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
  username : String,
  password : String // this will be unencrypted for now
});

userSchema.methods.validPassword = function (password) {
  return this.password == password;
};

// lets you save and get find() users is the collection
module.exports = mongoose.model('user', userSchema);