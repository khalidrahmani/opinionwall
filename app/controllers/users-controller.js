var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , Survey = mongoose.model('Survey')  
  , expressValidator = require('express-validator')
  , async = require('async')
  , nodemailer = require('nodemailer')
  , _s = require('underscore.string')
  
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
	    
		User.findOne({ uid : req.param('uid') }).exec(function (err, user) {
		        if (user) {		        	
		      	  Survey
		  	    .find({user: user._id}, '_id question createdAt tp')
		  	    .sort({'tp': -1})	    
		  	    .exec(function(err, surveys) {
		  	      if (err) return res.render('500')
		  	      res.render('users/profile', {
		  	    	  title: user.name,
		  	    	  user: user,
		  	    	  surveys: surveys
		  	      })      
		  	    })
		           
		        }		   
		        else {
		        	return res.render('404')
		        }
		      }) 
	}

exports.forgetpassword = function (req, res) {
	  res.contentType('json')
	  var email = req.param('email')
	  req.assert('email', 'Invalid email').isEmail()
	  var errors = req.validationErrors()
  
	  if (errors){
	   	 res.send({html : errors})
	  }
	  else{
		  User.findOne({ email: email, provider: "local" }).exec(function (err, user) {
		        if (err) return next(err)
		        else {
		        	if(user) {
		        		var d = new Date()	
		        		var token = user.encryptPassword(user.name)+'-'+d.getTime()		        		
		        		user.token = token
		        		user.save(function (err) {
			  			    if (err) res.send({html : err}) 
			  			    else{
			  			    	var smtpTransport = nodemailer.createTransport("SMTP",{
				        		    service: "Gmail",
				        		    auth: {
				        		        user: "opinionwall@opinionwall.com",
				        		        pass: "sky1111ol"
				        		    }
				        		})
				        		var mailOptions = {
				        		    from: "support@opinionwall.com", 
				        		    to: email, 
				        		    subject: "Reset Password",		        		    
				        		    html: '<h4>hello '+user.name+'</h4> please click the link below to reset your password, <br \> <a href="www.opinionwall.com/reset_password/'+token+'">reset password</a> <br \> Opinionwall.com team' 
				        	   }			  			    	
			  			    	smtpTransport.sendMail(mailOptions, function(error, response){
				        		    if(error){
				        		        console.log(error);
				        		    }else{
				        		        console.log("Message sent: " + response.message);
				        		    }		        		    
				        		    smtpTransport.close(); // shut down the connection pool, no more messages
				        		})				        		
				        		res.send({html : "Ok"})
			  			    }
			  			  })	        		
		        	}
		        	else    res.send({html : [{msg: "No user with this email"}]})
		        }
		      })
	  }
	}

exports.resetpassword = function (req, res) {
  res.render('users/resetpassword', {
      title: "Reset password",
      token: req.param('token')
  })
}

exports.changepassword = function (req, res) {
  var token = req.param('token')
  req.assert('password', 'should be between 6 and 20 character.').len(6, 20)	  
  req.assert('password2', 'passwords do not match.').equals(req.body.password)  
  var errors = req.validationErrors()

  if (errors) {	  
   	 res.send({html : errors})
  } 
  else{
	  User.findOne({ token: token }).exec(function (err, user) {
	        if (err) return next(err)
	        else {
	        	if(user) {
	        		var d = new Date(),	
	        		    oldtime = _s.strRightBack(token, '-')
	        		    newtime = d.getTime()
	        		    diff    = (newtime - oldtime)
	        		    console.log(diff)
	        		if(diff > 3600000){ // 1 hour
	        			res.send({html : {m:"errortoken", msg: "invalid token"}})
	        		}
	        		else{
	        			user.token = ''
	        			user.password = req.body.password
		        		user.save(function (err) {	
		        			 if (err) return next(err)
			  			    else{
			  			    	req.logIn(user, function(err) {
				  			    	if (err) res.send({html : err}) 
				  			    	res.send({html : {m:"success", msg: "redirect"}})
				  			    })
			  			    }
		        		})
	        		}
	        		        		
	        	}
	        	else {	        	
	        		res.send({html : {m:"errortoken", msg: "invalid token"}})
	        	}
	        }
	  })
	  
  }	  
}