// Survey schema

var mongoose = require('mongoose')
  , Schema = mongoose.Schema


var SurveySchema = new Schema({
    question: {type : String, default : '', trim : true}
    , user: {type : Schema.ObjectId, ref : 'User'}    
    , createdAt  : {type : Date, default : Date.now}
})

SurveySchema.path('question').validate(function (question) {
  return question.length > 0 
}, 'question is required and must not exeed 200 caracters')

mongoose.model('Survey', SurveySchema)
