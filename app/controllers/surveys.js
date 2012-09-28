
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
  var survey = new Survey(req.body)
  survey.user = req.user

  survey.save(function(err){
    if (err) {
      res.render('surveys/new', {
          title: 'New Survey'
        , survey: survey
        , errors: err.errors
      })
    }
    else {
      res.redirect('/surveys/'+survey._id)
    }
  })
}


// Edit an survey
exports.edit = function (req, res) {
  res.render('surveys/edit', {
    title: 'Edit '+req.survey.question,
    survey: req.survey
  })
}


// Update survey
exports.update = function(req, res){
  var survey = req.survey

  survey = _.extend(survey, req.body)

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


// View an survey
exports.show = function(req, res){
  res.render('surveys/show', {
	  title: req.survey.question,
	  survey: req.survey
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

