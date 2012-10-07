var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var ChoiceSchema = new Schema({    
	  choice      : {type : String, trim : true}
 	, counter     : {type : Number, default : 0}
})

var SurveySchema = new Schema({
      question:  {type : String, default : '', trim : true}
	, choices:   [ChoiceSchema]
    , user:      {type : Schema.ObjectId, ref : 'User'}    
    , createdAt: {type : Date, default : Date.now}
})

SurveySchema.path('question').validate(function (question) {
  return question.length > 0 &&  question.length < 200
}, 'question is required and must not exeed 200 caracters')

mongoose.model('Survey', SurveySchema)