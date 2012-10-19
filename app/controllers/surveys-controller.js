
var mongoose = require('mongoose')
  , Survey = mongoose.model('Survey')
  , _  = require('underscore')
  , _s = require('underscore.string')
  
// New survey
exports.new = function(req, res){
	
	for( i=3001; i<7000; i++){
	var	data = {
				  _id         :  "auto-generated-survey"+i
		, about       :  " about the survey politics ans society"
	    , question    :  "whats your favourite place in the world as a touristique destination ??"
		, type        :  "multi"
		, choices     :  [{_id: "auto-generated-choice1"+i, counter: i}, {_id: "auto-generated-choice2"+i, counter: i},{_id: "auto-generated-choice4"+i, counter: i},
		                  {_id: "auto-generated-choice3"+i, counter: i}]
		, history     :  [{
						    _id       : "2011-11-"+i
		                    , choices : [{_id: "auto-generated-choice1"+i, counter: i}, {_id: "auto-generated-choice2"+i, counter: i},{_id: "auto-generated-choice4"+i, counter: i},
		       		                  {_id: "auto-generated-choice3"+i, counter: i}]			 
				          },
				          {
							    _id       : "2011-12-"+i
			                    , choices : [{_id: "auto-generated-choice1"+i, counter: i}, {_id: "auto-generated-choice2"+i, counter: i},{_id: "auto-generated-choice4"+i, counter: i},
			       		                  {_id: "auto-generated-choice3"+i, counter: i}]			 
					          },
					          {
								    _id       : "2011-10-"+i
				                    , choices : [{_id: "auto-generated-choice1"+i, counter: i}, {_id: "auto-generated-choice2"+i, counter: i},{_id: "auto-generated-choice4"+i, counter: i},
				       		                  {_id: "auto-generated-choice3"+i, counter: i}]			 
						          },
						          {
									    _id       : "2011-09-"+i
					                    , choices : [{_id: "auto-generated-choice1"+i, counter: i}, {_id: "auto-generated-choice2"+i, counter: i},{_id: "auto-generated-choice4"+i, counter: i},
					       		                  {_id: "auto-generated-choice3"+i, counter: i}]			 
							          }]
	    , user:      req.user 
	    
	    , flags:     i 
	}	
		var survey     = new Survey(data)
			survey.save(function (err) {
				    
			})
		}	
	
	
	
  var survey = 	new Survey({})
  survey.choices.push({_id: ""}, {_id: ""}) // minimum 2 choices are required
  res.render('surveys/new', {
      title: 'New Survey'
    , survey: survey
  })
}

// Create an survey
exports.create = function (req, res) {
    var survey     = new Survey(req.body.survey)    
    survey.user    = req.user
    survey._id     = _s.slugify(req.body.survey.question)
    survey.save(function(err){
      if (err) {    	  
        res.render('surveys/new', {
            title: 'ERROR New Survey'
          , survey: survey
          , errors: err.errors
          , err : err
        })
      }
      else {
        res.redirect('/surveys/'+survey._id)
      }
  })
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
  survey     = _.extend(survey, req.body.survey)
  
  survey.save(function(err, doc) {
    if (err) {
      res.render('surveys/edit', {
          title: 'Edit Survey'
        , survey: survey
        , errors: err.errors
      })
    }
    else {
      res.redirect('/surveys/'+survey._id)
    }
  })
}


//View an survey
exports.show = function(req, res){  
	console.log(req)
  var survey = req.survey
  	  userSurvey = null,
  	  multiUserSurvey = null,
      graph_data = [],
      xkeys = [],
      donut_data = []
  
  if (req.user){
	  var userSurvey = req.user.surveys.id(survey._id)
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
	  t.label = ch._id
	  t.value = ch.counter
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
		}	
		choice.counter += 1	
	} 
	else{
		userChoices = []		
		
		var i = 0 
		survey.choices.forEach(function (ch) {
			userChoices.push({_id: ch._id, val: req.body.data[i].value})
			ch.counter += parseInt(req.body.data[i].value)	
			i++
		})  // Regular Post version
		
		if (userSurvey){
			survey.choices.forEach(function (ch) {
				var formerChoice = userSurvey.choices.id(ch._id)
				ch.counter -= parseInt(formerChoice.val)	
			})			
			userSurvey.choices = userChoices	
		}
		else {
			user.surveys.push({_id: survey._id, choices: userChoices})			
		}
	}	
	// history is a snapshot of surveys during a month, we could have a daily snapshot by adding day to the date	
	 d = new Date()
	 date = d.getFullYear()+'-'+(d.getMonth()+1)
	 var surveyTodayHistory = survey.history.id(date)
	 if(surveyTodayHistory){
		 surveyTodayHistory.choices = survey.choices
	 }
	 else{
		 survey.history.push({_id: date, choices: survey.choices})
	 }	 

	user.save(function(err){
	   	console.log(err)
	})
	survey.save(function(err){
	    if (err) {
	      res.render('/', {
	          title: 'ERROR New Survey'        
	        , errors: err.errors
	      })
	    }
	    else {           
	      res.contentType('json')    		
	      res.send({html : JSON.stringify("Thank you !!")})
	    }
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

// Listing of Surveys
exports.index = function(req, res){
  var perPage = 5
    , page = req.param('page') > 0 ? req.param('page') : 0

  Survey
    .find({})
    .populate('user', 'name')
    .sort({'createdAt': -1}) // sort by date
    .limit(perPage)
    .skip(perPage * page)
    .exec(function(err, surveys) {
      if (err) return res.render('500')
      Survey.count().exec(function (err, count) {
        res.render('surveys/index', {
            title: 'List of Surveys',
            surveys: surveys,
            page: page,
            pages: count / perPage
        })
      })
    })
}


exports.search = function(req, res){
  
	var  ajaxCall    = req.headers["x-requested-with"] == "XMLHttpRequest"
	     initResults = ajaxCall ? 0 : 2,
		 skipIndex   = ajaxCall ? 2 : 0,
	     q           = req.param('q'),    
         reg         = new RegExp(q, 'i')
	
  Survey
    .find({question: { $regex: reg }})
    .populate('user', 'name')
    .sort({'createdAt': -1}) // sort by date
    .limit(initResults)    
    .skip(skipIndex)
    .exec(function(err, surveys) {
      if (err) return res.render('500')
      Survey.find({question: { $regex: reg }}).count().exec(function (err, count) { // TODO remove double query 
    	  
    	if(ajaxCall){
    		res.contentType('json')
    		var h = ''
    		surveys.forEach(function (s) {
    			h+='<div class="survey"><a class="title" href="/surveys/'+s._id+'">'+s.question+'</a><div class="author"><span>Oct 12, 2012</span><span>&nbsp;| Author :&nbsp;</span><a href="/users/507741290413885340000002">vv</a>&nbsp;|&nbsp;</div></div>'		    		    
		    })	
    		res.send({html : h})
    	}  
    	else{
    		 res.render('surveys/search', {
    	            title: 'List of Surveys',
    	            surveys: surveys, 
    	            moreResults: count > initResults,
    	            q : q
    	        })
    	}  
       
      })
    })
}

exports.flag = function(req, res){
	
	var  ajaxCall   = req.headers["x-requested-with"] == "XMLHttpRequest",
		 survey     = req.survey
		 if(ajaxCall){
			 survey.flags += 1
			 res.contentType('json')
			 survey.save(function(err){
				    if (err) {
				      
				    }
				    else {
				    	res.send({html : survey.type })
				    }
				  })		 					  
		 }
}
