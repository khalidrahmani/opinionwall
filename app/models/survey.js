var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var ChoiceSchema = new Schema({    
	  _id         : {type : String, trim : true}
 	, counter     : {type : Number, default : 0} 	
})

var SurveySchema = new Schema({
      question:  {type : String, default : '', trim : true}
	, choices:   [ChoiceSchema]
	, history    : [{
					_id     : {  type : String }
				  , choices : [{
						          _id       :  	{ type : String }
								  ,counter  :  	{ type : Number, default : 0}
						      }]			 
			             }]
    , user:      {type : Schema.ObjectId, ref : 'User'}    
    , createdAt: {type : Date, default : Date.now}
})



SurveySchema.path('question').validate(function (question) {
  return question.length > 0 &&  question.length < 200 &&  question.choices[0]._id.length > 0 &&  question.choices[1]._id.length > 0
}, 'question is required and must not exeed 200 caracters')

SurveySchema.path('choices').validate(function (choices) {
  return choices[0]._id.length > 0 &&  choices[1]._id.length > 0
}, 'you must provide at least 2 choices')

mongoose.model('Survey', SurveySchema)
