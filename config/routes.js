
var mongoose = require('mongoose')
  , Survey = mongoose.model('Survey')
  , User = mongoose.model('User')
  , async = require('async')

function requiresRole(role) {
   return function(req, res, next) {
        if(req.isAuthenticated()){        	
        	if ((role == "user") || (req.user.name == "admin")) next()
        	else {return res.redirect('/login?back='+req.url)}             
        }            
        else {return res.redirect('/login?back='+req.url)}           
    }
}
module.exports = function (app, passport, auth) {

  // user routes
  var users = require('../app/controllers/users-controller')
  app.get('/login', users.login)
  app.get('/signup', users.signup)
  app.get('/logout', users.logout)
  app.post('/users', users.create)
//app.post('/login', passport.authenticate('local', {successRedirect: '/', failureRedirect: '/login?er=1', failureFlash: true}))
  app.post('/login', passport.authenticate('local'),
		  function(req, res) {
			  res.contentType('json')
			  res.send({html : "true"})
	  		})
  app.get('/profile', users.profile)
  app.get('/auth/facebook', passport.authenticate('facebook', { scope: [ 'email', 'user_about_me'], failureRedirect: '/login' }), users.signin)
  app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), users.authCallback)
  app.get('/auth/twitter', passport.authenticate('twitter', { failureRedirect: '/login' }), users.signin)
  app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), users.authCallback)

  // survey routes
  var surveys = require('../app/controllers/surveys-controller')
  app.get('/flag/:id', surveys.flag)
  app.get('/search', surveys.search)
  app.get('/design', surveys.design)  
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
      .populate('user', 'name')
      .exec(function (err, survey) {
        if (err) return next(err)
        if (!survey) return next(new Error('Failed to load article ' + id))
        req.survey = survey
        next()
      })
  })
  
  // home route
  app.get('/', surveys.index)
  

}
