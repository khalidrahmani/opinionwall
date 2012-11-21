/*$(document).ready(function () {

  var i =  parseInt($("#hidden_input").val()) 
  $("#add_choice").click(function(e) {
	  e.preventDefault()	  
	  $('#choices').append('<div class="control-group"><label class="control-label required">'+(i+1)+'</label><div class="controls"><input type="text" value="" name="choices['+i+'][_id]"> <a class="btn remove_choice" href="#"> x </a> </div></div> ');
	  i++
	});    
  
  $(".remove_choice").live("click", function() {
	  $(this).closest('div .control-group').remove();	 
	  $("#choices input:text").each(function(index) {
		    $(this).attr("name", "choices["+index+"][_id]")
		    i = index+1
	  });

	});
	
})*/
