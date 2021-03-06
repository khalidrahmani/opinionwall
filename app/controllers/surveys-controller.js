
var mongoose = require('mongoose')
  , Survey = mongoose.model('Survey')
  , User = mongoose.model('User')  
  , _  = require('underscore')
  , _s = require('underscore.string')
  , expressValidator = require('express-validator')
  

  // Listing of Surveys
exports.index = function(req, res){		
	User.count()
	  .exec(function(err, usercount) {
			Survey.count()
			  .exec(function(err, surveycount) {	
				  Survey
				    .find({}, '_id question')
				    .sort({'tp': -1}) 
				    .limit(15)    
				    .exec(function(err, surveys) {
				      if (err) return res.render('500')
				      res.render('surveys/index', {
				    	  title: 'Make your opinion count',
				    	  surveys: surveys,
				    	  rest: _.rest(surveys, [11]),
				    	  usercount: usercount,
				    	  surveycount: surveycount
				      })      
				    })     
			  })   
	})   
}
  
  
  
// New survey
exports.new = function(req, res){
  var survey = 	new Survey({})
  survey.choices.push({_id: ""}, {_id: ""}) // minimum 2 choices are required
  res.render('surveys/new', {
      title: 'New Survey'
    , survey: survey
  })
}

// Create survey
exports.create = function (req, res) {
	res.contentType('json')    
	
    var survey = new Survey(req.body)
    survey.user    = req.user
    
    var survey_id = _s.slugify(survey.question) || new mongoose.mongo.BSONPure.ObjectID().toString()
	
    survey.choices.forEach(function (ch) {	   	   
	  survey_id += "-"+_s.slugify(ch._id)	  	
    })
    
    survey._id   = survey_id    
    
    req.assert('question', 'between 6 and 120 character').len(6, 120)
    req.assert('type', '').notEmpty()
    
    var errors = req.validationErrors()  
	if (errors) {
		res.send({html : errors})
	} 
	else{
    survey.save(function(err){    	
	      if (err) {
	    	res.send({html : err}) 
	      }
	      else {
	    	  res.send({html: "Ok", survey_id: survey._id})
	      }
	  })
	}
}

//Edit an survey
exports.edit = function (req, res) {
  res.render('surveys/edit', {
    title: 'Edit '+req.survey.question,
    survey: req.survey
  })
}

// Update survey
exports.update = function(req, res){
  var survey = req.survey
  survey     = _.extend(survey, req.body)
  res.contentType('json')
  
  req.assert('question', 'between 6 and 120 character').len(6, 120)
  req.assert('type', '').notEmpty()
    	
  var errors = req.validationErrors()
  
  if (errors) {
	res.send({html : errors})
  }
  
  survey.save(function(err, doc) {
    if (err) {
    	res.send({html : errors})
    }
    else {
    	res.send({html: "Ok", survey_id: survey._id})
    }
  })
}


//View an survey
exports.show = function(req, res){  
	
  var   survey = req.survey
      , flaged = null
  	  , userSurvey = null
  	  , multiUserSurvey = null
      , graph_data = []
      , xkeys = []
      , donut_data = []
  
  if (req.user){
	  userSurvey = req.user.surveys.id(survey._id)
	  flaged = req.user.flags.id(survey._id)
	  
	  if(userSurvey){
		  if (survey.type == "unique") {
			  userSurvey = userSurvey.choice
		  }
		  else{
			  multiUserSurvey = userSurvey.choices
		  }
	  }
  }   
  survey.history.forEach(function (data) {	
	    t = {}
	    t.period = data._id	   
	    data.choices.forEach(function (ch) {
	    	t[ch._id] = ch.counter  
	    })	     
		graph_data.push(t)		    
	})
  
  survey.choices.forEach(function (ch) {
	  xkeys[xkeys.length] = ch._id	   
	  t = {}
	  t.label = _s.truncate(ch._id, 20)	  
	  t.value = parseFloat(_s.numberFormat(ch.counter*100/survey.total, 2))
	  donut_data.push(t)	
  })
  
  res.render('surveys/show', {
	  title: req.survey.question,
	  survey: survey,
	  userChoice: userSurvey,
	  multiUserChoice: multiUserSurvey,
	  graph_data: JSON.stringify(graph_data),
	  xkeys: JSON.stringify(xkeys),
	  donut_data: JSON.stringify(donut_data),
	  flaged: flaged
  })
}

