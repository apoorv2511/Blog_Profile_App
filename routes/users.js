//var express = require('express');
//var router = express.Router();
var mongoose  = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

//schema for user model
var userSchema = mongoose.Schema({
	local:{
		email : String,
		password : String
	}
});

//methods
//generating the hash
userSchema.methods.generateHash = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

//checking if password is valid
userSchema.methods.validPassword = function(password){
	return bcrypt.compareSync(password,this.local.password);
};

var User = module.exports = mongoose.model('User',userSchema);

