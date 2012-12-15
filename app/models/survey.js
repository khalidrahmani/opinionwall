var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var ChoiceSchema = new Schema({    
	  _id         : {type : String, trim : true}
 	, counter     : {type : Number, default : 0} 	
})

var SurveySchema = new Schema({
	  _id         :  {type : String, index: { unique: true } }
	//, about       :  {type : String, default : '', trim : true}
    , question    :  {type : String, default : '', trim : true}
	, type        :  {type : String}
	, choices     :  [ChoiceSchema]
	, history     :  [{
					    _id       : {  type : String }
	                    , choices : [{
						          _id       :  	{ type : String }
								  ,counter  :  	{ type : Number, default : 0}
						      }]			 
			          }]
    , user:      {type : Schema.ObjectId, ref : 'User'}    
    , createdAt: {type : Date, default : Date.now}
    , flags:     {type : Number, default : 0}
    , total:     {type : Number, default : 0} 
    , tp:        {type : Number, default : 0} // total participations of users
})

SurveySchema.path('question').validate(function (question) {
  return question.length > 0 &&  question.length < 200 
}, 'question is required and must not exeed 200 caracters')

SurveySchema.path('type').validate(function (type) {
  return type.length > 0 
}, 'type is required')

SurveySchema.path('choices').validate(function (choices) {
	var error = true
	choices.forEach(function (ch) {	
	    if(!ch._id.length > 0){
	    	error = false	    	
	    }	    
	})	
    return error
}, 'you must provide at least 2 choices, no empty choices allowed.')

mongoose.model('Survey', SurveySchema)
