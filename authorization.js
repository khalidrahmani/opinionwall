
/*
 *  Generic require login routing middleware
 */

exports.requiresLogin = function (req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/login')
  }
  next()
};


/*
 *  User authorizations routing middleware
 */

exports.user = {
    hasAuthorization : function (req, res, next) {
      if (req.profile.id != req.user.id) {
        return res.redirect('/users/'+req.profile.id)
      }
      next()
    }
}


/*
 *  Article authorizations routing middleware
 */

exports.survey = {
	    hasAuthorization : function (req, res, next) {
	      if (req.survey.user.id != req.user.id) {
	        return res.redirect('/surveys/'+req.survey.id)
	      }
	      next()
	    }
}