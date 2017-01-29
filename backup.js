var express = require('express');
var app = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var flash = require('connect-flash');


var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session      = require('express-session')

var index = require('./routes/index.js');
console.log("hello");

//var User = require('./routes/users.js');
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

var User = mongoose.model('User',userSchema);


//**********************************************************

//var configdb = require('./config/database.js');

console.log("hello1");
//configuration
mongoose.connect('mongodb://localhost:27017/login');
mongoose.connection.on('connected',function(){
  console.log('mongoose connected');
})
//pass passport for configuration
console.log("hello2");
require('./config/passport')(passport);
console.log("hello3");
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//passport requirement
app.use(session({secret : 'my name is apoorv',   
				 proxy: true,
				 resave: true,
    			 saveUninitialized: true
    			}));
app.use(passport.initialize());
app.use(passport.session());//persistant login sessions
app.use(flash());//use connect-flash for messages stored in sessions
console.log("dude");

//load our routes and pass in our app and fully configured passport
require('./routes/index.js')(app,passport);
console.log("dude1");

app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', index);
//app.use('/users', User);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//launch
//app.listen(port)
//console.log('magic happens on port' + port);

module.exports = app;
