
$(document).ready(function () {
  var page = 1  
  $(".ajax").click(function(){
      $("#content").append('<div class="ajax-loader"></div>')
      $.getJSON("/search",{q: $("#q").val(), page : page},
        function(data) {
            $(".surveys").append(data.html)
            $(".ajax-loader").remove()
            page++
        })
  })
  
  $(":input").focusin(function() {   
	  $(this).closest('div .control-group').removeClass("error")
	  $(".alert-error").remove()
	  $(".help-inline").remove()  
	})
  var i =  parseInt($("#hidden_input").val()) 
  $("#add_choice").click(function(e) {
    e.preventDefault()    
    $('#choices').append('<div class="control-group"><label class="control-label"><span class="label label-info">'+(i+1)+'</span></label><div class="controls"><input type="text" value="" name="choices['+i+'][_id]"> <a class="btn remove_choice" href="#"> x </a> </div></div> ');
    i++
  })
  
  $(".remove_choice").live("click", function(e) {
      e.preventDefault()
      $(this).closest('div .control-group').remove()
      $("#choices input:text").each(function(index) {
          $(this).attr("name", "choices["+index+"][_id]")
          i = index+1
          $(this).closest('div').prev().html("<span class='label label-info'>"+i+"</span>")
      })        
})
  


$('#survey-form').submit(function (e) {
    e.preventDefault()
    
    $(".alert-error").remove()  
    $(".help-inline").remove()                
    $(".controls-submit").append('<div class="ajax-loader"></div>')    
    var choices = {} 
    $("#choices input:text").each(function(index) {
        choices[index] = {_id: $(this).val()}
        if($(this).val() == ""){
          $(this).closest('div .control-group').addClass("error")
        }
    })
    $.post($(this).attr("action"),{about: $("#about").val(), question: $("#question").val(), type: $("#type").val(), choices: choices, _method: $("#_method").val()},
            function(data) { // success
              if(data.html === "Ok") $(location).attr('href',"/surveys/"+data.survey_id)
              else{
                if(data.html.name=="MongoError"){ 
                                      $(".question_cg").addClass("error")
                                      $(".question_cg").find(".controls").append("<span class='help-inline'>Duplicate question</span>")                                                                            
                      }
                $.each(data.html,function(i,el){
                  if(el != null){
                     $("."+el.param+"_cg").addClass("error")
                     $("."+el.param+"_cg").find(".controls").append("<span class='help-inline'>"+el.msg+"</span>")
                   }
                })
                
                $(".ajax-loader").remove()
                $(".navbar").append('<div class="alert alert-error"><button data-dismiss="alert" class="close">×</button>Please Correct Errors.</div>')
              }
        }, 'json')
    })
  })
  
