
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

exports.blog = function (req, res) {
	  res.render('statics/blog', {
		    title: 'The power of opinions '    
		  })
	}