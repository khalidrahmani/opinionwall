
var mongoose = require('mongoose')
  , Survey = mongoose.model('Survey')
  , User = mongoose.model('User')
  , async = require('async')
  , i18n = require("i18n")
  
function requiresRole(role) {   
   return function(req, res, next) {
	   if (role == "logedout"){
		   if (!req.isAuthenticated()) next()
		   else {return res.redirect('/')}   
	   }
	   else{
		   if(req.isAuthenticated()){        	
	        	if ((role == "user") || (req.user.name == "admin")) next()
	        	else {return res.redirect('/login?back='+req.url)}             
	        }            
	        else {return res.redirect('/login?back='+req.url)}   
	   }                   
    }
}

module.exports = function (app, passport, auth) {

	
  var statics = require('../app/controllers/statics-controller')

  app.get('/about', statics.about)	
  app.get('/terms', statics.terms)
  
  // user routes
  var users = require('../app/controllers/users-controller')

  app.get('/login', requiresRole("logedout"), users.login)
  app.get('/signup', requiresRole("logedout"), users.signup)
  app.get('/logout', users.logout)
  app.post('/users', requiresRole("logedout"), users.create)
  app.post('/forgetpassword', requiresRole("logedout"), users.forgetpassword)
  app.get('/reset_password/:token', requiresRole("logedout"), users.resetpassword)  
  app.post('/changepassword/:token', requiresRole("logedout"), users.changepassword)  
  
//app.post('/login', passport.authenticate('local', {successRedirect: '/', failureRedirect: '/login?er=1', failureFlash: true}))
  app.post('/login', requiresRole("logedout"), passport.authenticate('local'),
		  function(req, res) {
			  res.contentType('json')
			  res.send({html : "true"})
	  		})
  app.get('/user/:uid', users.profile)
  app.get('/auth/facebook', requiresRole("logedout"), passport.authenticate('facebook', { scope: [ 'email', 'user_about_me'], failureRedirect: '/login' }), users.signin)
  app.get('/auth/facebook/callback', requiresRole("logedout"), passport.authenticate('facebook', { failureRedirect: '/login' }), users.authCallback)
  app.get('/auth/twitter', requiresRole("logedout"), passport.authenticate('twitter', { failureRedirect: '/login' }), users.signin)
  app.get('/auth/twitter/callback', requiresRole("logedout"), passport.authenticate('twitter', { failureRedirect: '/login' }), users.authCallback)

  // survey routes
  var surveys = require('../app/controllers/surveys-controller')
  app.get('/language/:lang', surveys.lang)    
  app.get('/flag/:id', requiresRole("user"), surveys.flag)
  
  app.get('/search', surveys.search)
  app.get('/surveys', surveys.index)
  app.get('/surveys/new', requiresRole("user"), surveys.new)
  app.post('/surveys', requiresRole("user"), surveys.create)
  app.post('/surveys/:id/choice', requiresRole("user"), surveys.postChoice)  
  app.get('/surveys/:id', surveys.show)
  app.get('/surveys/:id/edit', requiresRole("admin"), surveys.edit)
  app.put('/surveys/:id', requiresRole("admin"), surveys.update)
  app.del('/surveys/:id', requiresRole("admin"), surveys.destroy)

  app.param('id', function(req, res, next, id){
	  Survey
      .findOne({ _id : id })
      .populate('user', 'uid')
      .exec(function (err, survey) {
        if (err) return next(err)
        if (!survey) return res.render('404')
        req.survey = survey
        next()
      })
  })
  
  // home route
  app.get('/', surveys.index) 
  

  
}
