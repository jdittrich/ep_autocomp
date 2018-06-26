var ep_autocomp_test_helper = ep_autocomp_test_helper || {};
ep_autocomp_test_helper.utils = {
  ENTER: 13,
  ESC: 27,
  SPACE: 32,
  writeWordsWithC: function(cb){
    var inner$ = helper.padInner$;
    var $firstTextElement = inner$("div").first();
    //select this text element
    $firstTextElement.sendkeys('{selectall}{del}');
    $firstTextElement.html('car<br/>chrome<br/>couch<br/>&nbsp;<br/>');
    helper.waitFor(function(){
      var $firstTextElement =  inner$("div").first();
      return $firstTextElement.text() === "car";
    }).done(cb);
  },

  // force pad content to be empty, so tests won't fail if Etherpad default text
  // has content on settings.json
  clearPad: function(cb) {
    var inner$ = helper.padInner$;
    var $padContent = inner$("#innerdocbody");
    $padContent.html("");

    // wait for Etherpad to re-create first line
    helper.waitFor(function(){
      var lineNumber = inner$("div").length;
      return lineNumber === 1;
    }).done(cb);
  },

  resetFlagsAndEnableAutocomplete: function(callback) {
    this.resetFlags();
    this.enableAutocomplete(callback);
  },

  enableAutocomplete: function(callback) {
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
  },

  // reset flags to avoid eventual conflicts with other plugins extending ep_autocomp
  resetFlags: function(){
    var autocomp = helper.padChrome$.window.autocomp;
    autocomp.processKeyEvent = true;
    autocomp.processEditEvent = true;
    autocomp.showOnEmptyWords = false;
    autocomp.doNotResetTargetLineOnEmptySuggestionList = false;
    return;
  },

  pressShortcut: function(keyCode, ctrlPressed){
    var inner$ = helper.padInner$;
    if(inner$(window)[0].bowser.firefox || inner$(window)[0].bowser.modernIE){ // if it's a mozilla or IE
      var evtType = "keypress";
    }else{
      var evtType = "keydown";
    }
    var e = inner$.Event(evtType);
    e.keyCode = keyCode;
    e.ctrlKey = ctrlPressed !== undefined ? true : false;
    inner$("#innerdocbody").trigger(e);
  },
  pressCtrlSpace: function(){
    var ctrlPressed = true;
    this.pressShortcut(this.SPACE, ctrlPressed);
  },

  pressEnter: function(){
    this.pressShortcut(this.ENTER);
  },

  pressEsc: function(){
    this.pressShortcut(this.ESC);
  },

  pressListButton: function(){
    var chrome$ = helper.padChrome$;
    var $insertunorderedlistButton = chrome$(".buttonicon-insertunorderedlist");
    $insertunorderedlistButton.click();
  },

  addAttributeToLine: function(lineNum, cb){
    var inner$ = helper.padInner$;
    var $targetLine = this.getLine(lineNum);
    $targetLine.sendkeys('{mark}');
    this.pressListButton();
    helper.waitFor(function(){
      var $targetLine = ep_autocomp_test_helper.utils.getLine(lineNum);
      return $targetLine.find("ul li").length === 1;
    }).done(cb);
  },

  // first line === getLine(0);
  // second line === getLine(1);
  // ...
  getLine: function(lineNum){
    var inner$ = helper.padInner$;
    var line = inner$("div").first();
    for (var i = lineNum - 1; i >= 0; i--) {
      line = line.next();
    }
    return line;
  },

  textsOf: function($target){
    var texts = _.map($target, function(el){
      return $(el).text();
    })
    return texts;
  },

  mockContext: function($currentElement){
    var context = {
      rep: {
        lines: {
          atIndex: function(i) {
            return {
              lineNode: $currentElement[0],
              domInfo: { node: $currentElement[0] },
            }
          }
        },
        selEnd: [1, 1],
      }
    }
    return context;
  },

  waitShowSuggestions: function(test, cb){
    test.timeout(5000);
    helper.waitFor(function(){
      var outer$ = helper.padOuter$;
      return outer$('div#autocomp').is(":visible");
    }, 3000).done(cb);
  },
  waitHideSuggestions: function(test, cb){
    test.timeout(5000);
    helper.waitFor(function(){
      var outer$ = helper.padOuter$;
      return !outer$('div#autocomp').is(":visible");
    }, 3000).done(cb);
  },

  disableCaseSensitiveMatch: function(){
    var autocompConfig = helper.padChrome$.window.clientVars.ep_autocomp;
    autocompConfig.caseSensitiveMatch = false;
  },
  enableCaseSensitiveMatch: function(){
    var autocompConfig = helper.padChrome$.window.clientVars.ep_autocomp;
    autocompConfig.caseSensitiveMatch = true;
  },
};
