describe("ep_autocomp - plugin customization", function(){

  beforeEach(function(cb){
    helper.newPad(function(){
      ep_autocomp_test_helper.utils.clearPad(function() {
        ep_autocomp_test_helper.utils.resetFlagsAndEnableAutocomplete(function(){
          ep_autocomp_test_helper.utils.writeWordsWithC(cb);
        });
      });
    });
    this.timeout(60000);
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
        ep_autocomp_test_helper.utils.pressEnter();

        helper.waitFor(function(){
          return callbackCalled;
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
      var $lastLine = ep_autocomp_test_helper.utils.getLine(3);
      $lastLine.sendkeys('{selectall}');
      $lastLine.sendkeys('c');
      helper.waitFor(function(){
        return outer$('div#autocomp').is(":visible");
      }).done(function(){
        //trigger key event (that should be ignored)
        ep_autocomp_test_helper.utils.pressEnter();

        //verify key event was ignored
        setTimeout(function(){
          var $lastLine = ep_autocomp_test_helper.utils.getLine(3);
          expect($lastLine.text()).to.be("c");
          done();
        }, 500);
      })
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
      ep_autocomp_test_helper.utils.addAttributeToLine(0, function(){
        var outer$ = helper.padOuter$;
        var $lastLine =  ep_autocomp_test_helper.utils.getLine(0);
        // let the line empty
        $lastLine.sendkeys('{selectall}{backspace}');

        helper.waitFor(function(){
          return outer$('div#autocomp').is(":visible");
        }).done(function(){
          // select first option "chrome"
          ep_autocomp_test_helper.utils.pressEnter();
          helper.waitFor(function(){
            var $firstLine =  ep_autocomp_test_helper.utils.getLine(0);
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
      var $lastLine = ep_autocomp_test_helper.utils.getLine(3);
      $lastLine.sendkeys('{selectall}');
      $lastLine.sendkeys('CAR CA');

      helper.waitFor(function(){
        return outer$('div#autocomp').is(":visible");
      }).done(function(){
        var suggestions = ep_autocomp_test_helper.utils.textsOf(outer$('div#autocomp li'));
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
      var $lastLine = ep_autocomp_test_helper.utils.getLine(3);
      $lastLine.sendkeys('dá dà dä dã dâ dÁ dÀ dÄ dÃ dÂ ');

      // type first letters, so all words written above should be displayed
      $lastLine.sendkeys('da');

      helper.waitFor(function(){
        return outer$('div#autocomp').is(":visible");
      }).done(function(){
        var suggestions = ep_autocomp_test_helper.utils.textsOf(outer$('div#autocomp li'));
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
      var $lastLine = ep_autocomp_test_helper.utils.getLine(3);
      $lastLine.sendkeys('dé dè dë dê dÉ dÈ dË dÊ ');

      // type first letters, so all words written above should be displayed
      $lastLine.sendkeys('de');

      helper.waitFor(function(){
        return outer$('div#autocomp').is(":visible");
      }).done(function(){
        var suggestions = ep_autocomp_test_helper.utils.textsOf(outer$('div#autocomp li'));
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
      var $lastLine = ep_autocomp_test_helper.utils.getLine(3);
      $lastLine.sendkeys('dí dì dï dî dÍ dÌ dÏ dÎ ');

      // type first letters, so all words written above should be displayed
      $lastLine.sendkeys('di');

      helper.waitFor(function(){
        return outer$('div#autocomp').is(":visible");
      }).done(function(){
        var suggestions = ep_autocomp_test_helper.utils.textsOf(outer$('div#autocomp li'));
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
      var $lastLine = ep_autocomp_test_helper.utils.getLine(3);
      $lastLine.sendkeys('dó dò dö dõ dô dÓ dÒ dÖ dÕ dÔ ');

      // type first letters, so all words written above should be displayed
      $lastLine.sendkeys('do');

      helper.waitFor(function(){
        return outer$('div#autocomp').is(":visible");
      }).done(function(){
        var suggestions = ep_autocomp_test_helper.utils.textsOf(outer$('div#autocomp li'));
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
      var $lastLine = ep_autocomp_test_helper.utils.getLine(3);
      $lastLine.sendkeys('dú dù dü dû dÚ dÙ dÜ dÛ ');

      // type first letters, so all words written above should be displayed
      $lastLine.sendkeys('du');

      helper.waitFor(function(){
        return outer$('div#autocomp').is(":visible");
      }).done(function(){
        var suggestions = ep_autocomp_test_helper.utils.textsOf(outer$('div#autocomp li'));
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
      var $lastLine = ep_autocomp_test_helper.utils.getLine(3);
      $lastLine.sendkeys('dç dÇ ');

      // type first letters, so all words written above should be displayed
      $lastLine.sendkeys('dc');

      helper.waitFor(function(){
        return outer$('div#autocomp').is(":visible");
      }).done(function(){
        var suggestions = ep_autocomp_test_helper.utils.textsOf(outer$('div#autocomp li'));
        expect(suggestions).to.contain("dç");
        expect(suggestions).to.contain("dÇ");
        done();
      });
    });
  });
});

/* ********** Helper functions ********** */
var ep_autocomp_test_helper = ep_autocomp_test_helper || {};