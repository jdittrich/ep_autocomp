var writeWordsWithC = function(cb){

  var inner$ = helper.padInner$;
  var $firstTextElement = inner$("div").first();
  //select this text element
  $firstTextElement.sendkeys('{selectall}{del}');
  $firstTextElement.html('car<br/>chrome<br/>couch<br/><br/>');
  helper.waitFor(function(){
    var $firstTextElement =  inner$("div").first();
    return $firstTextElement.text() === "car";
  }).done(cb);
}


var enableAutocomplete = function(callback) {
  var chrome$ = helper.padChrome$;

  //click on the settings button to make settings visible
  var $settingsButton = chrome$(".buttonicon-settings");
  $settingsButton.click();

  //check "enable autocompletion"
  var $autoComplete = chrome$('#options-autocomp')
  if (!$autoComplete.is(':checked')) $autoComplete.click();

  // hide settings again
  $settingsButton.click();

  callback();
}


var resetFlagsAndEnableAutocomplete = function(callback) {
  resetFlags();
  enableAutocomplete(callback);
}

// reset flags to avoid eventual conflicts with other plugins extending ep_autocomp
var resetFlags = function(){
  var autocomp = helper.padChrome$.window.autocomp;
  autocomp.processKeyEvent = true;
  autocomp.processEditEvent = true;
  autocomp.showOnEmptyWords = false;
  return;
}
