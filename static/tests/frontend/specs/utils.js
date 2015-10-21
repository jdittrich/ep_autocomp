var writeWordsWithC = function(cb){

  var inner$ = helper.padInner$;
  var $firstTextElement = inner$("div").first();
  //select this text element
  $firstTextElement.sendkeys('{selectall}');
  $firstTextElement.sendkeys('car{enter}chrome{enter}couch{enter}{enter}');
  helper.waitFor(function(){
    var $firstTextElement =  inner$("div").first();
    return $firstTextElement.text() === "car";
  }).done(cb);
}


var enableAutocomplete = function(shouldEnableAutocomplete, callback) {
  var chrome$ = helper.padChrome$;

  //click on the settings button to make settings visible
  var $settingsButton = chrome$(".buttonicon-settings");
  $settingsButton.click();

  //check "enable autocompletion"
  var $autoComplete = chrome$('#options-autocomp')
  if ($autoComplete.is(':checked') !== shouldEnableAutocomplete) $autoComplete.click();

  // hide settings again
  $settingsButton.click();

  callback();
}