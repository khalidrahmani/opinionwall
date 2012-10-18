
var mongoose = require('mongoose')
  , Survey = mongoose.model('Survey')
  , User = mongoose.model('User')
  , async = require('async')

module.exports = function (app, passport, auth) {

  // user routes
  var users = require('../app/controllers/users-controller')
  app.get('/login', users.login)
  app.get('/signup', users.signup)
  app.get('/logout', users.logout)
  app.post('/users', users.create)
  app.post('/users/session', passport.authenticate('local', {failureRedirect: '/login'}), users.session)
  app.get('/users/:userId', users.show)
  app.get('/auth/facebook', passport.authenticate('facebook', { scope: [ 'email', 'user_about_me'], failureRedirect: '/login' }), users.signin)
  app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), users.authCallback)
  app.get('/auth/twitter', passport.authenticate('twitter', { failureRedirect: '/login' }), users.signin)
  app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), users.authCallback)
  app.get('/auth/google', passport.authenticate('google', { failureRedirect: '/login', scope: 'https://www.google.com/m8/feeds' }), users.signin)
  app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login', scope: 'https://www.google.com/m8/feeds' }), users.authCallback)

  app.param('userId', function (req, res, next, id) {
    User
      .findOne({ _id : id })
      .exec(function (err, user) {
        if (err) return next(err)
        if (!user) return next(new Error('Failed to load User ' + id))
        req.profile = user
        next()
      })
  })

  // survey routes
  var surveys = require('../app/controllers/surveys-controller')
  app.get('/flag/:id', surveys.flag)
  app.get('/search', surveys.search)
  app.get('/surveys', surveys.index)
  app.get('/surveys/new', auth.requiresLogin, surveys.new)
  app.post('/surveys', auth.requiresLogin, surveys.create)
  app.post('/surveys/:id/choice', auth.requiresLogin, surveys.postChoice)  
  app.get('/surveys/:id', surveys.show)
  app.get('/surveys/:id/edit', auth.requiresLogin, auth.survey.hasAuthorization, surveys.edit)
  app.put('/surveys/:id', auth.requiresLogin, auth.survey.hasAuthorization, surveys.update)
  app.del('/surveys/:id', auth.requiresLogin, auth.survey.hasAuthorization, surveys.destroy)

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
