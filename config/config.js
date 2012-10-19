
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
	  db: 'mongodb://heroku_app7977078:g2hntm4r8lka8o86utu2o0pmkh@ds039737.mongolab.com:39737/heroku_app7977078',	
	  facebook: {
    	  clientID: "257956334321936"
        , clientSecret: "133392ec85c6e094217cef25542a4260"
        , callbackURL: "http://opinionswall.herokuapp.com/auth/facebook/callback" 
      },
      twitter: {
    	  clientID: "tMW24sgYF63Fulqr64ZTw"
        , clientSecret: "OdQP3SFN8fXsMKPRApgX1hm5FI0d5bVOrRwNzf6BI"
        , callbackURL: "http://opinionswall.herokuapp.com/auth/twitter/callback"
      },
      google: {
          clientID: "APP_ID"
        , clientSecret: "APP_SECRET"
        , callbackURL: "http://localhost:3000/auth/google/callback"
      }
    }
}
