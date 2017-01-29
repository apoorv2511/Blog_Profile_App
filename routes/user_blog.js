var express = require('express');
var router = express.Router();
var fs = require('fs');

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var person_blog = mongoose.Schema({
	name : String,
	email : String,
	heading : String,
	desc :String,
	count : Number,
	created_at : Date,
	userid  : {
		type: mongoose.Schema.Types.ObjectId,
		ref : 'userSchema'
	}
});
var Person_blog = module.exports = mongoose.model('Person_blog',person_blog);

