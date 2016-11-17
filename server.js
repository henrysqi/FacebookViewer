var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('./config');

var app = express();

app.use(session({secret: 'some-random-string'}))
app.use(passport.initialize())
app.use(passport.session())

passport.use(new FacebookStrategy({
  clientID: config.facebookId,
  clientSecret: config.facebookSecret,
  callbackURL: config.baseDomain + '/auth/facebook/callback'
}, function(token, refreshToken, profile, done) {
	// Go to database and look for profile.id
	// Create user using profile.id
	// and other code goes here
  return done(null/*error*/, profile/*info that goes on session*/);
}));

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
	successRedirect: '/me',
	failureRedirect: '/login'
}));

// Here to help with session
//preps data to put on session
passport.serializeUser(function(user, done) {
  done(null, user);
});

//gets data from session and preps for req.user
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


app.get('/me', function(req,res){
	res.send(req.user);
})




app.listen(3000, function(){
	console.log("listening........")
})