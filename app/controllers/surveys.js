
var mongoose = require('mongoose')
  , Survey = mongoose.model('Survey')
  , _ = require('underscore')

// New survey
exports.new = function(req, res){
  res.render('surveys/new', {
      title: 'New Survey'
    , survey: new Survey({})
  })
}

// Create an survey
exports.create = function (req, res) {
    var survey     = new Survey(req.body.survey)    
    survey.user    = req.user
   
    survey.save(function(err){
      if (err) {
        res.render('surveys/new', {
            title: 'ERROR New Survey'
          , survey: survey
          , errors: err.errors
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
  var survey = req.survey
  var userChoice = null
  
  if (req.user){
	  var userSurvey = req.user.surveys.id(survey._id)
	  if (userSurvey){
		   userChoice = userSurvey.choice 		
	  }
  } 
  
  res.render('surveys/show', {
	  title: req.survey.question,
	  survey: survey,
	  userChoice: userChoice,
	  disqus: true
  })
}


//User Post Choice
exports.postChoice = function (req, res) {
	var survey = req.survey
	var choice = survey.choices.id(req.body.survey.choice)
	var user   = req.user
	
	var userSurvey = user.surveys.id(survey._id)
	if (userSurvey){
		var formerChoice = survey.choices.id(userSurvey.choice)
		formerChoice.counter -= 1
		userSurvey.choice = req.body.survey.choice		
	}
	else {
		user.surveys.push({_id: survey, choice: req.body.survey.choice})			
	}	
	choice.counter += 1		

	choices = []
	survey.choices.forEach(function (choice) {			
			choices.push({_id: choice._id, counter: choice.counter})		    
	})
	 d = new Date()
	 date = d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()
	 var surveyTodayHistory = survey.history.id(date)
	 if(surveyTodayHistory){
		 surveyTodayHistory.choices = choices
	 }
	 else{
		 survey.history.push({_id: date, choices: choices})
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
      res.redirect('/')
    }
  })
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
            title: 'List of Surveys'
          , surveys: surveys
          , page: page
          , pages: count / perPage
        })
      })
    })
}

