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
});

/* ********** Helper functions ********** */
var ep_autocomp_test_helper = ep_autocomp_test_helper || {};