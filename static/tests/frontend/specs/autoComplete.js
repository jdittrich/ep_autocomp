describe("show autocomplete suggestions", function(){

  beforeEach(function(cb){
    helper.newPad(function(){
      enableAutocomplete(true, function(){
        writeWordsWithC(cb);
      });
    });
    this.timeout(60000);
  });


  it("displays suggestions", function(done){
    var outer$ = helper.padOuter$;
    var inner$ = helper.padInner$;
    var $lastLine =  inner$("div").last();
    $lastLine.sendkeys('c');
    helper.waitFor(function(){
      return outer$('div#autocomp').is(":visible");
    }).done(function(){
      var suggestionsPopup = outer$('div#autocomp');
      expect(suggestionsPopup.find('li').length).to.be(3);

      done();
    });
  })

  it("hides suggestions", function(done){
    var outer$ = helper.padOuter$;
    var inner$ = helper.padInner$;

    // first make sure suggestions are displayed
    var $lastLine =  inner$("div").last();
    $lastLine.sendkeys('c');
    helper.waitFor(function(){
      return outer$('div#autocomp').is(":visible");
    }).done(function(){
      // then check if suggestions are hidden if there are no words that match
      var $lastLine =  inner$("div").last();
      $lastLine.sendkeys('notSavedWord');
      helper.waitFor(function(){
        return !outer$('div#autocomp').is(":visible");
      }).done(done);
    });
  })

  it("applies selected suggestion", function(done){
    var outer$ = helper.padOuter$;
    var inner$ = helper.padInner$;
    var $lastLine =  inner$("div").last();
    $lastLine.sendkeys('c');
    helper.waitFor(function(){
      return outer$('div#autocomp').is(":visible");
    }).done(function(){
      pressEnter();
      helper.waitFor(function(){
        var $lastLine =  inner$("div").last();
        return $lastLine.text() === "car";
      }).done(done);
    });
  })

  context("when there is line attributes apllied", function(){

    it("ignores * in the beginning of line", function(done){
      addAttributeToFirstLine(function(){
        var outer$ = helper.padOuter$;
        var inner$ = helper.padInner$;
        var $lastLine =  inner$("div").last();
        $lastLine.sendkeys('c');
        helper.waitFor(function(){
          return outer$('div#autocomp').is(":visible");
        }).done(function(){
          pressEnter();
          helper.waitFor(function(){
            var $lastLine =  inner$("div").last();
            return $lastLine.text() === "car";
          }).done(done);
        });
      });
    })

  })

})

/* ********** Helper functions ********** */

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

function pressEnter(){
  var inner$ = helper.padInner$;
  if(inner$(window)[0].bowser.firefox || inner$(window)[0].bowser.modernIE){ // if it's a mozilla or IE
    var evtType = "keypress";
  }else{
    var evtType = "keydown";
  }
  var e = inner$.Event(evtType);
  e.which = 13; // enter :|
  inner$("#innerdocbody").trigger(e);
}

function pressListButton(){
  var chrome$ = helper.padChrome$;
  var $insertunorderedlistButton = chrome$(".buttonicon-insertunorderedlist");
  $insertunorderedlistButton.click();
}

function addAttributeToFirstLine(cb){
  var inner$ = helper.padInner$;
  var $firstLine = inner$("div").first();
  $firstLine.sendkeys('{selectall}');
  pressListButton();
  helper.waitFor(function(){
    var $firstLine = inner$("div").first();
    return $firstLine.find("ul li").length === 1;
  }).done(cb);
}