$(document).ready(function () {

  $('.confirm').submit(function (e) {
    e.preventDefault();
    var self = this;
    var msg = 'Are you sure?';
    bootbox.confirm(msg, 'cancel', 'Yes! I am sure', function (action) {
      if (action) {
        $(self).unbind('submit');
        $(self).trigger('submit');
      }
    });
  });
  var i = $("#hidden_input").val() 
  $("#add_choice").click(function() {
	  $('#choices').append('<p> <input type="text" name="survey[choices]['+i+'][_id]"><a class="btn remove_choice" href="#"> - </a> </p>');
	  i++
	});    
  
  $(".remove_choice").live("click", function() {
	  $(this).closest('p').remove();	 
	  $("#choices input:text").each(function(index) {
		    $(this).attr("name", "survey[choices]["+index+"][_id]")
		    i = index+1
	  });

	});    
  
/* 
$('#login').submit(function (e) {
		e.preventDefault()
		$.getJSON("/search",{q: $("#q").val(), page : page},
            function(data) {
                $(".surveys").append(data.html)
                $(".ajax").html("Load more results ...")
                page++
        })
		
		alert("login submitted")  
})*/
})
