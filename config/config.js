
module.exports = {
    development: {
      db: 'mongodb://localhost/op0012',
      facebook: {
    	  clientID: "257956334321936"
        , clientSecret: "133392ec85c6e094217cef25542a4260"
        , callbackURL: "http://opinionswall.herokuapp.com/auth/facebook/callback"
      },
      twitter: {
    	  clientID: "2151522152155615515"
        , clientSecret: "9c3c0bde2389f7ec7ccfaeba3b49ec32"
        , callbackURL: "http://localhost:3000/auth/twitter/callback"
      },
      github: {
    	  clientID: 'APP_ID'
        , clientSecret: 'APP_SECRET'
        , callbackURL: 'http://localhost:3000/auth/github/callback'
      },
      google: {
          clientID: "APP_ID"
        , clientSecret: "APP_SECRET"
        , callbackURL: "http://localhost:3000/auth/google/callback"
      }
    }
  , test: {

    }
  , production: {
	  db: 'mongodb://heroku:8b712063a7d71a87a242d21fc8d0925c@alex.mongohq.com:10072/app7977078',	
	  facebook: {
    	  clientID: "257956334321936"
        , clientSecret: "133392ec85c6e094217cef25542a4260"
        , callbackURL: "http://opinionswall.herokuapp.com/auth/facebook/callback" 
      },
      twitter: {
    	  clientID: "2151522152155615515"
        , clientSecret: "9c3c0bde2389f7ec7ccfaeba3b49ec32"
        , callbackURL: "http://localhost:3000/auth/twitter/callback"
      },
      github: {
    	  clientID: 'APP_ID'
        , clientSecret: 'APP_SECRET'
        , callbackURL: 'http://localhost:3000/auth/github/callback'
      },
      google: {
          clientID: "APP_ID"
        , clientSecret: "APP_SECRET"
        , callbackURL: "http://localhost:3000/auth/google/callback"
      }
    }
}
