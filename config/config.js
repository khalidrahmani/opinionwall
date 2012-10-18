
module.exports = {
    development: {
      db: 'mongodb://localhost/op0017',
      facebook: {
    	  clientID: "257956334321936"
        , clientSecret: "133392ec85c6e094217cef25542a4260"
        , callbackURL: "http://opinionswall.herokuapp.com/auth/facebook/callback"
      },
      twitter: {
    	  clientID: "529526791-vVf4yCKXYUSggdFMB6gFolDMzqZRPlampxZoWPzx"
        , clientSecret: "wIMK1E9PD4WNW61UJ1qSWrK5YJ3Bs125NapWoqCs"
        , callbackURL: "http://opinionswall.herokuapp.com/auth/twitter/callback"
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
	  db: 'mongodb://heroku:ece5a56b25fdc95f1f81bb1447d8f47a@alex.mongohq.com:10072/app7977078',	
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
      google: {
          clientID: "APP_ID"
        , clientSecret: "APP_SECRET"
        , callbackURL: "http://localhost:3000/auth/google/callback"
      }
    }
}
