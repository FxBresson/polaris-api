var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// create User Schema
var User = new Schema({
  battletag: String,
  someID: String
});


module.exports = mongoose.model('users', User);