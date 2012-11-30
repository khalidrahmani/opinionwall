
module.exports = {
    development: {
      db: 'mongodb://localhost/op0022',
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
        , callbackURL: "http://www.opinionswall.com/auth/facebook/callback" 
      },
      twitter: {
    	  clientID: "zyz1NOKBgJ73RHc3uICgg"
        , clientSecret: "ZSAjFnnQNAX9kW5kCEZezjjUkXfpSsWcXsVvJD0U"
        , callbackURL: "http://www.opinionswall.com/auth/twitter/callback"
      },
      google: {
          clientID:  "224727739474.apps.googleusercontent.com"
        , clientSecret: "LtU4K87cb1dcTnISQXlRu0Qr"
        , callbackURL: "http://www.opinionswall.com/auth/google/callback"
      }
    }
}
