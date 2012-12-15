
exports.about = function (req, res) {
  res.render('statics/about', {
    title: 'About'    
  })
}

exports.terms = function (req, res) {
  res.render('statics/terms', {
	    title: 'Terms And Conditions'    
	  })
}

exports.opinion = function (req, res) {
	  res.render('statics/opinion', {
		    title: 'Opinion '    
		  })
	}