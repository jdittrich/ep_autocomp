exports.postAceInit = function(type, context){
  var $ = require('ep_etherpad-lite/static/js/rjquery').$; //it rjquery is a bridge in order to make jquery require-able
  $.getScript("/tests/frontend/lib/sendkeys.js", function(){});

  /*
  Determines if the functionality is activated or not.
  */

  if(!$autocomp) {
    var $outerdocbody = $('iframe[name="ace_outer"]').contents().find('#outerdocbody');
    $autocomp = $('<div id="autocomp" class="autocomp-hidden" style="position: absolute;z-index: 10;"><ul id="autocompItems"></ul></div>');
    $list = $autocomp.find('#autocompItems');

    //react on clicks
    //$autocomp.click this does not work. Inserting text via sendkeys throws a "TypeError: invalid 'in' operand ret._doc" in "ace2_common.js?callback=require.define". It seems to be connected to some focus stealing problem.

    $outerdocbody.append($autocomp);
  }

  // Enable checkbox if it's set in settings
  if(clientVars.ep_autocomp.enabled === true){
    $('#options-autocomp').prop("checked", true);
  }else{
    $('#options-autocomp').prop("checked", false);
  }

  /* on click */
  //  "#options-autocomp" is simply the id/selector of the input with the checkbox determining if autocomp is toggled or not.
  $('#options-autocomp').on('click', function() {
    if($('#options-autocomp').is(':checked')===false){
      $autocomp.hide();
   }
  });

  var urlContainsAutocTrue = (autocomp.getParam("autocomp") == "true"); // if the url param is set
  if(urlContainsAutocTrue){
console.log("derp");
    $('#options-autocomp').attr('checked','checked'); //#options-autocomp is simply the id of the input with the checkbox
  }else if (autocomp.getParam("autocomp") == "false"){
    $('#options-autocomp').attr('checked',false);
    $autocomp.hide();
  }
};
