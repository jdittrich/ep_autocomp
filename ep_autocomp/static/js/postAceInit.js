exports.postAceInit = function(type, context){
	var $ = require('ep_etherpad-lite/static/js/rjquery').$; //it rjquery is a bridge in order to make jquery require-able
	$.getScript("../static/plugins/ep_autocomp/static/js/lib/jquery_sendkeys.js", function(){});
	/*
	Determines if the functionality is activated or not. 
	*/
	
	if(!$autocomp) {
			var $outerdocbody = $('iframe[name="ace_outer"]').contents().find('#outerdocbody');
			$autocomp = $('<div id="autocomp" style="position: absolute;display: none;z-index: 10;"><ul id="autocompItems"></ul></div>');
			$list = $autocomp.find('#autocompItems');
			$outerdocbody.append($autocomp);
	}
	
  /* on click */
  //  "#options-autocomp" is simply the id/selector of the input with the checkbox determining if autocomp is toggled or not. 
  $('#options-autocomp').on('click', function() {
	if($('#options-autocomp').is(':checked')) {
	  autocomp.enable(); // enables line tocping
   } else {
	   $('#options-autocomp').attr('checked',false);
	   autocomp.disable(); // disables line tocping
	}
  });
  if($('#options-autocomp').is(':checked')) {
	autocomp.enable();
  } else {
	autocomp.disable();
  }

  var urlContainsAutocTrue = (autocomp.getParam("autocomp") == "true"); // if the url param is set
   if(urlContainsAutocTrue){
	$('#options-autocomp').attr('checked','checked'); //#options-autocomp is simply the id of the input with the checkbox
	autocomp.enable();
  }else if (autocomp.getParam("autocomp") == "false"){
	$('#options-autocomp').attr('checked',false);
	autocomp.disable();
  }
};
