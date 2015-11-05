describe("ep_autocomp - show autocomplete suggestions", function(){

  beforeEach(function(cb){
    helper.newPad(function(){
      clearPad(function() {
        resetFlagsAndEnableAutocomplete(function(){
          writeWordsWithC(cb);
        });
      });
    });
    this.timeout(60000);
  });


  it("displays suggestions when user types a word that matches others from the text", function(done){
    var outer$ = helper.padOuter$;
    var inner$ = helper.padInner$;
    var $lastLine =  inner$("div").last();
    $lastLine.sendkeys('{selectall}');
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
    $lastLine.sendkeys('{selectall}');
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
    var $lastLine = autocompleteHelper.getLine(3);
    $lastLine.sendkeys('{selectall}');
    $lastLine.sendkeys('c');
    helper.waitFor(function(){
      return outer$('div#autocomp').is(":visible");
    }).done(function(){
      autocompleteHelper.pressEnter();
      helper.waitFor(function(){
        var $lastLine = autocompleteHelper.getLine(3);
        return $lastLine.text() === "car";
      }).done(done);
    });
  });

  it("applies selected suggestion when clicks on it on the suggestion box", function(done){
    var outer$ = helper.padOuter$;
    var inner$ = helper.padInner$;

    // type something to show suggestions
    var $lastLine = autocompleteHelper.getLine(3);
    $lastLine.sendkeys('{selectall}');
    $lastLine.sendkeys('c');

    helper.waitFor(function(){
      return outer$('div#autocomp').is(":visible");
    }).done(function(){
      // click on last suggestion ("couch")
      var $suggestions = outer$('div#autocomp li');
      var $couchSuggestion = $suggestions.last();
      $couchSuggestion.click();

      // check if last suggestion was inserted
      helper.waitFor(function(){
        var $lastLine = autocompleteHelper.getLine(3);
        return $lastLine.text() === "couch";
      }).done(done);
    });
  });

  context("when there is a callback registered for suggestion selection", function() {
    var callbackCalled = false;

    beforeEach(function() {
      // define a callback to be provided to autocomp
      var callback = function() {
        callbackCalled = true;
      };
      var autocomp = helper.padChrome$.window.autocomp;
      autocomp.addPostSuggestionSelectedCallback(callback);
    });

    it("calls the callback when user selects a suggestion", function(done){
      var outer$ = helper.padOuter$;
      var inner$ = helper.padInner$;

      // type something to display suggestions
      var $lastLine =  inner$("div").last();
      $lastLine.sendkeys('{selectall}');
      $lastLine.sendkeys('c');
      helper.waitFor(function(){
        return outer$('div#autocomp').is(":visible");
      }).done(function(){
        // select a suggestion to trigger callback
        autocompleteHelper.pressEnter();

        helper.waitFor(function(){
          return callbackCalled;
        }).done(done);
      });
    });
  });

  context("when there are line attributes applied", function(){
    beforeEach(function(cb) {
      // make line where "car" is a line with line attributes
      autocompleteHelper.addAttributeToLine(0, cb);
    });

    it("ignores * in the beginning of line", function(done){
      var outer$ = helper.padOuter$;
      var inner$ = helper.padInner$;

      // type something to display suggestions
      var $lastLine = autocompleteHelper.getLine(3);
      $lastLine.sendkeys('{selectall}');
      $lastLine.sendkeys('c');
      helper.waitFor(function(){
        return outer$('div#autocomp').is(":visible");
      }).done(function(){
        // select first suggestion (should be "car")
        autocompleteHelper.pressEnter();

        // test if "car" was selected -- if it was not, it means the suggestion
        // was "*car", so "*" was not ignored
        helper.waitFor(function(){
          var $lastLine = autocompleteHelper.getLine(3);
          return $lastLine.text() === "car";
        }).done(done);
      });
    });
  });

  context("when edit event processing is disabled", function(){
    beforeEach(function() {
      var autocomp = helper.padChrome$.window.autocomp;
      autocomp.processEditEvent = false;
    });

    it("does not show suggestions", function(done){
      var outer$ = helper.padOuter$;
      var inner$ = helper.padInner$;

      // type something to display suggestions -- it should not display anyway,
      // as edit event processing is disabled
      var $lastLine =  inner$("div").last();
      $lastLine.sendkeys('{selectall}');
      $lastLine.sendkeys('c');

      // we have to give enough time to suggestions box be shown
      setTimeout(function() {
        expect(outer$('div#autocomp').is(":visible")).to.be(false);
        done();
      }, 500);
    });
  });

  context("when key event processing is disabled", function(){
    beforeEach(function() {
      //press enter event should not be handled
      var autocomp = helper.padChrome$.window.autocomp;
      autocomp.processKeyEvent = false;
    });

    it("does not show suggestions", function(done){
      var outer$ = helper.padOuter$;
      var inner$ = helper.padInner$;

      // type something to display suggestions
      var $lastLine = autocompleteHelper.getLine(3);
      $lastLine.sendkeys('{selectall}');
      $lastLine.sendkeys('c');
      helper.waitFor(function(){
        return outer$('div#autocomp').is(":visible");
      }).done(function(){
        //trigger key event (that should be ignored)
        autocompleteHelper.pressEnter();

        //verify key event was ignored
        setTimeout(function(){
          var $lastLine = autocompleteHelper.getLine(3);
          expect($lastLine.text()).to.be("c");
          done();
        }, 500);
      })
    });
  });

  context("when current line has line attribute", function(){
    beforeEach(function(cb) {
      var $lastLine = autocompleteHelper.getLine(3);
      $lastLine.sendkeys('{selectall}');
      $lastLine.sendkeys("c");
      autocompleteHelper.addAttributeToLine(3, cb);
    });

    context("and there is no content after caret", function(){

      it("ignores * in the beginning of line", function(done){
        var outer$ = helper.padOuter$;
        var inner$ = helper.padInner$;

        //using contents was the only way we found to set content of a list item
        var $lastLine = inner$("div").last().find("ul li").contents();

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

    it("displays suggestions without having to type a word", function(done) {
      var outer$ = helper.padOuter$;
      var inner$ = helper.padInner$;
      var $lastLine = inner$("div").last();

      // type something to display suggestions
      $lastLine.sendkeys(" ");

      helper.waitFor(function(){
        return outer$('div#autocomp').is(":visible");
      }).done(done);
    });

    it("applies suggestion word", function(done){
      //change the first line to a list
      autocompleteHelper.addAttributeToLine(0, function(){
        var outer$ = helper.padOuter$;
        var $lastLine =  autocompleteHelper.getLine(0);
        // let the line empty
        $lastLine.sendkeys('{selectall}{backspace}');

        helper.waitFor(function(){
          return outer$('div#autocomp').is(":visible");
        }).done(function(){
          // select first option "chrome"
          autocompleteHelper.pressEnter();
          helper.waitFor(function(){
            var $firstLine =  autocompleteHelper.getLine(0);
            var $firstItem = $firstLine.find("ul li").text();
            return $firstItem === "chrome";
          }).done(done);
        });
      });
    });

  });

  context("when suggestions are not case sensitive", function(){
    // disable case sensitive matches
    beforeEach(function(){
      var autocomp = helper.padChrome$.window.autocomp;
      autocomp.caseSensitiveMatch = false;
    })

    it("shows suggestions in uppercase and lowercase", function(done){
      var outer$ = helper.padOuter$;

      //write CAR in the last line, duplicated word uppercase
      var $lastLine = autocompleteHelper.getLine(3);
      $lastLine.sendkeys('{selectall}');
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

  context("when flag to show suggestions for Latin characters is turned on", function(){

    // enable flag to consider Latin chars as regular chars
    beforeEach(function(){
      var autocomp = helper.padChrome$.window.autocomp;
      autocomp.ignoreLatinCharacters = true;
      // ignore case just to make tests easier -- so we don't need to create the double
      // of test scenarios
      autocomp.caseSensitiveMatch = false;
    });

    it("shows suggestions for 'á', 'à', 'ä', 'ã', 'â', 'Á', 'À', 'Ä', 'Ã', 'Â'", function(done){
      var outer$ = helper.padOuter$;

      // write words with Latin characters, so they will be available on suggestions later
      // (all start with "d" so we can use this prefix to choose which suggestions to show)
      var $lastLine = autocompleteHelper.getLine(3);
      $lastLine.sendkeys('dá dà dä dã dâ dÁ dÀ dÄ dÃ dÂ ');

      // type first letters, so all words written above should be displayed
      $lastLine.sendkeys('da');

      helper.waitFor(function(){
        return outer$('div#autocomp').is(":visible");
      }).done(function(){
        var suggestions = autocompleteHelper.textsOf(outer$('div#autocomp li'));
        expect(suggestions).to.contain("dá");
        expect(suggestions).to.contain("dà");
        expect(suggestions).to.contain("dä");
        expect(suggestions).to.contain("dã");
        expect(suggestions).to.contain("dâ");
        expect(suggestions).to.contain("dÁ");
        expect(suggestions).to.contain("dÀ");
        expect(suggestions).to.contain("dÄ");
        expect(suggestions).to.contain("dÃ");
        expect(suggestions).to.contain("dÂ");
        done();
      });
    });

    it("shows suggestions for 'é', 'è', 'ë', 'ê', 'É', 'È', 'Ë', 'Ê'", function(done){
      var outer$ = helper.padOuter$;

      // write words with Latin characters, so they will be available on suggestions later
      // (all start with "d" so we can use this prefix to choose which suggestions to show)
      var $lastLine = autocompleteHelper.getLine(3);
      $lastLine.sendkeys('dé dè dë dê dÉ dÈ dË dÊ ');

      // type first letters, so all words written above should be displayed
      $lastLine.sendkeys('de');

      helper.waitFor(function(){
        return outer$('div#autocomp').is(":visible");
      }).done(function(){
        var suggestions = autocompleteHelper.textsOf(outer$('div#autocomp li'));
        expect(suggestions).to.contain("dé");
        expect(suggestions).to.contain("dè");
        expect(suggestions).to.contain("dë");
        expect(suggestions).to.contain("dê");
        expect(suggestions).to.contain("dÉ");
        expect(suggestions).to.contain("dÈ");
        expect(suggestions).to.contain("dË");
        expect(suggestions).to.contain("dÊ");
        done();
      });
    });

    it("shows suggestions for 'í', 'ì', 'ï', 'î', 'Í', 'Ì', 'Ï', 'Î'", function(done){
      var outer$ = helper.padOuter$;

      // write words with Latin characters, so they will be available on suggestions later
      // (all start with "d" so we can use this prefix to choose which suggestions to show)
      var $lastLine = autocompleteHelper.getLine(3);
      $lastLine.sendkeys('dí dì dï dî dÍ dÌ dÏ dÎ ');

      // type first letters, so all words written above should be displayed
      $lastLine.sendkeys('di');

      helper.waitFor(function(){
        return outer$('div#autocomp').is(":visible");
      }).done(function(){
        var suggestions = autocompleteHelper.textsOf(outer$('div#autocomp li'));
        expect(suggestions).to.contain("dí");
        expect(suggestions).to.contain("dì");
        expect(suggestions).to.contain("dï");
        expect(suggestions).to.contain("dî");
        expect(suggestions).to.contain("dÍ");
        expect(suggestions).to.contain("dÌ");
        expect(suggestions).to.contain("dÏ");
        expect(suggestions).to.contain("dÎ");
        done();
      });
    });

    it("shows suggestions for 'ó', 'ò', 'ö', 'õ', 'ô', 'Ó', 'Ò', 'Ö', 'Õ', 'Ô'", function(done){
      var outer$ = helper.padOuter$;

      // write words with Latin characters, so they will be available on suggestions later
      // (all start with "d" so we can use this prefix to choose which suggestions to show)
      var $lastLine = autocompleteHelper.getLine(3);
      $lastLine.sendkeys('dó dò dö dõ dô dÓ dÒ dÖ dÕ dÔ ');

      // type first letters, so all words written above should be displayed
      $lastLine.sendkeys('do');

      helper.waitFor(function(){
        return outer$('div#autocomp').is(":visible");
      }).done(function(){
        var suggestions = autocompleteHelper.textsOf(outer$('div#autocomp li'));
        expect(suggestions).to.contain("dó");
        expect(suggestions).to.contain("dò");
        expect(suggestions).to.contain("dö");
        expect(suggestions).to.contain("dõ");
        expect(suggestions).to.contain("dô");
        expect(suggestions).to.contain("dÓ");
        expect(suggestions).to.contain("dÒ");
        expect(suggestions).to.contain("dÖ");
        expect(suggestions).to.contain("dÕ");
        expect(suggestions).to.contain("dÔ");
        done();
      });
    });

    it("shows suggestions for 'ú', 'ù', 'ü', 'û', 'Ú', 'Ù', 'Ü', 'Û'", function(done){
      var outer$ = helper.padOuter$;

      // write words with Latin characters, so they will be available on suggestions later
      // (all start with "d" so we can use this prefix to choose which suggestions to show)
      var $lastLine = autocompleteHelper.getLine(3);
      $lastLine.sendkeys('dú dù dü dû dÚ dÙ dÜ dÛ ');

      // type first letters, so all words written above should be displayed
      $lastLine.sendkeys('du');

      helper.waitFor(function(){
        return outer$('div#autocomp').is(":visible");
      }).done(function(){
        var suggestions = autocompleteHelper.textsOf(outer$('div#autocomp li'));
        expect(suggestions).to.contain("dú");
        expect(suggestions).to.contain("dù");
        expect(suggestions).to.contain("dü");
        expect(suggestions).to.contain("dû");
        expect(suggestions).to.contain("dÚ");
        expect(suggestions).to.contain("dÙ");
        expect(suggestions).to.contain("dÜ");
        expect(suggestions).to.contain("dÛ");
        done();
      });
    });

    it("shows suggestions for 'ç', 'Ç'", function(done){
      var outer$ = helper.padOuter$;

      // write words with Latin characters, so they will be available on suggestions later
      // (all start with "d" so we can use this prefix to choose which suggestions to show)
      var $lastLine = autocompleteHelper.getLine(3);
      $lastLine.sendkeys('dç dÇ ');

      // type first letters, so all words written above should be displayed
      $lastLine.sendkeys('dc');

      helper.waitFor(function(){
        return outer$('div#autocomp').is(":visible");
      }).done(function(){
        var suggestions = autocompleteHelper.textsOf(outer$('div#autocomp li'));
        expect(suggestions).to.contain("dç");
        expect(suggestions).to.contain("dÇ");
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
    var $targetLine = this.getLine(lineNum);
    $targetLine.sendkeys('{mark}');
    this.pressListButton();
    helper.waitFor(function(){
      var $targetLine = autocompleteHelper.getLine(lineNum);
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