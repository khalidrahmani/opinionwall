var mongoose = require('mongoose')
  , User = mongoose.model('User')

exports.signin = function (req, res) {}
// auth callback
exports.authCallback = function (req, res, next) {
  res.redirect('/')
}

// login
exports.login = function (req, res) {
  res.render('users/login', {
    title: 'Login'
  })
}

// sign up
exports.signup = function (req, res) {
  
  for( i=1; i<10000; i++){
  var user = new User()  
  user.name= "54556cd"+i 
  user.email= "54556cd"+i	
  user.password= "54556cd"+i
	  user.save(function (err) {
		    
		  })
  }
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

// session
exports.session = function (req, res) {
  res.redirect('/')
}

// signup
exports.create = function (req, res) {
  var user = new User(req.body)
  user.provider = 'local'
  user.save(function (err) {
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
