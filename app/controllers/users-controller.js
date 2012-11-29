var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , expressValidator = require('express-validator')
  , async = require('async')
       
exports.signin = function (req, res) {}
// auth callback
exports.authCallback = function (req, res, next) {
  res.redirect('/')
}

// login
exports.login = function (req, res) {	
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
  res.redirect('/')
}

// signup
exports.create = function (req, res) {
  res.contentType('json')
    
  req.assert('name', 'Invalid name').notEmpty()  
  req.assert('email', 'Invalid email').isEmail()
  req.assert('password', 'Invalid password').notEmpty()
  
  var errors = req.validationErrors()
  
  if (errors) {
   	 res.send({html : errors})
  } 
  else {
	  async.series([
	                function(callback){
	                	User.findOne({ email : req.body.email }).count().exec(function (err, user) {  
	              		  if(user !== 0)  callback(null, {
					              		      "param": "email",
					              		      "msg": "duplicate email"	              		      
					              		    })
	              		  else callback(null)
	              	  })	                    
	                },
	                function(callback){
	                	User.findOne({ name : req.body.name }).count().exec(function (err, user) {  
	                		if(user !== 0)  callback(null, {
		              		      "param": "name",
		              		      "msg": "duplicate name"	              		      
		              		    })
	                		else callback(null)
	              	    })                    
	                },
	            ],	            
	            function(err, results){
		  			if (results[0] || results[1]) res.send({html : results})
		  			else {
			  			  var user = new User(req.body)
			  			  user.provider = 'local'
			  			  user.save(function (err) {	
			  				console.log(err)
			  			    if (err) res.send({html : err}) 
			  			    req.logIn(user, function(err) {
			  			    	if (err) res.send({html : err}) 
			  			    	res.send({html : "Ok"}) 
			  			    })
			  			  })	  
		  			}
	            })
  }  
 
}

// show profile
exports.profile = function (req, res) {
	  var user = req.user
	  res.render('users/profile', {
	      title: user.name
	    , user: req.user
	  })
	}