//User Post Choice
exports.postChoice = function (req, res) {
	var  ajaxCall    = req.headers["x-requested-with"] == "XMLHttpRequest"
	     survey      = req.survey,
	     user        = req.user,	
	     userSurvey  = user.surveys.id(survey._id)
	
    if(ajaxCall){		
			if (survey.type == "unique") {
				var  vote   = req.body.data[0].value  // req.body.choice  regular post without ajax
				     choice = survey.choices.id(vote)
				if (userSurvey){
					var formerChoice = survey.choices.id(userSurvey.choice)
					formerChoice.counter -= 1
					userSurvey.choice = vote 		
				}
				else {			
					user.surveys.push({_id: survey._id, choice: vote})
					survey.total += 1
					survey.tp    += 1
				}	
				choice.counter += 1	
			} 
			else{
				userChoices = []		
				
				var i = 0 
				survey.choices.forEach(function (ch) {
					userChoices.push({_id: ch._id, val: req.body.data[i].value})
					ch.counter += parseInt(req.body.data[i].value)
					survey.total += parseInt(req.body.data[i].value)
					i++
				})  // Regular Post version
				
				if (userSurvey){
					survey.choices.forEach(function (ch) {
						var formerChoice = userSurvey.choices.id(ch._id)
						ch.counter -= parseInt(formerChoice.val)
						survey.total -= parseInt(formerChoice.val)
					})			
					userSurvey.choices = userChoices	
				}
				else {
					user.surveys.push({_id: survey._id, choices: userChoices})	
					survey.tp    += 1
				}
			}	
		// history is a snapshot of surveys during a month, we could have a daily snapshot by adding day to the date	
		 d = new Date()		 
		 date = d.getFullYear()+'-'+(d.getMonth()+1)//+'-'+d.getDate()
		 var surveyTodayHistory = survey.history.id(date)
		 if(surveyTodayHistory){
			 surveyTodayHistory.choices = survey.choices
		 }
		 else{
			 survey.history.push({_id: date, choices: survey.choices})
		 }	 
	
		user.save(function(err){
			survey.save(function(err){
			    if (err) {
			    	res.send({html : err})
			    }
			    else {           	         		
			      res.send({html : "Ok"})
			    }
			  })		
		})		
	}
}


// Delete an survey
exports.destroy = function(req, res){
  var survey = req.survey
  survey.remove(function(err){
    // req.flash('notice', 'Deleted successfully')
    res.redirect('/surveys')
  })
}

exports.search = function(req, res){
  
	var  ajaxCall    = req.headers["x-requested-with"] == "XMLHttpRequest"
	     limit       = ajaxCall ? 15 : 15,
		 skipIndex   = ajaxCall ? req.param('page')*limit : 0,
	     q           = req.param('q'),    
         reg         = new RegExp(q, 'i')
	
  Survey
    .find({$or:[ {question: { $regex: reg }}, {_id: { $regex: reg }}]})
    .sort({'tp': -1}) // sort by date
    .limit(limit)    
    .skip(skipIndex)
    .exec(function(err, surveys) {
      if (err) return res.render('500')
      Survey.find({question: { $regex: reg }}).count().exec(function (err, count) { // TODO remove double query 
    	  
    	if(ajaxCall){
    		res.contentType('json')
    		var h = ''
    		surveys.forEach(function (s) {    			
    			h+='<a class="survey-title" href="/surveys/'+s._id+'">'+s.question+'</a><p><small>'+formatDate(s.createdAt, "%b %d, %Y at %I:%M %p")+ ' - '+ s.tp +' votes</small> </p>'		    		    
		    })	
    		res.send({html : h})
    	}
    	else{
    		 res.render('surveys/search', {
    	            title: 'List of Surveys',
    	            surveys: surveys, 
    	            moreResults: count > limit,
    	            q : q
    	        })
    	} 
       
      })
    })
}
var formatDate = function (date) {
    var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec" ]
    return monthNames[date.getMonth()]+' '+date.getDate()+', '+date.getFullYear()
  }

exports.flag = function(req, res){
	
	var  ajaxCall   = req.headers["x-requested-with"] == "XMLHttpRequest",
		 survey     = req.survey,
		 user       = req.user
    
	res.contentType('json')
		 
	 if(user && ajaxCall){		 
		 if(user.flags.id(survey._id)){
			 res.send({html : "already flaged" })
		 }		 
		 else{
			 survey.flags += 1
			 user.flags.push({_id: survey._id})				 
			 survey.save(function(err){
				    if (err) {
				      
				    }
				    else {
				    	user.save(function(err){
				    		if (err) {
							      
						    }
						    else {
						    	res.send({html : survey.type })
						    }
				    	})
				    	
				    }
				  })		 					  
		 }
	 }
}

exports.lang = function (req, res) {
	//console.log(req.headers['accept-language'])
	locales = ['en', 'fr', 'de']
	languages = ['English', 'Francais', 'German']
	if(locales.indexOf(req.param('lang')) != -1){
		req.session.lang = req.param('lang')
		req.session.language = languages[locales.indexOf(req.param('lang'))]
		res.redirect('/')
	}
	else {
    	return res.render('404')
    }
}
