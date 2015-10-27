describe("ep_autocomp - show autocomplete suggestions", function(){

  beforeEach(function(cb){
    helper.newPad(function(){
      resetFlagsAndEnableAutocomplete(function(){
        writeWordsWithC(cb);
      });
    });
    this.timeout(60000);
  });


  it("displays suggestions when user types a word that matches others from the text", function(done){
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
  });

  it("hides suggestions when user types a word that does not match any other from the text", function(done){
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
  });

  it("applies selected suggestion when user presses ENTER", function(done){
    var outer$ = helper.padOuter$;
    var inner$ = helper.padInner$;
    var $lastLine =  getLine(3);
    $lastLine.sendkeys('c');
    helper.waitFor(function(){
      return outer$('div#autocomp').is(":visible");
    }).done(function(){
      autocompleteHelper.pressEnter();
      helper.waitFor(function(){
        var $lastLine =  getLine(3);
        return $lastLine.text() === "car";
      }).done(done);
    });
  });

  it("calls the callback when user selects a suggestion", function(done){
    var outer$ = helper.padOuter$;
    var inner$ = helper.padInner$;
    var $lastLine =  inner$("div").last();
    $lastLine.sendkeys('c');
    helper.waitFor(function(){
      return outer$('div#autocomp').is(":visible");
    }).done(function(){
      // define a callback to be provided to autocomp
      var callbackCalled = false;
      var callback = function() {
        callbackCalled = true;
      };
      var autocomp = helper.padChrome$.window.autocomp;
      autocomp.addPostSuggestionSelectedCallback(callback);

      // select a suggestion to trigger callback
      autocompleteHelper.pressEnter();

      helper.waitFor(function(){
        return callbackCalled;
      }).done(done);
    });
  });

  context("when there is line attributes applied", function(){

    it("ignores * in the beginning of line", function(done){
      autocompleteHelper.addAttributeToLine(0, function(){
        var outer$ = helper.padOuter$;
        var inner$ = helper.padInner$;
        var $lastLine =  getLine(3);
        $lastLine.sendkeys('c');
        helper.waitFor(function(){
          return outer$('div#autocomp').is(":visible");
        }).done(function(){
          autocompleteHelper.pressEnter();
          helper.waitFor(function(){
            var $lastLine =  getLine(3);
            return $lastLine.text() === "car";
          }).done(done);
        });
      });
    });

  });

  context("when edit event processing is disabled", function(){
    it("does not show suggestions", function(done){
      var outer$ = helper.padOuter$;
      var autocomp = helper.padChrome$.window.autocomp;
      autocomp.processEditEvent = false;
      var inner$ = helper.padInner$;
      var $lastLine =  inner$("div").last();
      $lastLine.sendkeys('c');
      //we have to give enough time to suggestions box be shown
      setTimeout(function() {
        expect(outer$('div#autocomp').is(":visible")).to.be(false);
        done();
      }, 500);
    });
  });

  context("when key event processing is disabled", function(){
    it("does not show suggestions", function(done){
      var outer$ = helper.padOuter$;
      var inner$ = helper.padInner$;

      //press enter event should not be handled
      var autocomp = helper.padChrome$.window.autocomp;
      autocomp.processKeyEvent = false;

      //show suggestions box
      var $lastLine =  inner$("div").last();
      $lastLine.sendkeys('c');
      helper.waitFor(function(){
        return outer$('div#autocomp').is(":visible");
      }).done(function(){
        //trigger event (that should be ignored)
        autocompleteHelper.pressEnter();

        //verify key event was ignored
        setTimeout(function(){
          var $lastLine =  inner$("div").last();
          expect($lastLine.text()).to.be("c");
          done();
        }, 500);
      })
    });
  });

  context("when current line has line attribute", function(){
    beforeEach(function(cb) {
      autocompleteHelper.getLine(3).sendkeys("c");
      autocompleteHelper.addAttributeToLine(3, cb);
    });

    context("and there is no content after caret", function(){

      it("ignores * in the beginning of line", function(done){
        var outer$ = helper.padOuter$;
        var inner$ = helper.padInner$;

        //using contents was the only way we found to set content of a list item
        var $lastLine =  inner$("div").last().find("ul li").contents();

        $lastLine.sendkeys('a');
        helper.waitFor(function(){
          return outer$('div#autocomp').is(":visible");
        }).done(function(){
          var suggestions = autocompleteHelper.textsOf(outer$('div#autocomp li'));
          expect(suggestions).to.contain("car");
          done();
        });
      });
    });

    context("and there is already content after caret", function(){
      it("displays suggestions matching text before the caret", function(done){
        var outer$ = helper.padOuter$;
        var inner$ = helper.padInner$;

        //using contents was the only way we found to set content of a list item
        var $lastLine = inner$("div").last().find("ul li").contents();

        // add content after caret
        $lastLine.sendkeys('s{leftarrow}');
        // type "a" to have "ca" before caret, so suggestion list has "car"
        $lastLine.sendkeys('a');

        // suggestions should have "car"
        helper.waitFor(function(){
          return outer$('div#autocomp').is(":visible");
        }).done(function(){
          var suggestions = autocompleteHelper.textsOf(outer$('div#autocomp li'));
          expect(suggestions).to.contain("car");
          done();
        });
      });
    });

  });

  context("when flag to show suggestions for empty words is turned on", function() {
    beforeEach(function(cb) {
      var autocomp = helper.padChrome$.window.autocomp;
      autocomp.showOnEmptyWords = true;
      cb();
    });

    it("displays suggestions without having to type anything", function(done) {
      var outer$ = helper.padOuter$;
      var inner$ = helper.padInner$;
      var $lastLine =  inner$("div").last();

      // type something to display suggestions
      $lastLine.sendkeys(" ");

      helper.waitFor(function(){
        return outer$('div#autocomp').is(":visible");
      }).done(done);
    });

  });

  context("when suggestions are not case sensitive", function(){

    // disable case sensitive matches
    beforeEach(function(){
      var autocomp = helper.padChrome$.window.autocomp;
      autocomp.caseSensitiveMatch = false;
    })

    it("shows suggestions in uppercase and lowercase", function(done){
      var $lastLine = getLine(3);
      var outer$ = helper.padOuter$;
      //write CAR in the last line, duplicated word uppercase
      $lastLine.sendkeys('CAR CA');

      helper.waitFor(function(){
        return outer$('div#autocomp').is(":visible");
      }).done(function(){
        var suggestions = autocompleteHelper.textsOf(outer$('div#autocomp li'));
        expect(suggestions).to.contain("CAR");
        expect(suggestions).to.contain("car");
        done();
      });
    });

  });

});

/* ********** Helper functions ********** */
var autocompleteHelper = {

  pressEnter: function(){
    var inner$ = helper.padInner$;
    if(inner$(window)[0].bowser.firefox || inner$(window)[0].bowser.modernIE){ // if it's a mozilla or IE
      var evtType = "keypress";
    }else{
      var evtType = "keydown";
    }
    var e = inner$.Event(evtType);
    e.keyCode = 13; // enter :|
    inner$("#innerdocbody").trigger(e);
  },

  pressListButton: function(){
    var chrome$ = helper.padChrome$;
    var $insertunorderedlistButton = chrome$(".buttonicon-insertunorderedlist");
    $insertunorderedlistButton.click();
  },

  addAttributeToLine: function(lineNum, cb){
    var inner$ = helper.padInner$;
    var $targetLine = getLine(lineNum);
    $targetLine.sendkeys('{mark}');
    this.pressListButton();
    helper.waitFor(function(){
      var $targetLine = getLine(lineNum);
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
  }

}