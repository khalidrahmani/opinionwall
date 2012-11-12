var mongoose = require('mongoose')
  , User = mongoose.model('User')

exports.signin = function (req, res) {}
// auth callback
exports.authCallback = function (req, res, next) {
  res.redirect('/')
}

// login
exports.login = function (req, res) {
	console.log(req.body)
  res.render('users/login', {
    title: 'Login',
    email: req.param('er')
  })
}

// sign up
exports.signup = function (req, res) {
  res.render('users/signup', {
    title: 'Sign up',
    user: new User({})
  })
}

// logout
exports.logout = function (req, res) {
  req.logout()
  res.redirect('/login')
}

// signup
exports.create = function (req, res) {
  var user = new User(req.body)
  user.provider = 'local'
  user.save(function (err) {
	console.log(err)
    if (err) return res.render('users/signup', { user: user, errors: err.errors })
    req.logIn(user, function(err) {
      if (err) return next(err)
      return res.redirect('/')
    })
  })
}

// show profile
exports.show = function (req, res) {
  var user = req.profile
  res.render('users/show', {
      title: user.name
    , user: user
  })
}
