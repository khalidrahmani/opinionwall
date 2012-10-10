  var disqus_shortname = 'opinionswall'; // required: replace example with your forum shortname

  /* * * DON'T EDIT BELOW THIS LINE * * */
  (function() {
      var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
  dsq.src = 'http://' + disqus_shortname + '.disqus.com/embed.js';
  (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
  })();
  
  
  Morris.Line({
	  element: 'annual',
	  data: [
	    {y: '2012', a: 100},
	    {y: '2011', a: 75},
	    {y: '2010', a: 50},
	    {y: '2009', a: 75},
	    {y: '2008', a: 50},
	    {y: '2007', a: 75},
	    {y: '2006', a: 100}
	  ],
	  xkey: 'y',
	  ykeys: ['a'],
	  labels: ['Series A']
	});
