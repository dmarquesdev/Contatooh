var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var mongoose = require('mongoose');

module.exports = function() {

	var Usuario = mongoose.model('Usuario');

	passport.use(new FacebookStrategy({
		clientID: '1478364139124401', 
		clientSecret: '72b8c642c7c131de91871fcac6188682', 
		callbackURL: 'http://localhost:3000/auth/facebook/callback'
	}, function(accessToken, refreshToken, profile, done){
		Usuario.findOrCreate(
			{ "login" : profile.id }, 
			{ "nome" : profile.displayName }, 
			function(erro, usuario) {
				if(erro) {
					console.log(erro);
					return done(erro);
				}

				return done(null, usuario);
			}
		);
	}));

	passport.serializeUser(function(usuario, done) {
		done(null, usuario._id);
	});

	passport.deserializeUser(function(id, done) {
		Usuario.findById(id).exec()
		.then(function(usuario) {
			done(null, usuario);
		});
	});
};