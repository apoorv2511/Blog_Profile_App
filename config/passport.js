var LocalStrategy = require('passport-local').Strategy;
var User = require('./user_schema.js'); //loading the user model
var multer = require('multer');

//expose this function to app.js
module.exports = function(passport){

	//session setup
	passport.serializeUser(function(user,done){
		done(null,user.id);
	});
	passport.deserializeUser(function(id,done){
		User.findById(id,function(err,user){
			done(err,user);
		});
	});

    //local signup
	passport.use('local-signup', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
        // User.findOne wont fire unless data is sent back
        
        process.nextTick(function() {
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
            User.findOne({ 'email' :  email }, function(err, user) {
                // if there are any errors, return the error
                if (err)
                    return done(err);

                // check to see if theres already a user with that email
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                } 
                else {
                // if there is no user with that email
                // create the user
                var newUser = new User();
                // set the user's local credentials
                newUser.name = req.body.name;
                name1 = req.body.name;
                newUser.email = email;
                newUser.password = newUser.generateHash(password);
                newUser.admin = req.body.admin;
                newUser.photoname = req.filename;
                // save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    console.log("gender is " + newUser.gender);
                    return done(null, newUser);
                });
                }

            });    

        });

    }));

	//LOCAL LOGIN
	passport.use('local-login',new LocalStrategy({
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true
	},
	function(req,email,password,done){
		console.log("entered into local login" + email);
		//callback with email and password from form
		//find user whose email same as form's email
		//we cheeck to see if user trying to login already exists
		 User.findOne({ 'email' :  email }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, user);
            console.log('user profile to be shown');
        });

    }));
};