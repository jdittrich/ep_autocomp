describe("ep_autocomp - plugin customization", function(){
  var utils;

  before(function () {
    utils = ep_autocomp_test_helper.utils;
  });

  beforeEach(function(cb){
    helper.newPad(function(){
      utils.clearPad(function() {
        utils.resetFlagsAndEnableAutocomplete(function(){
          utils.writeWordsWithC(cb);
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
      autocomp.addPostSuggestionSelectedCallback("ep_autocomp", callback);
    });

    it("calls the callback when user selects a suggestion", function(done){
      var inner$ = helper.padInner$;

      // type something to display suggestions
      var $lastLine =  inner$("div").last();
      $lastLine.sendkeys('{selectall}');
      $lastLine.sendkeys('c');
      utils.waitShowSuggestions(this, function(){
        // select a suggestion to trigger callback
        utils.pressEnter();

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
      // type something to display suggestions
      var $lastLine = utils.getLine(3);
      $lastLine.sendkeys('{selectall}');
      $lastLine.sendkeys('c');
      utils.waitShowSuggestions(this, function(){
        //trigger key event (that should be ignored)
        utils.pressEnter();

        //verify key event was ignored
        setTimeout(function(){
          var $lastLine = utils.getLine(3);
          expect($lastLine.text()).to.be("c");
          done();
        }, 500);
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
      var inner$ = helper.padInner$;
      var $lastLine = inner$("div").last();

      // type something to display suggestions
      $lastLine.sendkeys(" ");

      utils.waitShowSuggestions(this, done);
    });

    it("applies suggestion word", function(done){
      //change the first line to a list
      var self = this;
      utils.addAttributeToLine(0, function(){
        var $lastLine =  utils.getLine(0);
        // let the line empty
        $lastLine.sendkeys('{selectall}{backspace}');

        utils.waitShowSuggestions(self, function(){
          // wait a little to press enter
          setTimeout(function() {
            // select first option "chrome"
            utils.pressEnter();
            helper.waitFor(function(){
              var $firstLine =  utils.getLine(0);
              var $firstItem = $firstLine.find("ul li").text();
              return $firstItem === "chrome";
            }).done(done);

          }, 1000);
        });
      });
    });
  });

  context("when suggestions are not case sensitive", function(){
    // disable case sensitive matches
    beforeEach(function(){
      utils.disableCaseSensitiveMatch();
    });

    afterEach(function () {
      utils.enableCaseSensitiveMatch();
    });

    it("shows suggestions in uppercase and lowercase", function(done){
      var outer$ = helper.padOuter$;

      //write CAR in the last line, duplicated word uppercase
      var $lastLine = utils.getLine(3);
      $lastLine.sendkeys('{selectall}');
      $lastLine.sendkeys('CAR CA');

      utils.waitShowSuggestions(this,function(){
        var suggestions = utils.textsOf(outer$('div#autocomp li'));
        expect(suggestions).to.contain("CAR");
        expect(suggestions).to.contain("car");
        done();
      });
    });
  });
});

/* ********** Helper functions ********** */
var ep_autocomp_test_helper = ep_autocomp_test_helper || {};