// user schema

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , crypto = require('crypto')
  , _ = require('underscore.string')
  , authTypes = ['twitter', 'facebook']
  
  
var UserSchema = new Schema({
	uid:   { type: String }
  ,	flags: [{_id: { type: String }}]
  , surveys: [{   
				_id:      	{ type : String }
				,choice:   	{ type : String }
				,choices: 	[{ _id : String, val : String}] // case multichoices
			}]   
  , name: {type: String}
  , email: {type: String}
  , provider: String
  , hashed_password: {type: String}  
  , salt: String
  , token: String
  , facebook: {}
  , twitter:  {}  
})
UserSchema.pre('save', function(next, done){
    this.uid = _.slugify(this.name)
    next()
})
// virtual attributes
UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password
    this.salt = this.makeSalt()
    this.hashed_password = this.encryptPassword(password)
  })
  .get(function() { return this._password })

// methods
UserSchema.method('authenticate', function(plainText) {
  return this.encryptPassword(plainText) === this.hashed_password
})

UserSchema.method('makeSalt', function() {
  return Math.round((new Date().valueOf() * Math.random())) + ''
})

UserSchema.method('encryptPassword', function(password) {
  return crypto.createHmac('sha1', this.salt).update(password).digest('hex')
})

mongoose.model('User', UserSchema)

