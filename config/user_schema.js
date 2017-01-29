var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');

//schema for user model
var userSchema = mongoose.Schema({
	name : String,
    email : String,
    password : String,
    admin : String,
 // gender : String,
    mob_no : Number,
    photoname : String
});

//methods
//generating the hash
userSchema.methods.generateHash = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

//checking if password is valid
userSchema.methods.validPassword = function(password){
  return bcrypt.compareSync(password,this.password);
};

var User = module.exports = mongoose.model('User',userSchema);