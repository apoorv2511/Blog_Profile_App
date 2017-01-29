//var express = require('express');
//app = express();
var bcrypt = require('bcrypt-nodejs');
var multer = require('multer');
var Person_blog = require('./user_blog');
var User = require('../config/user_schema.js');

module.exports = function(app,passport){
	
	app.post('/blog',isLoggedin,function(req,res,next){
		var per_blog = new Person_blog();
		per_blog.name = req.user.name;
		per_blog.email = req.user.email;
		console.log("name is " + per_blog.name);
		per_blog.heading = req.body.heading;
		per_blog.desc = req.body.desc;
		per_blog.created_at = Date.now();
		console.log("heading is " + per_blog.heading + "at" + per_blog.created_at);
		per_blog.userid = req.user._id;
		per_blog.save(function(err) {
                    if (err)
                        throw err;
                    console.log("date is " + per_blog.date);
                });
		res.redirect("/profile1");
	});

	app.get('/about_me', function(req, res, next) {
  		res.render('about_me');
	});


	app.get('/', function(req, res, next) {
  		res.render('index', { title: 'Express' });
	});

	//login form
	app.get('/login',function(req,res,next){
		res.render('login', { message : req.flash('loginMessage')});
	});

	//to process the login form
    app.post('/login', passport.authenticate('local-login', {
    	successRedirect : '/profile1', // redirect to the secure profile section
    	failureRedirect : '/login', // redirect back to the signup page if there is an error
    	failureFlash : true // allow flash messages
	}));

	app.get('/signup',function(req,res,next){
		res.render('signup.ejs',{ message : req.flash('SignupMessage')});
	});
	//to process signup form
	app.post('/signup',function(req,res,next){
    	upload(req,res,function(err){
      		if(err){
        	return res.render('photo.ejs',{mess :  "file not uploaded"});
      	}
      	console.log("photoSaved as",req.filename);
      	next();
    	})
	},passport.authenticate('local-signup', {
		successRedirect : '/profile1',
		failureRedirect : '/login',
		falureFlash : true
	})
	);
	
	app.get('/getpic/:filename',isLoggedin,function(req,res,next){
		console.log(req.params.filename);
		res.sendFile("C://Express Apps/login/upload/"+req.params.filename);
	});
	
	//profile page
	//isLoggedin function used as route middleware to check
	app.get('/profile1',isLoggedin,function(req,res,next){
		id = req.user._id;
		Person_blog.find({'userid' : id}, function(err,blogs){
			if(err) throw err;
			req.blogs = blogs;		
			console.log("blog:",req.blogs);	
			res.render('profile1.ejs',{
			user : req.user,
			blogs : req.blogs//get user out of session and pass to template
			});
		})		
	});

	app.get('/delete_blog/:_id',isLoggedin, function(req,res,next){
		id1 = req.Person_blog._id;
		Person_blog.findOne({'_id' : id1},function(err,docs){
			docs.remove();
		})
	});

	app.get('/blog',isLoggedin,function(req,res,next){
		res.render('blog.ejs',{ user : req.user 
		});
	});

	app.get('/back_to_profile',isLoggedin,function(req,res,next){
		res.render('profile1.ejs',{ 
			user : req.user,
			blogs : req.blogs 
		});
	});

	//After logout
	app.get('/logout',function(req,res,next){
		req.session.destroy();
		//res.logout();
		res.redirect('/');
	});

	app.get('/api/user_details/*', function(req,res,next){
	res.render('update.ejs', { 
		message : req.flash('SignupMessage'),
		user : req.user
	});
	});

	app.post('/api/user_details/:objid',function(req,res,next){
		var id = req.params.objid;
		console.log(id);
		console.log(req.user.body);
		var user = req.body;
		console.log("user",user);
		var query = { '_id' : id };
		var update = { name : user.name };
		User.findOneAndUpdate({ _id : id }, {$set:{name : req.body.name, email : req.body.email, password : req.user.password, admin : req.body.admin}}, {}, function(err, user){
			if(err) throw err;
				console.log("new name is : " + user.name);
				res.render('message.ejs', { mess : "Your credentials are updated" });
			});
		});

};


function isLoggedin(req,res,next){
	//if the user is authenticated
	if(req.isAuthenticated())
		console.log('routes/index, is logged in, yes authenticated');
		return next();
	//if not
	res.redirect('/');
}

//file storage
var storage = multer.diskStorage({
  destination : function(req,file,callback){
      callback(null,"./upload");
    },
  filename : function(req, file, callback){
    req.filename = file.originalname;
    callback(null,file.originalname );
    console.log(file.originalname);
  }
});

var upload = multer({ storage : storage},{limits : {fieldNameSize : 10}}).single('userphoto');
